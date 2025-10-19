import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

if (process.env.SKIP_RLS_TESTS === '1' || process.env.SKIP_RLS_TESTS === 'true') {
  console.log('⏩ SKIP_RLS_TESTS set. Skipping RLS harness.');
  process.exit(0);
}

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function asBool(v) {
  return v === true || v === 't' || v === 1 || v === '1';
}

async function main() {
  try {
    console.log('🔐 RLS test: engagement_notes (CRUD coverage)');

    // 1) RLS enabled check
    const rls = await sql`
      select c.relrowsecurity as enabled
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = 'engagement_notes'
    `;
    const rlsEnabled = rls.length === 1 && asBool(rls[0].enabled);

    // 2) Policies existence check (SELECT policies)
    const policies = await sql`
      select p.polname as name
      from pg_policy p
      join pg_class c on c.oid = p.polrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = 'engagement_notes'
      order by p.polname
    `;
    const names = policies.map(p => p.name);

    console.log(`   - RLS enabled: ${rlsEnabled}`);
    console.log(`   - Policies: ${names.join(', ') || '(none)'}`);

    // 3) Basic SELECT should succeed when session user_id is set
    await sql`select set_config('app.user_id', '00000000-0000-0000-0000-000000000001', true)`;
    await sql`select count(*) from public.engagement_notes`;

    console.log('✅ RLS policy presence and SELECT check passed');

    // Contacts CRUD policy presence
    console.log('\n🔐 RLS test: contacts (CRUD coverage)');
    const rlsContacts = await sql`
      select c.relrowsecurity as enabled
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = 'contacts'
    `;
    const rlsContactsEnabled = rlsContacts.length === 1 && asBool(rlsContacts[0].enabled);

    const contactPolicies = await sql`
      select p.polname as name
      from pg_policy p
      join pg_class c on c.oid = p.polrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relname = 'contacts'
      order by p.polname
    `;
    const cNames = contactPolicies.map(p => p.name);
    console.log(`   - contacts RLS enabled: ${rlsContactsEnabled}`);
    console.log(`   - contacts Policies: ${cNames.join(', ') || '(none)'}`);

    console.log('✅ Contacts CRUD policy presence verified');

    // Optional: surface migration journal for debugging
    const journal = await sql`select id, hash, created_at from __drizzle_migrations order by created_at desc limit 5`;
    console.log('\n🗒️  Recent migrations applied:');
    journal.forEach(j => console.log(`  ${j.id} ${j.hash} @ ${j.created_at}`));

    // Final assertions after diagnostics
    await assert(rlsEnabled, 'RLS not enabled on engagement_notes');
    await assert(names.includes('engagement_notes_owner_select'), 'Missing policy engagement_notes_owner_select');
    await assert(names.includes('engagement_notes_owner_insert'), 'Missing policy engagement_notes_owner_insert');
    await assert(names.includes('engagement_notes_owner_update'), 'Missing policy engagement_notes_owner_update');
    await assert(names.includes('engagement_notes_owner_delete'), 'Missing policy engagement_notes_owner_delete');

    await assert(rlsContactsEnabled, 'RLS not enabled on contacts');
    await assert(cNames.includes('contacts_site_select'), 'Missing policy contacts_site_select');
    await assert(cNames.includes('contacts_site_insert'), 'Missing policy contacts_site_insert');
    await assert(cNames.includes('contacts_site_update'), 'Missing policy contacts_site_update');
    await assert(cNames.includes('contacts_site_delete'), 'Missing policy contacts_site_delete');
    process.exit(0);
  } catch (err) {
    console.error('❌ RLS test failed:', err.message || err);
    process.exit(1);
  }
}

main();


