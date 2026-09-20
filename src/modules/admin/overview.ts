import "server-only";

import { count, desc, eq } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, type Database } from "@/lib/db";
import { comments, posts } from "@/lib/db/schema";

export type AdminOverview = {
  counts: {
    published: number;
    drafts: number;
    withdrawn: number;
    hiddenComments: number;
  };
  recentComments: Array<{
    id: string;
    authorName: string;
    body: string;
    postTitle: string;
    createdAt: Date;
    status: "visible" | "hidden";
  }>;
};

export async function getAdminOverview(
  database?: Database,
): Promise<AdminOverview> {
  await connection();
  const db = database ?? getDatabase();

  const [published, drafts, withdrawn, hiddenComments, recentComments] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(posts)
        .where(eq(posts.status, "published")),
      db
        .select({ value: count() })
        .from(posts)
        .where(eq(posts.status, "draft")),
      db
        .select({ value: count() })
        .from(posts)
        .where(eq(posts.status, "withdrawn")),
      db
        .select({ value: count() })
        .from(comments)
        .where(eq(comments.status, "hidden")),
      db
        .select({
          id: comments.id,
          authorName: comments.authorName,
          body: comments.body,
          postTitle: posts.title,
          createdAt: comments.createdAt,
          status: comments.status,
        })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .orderBy(desc(comments.createdAt))
        .limit(5),
    ]);

  return {
    counts: {
      published: published[0]?.value ?? 0,
      drafts: drafts[0]?.value ?? 0,
      withdrawn: withdrawn[0]?.value ?? 0,
      hiddenComments: hiddenComments[0]?.value ?? 0,
    },
    recentComments,
  };
}
