import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const postStatus = pgEnum("post_status", [
  "draft",
  "published",
  "withdrawn",
]);

export const contentType = pgEnum("content_type", [
  "academic_work",
  "article",
  "research",
  "study",
  "reflection",
  "project",
]);

export const commentStatus = pgEnum("comment_status", ["visible", "hidden"]);

export const referenceKind = pgEnum("reference_kind", [
  "bibliography",
  "related_link",
]);

export const coverAssets = pgTable(
  "cover_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    altText: varchar("alt_text", { length: 300 }).notNull(),
    width: integer("width"),
    height: integer("height"),
    contentType: varchar("content_type", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("cover_assets_pathname_unique").on(table.pathname),
    check("cover_assets_size_positive", sql`${table.sizeBytes} > 0`),
    check(
      "cover_assets_dimensions_positive",
      sql`(${table.width} IS NULL OR ${table.width} > 0) AND (${table.height} IS NULL OR ${table.height} > 0)`,
    ),
  ],
);

export const knowledgeAreas = pgTable(
  "knowledge_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    normalizedName: varchar("normalized_name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("knowledge_areas_normalized_name_unique").on(
      table.normalizedName,
    ),
    uniqueIndex("knowledge_areas_slug_unique").on(table.slug),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    normalizedName: varchar("normalized_name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("categories_normalized_name_unique").on(table.normalizedName),
    uniqueIndex("categories_slug_unique").on(table.slug),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    normalizedName: varchar("normalized_name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tags_normalized_name_unique").on(table.normalizedName),
    uniqueIndex("tags_slug_unique").on(table.slug),
  ],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 240 }).notNull(),
    slug: varchar("slug", { length: 260 }).notNull(),
    summary: varchar("summary", { length: 600 }).notNull(),
    markdown: text("markdown").notNull(),
    contentType: contentType("content_type"),
    status: postStatus("status").default("draft").notNull(),
    featured: boolean("featured").default(false).notNull(),
    course: varchar("course", { length: 180 }),
    discipline: varchar("discipline", { length: 180 }),
    originalDate: timestamp("original_date", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
    coverAssetId: uuid("cover_asset_id").references(() => coverAssets.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    shareTitle: varchar("share_title", { length: 240 }),
    shareDescription: varchar("share_description", { length: 300 }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("posts_slug_unique").on(table.slug),
    uniqueIndex("posts_cover_asset_unique").on(table.coverAssetId),
    index("posts_publication_idx").on(table.status, table.publishedAt),
    index("posts_featured_idx").on(table.featured, table.publishedAt),
    index("posts_content_type_idx").on(table.contentType),
    check(
      "posts_publishable_content",
      sql`${table.status} = 'draft' OR (length(trim(${table.title})) > 0 AND length(trim(${table.summary})) > 0 AND length(trim(${table.markdown})) > 0 AND ${table.contentType} IS NOT NULL)`,
    ),
    check(
      "posts_editorial_dates_match_status",
      sql`(${table.status} = 'draft' AND ${table.publishedAt} IS NULL AND ${table.withdrawnAt} IS NULL) OR (${table.status} = 'published' AND ${table.publishedAt} IS NOT NULL AND ${table.withdrawnAt} IS NULL) OR (${table.status} = 'withdrawn' AND ${table.publishedAt} IS NOT NULL AND ${table.withdrawnAt} IS NOT NULL)`,
    ),
  ],
);

export const postKnowledgeAreas = pgTable(
  "post_knowledge_areas",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    knowledgeAreaId: uuid("knowledge_area_id")
      .notNull()
      .references(() => knowledgeAreas.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.knowledgeAreaId] }),
    index("post_knowledge_areas_area_idx").on(table.knowledgeAreaId),
  ],
);

export const postCategories = pgTable(
  "post_categories",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.categoryId] }),
    index("post_categories_category_idx").on(table.categoryId),
  ],
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "restrict", onUpdate: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.tagId] }),
    index("post_tags_tag_idx").on(table.tagId),
  ],
);

export const references = pgTable(
  "post_references",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    kind: referenceKind("kind").notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    citation: text("citation"),
    url: text("url"),
    position: integer("position").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("post_references_position_unique").on(
      table.postId,
      table.position,
    ),
    index("post_references_post_idx").on(table.postId),
    check("post_references_position_non_negative", sql`${table.position} >= 0`),
    check(
      "post_references_value_present",
      sql`${table.citation} IS NOT NULL OR ${table.url} IS NOT NULL`,
    ),
  ],
);

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    visitorHash: varchar("visitor_hash", { length: 128 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("likes_post_visitor_unique").on(
      table.postId,
      table.visitorHash,
    ),
    index("likes_post_idx").on(table.postId),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" }),
    authorName: varchar("author_name", { length: 80 })
      .default("Anônimo")
      .notNull(),
    body: varchar("body", { length: 1500 }).notNull(),
    status: commentStatus("status").default("visible").notNull(),
    moderatedAt: timestamp("moderated_at", { withTimezone: true }),
    moderationReason: varchar("moderation_reason", { length: 300 }),
    ...timestamps,
  },
  (table) => [
    index("comments_post_status_created_idx").on(
      table.postId,
      table.status,
      table.createdAt,
    ),
    index("comments_moderation_idx").on(table.status, table.moderatedAt),
    check(
      "comments_author_not_blank",
      sql`length(trim(${table.authorName})) > 0`,
    ),
    check("comments_body_not_blank", sql`length(trim(${table.body})) > 0`),
    check(
      "comments_moderation_matches_status",
      sql`(${table.status} = 'visible') OR (${table.status} = 'hidden' AND ${table.moderatedAt} IS NOT NULL)`,
    ),
  ],
);

export const adminIdentities = pgTable(
  "admin_identities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 128 }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("admin_identities_clerk_user_unique").on(table.clerkUserId),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminIdentityId: uuid("admin_identity_id").references(
      () => adminIdentities.id,
      { onDelete: "set null", onUpdate: "cascade" },
    ),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: uuid("entity_id"),
    result: varchar("result", { length: 16 }).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_events_entity_idx").on(table.entityType, table.entityId),
    index("audit_events_created_idx").on(table.createdAt),
    check(
      "audit_events_result_valid",
      sql`${table.result} IN ('success', 'failure')`,
    ),
  ],
);
