#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html']);

const replacements = [
  // Border directional
  ['border-t-brand-teal',  'border-t-oxblood-primary'],
  ['border-r-brand-teal',  'border-r-oxblood-primary'],
  ['border-b-brand-teal',  'border-b-oxblood-primary'],
  ['border-l-brand-teal',  'border-l-oxblood-primary'],
  ['outline-brand-teal',   'outline-oxblood-primary'],
  ['accent-brand-teal',    'accent-oxblood-primary'],
  ['ring-offset-brand-teal','ring-offset-oxblood-primary'],
  ['shadow-brand-teal/30', ''],

  // brand.line + brand.deep
  ['bg-brand-line',        'bg-hairline'],
  ['border-brand-line',    'border-hairline'],
  ['divide-brand-line',    'divide-hairline'],
  ['text-brand-deep',      'text-ink-primary'],
  ['border-brand-deep',    'border-ink-primary'],
  ['from-brand-deep',      'from-ink-primary'],
  ['to-brand-deep',        'to-ink-primary'],

  // Fix double-slash artifact from earlier migration: /40/40 → /40
  ['border-gold-muted/40/40', 'border-gold-muted/40'],

  // CSS var ref to old token
  ['var(--color-brand-line)', '#E5E2DA'],

  // Stray shadow utilities on cards
  ['shadow-lg shadow-oxblood-primary',  ''],
  ['shadow-md shadow-oxblood-primary',  ''],
];

const compiled = replacements.map(([f, t]) => ({ re: new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to: t }));

let touched = 0, total = 0;
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!exts.has(path.extname(e.name).toLowerCase())) continue;
    let s = fs.readFileSync(p, 'utf8');
    const o = s;
    let c = 0;
    for (const { re, to } of compiled) s = s.replace(re, () => { c++; return to; });
    if (s !== o) {
      s = s.replace(/className="([^"]*)"/g, (m, cls) => `className="${cls.replace(/\s+/g, ' ').trim()}"`);
      fs.writeFileSync(p, s, 'utf8');
      touched++; total += c;
      console.log(`  ${path.relative(ROOT, p)}  (${c})`);
    }
  }
}
walk(SRC);
console.log(`\nPass 2: ${touched} files, ${total} replacements.`);
