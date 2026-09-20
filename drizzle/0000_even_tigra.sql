CREATE TYPE "public"."comment_status" AS ENUM('visible', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('academic_work', 'article', 'research', 'study', 'reflection', 'project');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."reference_kind" AS ENUM('bibliography', 'related_link');--> statement-breakpoint
CREATE TABLE "admin_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_identity_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(80) NOT NULL,
	"entity_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"normalized_name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_name" varchar(80) DEFAULT 'Anônimo' NOT NULL,
	"body" varchar(1500) NOT NULL,
	"status" "comment_status" DEFAULT 'visible' NOT NULL,
	"moderated_at" timestamp with time zone,
	"moderation_reason" varchar(300),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comments_author_not_blank" CHECK (length(trim("comments"."author_name")) > 0),
	CONSTRAINT "comments_body_not_blank" CHECK (length(trim("comments"."body")) > 0),
	CONSTRAINT "comments_moderation_matches_status" CHECK (("comments"."status" = 'visible') OR ("comments"."status" = 'hidden' AND "comments"."moderated_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "cover_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"alt_text" varchar(300) NOT NULL,
	"width" integer,
	"height" integer,
	"content_type" varchar(100) NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cover_assets_size_positive" CHECK ("cover_assets"."size_bytes" > 0),
	CONSTRAINT "cover_assets_dimensions_positive" CHECK (("cover_assets"."width" IS NULL OR "cover_assets"."width" > 0) AND ("cover_assets"."height" IS NULL OR "cover_assets"."height" > 0))
);
--> statement-breakpoint
CREATE TABLE "knowledge_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"normalized_name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"visitor_hash" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_categories" (
	"post_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "post_categories_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "post_knowledge_areas" (
	"post_id" uuid NOT NULL,
	"knowledge_area_id" uuid NOT NULL,
	CONSTRAINT "post_knowledge_areas_post_id_knowledge_area_id_pk" PRIMARY KEY("post_id","knowledge_area_id")
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(240) NOT NULL,
	"slug" varchar(260) NOT NULL,
	"summary" varchar(600) NOT NULL,
	"markdown" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"course" varchar(180),
	"discipline" varchar(180),
	"original_date" timestamp with time zone,
	"published_at" timestamp with time zone,
	"withdrawn_at" timestamp with time zone,
	"cover_asset_id" uuid,
	"share_title" varchar(240),
	"share_description" varchar(300),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_title_not_blank" CHECK (length(trim("posts"."title")) > 0),
	CONSTRAINT "posts_summary_not_blank" CHECK (length(trim("posts"."summary")) > 0),
	CONSTRAINT "posts_markdown_not_blank" CHECK (length(trim("posts"."markdown")) > 0),
	CONSTRAINT "posts_editorial_dates_match_status" CHECK (("posts"."status" = 'draft' AND "posts"."published_at" IS NULL AND "posts"."withdrawn_at" IS NULL) OR ("posts"."status" = 'published' AND "posts"."published_at" IS NOT NULL AND "posts"."withdrawn_at" IS NULL) OR ("posts"."status" = 'withdrawn' AND "posts"."published_at" IS NOT NULL AND "posts"."withdrawn_at" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "post_references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"kind" "reference_kind" NOT NULL,
	"title" varchar(300) NOT NULL,
	"citation" text,
	"url" text,
	"position" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_references_position_non_negative" CHECK ("post_references"."position" >= 0),
	CONSTRAINT "post_references_value_present" CHECK ("post_references"."citation" IS NOT NULL OR "post_references"."url" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"normalized_name" varchar(80) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_admin_identity_id_admin_identities_id_fk" FOREIGN KEY ("admin_identity_id") REFERENCES "public"."admin_identities"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_knowledge_areas" ADD CONSTRAINT "post_knowledge_areas_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_knowledge_areas" ADD CONSTRAINT "post_knowledge_areas_knowledge_area_id_knowledge_areas_id_fk" FOREIGN KEY ("knowledge_area_id") REFERENCES "public"."knowledge_areas"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_asset_id_cover_assets_id_fk" FOREIGN KEY ("cover_asset_id") REFERENCES "public"."cover_assets"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "post_references" ADD CONSTRAINT "post_references_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_identities_clerk_user_unique" ON "admin_identities" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_events_created_idx" ON "audit_events" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_normalized_name_unique" ON "categories" USING btree ("normalized_name");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "comments_post_status_created_idx" ON "comments" USING btree ("post_id","status","created_at");--> statement-breakpoint
CREATE INDEX "comments_moderation_idx" ON "comments" USING btree ("status","moderated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cover_assets_pathname_unique" ON "cover_assets" USING btree ("pathname");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_areas_normalized_name_unique" ON "knowledge_areas" USING btree ("normalized_name");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_areas_slug_unique" ON "knowledge_areas" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_post_visitor_unique" ON "likes" USING btree ("post_id","visitor_hash");--> statement-breakpoint
CREATE INDEX "likes_post_idx" ON "likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_categories_category_idx" ON "post_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "post_knowledge_areas_area_idx" ON "post_knowledge_areas" USING btree ("knowledge_area_id");--> statement-breakpoint
CREATE INDEX "post_tags_tag_idx" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_unique" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_cover_asset_unique" ON "posts" USING btree ("cover_asset_id");--> statement-breakpoint
CREATE INDEX "posts_publication_idx" ON "posts" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "posts_featured_idx" ON "posts" USING btree ("featured","published_at");--> statement-breakpoint
CREATE INDEX "posts_content_type_idx" ON "posts" USING btree ("content_type");--> statement-breakpoint
CREATE UNIQUE INDEX "post_references_position_unique" ON "post_references" USING btree ("post_id","position");--> statement-breakpoint
CREATE INDEX "post_references_post_idx" ON "post_references" USING btree ("post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_normalized_name_unique" ON "tags" USING btree ("normalized_name");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_unique" ON "tags" USING btree ("slug");
