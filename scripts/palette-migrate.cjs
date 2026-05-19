#!/usr/bin/env node
/* Mechanical palette migration: teal → oxblood, brand.* → ink/bone/slate */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.svg']);

// Order matters: longer/specific patterns first.
const replacements = [
  // hover variants first
  ['hover:bg-brand-teal',     'hover:bg-oxblood-hover'],
  ['hover:text-brand-teal',   'hover:text-oxblood-hover'],
  ['hover:border-brand-teal', 'hover:border-oxblood-hover'],

  // brand-teal/lightTeal opacity-aware
  ['bg-brand-lightTeal',      'bg-oxblood-primary/10'],
  ['text-brand-lightTeal',    'text-oxblood-primary'],
  ['border-brand-lightTeal',  'border-oxblood-primary/40'],

  ['bg-brand-teal',           'bg-oxblood-primary'],
  ['text-brand-teal',         'text-oxblood-primary'],
  ['border-brand-teal',       'border-oxblood-primary'],
  ['from-brand-teal',         'from-oxblood-primary'],
  ['to-brand-teal',           'to-oxblood-primary'],
  ['via-brand-teal',          'via-oxblood-primary'],
  ['ring-brand-teal',         'ring-oxblood-primary'],
  ['fill-brand-teal',         'fill-oxblood-primary'],
  ['stroke-brand-teal',       'stroke-oxblood-primary'],

  // brand.blue alias (same as teal)
  ['bg-brand-blue',           'bg-oxblood-primary'],
  ['text-brand-blue',         'text-oxblood-primary'],
  ['border-brand-blue',       'border-oxblood-primary'],

  // brand ink + deep surfaces
  ['bg-brand-inkElevated',    'bg-ink-soft'],
  ['bg-brand-inkRaised',      'bg-ink-soft'],
  ['bg-brand-inkPeak',        'bg-ink-soft'],
  ['bg-brand-graphite',       'bg-ink-soft'],
  ['bg-brand-deep',           'bg-ink-soft'],
  ['bg-brand-ink',            'bg-ink-primary'],
  ['text-brand-ink',          'text-ink-primary'],
  ['border-brand-ink',        'border-ink-primary'],
  ['from-brand-ink',          'from-ink-primary'],
  ['to-brand-ink',            'to-ink-primary'],
  ['via-brand-ink',           'via-ink-primary'],

  // brand cream/paper → bone
  ['bg-brand-cream',          'bg-bone-surface'],
  ['bg-brand-paper',          'bg-bone-surface'],
  ['text-brand-cream',        'text-bone-surface'],
  ['text-brand-paper',        'text-bone-surface'],
  ['border-brand-cream',      'border-bone-surface'],

  // surface tokens
  ['bg-surface-muted',        'bg-bone-muted'],
  ['bg-surface-card',         'bg-bone-surface'],
  ['bg-surface\\b',           'bg-bone-surface'],
  ['border-surface-card',     'border-bone-surface'],

  // oc dark family
  ['bg-oc-black',             'bg-ink-primary'],
  ['bg-oc-dark',              'bg-ink-primary'],
  ['bg-oc-gray',              'bg-bone-muted'],
  ['text-oc-light',           'text-slate-body'],
  ['text-oc-lighter',         'text-bone-surface'],
  ['text-oc-muted',           'text-slate-muted'],
  ['border-oc-border',        'border-hairline'],

  // borders + lines
  ['border-brand-line',       'border-hairline'],
  ['border-default',          'border-hairline'],

  // slate / muted text
  ['text-brand-slate',        'text-slate-body'],
  ['text-brand-muted',        'text-slate-muted'],

  // amber → gold-muted (used for ISO chips and accents)
  ['bg-brand-amberSoft',      'bg-gold-muted/20'],
  ['text-brand-amberSoft',    'text-gold-muted'],
  ['bg-brand-amberDeep',      'bg-gold-muted'],
  ['text-brand-amberDeep',    'text-gold-muted'],
  ['bg-brand-amber',          'bg-gold-muted/20'],
  ['text-brand-amber',        'text-gold-muted'],
  ['border-brand-amber',      'border-gold-muted/40'],
  ['from-brand-amber',        'from-gold-muted'],
  ['to-brand-amber',          'to-gold-muted'],
  ['via-brand-amber',         'via-gold-muted'],
  ['ring-brand-amber',        'ring-gold-muted'],

  // text token classes
  ['text-text-primary',       'text-ink-primary'],
  ['text-text-secondary',     'text-slate-body'],
  ['text-text-muted',         'text-slate-muted'],

  // shadows removed
  ['shadow-card-elevated',    ''],
  ['shadow-cardHover',        ''],
  ['shadow-card',             ''],
  ['shadow-glow-teal-lg',     ''],
  ['shadow-glow-teal',        ''],
  ['shadow-glow-amber-lg',    ''],
  ['shadow-glow-amber',       ''],
  ['shadow-glow-dual',        ''],
  ['shadow-glow-pulse',       ''],
  ['shadow-premium-xl',       ''],
  ['shadow-premium-lg',       ''],
  ['shadow-premium-sm',       ''],
  ['shadow-premium',          ''],
  ['shadow-glass-hover',      ''],
  ['shadow-glass',            ''],

  // animations referencing removed keyframes
  ['animate-glow-teal',       ''],
  ['animate-glow-pulse',      ''],
  ['animate-text-shimmer',    ''],

  // hardcoded hex (only safe in JSX/string contexts — palette colors)
  ['#6dd4c4',                 '#7F1D1D'],
  ['#8fe8db',                 '#991B1B'],
  ['#0A4AAD',                 '#0A0E1A'],
  ['#0B1220',                 '#0A0E1A'],
  ['#EFEEE7',                 '#F4F1EA'],
  ['#FAFBFD',                 '#F4F1EA'],
  ['#111111',                 '#0A0E1A'],
  ['#222222',                 '#1A1F2E'],
];

const compiled = replacements.map(([from, to]) => {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\\b/g, '\\b');
  return { re: new RegExp(escaped, 'g'), to };
});

let filesTouched = 0;
let totalReplacements = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(p); continue; }
    const ext = path.extname(entry.name).toLowerCase();
    if (!exts.has(ext)) continue;
    if (entry.name === 'palette-migrate.cjs') continue;
    let s = fs.readFileSync(p, 'utf8');
    const orig = s;
    let count = 0;
    for (const { re, to } of compiled) {
      s = s.replace(re, (m) => { count++; return to; });
    }
    // Cleanup: collapse multiple spaces inside className strings
    if (s !== orig) {
      s = s.replace(/className="([^"]*)"/g, (m, cls) => `className="${cls.replace(/\s+/g, ' ').trim()}"`);
      s = s.replace(/className=\{`([^`]*)`\}/g, (m, cls) => `className={\`${cls.replace(/[ \t]+/g, ' ')}\`}`);
      fs.writeFileSync(p, s, 'utf8');
      filesTouched++;
      totalReplacements += count;
      console.log(`  ${path.relative(ROOT, p)}  (${count})`);
    }
  }
}

console.log('Palette migration starting...\n');
walk(SRC);
const idxHtml = path.join(ROOT, 'index.html');
if (fs.existsSync(idxHtml)) {
  let s = fs.readFileSync(idxHtml, 'utf8');
  const orig = s;
  let c = 0;
  for (const { re, to } of compiled) s = s.replace(re, (m) => { c++; return to; });
  if (s !== orig) {
    fs.writeFileSync(idxHtml, s, 'utf8');
    filesTouched++;
    totalReplacements += c;
    console.log(`  index.html  (${c})`);
  }
}
console.log(`\nDone. ${filesTouched} files touched, ${totalReplacements} replacements.`);
