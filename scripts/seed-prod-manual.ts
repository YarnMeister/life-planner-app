/**
 * Manually seed pillars and themes for all users in production
 * 
 * Usage:
 *   DATABASE_URL="your-prod-connection-string" npx tsx scripts/seed-prod-manual.ts
 * 
 * This script will:
 * 1. Connect to the specified database
 * 2. Find all users who don't have pillars
 * 3. Seed them with 5 pillars and 25 themes
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import * as schema from '../drizzle/schema.js';

// Get DATABASE_URL from command line environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!');
  console.error('');
  console.error('Usage:');
  console.error('  DATABASE_URL="postgresql://..." npx tsx scripts/seed-prod-manual.ts');
  console.error('');
  process.exit(1);
}

// Show which database we're connecting to (hide password)
const dbHost = DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown';
console.log(`📡 Connecting to: ${dbHost}\n`);

const neonSql = neon(DATABASE_URL);
const db = drizzle(neonSql, { schema });

async function seedUsers() {
  try {
    console.log('🚀 Starting user seeding...\n');

    // Get all users
    const users = await db.query.users.findMany();
    console.log(`👥 Found ${users.length} total users\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in database');
      process.exit(0);
    }

    let seededCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      console.log(`\n👤 Processing user: ${user.email}`);
      
      // Check if user already has pillars
      const existingPillars = await db.query.pillars.findMany({
        where: (pillars, { eq }) => eq(pillars.userId, user.id)
      });

      if (existingPillars.length > 0) {
        console.log(`   ⏭️  Skipping - user already has ${existingPillars.length} pillars`);
        skippedCount++;
        continue;
      }

      console.log('   🌱 Seeding pillars and themes...');

      // Run the seeding logic
      await db.execute(sql`
        DO $$
        DECLARE
          target_user_id uuid := ${user.id};
        BEGIN
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
        END $$;
      `);

      // Verify
      const pillars = await db.query.pillars.findMany({
        where: (pillars, { eq }) => eq(pillars.userId, user.id)
      });
      const themes = await db.query.themes.findMany({
        where: (themes, { eq }) => eq(themes.userId, user.id)
      });

      console.log(`   ✅ Seeded ${pillars.length} pillars and ${themes.length} themes`);
      seededCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Seeding complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Total users: ${users.length}`);
    console.log(`   Seeded: ${seededCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedUsers();

