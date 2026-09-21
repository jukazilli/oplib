import "server-only";

import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, type Database } from "@/lib/db";
import {
  categories,
  coverAssets,
  knowledgeAreas,
  postCategories,
  postKnowledgeAreas,
  posts,
  postTags,
  tags,
} from "@/lib/db/schema";
import { contentTypeValues } from "@/modules/publishing/draft-domain";
import type { PublicSearch } from "@/modules/discovery/domain";

export type PublicPublicationSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  markdown: string;
  contentType: (typeof contentTypeValues)[number];
  publishedAt: Date;
  cover: { url: string; altText: string } | null;
  areaNames: string[];
  categoryName: string;
  tagNames: string[];
};

export type PublicSearchResult = {
  items: PublicPublicationSummary[];
  total: number;
  page: number;
  pageCount: number;
};

const PAGE_SIZE = 9;

export async function searchPublications(
  search: PublicSearch,
  database?: Database,
): Promise<PublicSearchResult> {
  await connection();
  const db = database ?? getDatabase();
  const term = `%${search.busca}%`;
  const conditions = [eq(posts.status, "published")];
  if (search.busca)
    conditions.push(
      or(
        ilike(posts.title, term),
        ilike(posts.summary, term),
        ilike(posts.markdown, term),
      )!,
    );
  if (search.tipo) conditions.push(eq(posts.contentType, search.tipo));
  if (search.ano)
    conditions.push(
      sql<boolean>`extract(year from ${posts.publishedAt}) = ${search.ano}`,
    );
  if (search.area)
    conditions.push(sql<boolean>`exists (
      select 1 from ${postKnowledgeAreas}
      inner join ${knowledgeAreas} on ${knowledgeAreas.id} = ${postKnowledgeAreas.knowledgeAreaId}
      where ${postKnowledgeAreas.postId} = ${posts.id} and ${knowledgeAreas.slug} = ${search.area}
    )`);
  if (search.categoria)
    conditions.push(sql<boolean>`exists (
      select 1 from ${postCategories}
      inner join ${categories} on ${categories.id} = ${postCategories.categoryId}
      where ${postCategories.postId} = ${posts.id} and ${categories.slug} = ${search.categoria}
    )`);
  if (search.tag)
    conditions.push(sql<boolean>`exists (
      select 1 from ${postTags}
      inner join ${tags} on ${tags.id} = ${postTags.tagId}
      where ${postTags.postId} = ${posts.id} and ${tags.slug} = ${search.tag}
    )`);

  const where = and(...conditions);
  const totalRows = await db
    .select({ value: count() })
    .from(posts)
    .where(where);
  const total = totalRows[0]?.value ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(search.pagina, pageCount);
  const direction = search.ordem === "antigas" ? asc : desc;
  const rows = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      summary: posts.summary,
      markdown: posts.markdown,
      contentType: posts.contentType,
      publishedAt: posts.publishedAt,
      coverUrl: coverAssets.url,
      coverAltText: coverAssets.altText,
      areaNames: sql<string[]>`coalesce((
        select array_agg(${knowledgeAreas.name} order by ${knowledgeAreas.name})
        from ${postKnowledgeAreas}
        inner join ${knowledgeAreas} on ${knowledgeAreas.id} = ${postKnowledgeAreas.knowledgeAreaId}
        where ${postKnowledgeAreas.postId} = ${posts.id}
      ), array[]::varchar[])`,
      categoryName: sql<string>`coalesce((
        select ${categories.name}
        from ${postCategories}
        inner join ${categories} on ${categories.id} = ${postCategories.categoryId}
        where ${postCategories.postId} = ${posts.id}
        limit 1
      ), '')`,
      tagNames: sql<string[]>`coalesce((
        select array_agg(${tags.name} order by ${tags.name})
        from ${postTags}
        inner join ${tags} on ${tags.id} = ${postTags.tagId}
        where ${postTags.postId} = ${posts.id}
      ), array[]::varchar[])`,
    })
    .from(posts)
    .leftJoin(coverAssets, eq(coverAssets.id, posts.coverAssetId))
    .where(where)
    .orderBy(direction(posts.publishedAt), direction(posts.id))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const items = rows.map((row): PublicPublicationSummary => {
    if (!row.contentType || !row.publishedAt)
      throw new Error("Published post violates database constraints.");
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      markdown: row.markdown,
      contentType: row.contentType,
      publishedAt: row.publishedAt,
      cover:
        row.coverUrl && row.coverAltText
          ? { url: row.coverUrl, altText: row.coverAltText }
          : null,
      areaNames: row.areaNames,
      categoryName: row.categoryName,
      tagNames: row.tagNames,
    };
  });

  return { items, total, page, pageCount };
}
