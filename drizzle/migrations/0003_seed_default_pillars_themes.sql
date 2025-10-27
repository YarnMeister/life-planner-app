-- Seed default pillars and themes for all users (only if tables are empty)
-- This migration creates the standard Life Planner structure:
-- - 5 Pillars: Health, Finance, Social, Family, Work
-- - 25 Themes across all pillars
-- Note: Tasks are NOT seeded - users start with empty task lists

--> statement-breakpoint

-- Function to seed pillars and themes for a user
CREATE OR REPLACE FUNCTION seed_user_pillars_themes(target_user_id uuid)
RETURNS void AS $$
DECLARE
  health_pillar_id uuid;
  finance_pillar_id uuid;
  social_pillar_id uuid;
  family_pillar_id uuid;
  work_pillar_id uuid;
BEGIN
  -- Check if user already has pillars
  IF EXISTS (SELECT 1 FROM pillars WHERE user_id = target_user_id) THEN
    RETURN; -- User already has data, skip seeding
  END IF;

  -- Insert pillars
  INSERT INTO pillars (user_id, name, color, domain, avg_percent)
  VALUES 
    (target_user_id, 'Health', '#7C3AED', 'personal', 0),
    (target_user_id, 'Finance', '#16A34A', 'personal', 0),
    (target_user_id, 'Social', '#2563EB', 'personal', 0),
    (target_user_id, 'Family', '#F97316', 'personal', 0),
    (target_user_id, 'Work', '#DC2626', 'work', 0)
  RETURNING id INTO health_pillar_id, finance_pillar_id, social_pillar_id, family_pillar_id, work_pillar_id;

  -- Get pillar IDs
  SELECT id INTO health_pillar_id FROM pillars WHERE user_id = target_user_id AND name = 'Health';
  SELECT id INTO finance_pillar_id FROM pillars WHERE user_id = target_user_id AND name = 'Finance';
  SELECT id INTO social_pillar_id FROM pillars WHERE user_id = target_user_id AND name = 'Social';
  SELECT id INTO family_pillar_id FROM pillars WHERE user_id = target_user_id AND name = 'Family';
  SELECT id INTO work_pillar_id FROM pillars WHERE user_id = target_user_id AND name = 'Work';

  -- Insert themes for Health pillar
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  VALUES
    (target_user_id, health_pillar_id, 'Body', 50),
    (target_user_id, health_pillar_id, 'Mind', 50),
    (target_user_id, health_pillar_id, 'Diet', 50),
    (target_user_id, health_pillar_id, 'Sleep', 50),
    (target_user_id, health_pillar_id, 'Movement', 50);

  -- Insert themes for Finance pillar
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  VALUES
    (target_user_id, finance_pillar_id, 'Budgeting', 50),
    (target_user_id, finance_pillar_id, 'Savings', 50),
    (target_user_id, finance_pillar_id, 'Investing', 50),
    (target_user_id, finance_pillar_id, 'Debt Management', 50),
    (target_user_id, finance_pillar_id, 'Taxes & Compliance', 50);

  -- Insert themes for Social pillar
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  VALUES
    (target_user_id, social_pillar_id, 'Close Friends', 50),
    (target_user_id, social_pillar_id, 'Community', 50),
    (target_user_id, social_pillar_id, 'Professional Network', 50),
    (target_user_id, social_pillar_id, 'Volunteering', 50);

  -- Insert themes for Family pillar
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  VALUES
    (target_user_id, family_pillar_id, 'Partner Relationship', 50),
    (target_user_id, family_pillar_id, 'Kids & Parenting', 50),
    (target_user_id, family_pillar_id, 'Home & Routines', 50),
    (target_user_id, family_pillar_id, 'Extended Family', 50);

  -- Insert themes for Work pillar
  INSERT INTO themes (user_id, pillar_id, name, rating_percent)
  VALUES
    (target_user_id, work_pillar_id, 'Strategy & Planning', 50),
    (target_user_id, work_pillar_id, 'Delivery & Projects', 50),
    (target_user_id, work_pillar_id, 'Stakeholder Management', 50),
    (target_user_id, work_pillar_id, 'Craft & Learning', 50),
    (target_user_id, work_pillar_id, 'Hiring & Mentoring', 50),
    (target_user_id, work_pillar_id, 'Operations & Admin', 50),
    (target_user_id, work_pillar_id, 'Innovation & Experiments', 50);
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

-- Seed pillars and themes for all existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM users LOOP
    PERFORM seed_user_pillars_themes(user_record.id);
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

