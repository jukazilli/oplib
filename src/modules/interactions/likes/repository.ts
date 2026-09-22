import "server-only";

import { and, count, eq } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, likes, posts, type Database } from "@/lib/db";

type LikeDatabase =
  Database | Parameters<Parameters<Database["transaction"]>[0]>[0];

async function countLikes(db: LikeDatabase, postId: string) {
  const rows = await db
    .select({ value: count() })
    .from(likes)
    .where(eq(likes.postId, postId));
  return rows[0]?.value ?? 0;
}

export async function getLikeState(
  postId: string,
  visitorHash?: string | null,
  database?: Database,
) {
  await connection();
  const db = database ?? getDatabase();
  const [total, visitorRows] = await Promise.all([
    countLikes(db, postId),
    visitorHash
      ? db
          .select({ id: likes.id })
          .from(likes)
          .where(
            and(eq(likes.postId, postId), eq(likes.visitorHash, visitorHash)),
          )
          .limit(1)
      : Promise.resolve([]),
  ]);
  return { count: total, liked: visitorRows.length > 0 };
}

export async function registerLike(
  slug: string,
  visitorHash: string,
  database?: Database,
) {
  await connection();
  const db = database ?? getDatabase();
  return db.transaction(async (tx) => {
    const publicationRows = await tx
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
      .limit(1);
    const publication = publicationRows[0];
    if (!publication) return null;

    const inserted = await tx
      .insert(likes)
      .values({ postId: publication.id, visitorHash })
      .onConflictDoNothing()
      .returning({ id: likes.id });
    const total = await countLikes(tx, publication.id);
    return { count: total, alreadyLiked: inserted.length === 0 };
  });
}
