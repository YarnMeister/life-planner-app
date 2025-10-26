import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function verify() {
  console.log('🔍 Verifying Phase 2 database schema...\n');
  
  // Check tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('pillars', 'themes', 'tasks')
    ORDER BY table_name;
  `;
  
  console.log('✅ Life Planner Tables Created:');
  tables.forEach(t => console.log(`   - ${t.table_name}`));
  
  // Check enums
  const enums = await sql`
    SELECT typname 
    FROM pg_type 
    WHERE typtype = 'e' 
    AND typname LIKE '%_enum'
    ORDER BY typname;
  `;
  
  console.log('\n✅ Enums Created:');
  enums.forEach(e => console.log(`   - ${e.typname}`));
  
  // Check indexes
  const indexes = await sql`
    SELECT indexname 
    FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename IN ('pillars', 'themes', 'tasks')
    ORDER BY indexname;
  `;
  
  console.log('\n✅ Indexes Created:');
  indexes.forEach(i => console.log(`   - ${i.indexname}`));
  
  // Count records
  const counts = await sql`
    SELECT 
      (SELECT COUNT(*) FROM pillars) as pillars,
      (SELECT COUNT(*) FROM themes) as themes,
      (SELECT COUNT(*) FROM tasks) as tasks;
  `;
  
  console.log('\n📊 Current Record Counts:');
  console.log(`   - Pillars: ${counts[0].pillars}`);
  console.log(`   - Themes: ${counts[0].themes}`);
  console.log(`   - Tasks: ${counts[0].tasks}`);
  
  console.log('\n✅ Phase 2 database schema verified successfully!\n');
}

verify().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

