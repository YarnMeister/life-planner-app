-- Bootstrap Drizzle's migration tracking table in PROD
-- Run this ONCE manually against your PROD database

CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL,
  created_at bigint
);

-- Safety check: prevent duplicate or conflicting entries
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "__drizzle_migrations" 
    WHERE hash != 'f3b25772-dc03-4507-86d6-f06cec5b5436'
  ) THEN
    RAISE EXCEPTION 'Migration state mismatch. Journal hash does not match drizzle/migrations/meta/_journal.json';
  END IF;
END $$;

-- Register that migration 0000 was already applied
-- (so Drizzle doesn't try to re-run it)
INSERT INTO "__drizzle_migrations" (hash, created_at)
VALUES 
  ('f3b25772-dc03-4507-86d6-f06cec5b5436', 1760827394056)
ON CONFLICT DO NOTHING;

-- After running this, trigger a new Vercel deploy
-- Drizzle will see 0000 is done and apply 0001, 0002

