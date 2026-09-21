ALTER TABLE "audit_events" ADD COLUMN "result" varchar(16) DEFAULT 'success' NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_events" ALTER COLUMN "result" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_result_valid" CHECK ("audit_events"."result" IN ('success', 'failure'));
