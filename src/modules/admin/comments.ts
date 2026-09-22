import "server-only";

import { and, desc, eq, lt, or } from "drizzle-orm";
import { connection } from "next/server";
import { comments, getDatabase, posts, type Database } from "@/lib/db";

export type AdminComment = {
  id: string;
  authorName: string;
  body: string;
  status: "visible" | "hidden";
  createdAt: Date;
  postTitle: string;
  postId: string;
};

export async function listAdminComments(
  status: "all" | "visible" | "hidden",
  before?: { createdAt: Date; id: string },
  database?: Database,
) {
  await connection();
  const db = database ?? getDatabase();
  const conditions = [
    ...(status === "all" ? [] : [eq(comments.status, status)]),
    ...(before
      ? [
          or(
            lt(comments.createdAt, before.createdAt),
            and(
              eq(comments.createdAt, before.createdAt),
              lt(comments.id, before.id),
            ),
          )!,
        ]
      : []),
  ];
  const rows = await db
    .select({
      id: comments.id,
      authorName: comments.authorName,
      body: comments.body,
      status: comments.status,
      createdAt: comments.createdAt,
      postTitle: posts.title,
      postId: posts.id,
    })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(comments.createdAt), desc(comments.id))
    .limit(51);
  return { comments: rows.slice(0, 50), hasMore: rows.length > 50 };
}
