-- Create enum types for Life Planner
CREATE TYPE "pillar_domain" AS ENUM('work', 'personal');
CREATE TYPE "time_estimate" AS ENUM('15m', '30m', '1h', '2h+');
CREATE TYPE "impact" AS ENUM('H', 'M', 'L');
CREATE TYPE "task_status" AS ENUM('open', 'done');
CREATE TYPE "task_type" AS ENUM('adhoc', 'recurring');
CREATE TYPE "recurrence_frequency" AS ENUM('daily', 'weekly', 'monthly');

--> statement-breakpoint

-- Create pillars table
CREATE TABLE "pillars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"domain" "pillar_domain" NOT NULL DEFAULT 'personal',
	"avg_percent" integer NOT NULL DEFAULT 0,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint

-- Create themes table
CREATE TABLE "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pillar_id" uuid NOT NULL,
	"name" text NOT NULL,
	"rating_percent" integer NOT NULL DEFAULT 50,
	"last_reflection_note" text,
	"previous_rating" integer,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint

-- Create tasks table
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pillar_id" uuid NOT NULL,
	"theme_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"time_estimate" "time_estimate",
	"impact" "impact",
	"status" "task_status" NOT NULL DEFAULT 'open',
	"due_date" date,
	"rank" integer NOT NULL DEFAULT 0,
	"notes" text,
	"task_type" "task_type" NOT NULL DEFAULT 'adhoc',
	"recurrence_frequency" "recurrence_frequency",
	"recurrence_interval" integer,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint

-- Add foreign key constraints
ALTER TABLE "pillars" ADD CONSTRAINT "pillars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
ALTER TABLE "themes" ADD CONSTRAINT "themes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
ALTER TABLE "themes" ADD CONSTRAINT "themes_pillar_id_pillars_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "pillars"("id") ON DELETE cascade;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_pillar_id_pillars_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "pillars"("id") ON DELETE cascade;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "themes"("id") ON DELETE cascade;

--> statement-breakpoint

-- Create indexes for performance
CREATE INDEX "pillars_user_id_idx" ON "pillars" USING btree ("user_id");
CREATE INDEX "pillars_user_id_name_idx" ON "pillars" USING btree ("user_id","name");

--> statement-breakpoint

CREATE INDEX "themes_user_id_idx" ON "themes" USING btree ("user_id");
CREATE INDEX "themes_pillar_id_idx" ON "themes" USING btree ("pillar_id");
CREATE INDEX "themes_user_id_pillar_id_idx" ON "themes" USING btree ("user_id","pillar_id");

--> statement-breakpoint

CREATE INDEX "tasks_user_id_idx" ON "tasks" USING btree ("user_id");
CREATE INDEX "tasks_theme_id_idx" ON "tasks" USING btree ("theme_id");
CREATE INDEX "tasks_pillar_id_idx" ON "tasks" USING btree ("pillar_id");
CREATE INDEX "tasks_user_id_theme_id_idx" ON "tasks" USING btree ("user_id","theme_id");
CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");
CREATE INDEX "tasks_user_id_status_idx" ON "tasks" USING btree ("user_id","status");

