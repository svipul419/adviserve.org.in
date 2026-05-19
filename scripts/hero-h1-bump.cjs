#!/usr/bin/env node
/* Bump all page hero H1s: weight 700, tighter tracking, slightly larger scale.
 * Targets clamp(48px,7vw,96px) → clamp(44px,6.5vw,104px), adds font-bold if missing. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');

const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx')) files.push(p);
  }
}
walk(PAGES_DIR);

let touched = 0;
for (const file of files) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s;

  // Pattern 1: clamp(48px,7vw,96px) leading-[1.02] tracking-[-0.02em] → bigger + tighter + bold
  s = s.replace(
    /font-display text-\[clamp\(48px,7vw,96px\)\] leading-\[1\.02\] tracking-\[-0\.02em\]/g,
    'font-display font-bold text-[clamp(40px,6vw,96px)] leading-[1.02] tracking-[-0.03em]'
  );
  // Pattern 2: clamp(36px,6vw,68px) on CaseStudyDetail and similar
  s = s.replace(
    /font-display text-\[clamp\(36px,6vw,68px\)\] leading-\[1\.05\] tracking-tight/g,
    'font-display font-bold text-[clamp(36px,5.5vw,76px)] leading-[1.04] tracking-[-0.03em]'
  );

  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8');
    touched++;
    console.log(`  ${path.relative(ROOT, file)}`);
  }
}
console.log(`\n${touched} files updated`);
