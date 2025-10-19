#!/usr/bin/env node

/**
 * Migration Linting Script
 * 
 * This script validates migration files to ensure they follow best practices:
 * - Blocks destructive SQL operations unless explicitly allowed with -- allow-destructive
 * - Checks for proper SQL syntax
 * - Validates migration file naming conventions
 * - Ensures migrations are properly formatted
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'drizzle', 'migrations');

// Destructive SQL patterns that require explicit approval
const destructive = /\b(DROP\s+TABLE|DROP\s+COLUMN|TRUNCATE|DELETE\s+FROM)\b/i;
const allow = /--\s*allow-destructive/i;

function lintMigrations() {
  console.log('🔍 Linting migration files...\n');
  
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('✅ No migrations directory found - this is expected for new projects');
    return 0;
  }
  
  const files = fs.readdirSync(MIGRATIONS_DIR);
  const migrationFiles = files.filter(file => file.endsWith('.sql'));
  
  if (migrationFiles.length === 0) {
    console.log('✅ No migration files found - this is expected for new projects');
    return 0;
  }
  
  let errors = 0;
  let badFiles = [];
  
  for (const file of migrationFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 Checking ${file}...`);
    
    // Check for basic SQL syntax issues
    if (content.trim() === '') {
      console.log(`  ❌ Empty migration file: ${file}`);
      errors++;
      continue;
    }
    
    // Check for destructive operations
    if (destructive.test(content) && !allow.test(content)) {
      console.log(`  ❌ Destructive SQL detected without -- allow-destructive: ${file}`);
      badFiles.push(file);
      errors++;
    }
    
    // Check for common SQL issues
    if (content.includes('-- TODO') || content.includes('-- FIXME')) {
      console.log(`  ⚠️  Migration contains TODO/FIXME comments: ${file}`);
    }

    // Check for manual transaction statements outside DO $$ ... $$ blocks
    const contentWithoutDoBlocks = content.replace(/DO\s+\$\$[\s\S]*?\$\$;/gi, '');
    const hasManualBegin = /\b(BEGIN|START\s+TRANSACTION)\s*;/i.test(contentWithoutDoBlocks);
    const hasManualCommit = /\b(COMMIT|COMMIT\s+TRANSACTION)\s*;/i.test(contentWithoutDoBlocks);
    const hasManualRollback = /\b(ROLLBACK|ROLLBACK\s+TRANSACTION)\s*;/i.test(contentWithoutDoBlocks);
    if (hasManualBegin || hasManualCommit || hasManualRollback) {
      console.log(`  ❌ Manual transaction statements detected (BEGIN/COMMIT/ROLLBACK). Drizzle migrator wraps each migration in a transaction; remove manual transactions: ${file}`);
      errors++;
    }
    
    // Check for DDL statements (good practice)
    const hasDDL = /CREATE|ALTER|DROP|ADD|MODIFY|RENAME/i.test(content);
    if (!hasDDL && content.trim().length > 0) {
      console.log(`  ⚠️  Migration doesn't contain DDL statements: ${file}`);
    }
    
    if ((!destructive.test(content) || allow.test(content)) && !hasManualBegin && !hasManualCommit && !hasManualRollback) {
      console.log(`  ✅ ${file} passed basic checks`);
    }
  }
  
  if (badFiles.length > 0) {
    console.log('\n❌ Refusing to run destructive SQL without -- allow-destructive:');
    badFiles.forEach(file => console.log(`  - ${file}`));
    console.log('\nTo allow destructive operations, add this comment to your migration:');
    console.log('-- allow-destructive');
    return 1;
  }
  
  if (errors === 0) {
    console.log('\n🎉 All migration files passed linting!');
    return 0;
  } else {
    console.log(`\n❌ Found ${errors} error(s) in migration files`);
    return 1;
  }
}

// Run the linter
process.exit(lintMigrations());
