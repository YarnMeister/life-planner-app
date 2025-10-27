/**
 * Verify that the seed migration created pillars and themes for all users
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../drizzle/schema.js';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function verify() {
  try {
    console.log('🔍 Verifying seed migration...\n');

    const users = await db.query.users.findMany();
    console.log(`📊 Total users: ${users.length}\n`);

    for (const user of users) {
      const pillars = await db.query.pillars.findMany({ 
        where: (pillars, { eq }) => eq(pillars.userId, user.id) 
      });
      const themes = await db.query.themes.findMany({ 
        where: (themes, { eq }) => eq(themes.userId, user.id) 
      });
      const tasks = await db.query.tasks.findMany({ 
        where: (tasks, { eq }) => eq(tasks.userId, user.id) 
      });

      console.log(`👤 User: ${user.email}`);
      console.log(`   Pillars: ${pillars.length} (expected: 5)`);
      console.log(`   Themes: ${themes.length} (expected: 25)`);
      console.log(`   Tasks: ${tasks.length} (expected: 0 for new users, 73 for seeded users)`);
      
      if (pillars.length === 5 && themes.length === 25) {
        console.log(`   ✅ User has correct pillars and themes\n`);
      } else {
        console.log(`   ❌ User has incorrect data\n`);
      }
    }

    console.log('✨ Verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify();

