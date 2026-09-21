import "server-only";

import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, type Database } from "@/lib/db";
import {
  categories,
  coverAssets,
  postCategories,
  posts,
  postTags,
  tags,
} from "@/lib/db/schema";

export type DraftCover = {
  pathname: string;
  url: string;
  altText: string;
  contentType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};

export type DraftValues = {
  title: string;
  markdown: string;
  categoryId: string;
  tagIds: string[];
  cover: DraftCover | null;
};

export type DraftRecord = {
  id: string;
  title: string;
  markdown: string;
  categoryId: string;
  tagIds: string[];
  cover: DraftCover | null;
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
  coverPathname: coverAssets.pathname,
  coverUrl: coverAssets.url,
  coverAltText: coverAssets.altText,
  coverContentType: coverAssets.contentType,
  coverSizeBytes: coverAssets.sizeBytes,
  coverWidth: coverAssets.width,
  coverHeight: coverAssets.height,
};

async function enrichDraft(
  row: typeof draftSelection extends Record<string, unknown>
    ? {
        id: string;
        title: string;
        markdown: string;
        updatedAt: Date;
        coverPathname: string | null;
        coverUrl: string | null;
        coverAltText: string | null;
        coverContentType: string | null;
        coverSizeBytes: number | null;
        coverWidth: number | null;
        coverHeight: number | null;
      }
    : never,
  db: Database,
): Promise<DraftRecord> {
  const [categoryRows, tagRows] = await Promise.all([
    db
      .select({ id: categories.id })
      .from(postCategories)
      .innerJoin(categories, eq(categories.id, postCategories.categoryId))
      .where(eq(postCategories.postId, row.id))
      .limit(1),
    db
      .select({ id: tags.id })
      .from(postTags)
      .innerJoin(tags, eq(tags.id, postTags.tagId))
      .where(eq(postTags.postId, row.id)),
  ]);
  return {
    id: row.id,
    title: row.title,
    markdown: row.markdown,
    updatedAt: row.updatedAt,
    categoryId: categoryRows[0]?.id ?? "",
    tagIds: tagRows.map(({ id }) => id),
    cover:
      row.coverPathname &&
      row.coverUrl &&
      row.coverAltText !== null &&
      row.coverContentType &&
      row.coverSizeBytes
        ? {
            pathname: row.coverPathname,
            url: row.coverUrl,
            altText: row.coverAltText,
            contentType: row.coverContentType,
            sizeBytes: row.coverSizeBytes,
            width: row.coverWidth,
            height: row.coverHeight,
          }
        : null,
  };
}

export async function getDraftById(id: string, database?: Database) {
  await connection();
  const db = database ?? getDatabase();
  const rows = await db
    .select(draftSelection)
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .where(and(eq(posts.id, id), eq(posts.status, "draft")))
    .limit(1);
  return rows[0] ? enrichDraft(rows[0], db) : null;
}

export async function listAdminPublications(database?: Database) {
  await connection();
  const db = database ?? getDatabase();
  const rows = await db
    .select({
      ...draftSelection,
      summary: posts.summary,
      status: posts.status,
    })
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .orderBy(desc(posts.updatedAt));
  return Promise.all(
    rows.map(async (row) => ({
      ...(await enrichDraft(row, db)),
      summary: row.summary,
      status: row.status,
    })),
  );
}

export async function createDraft(
  values: DraftValues,
  database?: Database,
): Promise<DraftRecord> {
  const db = database ?? getDatabase();
  const id = randomUUID();
  await db.transaction(async (tx) => {
    const coverRows = values.cover
      ? await tx
          .insert(coverAssets)
          .values(values.cover)
          .onConflictDoUpdate({
            target: coverAssets.pathname,
            set: { altText: values.cover.altText },
          })
          .returning({ id: coverAssets.id })
      : [];
    const coverAssetId = coverRows[0]?.id ?? null;
    await tx.insert(posts).values({
      id,
      title: values.title,
      slug: `draft-${id}`,
      summary: "",
      markdown: values.markdown,
      contentType: null,
      status: "draft",
      coverAssetId,
    });
    if (values.categoryId)
      await tx
        .insert(postCategories)
        .values({ postId: id, categoryId: values.categoryId });
    if (values.tagIds.length)
      await tx
        .insert(postTags)
        .values(values.tagIds.map((tagId) => ({ postId: id, tagId })));
  });
  const draft = await getDraftById(id, db);
  if (!draft) throw new Error("Draft creation returned no row.");
  return draft;
}

export async function updateDraft(
  id: string,
  version: Date,
  values: DraftValues,
  database?: Database,
): Promise<DraftRecord | null> {
  const db = database ?? getDatabase();
  const updated = await db.transaction(async (tx) => {
    const coverRows = values.cover
      ? await tx
          .insert(coverAssets)
          .values(values.cover)
          .onConflictDoUpdate({
            target: coverAssets.pathname,
            set: { altText: values.cover.altText },
          })
          .returning({ id: coverAssets.id })
      : [];
    const coverAssetId = coverRows[0]?.id ?? null;
    const rows = await tx
      .update(posts)
      .set({
        title: values.title,
        markdown: values.markdown,
        coverAssetId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(posts.id, id),
          eq(posts.status, "draft"),
          eq(posts.updatedAt, version),
        ),
      )
      .returning({ id: posts.id });
    if (!rows[0]) return false;
    await tx.delete(postCategories).where(eq(postCategories.postId, id));
    await tx.delete(postTags).where(eq(postTags.postId, id));
    if (values.categoryId)
      await tx
        .insert(postCategories)
        .values({ postId: id, categoryId: values.categoryId });
    if (values.tagIds.length)
      await tx
        .insert(postTags)
        .values(values.tagIds.map((tagId) => ({ postId: id, tagId })));
    return true;
  });
  return updated ? getDraftById(id, db) : null;
}
