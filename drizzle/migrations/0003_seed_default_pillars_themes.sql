-- Seed default pillars and themes for all users (only if tables are empty)
-- This migration creates the standard Life Planner structure:
-- - 5 Pillars: Health, Finance, Social, Family, Work
-- - 25 Themes across all pillars
-- Note: Tasks are NOT seeded - users start with empty task lists

--> statement-breakpoint

-- Seed pillars and themes for all existing users
DO $$
DECLARE
  user_record RECORD;
  target_user_id uuid;
BEGIN
  FOR user_record IN SELECT id FROM users LOOP
    target_user_id := user_record.id;

    -- Check if user already has pillars
    IF NOT EXISTS (SELECT 1 FROM pillars WHERE user_id = target_user_id) THEN
      -- Insert pillars
      INSERT INTO pillars (user_id, name, color, domain, avg_percent)
      VALUES
        (target_user_id, 'Health', '#7C3AED', 'personal', 0),
        (target_user_id, 'Finance', '#16A34A', 'personal', 0),
        (target_user_id, 'Social', '#2563EB', 'personal', 0),
        (target_user_id, 'Family', '#F97316', 'personal', 0),
        (target_user_id, 'Work', '#DC2626', 'work', 0);

      -- Insert themes for Health
      INSERT INTO themes (user_id, pillar_id, name, rating_percent)
      SELECT target_user_id, id, theme_name, 50
      FROM pillars, unnest(ARRAY['Body', 'Mind', 'Diet', 'Sleep', 'Movement']) AS theme_name
      WHERE user_id = target_user_id AND name = 'Health';

      -- Insert themes for Finance
      INSERT INTO themes (user_id, pillar_id, name, rating_percent)
      SELECT target_user_id, id, theme_name, 50
      FROM pillars, unnest(ARRAY['Budgeting', 'Savings', 'Investing', 'Debt Management', 'Taxes & Compliance']) AS theme_name
      WHERE user_id = target_user_id AND name = 'Finance';

      -- Insert themes for Social
      INSERT INTO themes (user_id, pillar_id, name, rating_percent)
      SELECT target_user_id, id, theme_name, 50
      FROM pillars, unnest(ARRAY['Close Friends', 'Community', 'Professional Network', 'Volunteering']) AS theme_name
      WHERE user_id = target_user_id AND name = 'Social';

      -- Insert themes for Family
      INSERT INTO themes (user_id, pillar_id, name, rating_percent)
      SELECT target_user_id, id, theme_name, 50
      FROM pillars, unnest(ARRAY['Partner Relationship', 'Kids & Parenting', 'Home & Routines', 'Extended Family']) AS theme_name
      WHERE user_id = target_user_id AND name = 'Family';

      -- Insert themes for Work
      INSERT INTO themes (user_id, pillar_id, name, rating_percent)
      SELECT target_user_id, id, theme_name, 50
      FROM pillars, unnest(ARRAY['Strategy & Planning', 'Delivery & Projects', 'Stakeholder Management', 'Craft & Learning', 'Hiring & Mentoring', 'Operations & Admin', 'Innovation & Experiments']) AS theme_name
      WHERE user_id = target_user_id AND name = 'Work';
    END IF;
  END LOOP;
END $$;

--> statement-breakpoint

-- Create trigger to automatically seed pillars and themes for new users
-- Note: Using AFTER INSERT with DEFERRABLE INITIALLY DEFERRED to ensure
-- the user record is committed before seeding
CREATE OR REPLACE FUNCTION trigger_seed_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert pillars directly in the trigger
  INSERT INTO pillars (user_id, name, color, domain, avg_percent)
  VALUES
    (NEW.id, 'Health', '#7C3AED', 'personal', 0),
    (NEW.id, 'Finance', '#16A34A', 'personal', 0),
    (NEW.id, 'Social', '#2563EB', 'personal', 0),
    (NEW.id, 'Family', '#F97316', 'personal', 0),
    (NEW.id, 'Work', '#DC2626', 'work', 0);

  -- Insert themes for each pillar
  -- Health themes
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  SELECT NEW.id, id, theme_name, 50
  FROM pillars, unnest(ARRAY['Body', 'Mind', 'Diet', 'Sleep', 'Movement']) AS theme_name
  WHERE user_id = NEW.id AND name = 'Health';

  -- Finance themes
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  SELECT NEW.id, id, theme_name, 50
  FROM pillars, unnest(ARRAY['Budgeting', 'Savings', 'Investing', 'Debt Management', 'Taxes & Compliance']) AS theme_name
  WHERE user_id = NEW.id AND name = 'Finance';

  -- Social themes
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  SELECT NEW.id, id, theme_name, 50
  FROM pillars, unnest(ARRAY['Close Friends', 'Community', 'Professional Network', 'Volunteering']) AS theme_name
  WHERE user_id = NEW.id AND name = 'Social';

  -- Family themes
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  SELECT NEW.id, id, theme_name, 50
  FROM pillars, unnest(ARRAY['Partner Relationship', 'Kids & Parenting', 'Home & Routines', 'Extended Family']) AS theme_name
  WHERE user_id = NEW.id AND name = 'Family';

  -- Work themes
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  SELECT NEW.id, id, theme_name, 50
  FROM pillars, unnest(ARRAY['Strategy & Planning', 'Delivery & Projects', 'Stakeholder Management', 'Craft & Learning', 'Hiring & Mentoring', 'Operations & Admin', 'Innovation & Experiments']) AS theme_name
  WHERE user_id = NEW.id AND name = 'Work';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE TRIGGER seed_new_user_pillars_themes
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_seed_new_user();

