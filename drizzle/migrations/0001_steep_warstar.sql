CREATE TABLE "failed_auth_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"ip_address" text NOT NULL,
	"attempted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "auth_codes_email_idx";--> statement-breakpoint
DROP INDEX "auth_codes_ip_idx";--> statement-breakpoint
CREATE INDEX "failed_attempts_email_attempted_idx" ON "failed_auth_attempts" USING btree ("email","attempted_at");--> statement-breakpoint
CREATE INDEX "failed_attempts_ip_attempted_idx" ON "failed_auth_attempts" USING btree ("ip_address","attempted_at");--> statement-breakpoint
CREATE INDEX "auth_codes_email_created_idx" ON "auth_codes" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "auth_codes_ip_created_idx" ON "auth_codes" USING btree ("ip_address","created_at");