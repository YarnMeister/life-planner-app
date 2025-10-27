/**
 * Test that new users automatically get pillars and themes via trigger
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema.js';

const { users, pillars, themes } = schema;

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function test() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`🧪 Testing new user trigger with email: ${testEmail}\n`);

    // Create new user
    console.log('📝 Creating new user...');
    const [newUser] = await db.insert(users).values({
      email: testEmail,
    }).returning();
    console.log(`✅ User created: ${newUser.id}\n`);

    // Wait a moment for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if pillars and themes were created
    console.log('🔍 Checking for pillars and themes...');
    const userPillars = await db.query.pillars.findMany({ 
      where: eq(pillars.userId, newUser.id) 
    });
    const userThemes = await db.query.themes.findMany({ 
      where: eq(themes.userId, newUser.id) 
    });

    console.log(`   Pillars: ${userPillars.length} (expected: 5)`);
    console.log(`   Themes: ${userThemes.length} (expected: 25)\n`);

    if (userPillars.length === 5 && userThemes.length === 25) {
      console.log('✅ Trigger worked! New user automatically got pillars and themes.');
      
      // Clean up test user
      console.log('\n🧹 Cleaning up test user...');
      await db.delete(users).where(eq(users.id, newUser.id));
      console.log('✅ Test user deleted.');
      
      process.exit(0);
    } else {
      console.log('❌ Trigger failed! New user did not get pillars and themes.');
      
      // Clean up test user
      console.log('\n🧹 Cleaning up test user...');
      await db.delete(users).where(eq(users.id, newUser.id));
      console.log('✅ Test user deleted.');
      
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();

