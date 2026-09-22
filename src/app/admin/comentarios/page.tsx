import { randomUUID } from "node:crypto";
import { notFound, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import {
  AdminCommentsError,
  AdminCommentsList,
} from "@/components/admin/comments-list";
import { logEvent } from "@/lib/observability/logger";
import { listAdminComments } from "@/modules/admin/comments";
import { requireAdminCommand } from "@/modules/identity/admin";

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; before?: string }>;
}) {
  await requireAdminCommand();
  const { status = "all", before } = await searchParams;
  if (status !== "all" && status !== "visible" && status !== "hidden")
    notFound();
  const cursorMatch = before?.match(/^(.*)_([0-9a-f-]{36})$/i);
  if (before && !cursorMatch) notFound();
  const cursor =
    cursorMatch?.[1] && cursorMatch[2]
      ? { createdAt: new Date(cursorMatch[1]), id: cursorMatch[2] }
      : undefined;
  if (
    cursor &&
    (Number.isNaN(cursor.createdAt.valueOf()) ||
      !z.uuid().safeParse(cursor.id).success)
  )
    notFound();
  let result: Awaited<ReturnType<typeof listAdminComments>> | null = null;
  try {
    result = await listAdminComments(status, cursor);
  } catch (error) {
    unstable_rethrow(error);
    logEvent({
      level: "error",
      event: "admin.comments.read",
      correlationId: randomUUID(),
      module: "comments",
      result: "degraded",
      errorCode: "COMMENTS_READ_FAILED",
    });
  }
  return result ? (
    <AdminCommentsList {...result} status={status} />
  ) : (
    <AdminCommentsError />
  );
}
