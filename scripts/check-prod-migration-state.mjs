import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const url = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('❌ No DATABASE_URL found');
  process.exit(1);
}

const sql = neon(url);

async function main() {
  console.log('🔍 Checking PROD migration state...\n');
  
  // Check if __drizzle_migrations exists
  const tableExists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = '__drizzle_migrations'
    ) as exists
  `;
  
  console.log(`__drizzle_migrations table exists: ${tableExists[0].exists}`);
  
  if (tableExists[0].exists) {
    const migrations = await sql`SELECT * FROM __drizzle_migrations ORDER BY id`;
    console.log(`\nMigrations in __drizzle_migrations table (${migrations.length}):`);
    migrations.forEach(m => console.log(`  - ${m.id}: ${m.hash} @ ${m.created_at}`));
  }
  
  // Check RLS status
  const rls = await sql`
    SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname IN ('engagement_notes', 'contacts')
  `;
  
  console.log(`\nRLS status:`);
  rls.forEach(r => console.log(`  - ${r.relname}: enabled=${r.relrowsecurity}, forced=${r.relforcerowsecurity}`));
  
  const policies = await sql`SELECT COUNT(*) as count FROM pg_policy`;
  console.log(`\nTotal RLS policies: ${policies[0].count}`);
}

main().catch(console.error);

