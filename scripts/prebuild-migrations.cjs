#!/usr/bin/env node
/*
  Run DB migrations only in Vercel Production builds.
  Skips in Preview/Development to avoid needing DATABASE_URL there.
*/
const { execSync } = require('node:child_process');

const env = process.env.VERCEL_ENV;

if (env === 'production') {
  console.log('🛠️  Production build detected. Running migration checks...');
  execSync('npm run db:lint:migrations', { stdio: 'inherit' });
  execSync('npm run db:migrate', { stdio: 'inherit' });
  console.log('✅ Migrations completed. Proceeding to app build...');
} else {
  console.log(`ℹ️  ${env || 'development'} build detected. Skipping DB migrations.`);
}


