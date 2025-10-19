import fs from 'fs';
import path from 'path';

// Fail build if DDL/raw SQL is found outside approved migration files.
// Approved locations: drizzle/migrations/*.sql only.

const ROOT = process.cwd();
const APPROVED_DIR = path.join(ROOT, 'drizzle', 'migrations');

// Simple DDL detection patterns (expand if needed)
const ddlPatterns = [
  /\bCREATE\s+TABLE\b/i,
  /\bALTER\s+TABLE\b/i,
  /\bDROP\s+TABLE\b/i,
  /\bCREATE\s+TYPE\b/i,
  /\bALTER\s+TYPE\b/i,
  /\bDROP\s+TYPE\b/i,
  /\bCREATE\s+INDEX\b/i,
  /\bDROP\s+INDEX\b/i,
  /\bCREATE\s+SCHEMA\b/i,
  /\bDROP\s+SCHEMA\b/i,
  /\bDO\s+\$\$/i,
  /\bCREATE\s+POLICY\b/i,
  /\bALTER\s+TABLE\b.*ROW\s+LEVEL\s+SECURITY/i,
];

// File globs to scan (JS/TS/SQL outside migrations)
// NOTE: Do not scan docs to avoid flagging example SQL in documentation.
const SCAN_DIRS = [
  'src',
  'scripts',
  'drizzle', // we'll skip drizzle/migrations explicitly
];

// Known-safe files that may contain SQL keywords in strings or comments
const ALLOW_PATH_ENDS_WITH = [
  `${path.sep}scripts${path.sep}lint-migrations.cjs`,
  `${path.sep}scripts${path.sep}verify-migration.cjs`,
  `${path.sep}scripts${path.sep}test-rls.mjs`,
  `${path.sep}scripts${path.sep}audit-rls.mjs`,
  `${path.sep}scripts${path.sep}audit-raw-sql.mjs`,
  `${path.sep}scripts${path.sep}prebuild-migrations.cjs`,
];

function listFiles(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  const stack = [abs];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) {
        // Skip node_modules and approved migrations dir
        if (p.includes(`${path.sep}node_modules${path.sep}`)) continue;
        if (p === APPROVED_DIR) continue;
        stack.push(p);
      } else {
        if (p.endsWith('.sql') || p.endsWith('.ts') || p.endsWith('.tsx') || p.endsWith('.js') || p.endsWith('.mjs') || p.endsWith('.cjs')) {
          out.push(p);
        }
      }
    }
  }
  return out;
}

function isApproved(file) {
  return file.startsWith(APPROVED_DIR + path.sep);
}

function isAllowed(file) {
  return ALLOW_PATH_ENDS_WITH.some(suffix => file.endsWith(suffix));
}

function scanFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  for (const re of ddlPatterns) {
    if (re.test(text)) {
      return re;
    }
  }
  return null;
}

async function main() {
  let failures = 0;
  const offenders = [];
  for (const d of SCAN_DIRS) {
    const files = listFiles(d);
    for (const f of files) {
      if (isApproved(f)) continue; // migrations are allowed
      if (isAllowed(f)) continue; // known-safe scripts allowed
      const match = scanFile(f);
      if (match) {
        offenders.push({ file: f, pattern: match.toString() });
        failures++;
      }
    }
  }

  if (failures) {
    console.error('❌ Raw SQL/DDL detected outside approved migrations:');
    for (const o of offenders) console.error(`  - ${o.file} (${o.pattern})`);
    process.exit(1);
  }
  console.log('✅ No raw SQL/DDL found outside drizzle/migrations/*.sql');
}

main().catch(err => { console.error('audit-raw-sql error', err); process.exit(1); });


