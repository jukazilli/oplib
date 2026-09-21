import "server-only";

import { asc, count, eq, ilike, or, sql } from "drizzle-orm";
import { connection } from "next/server";

import { getDatabase, type Database } from "@/lib/db";
import {
  categories,
  knowledgeAreas,
  postCategories,
  postKnowledgeAreas,
  postTags,
  tags,
} from "@/lib/db/schema";
import type { TaxonomyKind } from "@/modules/taxonomy/domain";

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
};

export type TaxonomyCollection = {
  areas: TaxonomyItem[];
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
};

export async function listTaxonomy(
  search = "",
  database?: Database,
): Promise<TaxonomyCollection> {
  await connection();
  const db = database ?? getDatabase();
  const pattern = `%${search.trim()}%`;
  const categoryFilter = search.trim()
    ? or(ilike(categories.name, pattern), ilike(categories.slug, pattern))
    : undefined;
  const tagFilter = search.trim()
    ? or(ilike(tags.name, pattern), ilike(tags.slug, pattern))
    : undefined;

  const [areaRows, categoryRows, tagRows] = await Promise.all([
    db
      .select({
        id: knowledgeAreas.id,
        name: knowledgeAreas.name,
        slug: knowledgeAreas.slug,
        usageCount: count(postKnowledgeAreas.postId),
      })
      .from(knowledgeAreas)
      .leftJoin(
        postKnowledgeAreas,
        eq(knowledgeAreas.id, postKnowledgeAreas.knowledgeAreaId),
      )
      .groupBy(knowledgeAreas.id)
      .orderBy(asc(knowledgeAreas.name)),
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        usageCount: count(postCategories.postId),
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .where(categoryFilter)
      .groupBy(categories.id)
      .orderBy(asc(categories.name)),
    db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        usageCount: count(postTags.postId),
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .where(tagFilter)
      .groupBy(tags.id)
      .orderBy(asc(tags.name)),
  ]);

  return { areas: areaRows, categories: categoryRows, tags: tagRows };
}

export async function createTaxonomyItem(
  kind: TaxonomyKind,
  values: { name: string; normalizedName: string; slug: string },
  database?: Database,
) {
  const db = database ?? getDatabase();
  const table = kind === "category" ? categories : tags;
  await db.insert(table).values(values);
}

export async function renameTaxonomyItem(
  kind: TaxonomyKind,
  id: string,
  values: { name: string; normalizedName: string; slug: string },
  database?: Database,
) {
  const db = database ?? getDatabase();
  const table = kind === "category" ? categories : tags;
  const rows = await db
    .update(table)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(table.id, id))
    .returning({ id: table.id });
  return rows.length > 0;
}

export async function deleteTaxonomyItem(
  kind: TaxonomyKind,
  id: string,
  strategy: "unlinked" | "remove" | "replace",
  replacementId?: string,
  database?: Database,
) {
  const db = database ?? getDatabase();

  return db.transaction(async (tx) => {
    const table = kind === "category" ? categories : tags;
    const relation = kind === "category" ? postCategories : postTags;
    const relationId =
      kind === "category" ? postCategories.categoryId : postTags.tagId;
    const usage = await tx
      .select({ value: count() })
      .from(relation)
      .where(eq(relationId, id));
    const usageCount = usage[0]?.value ?? 0;

    if (usageCount > 0 && strategy === "unlinked")
      return { status: "in-use" as const, usageCount };

    if (usageCount > 0 && strategy === "replace") {
      if (!replacementId || replacementId === id)
        return { status: "invalid-replacement" as const };

      if (kind === "category") {
        await tx.execute(
          sql`insert into ${postCategories} (post_id, category_id) select post_id, ${replacementId}::uuid from ${postCategories} where category_id = ${id}::uuid on conflict do nothing`,
        );
      } else {
        await tx.execute(
          sql`insert into ${postTags} (post_id, tag_id) select post_id, ${replacementId}::uuid from ${postTags} where tag_id = ${id}::uuid on conflict do nothing`,
        );
      }
    }

    if (usageCount > 0) await tx.delete(relation).where(eq(relationId, id));
    const deleted = await tx
      .delete(table)
      .where(eq(table.id, id))
      .returning({ id: table.id });
    return {
      status: deleted.length ? ("deleted" as const) : ("not-found" as const),
      usageCount,
    };
  });
}
