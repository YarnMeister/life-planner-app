import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

if (process.env.SKIP_RLS_TESTS === '1' || process.env.SKIP_RLS_TESTS === 'true') {
  console.log('⏩ SKIP_RLS_TESTS set. Skipping RLS audit.');
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL);

// Tables exempt from RLS (metadata/lookups). Adjust as needed.
const EXEMPT_TABLES = new Set([
  '__drizzle_migrations',
]);
const EXEMPT_PATTERN = /_lu$/; // all lookup tables end with _lu

async function fetchTables() {
  const rows = await sql`
    select n.nspname as schema,
           c.relname as table,
           c.relrowsecurity as rls_enabled,
           c.relforcerowsecurity as rls_forced
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind = 'r' and n.nspname = 'public'
    order by c.relname
  `;
  return rows;
}

async function fetchPolicies() {
  const rows = await sql`
    select c.relname as table,
           p.polname as policy_name,
           p.polcmd as command,
           (select array_agg(r.rolname order by r.rolname)
              from pg_roles r where r.oid = any(p.polroles)) as roles,
           pg_get_expr(p.polqual, p.polrelid) as using_expr,
           pg_get_expr(p.polwithcheck, p.polrelid) as check_expr
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
    order by c.relname, p.polname
  `;
  const byTable = new Map();
  for (const r of rows) {
    if (!byTable.has(r.table)) byTable.set(r.table, []);
    byTable.get(r.table).push(r);
  }
  return byTable;
}

function isExempt(table) {
  return EXEMPT_TABLES.has(table) || EXEMPT_PATTERN.test(table);
}

async function main() {
  let failures = 0;
  console.log('🔎 Auditing RLS coverage for schema public...\n');

  const [tables, policiesByTable] = await Promise.all([
    fetchTables(),
    fetchPolicies(),
  ]);

  for (const t of tables) {
    const name = t.table;
    const exempt = isExempt(name);

    const tablePolicies = policiesByTable.get(name) || [];
    const hasSelectPolicy = tablePolicies.some(p => p.command === 'r');
    const hasInsertPolicy = tablePolicies.some(p => p.command === 'a');
    const hasUpdatePolicy = tablePolicies.some(p => p.command === 'w');
    const hasDeletePolicy = tablePolicies.some(p => p.command === 'd');

    if (exempt) {
      console.log(`🟨 ${name}: exempt (lookup/metadata)`);
      continue;
    }

    if (!t.rls_enabled) {
      console.log(`❌ ${name}: RLS not enabled`);
      failures++;
      continue;
    }

    if (!hasSelectPolicy) { console.log(`❌ ${name}: no SELECT policy defined`); failures++; }
    if (!hasInsertPolicy) { console.log(`❌ ${name}: no INSERT policy defined`); failures++; }
    if (!hasUpdatePolicy) { console.log(`❌ ${name}: no UPDATE policy defined`); failures++; }
    if (!hasDeletePolicy) { console.log(`❌ ${name}: no DELETE policy defined`); failures++; }

    if (hasSelectPolicy && hasInsertPolicy && hasUpdatePolicy && hasDeletePolicy) {
      console.log(`✅ ${name}: RLS enabled${t.rls_forced ? ' (forced)' : ''}, CRUD policies present`);
      if (!t.rls_forced) {
        console.log(`  ⚠️  ${name}: consider FORCE ROW LEVEL SECURITY`);
      }
    }
  }

  if (failures > 0) {
    console.error(`\n❌ RLS audit failed: ${failures} table(s) missing coverage.`);
    process.exit(1);
  } else {
    console.log('\n🎉 RLS audit passed: all non-exempt tables covered.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('❌ RLS audit error:', err);
  process.exit(1);
});


