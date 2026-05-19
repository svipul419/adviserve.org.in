/**
 * Run the migration SQL against Neon database — statement by statement.
 * The Neon serverless driver only supports single statements per call.
 */
import { readFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';

let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envContent = readFileSync('.env.local', 'utf-8');
    const match = envContent.match(/^DATABASE_URL=(.+)$/m);
    if (match) databaseUrl = match[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
}
if (!databaseUrl) { console.error('ERROR: DATABASE_URL not found.'); process.exit(1); }

console.log('Connecting to Neon...');
const sql = neon(databaseUrl);

const migrationSql = readFileSync('db/migration.sql', 'utf-8');

// Smart SQL splitter: respects $$ dollar-quoted blocks and parenthesized blocks
function splitStatements(sqlText) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let parenDepth = 0;
  const lines = sqlText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && !inDollarQuote) continue; // skip comments

    // Track dollar quoting (DO $$...$$, CREATE FUNCTION $$...$$)
    const dollarMatches = line.match(/\$\$/g);
    if (dollarMatches) {
      for (const _ of dollarMatches) {
        inDollarQuote = !inDollarQuote;
      }
    }

    // Track parenthesis depth (for CREATE TABLE (...))
    if (!inDollarQuote) {
      for (const ch of line) {
        if (ch === '(') parenDepth++;
        if (ch === ')') parenDepth--;
      }
    }

    current += line + '\n';

    // Statement ends when we hit ; outside dollar quotes and outside parens
    if (!inDollarQuote && parenDepth <= 0 && trimmed.endsWith(';')) {
      const stmt = current.trim();
      if (stmt && stmt !== ';') statements.push(stmt);
      current = '';
      parenDepth = 0;
    }
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

const statements = splitStatements(migrationSql);
console.log(`Found ${statements.length} SQL statements to execute.\n`);

let success = 0, failed = 0;
for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.substring(0, 70).replace(/\n/g, ' ');
  try {
    await sql.query(stmt);
    success++;
    if (stmt.startsWith('CREATE TABLE')) {
      const tableName = stmt.match(/CREATE TABLE[^(]*?(\w+)\s*\(/)?.[1] || '?';
      console.log(`  ✓ Created table: ${tableName}`);
    } else if (stmt.startsWith('CREATE INDEX') || stmt.startsWith('CREATE UNIQUE INDEX')) {
      // silent
    } else if (stmt.startsWith('INSERT')) {
      const tableName = stmt.match(/INSERT INTO\s+(\w+)/)?.[1] || '?';
      console.log(`  ✓ Seeded: ${tableName}`);
    } else if (stmt.startsWith('DO ')) {
      console.log(`  ✓ Executed block`);
    } else if (stmt.startsWith('CREATE OR REPLACE')) {
      console.log(`  ✓ Created function`);
    } else if (stmt.startsWith('CREATE TRIGGER') || stmt.includes('CREATE TRIGGER')) {
      console.log(`  ✓ Created trigger`);
    }
  } catch (e) {
    failed++;
    console.error(`  ✗ FAILED [${i+1}]: ${preview}`);
    console.error(`    → ${e.message.substring(0, 100)}`);
  }
}

console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${success} succeeded, ${failed} failed`);

// Show final tables
try {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  console.log(`\nTables in database (${tables.length}):`);
  tables.forEach(t => console.log(`  - ${t.table_name}`));
} catch {}
