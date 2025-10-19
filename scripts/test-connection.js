import { neon } from '@neondatabase/serverless';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

neonConfig.webSocketConstructor = ws;

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
