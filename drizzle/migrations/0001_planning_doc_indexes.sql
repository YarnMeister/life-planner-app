-- GIN index for fast JSONB queries (by pillar, by theme, etc.)
CREATE INDEX "idx_planning_doc_data_gin" ON "planning_doc" USING GIN ("data" jsonb_path_ops);--> statement-breakpoint

-- Constraint: data must be an array for all kinds
ALTER TABLE "planning_doc" ADD CONSTRAINT "chk_planning_doc_data_array" CHECK (jsonb_typeof("data") = 'array');

