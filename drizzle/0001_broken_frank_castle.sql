ALTER TABLE "posts" DROP CONSTRAINT "posts_title_not_blank";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_summary_not_blank";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_markdown_not_blank";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_publishable_content" CHECK ("posts"."status" = 'draft' OR (length(trim("posts"."title")) > 0 AND length(trim("posts"."summary")) > 0 AND length(trim("posts"."markdown")) > 0 AND "posts"."content_type" IS NOT NULL));