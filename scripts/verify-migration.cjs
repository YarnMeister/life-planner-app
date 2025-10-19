const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration results...\n');
    
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log('📋 Tables created:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
    // Check lookup table data
    console.log('\n🏷️  Service Tier Lookup Data:');
    const serviceTiers = await sql`SELECT * FROM service_tier_lu ORDER BY sort_order`;
    serviceTiers.forEach(tier => console.log(`  ${tier.code}: ${tier.label} (order: ${tier.sort_order})`));
    
    console.log('\n📈 Growth Potential Lookup Data:');
    const growthPotential = await sql`SELECT * FROM growth_potential_lu ORDER BY sort_order`;
    growthPotential.forEach(gp => console.log(`  ${gp.code}: ${gp.label} (order: ${gp.sort_order})`));
    
    console.log('\n🔄 Lifecycle Bucket Lookup Data:');
    const lifecycleBuckets = await sql`SELECT * FROM lifecycle_bucket_lu ORDER BY sort_order`;
    lifecycleBuckets.forEach(bucket => console.log(`  ${bucket.code}: ${bucket.label} (order: ${bucket.sort_order})`));
    
    console.log('\n⚡ Urgency Category Lookup Data:');
    const urgencyCategories = await sql`SELECT * FROM urgency_category_lu ORDER BY sort_order`;
    urgencyCategories.forEach(urgency => console.log(`  ${urgency.code}: ${urgency.label} (order: ${urgency.sort_order})`));
    
    console.log('\n📦 Order Status Lookup Data:');
    const orderStatuses = await sql`SELECT * FROM order_status_lu ORDER BY sort_order`;
    orderStatuses.forEach(status => console.log(`  ${status.code}: ${status.label} (order: ${status.sort_order})`));
    
    // Check foreign key constraints
    console.log('\n🔗 Foreign Key Constraints:');
    const constraints = await sql`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name, kcu.column_name
    `;
    constraints.forEach(constraint => 
      console.log(`  ${constraint.table_name}.${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`)
    );
    
    console.log('\n✅ Migration verification complete!');
    
  } catch (error) {
    console.error('❌ Error verifying migration:', error);
    process.exit(1);
  }
}

verifyMigration();
