import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkUser() {
  const email = 'jan@jan.com';
  
  console.log(`\n🔍 Checking user and planning docs for: ${email}\n`);
  
  // Get user
  const users = await sql`
    SELECT id, email, created_at 
    FROM users 
    WHERE email = ${email}
  `;
  
  if (users.length === 0) {
    console.log('❌ User not found');
    return;
  }
  
  const user = users[0];
  console.log('✅ User found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Created: ${user.created_at}\n`);
  
  // Get planning docs
  const docs = await sql`
    SELECT id, kind, version, created_at,
           jsonb_array_length(data) as item_count
    FROM planning_doc 
    WHERE user_id = ${user.id}
    ORDER BY kind
  `;
  
  console.log(`📄 Planning docs: ${docs.length} found\n`);
  
  if (docs.length === 0) {
    console.log('❌ No planning docs found for this user!');
    console.log('   This user needs initialization.\n');
  } else {
    docs.forEach(doc => {
      console.log(`   ${doc.kind}:`);
      console.log(`      ID: ${doc.id}`);
      console.log(`      Items: ${doc.item_count}`);
      console.log(`      Version: ${doc.version}`);
      console.log(`      Created: ${doc.created_at}\n`);
    });
  }
}

checkUser().catch(console.error);

