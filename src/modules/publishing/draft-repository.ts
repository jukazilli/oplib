import "server-only";

import { randomUUID } from "node:crypto";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, type Database } from "@/lib/db";
import { logEvent } from "@/lib/observability/logger";
import {
  categories,
  coverAssets,
  knowledgeAreas,
  postCategories,
  postKnowledgeAreas,
  references,
  posts,
  postTags,
  tags,
} from "@/lib/db/schema";
import { normalizeRequestedSlug, slugifyPostTitle } from "./metadata";
import { cleanupDetachedCover } from "@/modules/media/covers";
import { recordAdminAuditEvent } from "@/modules/identity/audit/repository";

type DraftDatabase =
  Database | Parameters<Parameters<Database["transaction"]>[0]>[0];

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
  slug: string;
  summary: string;
  markdown: string;
  contentType:
    | "academic_work"
    | "article"
    | "research"
    | "study"
    | "reflection"
    | "project"
    | "";
  areaIds: string[];
  categoryId: string;
  tagIds: string[];
  course: string;
  discipline: string;
  originalDate: string;
  references: DraftReference[];
  cover: DraftCover | null;
};

export type DraftReference = {
  id: string;
  kind: "bibliography" | "related_link";
  title: string;
  citation: string;
  url: string;
};

export type DraftRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  contentType: DraftValues["contentType"];
  areaIds: string[];
  categoryId: string;
  tagIds: string[];
  course: string;
  discipline: string;
  originalDate: string;
  references: DraftReference[];
  cover: DraftCover | null;
  updatedAt: Date;
};

export type AdminPublication = DraftRecord & {
  status: "draft" | "published" | "withdrawn";
};

const draftSelection = {
  id: posts.id,
  title: posts.title,
  slug: posts.slug,
  summary: posts.summary,
  markdown: posts.markdown,
  contentType: posts.contentType,
  course: posts.course,
  discipline: posts.discipline,
  originalDate: posts.originalDate,
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
        slug: string;
        summary: string;
        markdown: string;
        contentType: DraftValues["contentType"] | null;
        course: string | null;
        discipline: string | null;
        originalDate: Date | null;
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
  db: DraftDatabase,
): Promise<DraftRecord> {
  const [areaRows, categoryRows, tagRows, referenceRows] = await Promise.all([
    db
      .select({ id: knowledgeAreas.id })
      .from(postKnowledgeAreas)
      .innerJoin(
        knowledgeAreas,
        eq(knowledgeAreas.id, postKnowledgeAreas.knowledgeAreaId),
      )
      .where(eq(postKnowledgeAreas.postId, row.id)),
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
    db
      .select({
        id: references.id,
        kind: references.kind,
        title: references.title,
        citation: references.citation,
        url: references.url,
      })
      .from(references)
      .where(eq(references.postId, row.id))
      .orderBy(references.position),
  ]);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    markdown: row.markdown,
    contentType: row.contentType ?? "",
    areaIds: areaRows.map(({ id }) => id),
    updatedAt: row.updatedAt,
    categoryId: categoryRows[0]?.id ?? "",
    tagIds: tagRows.map(({ id }) => id),
    course: row.course ?? "",
    discipline: row.discipline ?? "",
    originalDate: row.originalDate?.toISOString().slice(0, 10) ?? "",
    references: referenceRows.map((reference) => ({
      ...reference,
      citation: reference.citation ?? "",
      url: reference.url ?? "",
    })),
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

export async function getAdminPublicationById(
  id: string,
  database?: Database,
): Promise<AdminPublication | null> {
  await connection();
  const db = database ?? getDatabase();
  const rows = await db
    .select({ ...draftSelection, status: posts.status })
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .where(eq(posts.id, id))
    .limit(1);
  return rows[0]
    ? { ...(await enrichDraft(rows[0], db)), status: rows[0].status }
    : null;
}

export async function listAdminPublications(database?: Database) {
  await connection();
  const db = database ?? getDatabase();
  const rows = await db
    .select({
      ...draftSelection,
      status: posts.status,
    })
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .orderBy(desc(posts.updatedAt));
  return Promise.all(
    rows.map(async (row) => ({
      ...(await enrichDraft(row, db)),
      status: row.status,
    })),
  );
}

async function availableSlug(
  db: DraftDatabase,
  title: string,
  requested: string,
  currentId?: string,
) {
  const base =
    normalizeRequestedSlug(requested) ||
    slugifyPostTitle(title) ||
    "publicacao";
  await db.execute(sql`select pg_advisory_xact_lock(hashtext(${base}))`);
  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix ? `${base}-${suffix + 1}` : base;
    const rows = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        currentId
          ? and(eq(posts.slug, candidate), ne(posts.id, currentId))
          : eq(posts.slug, candidate),
      )
      .limit(1);
    if (!rows[0]) return candidate;
  }
  return `${base}-${randomUUID().slice(0, 8)}`;
}

async function replaceRelations(
  db: DraftDatabase,
  postId: string,
  values: DraftValues,
) {
  await db
    .delete(postKnowledgeAreas)
    .where(eq(postKnowledgeAreas.postId, postId));
  await db.delete(postCategories).where(eq(postCategories.postId, postId));
  await db.delete(postTags).where(eq(postTags.postId, postId));
  await db.delete(references).where(eq(references.postId, postId));
  if (values.areaIds.length)
    await db
      .insert(postKnowledgeAreas)
      .values(
        values.areaIds.map((knowledgeAreaId) => ({ postId, knowledgeAreaId })),
      );
  if (values.categoryId)
    await db
      .insert(postCategories)
      .values({ postId, categoryId: values.categoryId });
  if (values.tagIds.length)
    await db
      .insert(postTags)
      .values(values.tagIds.map((tagId) => ({ postId, tagId })));
  if (values.references.length)
    await db.insert(references).values(
      values.references.map((reference, position) => ({
        postId,
        kind: reference.kind,
        title: reference.title,
        citation: reference.citation || null,
        url: reference.url || null,
        position,
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
    const slug = await availableSlug(tx, values.title, values.slug);
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
      slug,
      summary: values.summary,
      markdown: values.markdown,
      contentType: values.contentType || null,
      status: "draft",
      course: values.course || null,
      discipline: values.discipline || null,
      originalDate: values.originalDate
        ? new Date(`${values.originalDate}T12:00:00.000Z`)
        : null,
      coverAssetId,
    });
    await replaceRelations(tx, id, values);
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
  const previousCoverRows = await db
    .select({ pathname: coverAssets.pathname })
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .where(eq(posts.id, id))
    .limit(1);
  const previousCoverPathname = previousCoverRows[0]?.pathname ?? null;
  const updated = await db.transaction(async (tx) => {
    const slug = await availableSlug(tx, values.title, values.slug, id);
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
        slug,
        summary: values.summary,
        markdown: values.markdown,
        contentType: values.contentType || null,
        course: values.course || null,
        discipline: values.discipline || null,
        originalDate: values.originalDate
          ? new Date(`${values.originalDate}T12:00:00.000Z`)
          : null,
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
    await replaceRelations(tx, id, values);
    return true;
  });
  if (!updated) return null;
  if (
    previousCoverPathname &&
    previousCoverPathname !== values.cover?.pathname
  ) {
    try {
      await cleanupDetachedCover(previousCoverPathname, db);
    } catch {
      // The detached database record is retained for a later cleanup retry.
      logEvent({
        level: "warn",
        event: "media.cover_cleanup",
        correlationId: randomUUID(),
        module: "media",
        result: "retry_required",
        errorCode: "MEDIA_CLEANUP_FAILED",
      });
    }
  }
  return getDraftById(id, db);
}

/** The state change, submitted content, relations, and audit event commit together. */
export async function publishPublication(
  id: string,
  version: Date,
  values: DraftValues,
  administratorId: string,
  expectedStatus: "draft" | "published",
  database?: Database,
): Promise<AdminPublication | null> {
  const db = database ?? getDatabase();
  const previousCoverRows = await db
    .select({ pathname: coverAssets.pathname })
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .where(eq(posts.id, id))
    .limit(1);
  const previousCoverPathname = previousCoverRows[0]?.pathname ?? null;
  const updated = await db.transaction(async (tx) => {
    const slug = await availableSlug(tx, values.title, values.slug, id);
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
    const rows = await tx
      .update(posts)
      .set({
        title: values.title.trim(),
        slug,
        summary: values.summary.trim(),
        markdown: values.markdown.trim(),
        contentType: values.contentType || null,
        course: values.course || null,
        discipline: values.discipline || null,
        originalDate: values.originalDate
          ? new Date(`${values.originalDate}T12:00:00.000Z`)
          : null,
        coverAssetId: coverRows[0]?.id ?? null,
        status: "published",
        publishedAt: expectedStatus === "draft" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(posts.id, id),
          eq(posts.status, expectedStatus),
          eq(posts.updatedAt, version),
        ),
      )
      .returning({ id: posts.id });
    if (!rows[0]) return false;
    await replaceRelations(tx, id, values);
    await recordAdminAuditEvent(
      administratorId,
      {
        action:
          expectedStatus === "draft"
            ? "publication.publish"
            : "publication.update",
        result: "success",
        entityId: id,
      },
      tx,
    );
    return true;
  });
  if (!updated) return null;
  if (
    previousCoverPathname &&
    previousCoverPathname !== values.cover?.pathname
  ) {
    try {
      await cleanupDetachedCover(previousCoverPathname, db);
    } catch {
      logEvent({
        level: "warn",
        event: "media.cover_cleanup",
        correlationId: randomUUID(),
        module: "media",
        result: "retry_required",
        errorCode: "MEDIA_CLEANUP_FAILED",
      });
    }
  }
  return getAdminPublicationById(id, db);
}
