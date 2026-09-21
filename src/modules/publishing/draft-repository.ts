import "server-only";

import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, type Database } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export type DraftRecord = {
  id: string;
  title: string;
  markdown: string;
  updatedAt: Date;
};

export type AdminPublication = DraftRecord & {
  summary: string;
  status: "draft" | "published" | "withdrawn";
};

const draftSelection = {
  id: posts.id,
  title: posts.title,
  markdown: posts.markdown,
  updatedAt: posts.updatedAt,
};

export async function getDraftById(id: string, database?: Database) {
  await connection();
  const db = database ?? getDatabase();
  const rows = await db
    .select(draftSelection)
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.status, "draft")))
    .limit(1);
  return rows[0] ?? null;
}

export async function listAdminPublications(database?: Database) {
  await connection();
  const db = database ?? getDatabase();
  return db
    .select({
      ...draftSelection,
      summary: posts.summary,
      status: posts.status,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt));
}

export async function createDraft(
  values: { title: string; markdown: string },
  database?: Database,
): Promise<DraftRecord> {
  const db = database ?? getDatabase();
  const id = randomUUID();
  const rows = await db
    .insert(posts)
    .values({
      id,
      title: values.title,
      slug: `draft-${id}`,
      summary: "",
      markdown: values.markdown,
      contentType: null,
      status: "draft",
    })
    .returning(draftSelection);

  const draft = rows[0];
  if (!draft) throw new Error("Draft creation returned no row.");
  return draft;
}

export async function updateDraft(
  id: string,
  version: Date,
  values: { title: string; markdown: string },
  database?: Database,
): Promise<DraftRecord | null> {
  const db = database ?? getDatabase();
  const rows = await db
    .update(posts)
    .set({ ...values, updatedAt: new Date() })
    .where(
      and(
        eq(posts.id, id),
        eq(posts.status, "draft"),
        eq(posts.updatedAt, version),
      ),
    )
    .returning(draftSelection);
  return rows[0] ?? null;
}
