import "server-only";

import { and, eq } from "drizzle-orm";
import { connection } from "next/server";

import { comments, getDatabase, posts, type Database } from "@/lib/db";
import { recordAdminAuditEvent } from "@/modules/identity/audit/repository";

export async function changeCommentVisibility(
  id: string,
  intent: "hide" | "restore",
  administratorId: string,
  database?: Database,
) {
  await connection();
  const db = database ?? getDatabase();
  return db.transaction(async (tx) => {
    const from = intent === "hide" ? "visible" : "hidden";
    const to: "hidden" | "visible" = intent === "hide" ? "hidden" : "visible";
    const rows = await tx
      .update(comments)
      .set({
        status: to,
        moderatedAt: intent === "hide" ? new Date() : null,
        moderationReason: null,
        updatedAt: new Date(),
      })
      .where(and(eq(comments.id, id), eq(comments.status, from)))
      .returning({ postId: comments.postId });
    if (!rows[0]) return null;
    await recordAdminAuditEvent(
      administratorId,
      {
        action: intent === "hide" ? "comment.hide" : "comment.restore",
        result: "success",
        entityId: id,
      },
      tx,
    );
    const publication = await tx
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.id, rows[0].postId))
      .limit(1);
    return { status: to, slug: publication[0]?.slug ?? null };
  });
}
