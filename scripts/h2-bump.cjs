#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.tsx')) files.push(p);
  }
}
walk(PAGES_DIR);
let n = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const b = s;
  // Final CTA H2 pattern
  s = s.replace(
    /font-display text-\[clamp\(36px,5vw,64px\)\] leading-\[1\.05\] tracking-\[-0\.01em\]/g,
    'font-display font-bold text-[clamp(34px,4.5vw,68px)] leading-[1.05] tracking-[-0.02em]'
  );
  // Lighter eyebrow tracking — Infosys-style
  s = s.replace(
    /tracking-\[0\.2em\] text-white\/75 mb-6/g,
    'tracking-[0.22em] text-white/65 mb-7'
  );
  if (s !== b) { fs.writeFileSync(f, s, 'utf8'); n++; console.log('  ' + path.relative(ROOT, f)); }
}
console.log(`\n${n} files`);
