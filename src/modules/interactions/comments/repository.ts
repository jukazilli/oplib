import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { comments, getDatabase, posts, type Database } from "@/lib/db";
import type { PublicComment } from "@/modules/interactions/comments/contract";

export type { PublicComment } from "@/modules/interactions/comments/contract";
type CommentDatabase =
  Database | Parameters<Parameters<Database["transaction"]>[0]>[0];
const selection = {
  id: comments.id,
  authorName: comments.authorName,
  body: comments.body,
  createdAt: comments.createdAt,
};
const serialize = (row: {
  id: string;
  authorName: string;
  body: string;
  createdAt: Date;
}): PublicComment => ({ ...row, createdAt: row.createdAt.toISOString() });

export async function listVisibleComments(postId: string, database?: Database) {
  await connection();
  const db = database ?? getDatabase();
  const rows = await db
    .select(selection)
    .from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.status, "visible")))
    .orderBy(desc(comments.createdAt));
  return rows.map(serialize);
}

export async function createPublicComment(
  slug: string,
  values: { authorName: string; body: string },
  database?: Database,
) {
  await connection();
  const db = database ?? getDatabase();
  return db.transaction(async (tx: CommentDatabase) => {
    const publication = await tx
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
      .limit(1);
    if (!publication[0]) return null;
    const inserted = await tx
      .insert(comments)
      .values({ postId: publication[0].id, ...values })
      .returning(selection);
    return inserted[0] ? serialize(inserted[0]) : null;
  });
}
