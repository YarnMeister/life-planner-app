/**
 * Seed script for Life Planner data
 * Migrates seed data from useLifeOSStore to database
 *
 * Usage: npx tsx scripts/seed-life-planner.ts
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema.js';

const { pillars, themes, tasks, users } = schema;

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create database connection with schema
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

// Seed data - mirrors useLifeOSStore.ts
const seedPillars = [
  { name: 'Health', color: '#7C3AED', domain: 'personal' as const },
  { name: 'Finance', color: '#16A34A', domain: 'personal' as const },
  { name: 'Social', color: '#2563EB', domain: 'personal' as const },
  { name: 'Family', color: '#F97316', domain: 'personal' as const },
  { name: 'Work', color: '#DC2626', domain: 'work' as const },
];

const seedThemes = [
  // Health
  { pillarIndex: 0, name: 'Body', ratingPercent: 50 },
  { pillarIndex: 0, name: 'Mind', ratingPercent: 50 },
  { pillarIndex: 0, name: 'Diet', ratingPercent: 50 },
  { pillarIndex: 0, name: 'Sleep', ratingPercent: 50 },
  { pillarIndex: 0, name: 'Movement', ratingPercent: 50 },
  
  // Finance
  { pillarIndex: 1, name: 'Budgeting', ratingPercent: 50 },
  { pillarIndex: 1, name: 'Savings', ratingPercent: 50 },
  { pillarIndex: 1, name: 'Investing', ratingPercent: 50 },
  { pillarIndex: 1, name: 'Debt Management', ratingPercent: 50 },
  { pillarIndex: 1, name: 'Taxes & Compliance', ratingPercent: 50 },
  
  // Social
  { pillarIndex: 2, name: 'Close Friends', ratingPercent: 50 },
  { pillarIndex: 2, name: 'Community', ratingPercent: 50 },
  { pillarIndex: 2, name: 'Professional Network', ratingPercent: 50 },
  { pillarIndex: 2, name: 'Volunteering', ratingPercent: 50 },
  
  // Family
  { pillarIndex: 3, name: 'Partner Relationship', ratingPercent: 50 },
  { pillarIndex: 3, name: 'Kids & Parenting', ratingPercent: 50 },
  { pillarIndex: 3, name: 'Home & Routines', ratingPercent: 50 },
  { pillarIndex: 3, name: 'Extended Family', ratingPercent: 50 },
  
  // Work
  { pillarIndex: 4, name: 'Strategy & Planning', ratingPercent: 50 },
  { pillarIndex: 4, name: 'Delivery & Projects', ratingPercent: 50 },
  { pillarIndex: 4, name: 'Stakeholder Management', ratingPercent: 50 },
  { pillarIndex: 4, name: 'Craft & Learning', ratingPercent: 50 },
  { pillarIndex: 4, name: 'Hiring & Mentoring', ratingPercent: 50 },
  { pillarIndex: 4, name: 'Operations & Admin', ratingPercent: 50 },
  { pillarIndex: 4, name: 'Innovation & Experiments', ratingPercent: 50 },
];

const seedTasksData = [
  // Health - Body (1 task)
  { pillarIndex: 0, themeIndex: 0, title: 'Complete gym workout routine', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  
  // Health - Mind (3 tasks)
  { pillarIndex: 0, themeIndex: 1, title: 'Practice daily meditation', timeEstimate: '15m' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 0, themeIndex: 1, title: 'Read mental health book chapter', timeEstimate: '30m' as const, impact: 'M' as const, status: 'done' as const, rank: 1 },
  { pillarIndex: 0, themeIndex: 1, title: 'Journal about daily experiences', timeEstimate: '15m' as const, impact: 'M' as const, status: 'open' as const, rank: 2 },
  
  // Health - Diet (1 task)
  { pillarIndex: 0, themeIndex: 2, title: 'Meal prep for the week', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  
  // Health - Sleep (3 tasks)
  { pillarIndex: 0, themeIndex: 3, title: 'Set consistent bedtime routine', timeEstimate: '30m' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 0, themeIndex: 3, title: 'Reduce screen time before bed', timeEstimate: '15m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 0, themeIndex: 3, title: 'Track sleep quality', timeEstimate: '15m' as const, impact: 'L' as const, status: 'done' as const, rank: 2 },
  
  // Health - Movement (5 tasks)
  { pillarIndex: 0, themeIndex: 4, title: 'Morning stretching routine', timeEstimate: '15m' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 0, themeIndex: 4, title: 'Walk 10,000 steps daily', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 0, themeIndex: 4, title: 'Try new yoga class', timeEstimate: '1h' as const, impact: 'M' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 0, themeIndex: 4, title: 'Research posture exercises', timeEstimate: '30m' as const, impact: 'L' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 0, themeIndex: 4, title: 'Join walking group', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 4 },
  
  // Finance - Budgeting (3 tasks)
  { pillarIndex: 1, themeIndex: 5, title: 'Review monthly expenses', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 1, themeIndex: 5, title: 'Update budget spreadsheet', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 1, themeIndex: 5, title: 'Cancel unused subscriptions', timeEstimate: '30m' as const, impact: 'H' as const, status: 'done' as const, rank: 2 },
  
  // Finance - Savings (1 task)
  { pillarIndex: 1, themeIndex: 6, title: 'Set up automatic savings transfer', timeEstimate: '15m' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  
  // Finance - Investing (5 tasks)
  { pillarIndex: 1, themeIndex: 7, title: 'Research index funds', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 1, themeIndex: 7, title: 'Review investment portfolio', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 1, themeIndex: 7, title: 'Rebalance asset allocation', timeEstimate: '1h' as const, impact: 'M' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 1, themeIndex: 7, title: 'Read investment book', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 1, themeIndex: 7, title: 'Calculate retirement needs', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 4 },
  
  // Finance - Debt Management (1 task)
  { pillarIndex: 1, themeIndex: 8, title: 'Create debt payoff plan', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  
  // Finance - Taxes & Compliance (3 tasks)
  { pillarIndex: 1, themeIndex: 9, title: 'Organize tax documents', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 1, themeIndex: 9, title: 'Schedule accountant meeting', timeEstimate: '15m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 1, themeIndex: 9, title: 'Review tax deductions', timeEstimate: '30m' as const, impact: 'M' as const, status: 'done' as const, rank: 2 },
  
  // Social - Close Friends (3 tasks)
  { pillarIndex: 2, themeIndex: 10, title: 'Plan dinner with best friend', timeEstimate: '15m' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 2, themeIndex: 10, title: 'Call old college friend', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 2, themeIndex: 10, title: 'Organize game night', timeEstimate: '1h' as const, impact: 'M' as const, status: 'done' as const, rank: 2 },
  
  // Social - Community (1 task)
  { pillarIndex: 2, themeIndex: 11, title: 'Attend local meetup event', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  
  // Social - Professional Network (5 tasks)
  { pillarIndex: 2, themeIndex: 12, title: 'Update LinkedIn profile', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 2, themeIndex: 12, title: 'Reach out to former colleague', timeEstimate: '15m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 2, themeIndex: 12, title: 'Attend industry conference', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 2, themeIndex: 12, title: 'Join professional Slack group', timeEstimate: '15m' as const, impact: 'L' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 2, themeIndex: 12, title: 'Schedule coffee chat with mentor', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 4 },
  
  // Social - Volunteering (1 task)
  { pillarIndex: 2, themeIndex: 13, title: 'Research volunteer opportunities', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  
  // Family - Partner Relationship (3 tasks)
  { pillarIndex: 3, themeIndex: 14, title: 'Plan date night', timeEstimate: '30m' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 3, themeIndex: 14, title: 'Weekly check-in conversation', timeEstimate: '30m' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 3, themeIndex: 14, title: 'Book couples weekend getaway', timeEstimate: '1h' as const, impact: 'M' as const, status: 'done' as const, rank: 2 },
  
  // Family - Kids & Parenting (5 tasks)
  { pillarIndex: 3, themeIndex: 15, title: 'Help with homework', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 3, themeIndex: 15, title: 'Plan family movie night', timeEstimate: '15m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 3, themeIndex: 15, title: 'Attend school parent meeting', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 3, themeIndex: 15, title: 'Research parenting book', timeEstimate: '30m' as const, impact: 'L' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 3, themeIndex: 15, title: 'Schedule pediatrician appointment', timeEstimate: '15m' as const, impact: 'H' as const, status: 'open' as const, rank: 4 },
  
  // Family - Home & Routines (1 task)
  { pillarIndex: 3, themeIndex: 16, title: 'Create weekly meal plan', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  
  // Family - Extended Family (3 tasks)
  { pillarIndex: 3, themeIndex: 17, title: 'Call parents', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 3, themeIndex: 17, title: 'Plan family reunion', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 3, themeIndex: 17, title: 'Send birthday card to aunt', timeEstimate: '15m' as const, impact: 'L' as const, status: 'done' as const, rank: 2 },
  
  // Work - Strategy & Planning (5 tasks)
  { pillarIndex: 4, themeIndex: 18, title: 'Define Q1 OKRs', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 4, themeIndex: 18, title: 'Review team roadmap', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 4, themeIndex: 18, title: 'Competitive analysis research', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 4, themeIndex: 18, title: 'Update product strategy doc', timeEstimate: '1h' as const, impact: 'H' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 4, themeIndex: 18, title: 'Present vision to leadership', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 4 },
  
  // Work - Delivery & Projects (3 tasks)
  { pillarIndex: 4, themeIndex: 19, title: 'Complete feature implementation', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 4, themeIndex: 19, title: 'Code review for team PR', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 4, themeIndex: 19, title: 'Deploy to production', timeEstimate: '1h' as const, impact: 'H' as const, status: 'done' as const, rank: 2 },
  
  // Work - Stakeholder Management (1 task)
  { pillarIndex: 4, themeIndex: 20, title: 'Prepare executive update', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  
  // Work - Craft & Learning (7 tasks)
  { pillarIndex: 4, themeIndex: 21, title: 'Read technical blog posts', timeEstimate: '1h' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 4, themeIndex: 21, title: 'Complete online course module', timeEstimate: '2h+' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 4, themeIndex: 21, title: 'Practice new framework', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 4, themeIndex: 21, title: 'Watch conference talk', timeEstimate: '1h' as const, impact: 'L' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 4, themeIndex: 21, title: 'Write technical blog post', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 4 },
  { pillarIndex: 4, themeIndex: 21, title: 'Attend tech meetup', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 5 },
  { pillarIndex: 4, themeIndex: 21, title: 'Experiment with new tool', timeEstimate: '1h' as const, impact: 'L' as const, status: 'open' as const, rank: 6 },
  
  // Work - Hiring & Mentoring (3 tasks)
  { pillarIndex: 4, themeIndex: 22, title: 'Review candidate resumes', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 4, themeIndex: 22, title: 'Conduct technical interview', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 4, themeIndex: 22, title: 'Weekly 1-on-1 with mentee', timeEstimate: '30m' as const, impact: 'M' as const, status: 'done' as const, rank: 2 },
  
  // Work - Operations & Admin (1 task)
  { pillarIndex: 4, themeIndex: 23, title: 'Submit expense reports', timeEstimate: '30m' as const, impact: 'L' as const, status: 'open' as const, rank: 0 },
  
  // Work - Innovation & Experiments (5 tasks)
  { pillarIndex: 4, themeIndex: 24, title: 'Prototype new feature idea', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 0 },
  { pillarIndex: 4, themeIndex: 24, title: 'Research emerging technologies', timeEstimate: '2h+' as const, impact: 'M' as const, status: 'open' as const, rank: 1 },
  { pillarIndex: 4, themeIndex: 24, title: 'Run A/B test analysis', timeEstimate: '1h' as const, impact: 'H' as const, status: 'open' as const, rank: 2 },
  { pillarIndex: 4, themeIndex: 24, title: 'Brainstorm innovation ideas', timeEstimate: '1h' as const, impact: 'L' as const, status: 'done' as const, rank: 3 },
  { pillarIndex: 4, themeIndex: 24, title: 'Present hackathon project', timeEstimate: '30m' as const, impact: 'M' as const, status: 'open' as const, rank: 4 },
];

async function seed() {
  try {
    console.log('🌱 Starting Life Planner seed...');
    
    // Get or create test user
    let testUser = await db.query.users.findFirst({
      where: eq(users.email, 'seed@lifeplanner.local'),
    });
    
    if (!testUser) {
      console.log('📝 Creating test user...');
      const result = await db.insert(users).values({
        email: 'seed@lifeplanner.local',
      }).returning();
      testUser = result[0];
    }
    
    const userId = testUser.id;
    console.log(`✅ Using user: ${userId}`);
    
    // Insert pillars
    console.log('📌 Inserting pillars...');
    const insertedPillars = await db.insert(pillars).values(
      seedPillars.map(p => ({
        userId,
        name: p.name,
        color: p.color,
        domain: p.domain,
        avgPercent: 0,
      }))
    ).returning();
    console.log(`✅ Inserted ${insertedPillars.length} pillars`);
    
    // Insert themes
    console.log('🎨 Inserting themes...');
    const insertedThemes = await db.insert(themes).values(
      seedThemes.map(t => ({
        userId,
        pillarId: insertedPillars[t.pillarIndex].id,
        name: t.name,
        ratingPercent: t.ratingPercent,
      }))
    ).returning();
    console.log(`✅ Inserted ${insertedThemes.length} themes`);
    
    // Insert tasks
    console.log('✓ Inserting tasks...');
    const insertedTasks = await db.insert(tasks).values(
      seedTasksData.map(t => ({
        userId,
        pillarId: insertedPillars[t.pillarIndex].id,
        themeId: insertedThemes.find((th: any) =>
          th.pillarId === insertedPillars[t.pillarIndex].id &&
          th.name === seedThemes[t.themeIndex].name
        )!.id,
        title: t.title,
        timeEstimate: t.timeEstimate,
        impact: t.impact,
        status: t.status,
        rank: t.rank,
        taskType: 'adhoc' as const,
      }))
    ).returning();
    console.log(`✅ Inserted ${insertedTasks.length} tasks`);
    
    // Verify data
    console.log('\n📊 Verification:');
    const pillarCount = await db.query.pillars.findMany({ where: eq(pillars.userId, userId) });
    const themeCount = await db.query.themes.findMany({ where: eq(themes.userId, userId) });
    const taskCount = await db.query.tasks.findMany({ where: eq(tasks.userId, userId) });
    
    console.log(`  Pillars: ${pillarCount.length} (expected: 5)`);
    console.log(`  Themes: ${themeCount.length} (expected: 25)`);
    console.log(`  Tasks: ${taskCount.length} (expected: 73)`);
    
    if (pillarCount.length === 5 && themeCount.length === 25 && taskCount.length === 73) {
      console.log('\n✨ Seed completed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Seed verification failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

