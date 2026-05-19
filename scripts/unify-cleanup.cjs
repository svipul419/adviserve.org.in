#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html']);

const replacements = [
  // Double-slash artifacts (X/A/B → X/B is risky; force expected variants)
  ['bg-white/15/40', 'bg-white/20'],
  ['bg-white/15/15', 'bg-white/15'],
  ['bg-white/10/10', 'bg-white/10'],
  ['border-white/10/40', 'border-white/12'],
  ['border-white/10/30', 'border-white/12'],
  ['text-white/75/85', 'text-white/85'],
  ['text-white/75/70', 'text-white/70'],
  ['text-white/55/40', 'text-white/55'],
  ['text-white/70/85', 'text-white/85'],

  // Stray light hover bgs
  ['hover:bg-[#f5f4f0]', 'hover:bg-ink-glass'],
  ['hover:bg-[#f1efe9]', 'hover:bg-ink-glass'],
  ['hover:bg-bone-surface', 'hover:bg-ink-glass'],
  ['hover:bg-bone-muted',   'hover:bg-ink-glass'],

  // Tailwind opacity tokens not supported by default (/6 /8 /14) — round
  ['bg-accent-blue/6',  'bg-accent-blue/10'],
  ['bg-accent-blue/8',  'bg-accent-blue/10'],
  ['bg-accent-blue/12', 'bg-accent-blue/10'],
  ['bg-accent-blue/14', 'bg-accent-blue/15'],
  ['bg-accent-amber/8', 'bg-accent-amber/10'],
  ['bg-accent-amber/12','bg-accent-amber/10'],

  // Ink-base / ink-raised / ink-peak shorthand usages already valid;
  // ensure no leftover bg-ink-soft
  ['bg-ink-soft',     'bg-ink-raised'],
  ['text-ink-soft',   'text-white/80'],
  ['border-ink-soft', 'border-white/10'],

  // Stale CSS var refs
  ['var(--color-brand-line)', 'rgba(255,255,255,0.10)'],
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
      fs.writeFileSync(p, s, 'utf8');
      touched++; total += c;
    }
  }
}
walk(SRC);
console.log(`Cleanup: ${touched} files, ${total} fixes.`);
