/**
 * Test script to verify user creation and planning docs initialization
 */

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from '../drizzle/schema.js';

const { users, planningDoc } = schema;

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function testUserCreation() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    console.log('🧪 Testing user creation and planning docs initialization\n');
    console.log(`📧 Test email: ${testEmail}\n`);

    // Step 1: Create a new user (simulating what happens in verify-code route)
    console.log('Step 1: Creating new user...');
    const [newUser] = await db.insert(users).values({
      email: testEmail,
    }).returning();
    console.log(`✅ User created: ${newUser.id}\n`);

    // Step 2: Manually initialize planning docs (simulating what happens after user creation)
    console.log('Step 2: Initializing planning docs...');
    const { initializePlanningDocs } = await import('../src/lib/services/user-init.service.js');
    await initializePlanningDocs(newUser.id);
    console.log('✅ Planning docs initialized\n');

    // Step 3: Verify planning docs were created
    console.log('Step 3: Verifying planning docs...\n');

    const pillarsDoc = await db.query.planningDoc.findFirst({
      where: eq(planningDoc.userId, newUser.id) && eq(planningDoc.kind, 'pillars'),
    });

    const themesDoc = await db.query.planningDoc.findFirst({
      where: eq(planningDoc.userId, newUser.id) && eq(planningDoc.kind, 'themes'),
    });

    const tasksDoc = await db.query.planningDoc.findFirst({
      where: eq(planningDoc.userId, newUser.id) && eq(planningDoc.kind, 'tasks'),
    });

    // Verify pillars
    if (!pillarsDoc) {
      console.error('❌ Pillars document not found!');
      process.exit(1);
    }
    const pillars = pillarsDoc.data as any[];
    console.log(`✅ Pillars document found (version: ${pillarsDoc.version})`);
    console.log(`   - Count: ${pillars.length} (expected: 4)`);
    console.log(`   - Pillars: ${pillars.map(p => p.name).join(', ')}\n`);

    // Verify themes
    if (!themesDoc) {
      console.error('❌ Themes document not found!');
      process.exit(1);
    }
    const themes = themesDoc.data as any[];
    console.log(`✅ Themes document found (version: ${themesDoc.version})`);
    console.log(`   - Count: ${themes.length} (expected: 8)`);
    console.log(`   - Themes: ${themes.map(t => t.name).join(', ')}\n`);

    // Verify tasks
    if (!tasksDoc) {
      console.error('❌ Tasks document not found!');
      process.exit(1);
    }
    const tasks = tasksDoc.data as any[];
    console.log(`✅ Tasks document found (version: ${tasksDoc.version})`);
    console.log(`   - Count: ${tasks.length} (expected: 0)\n`);

    // Verify data structure
    console.log('Step 4: Verifying data structure...\n');

    // Check pillar structure
    const samplePillar = pillars[0];
    console.log('Sample Pillar:', JSON.stringify(samplePillar, null, 2));
    
    const requiredPillarFields = ['id', 'name', 'color', 'domain', 'rating', 'order', 'createdAt', 'updatedAt'];
    const missingPillarFields = requiredPillarFields.filter(f => !(f in samplePillar));
    if (missingPillarFields.length > 0) {
      console.error(`❌ Missing pillar fields: ${missingPillarFields.join(', ')}`);
      process.exit(1);
    }
    console.log('✅ Pillar structure valid\n');

    // Check theme structure
    const sampleTheme = themes[0];
    console.log('Sample Theme:', JSON.stringify(sampleTheme, null, 2));
    
    const requiredThemeFields = ['id', 'pillarId', 'name', 'rating', 'order', 'createdAt', 'updatedAt'];
    const missingThemeFields = requiredThemeFields.filter(f => !(f in sampleTheme));
    if (missingThemeFields.length > 0) {
      console.error(`❌ Missing theme fields: ${missingThemeFields.join(', ')}`);
      process.exit(1);
    }
    console.log('✅ Theme structure valid\n');

    // Verify theme-pillar relationships
    console.log('Step 5: Verifying relationships...\n');
    const pillarIds = new Set(pillars.map(p => p.id));
    const invalidThemes = themes.filter(t => !pillarIds.has(t.pillarId));
    if (invalidThemes.length > 0) {
      console.error(`❌ Found ${invalidThemes.length} themes with invalid pillarId`);
      process.exit(1);
    }
    console.log('✅ All themes have valid pillarId references\n');

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ All tests passed!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`User ID: ${newUser.id}`);
    console.log(`Email: ${testEmail}`);
    console.log(`Pillars: ${pillars.length}`);
    console.log(`Themes: ${themes.length}`);
    console.log(`Tasks: ${tasks.length}`);
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testUserCreation();

