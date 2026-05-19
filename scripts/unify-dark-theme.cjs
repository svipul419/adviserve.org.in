#!/usr/bin/env node
/* Convert mixed light-bone + oxblood palette to unified hero-video dark theme.
 * - bone-surface (was light) → ink-base (dark navy)
 * - bone-muted (was lighter light) → ink-raised
 * - slate-body / slate-muted (dark text on light) → white/75 / white/55
 * - gold-muted (warm chip) → accent-amber
 * - oxblood-primary / oxblood-hover (red accent) → accent-blue / accent-blueHover
 * - text-ink-primary on light page surfaces → text-white
 * - hairline (warm beige line) → white/10 ring
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html']);

const replacements = [
  // Oxblood → electric Infosys-blue accent
  ['bg-oxblood-primary',     'bg-accent-blue'],
  ['text-oxblood-primary',   'text-accent-blue'],
  ['border-oxblood-primary', 'border-accent-blue'],
  ['hover:bg-oxblood-hover', 'hover:bg-accent-blueHover'],
  ['hover:text-oxblood-hover','hover:text-accent-blueHover'],
  ['hover:border-oxblood-hover','hover:border-accent-blueHover'],
  ['hover:text-oxblood-primary','hover:text-accent-blue'],
  ['bg-oxblood-hover',       'bg-accent-blueHover'],
  ['text-oxblood-hover',     'text-accent-blueHover'],
  ['border-oxblood-hover',   'border-accent-blueHover'],
  ['from-oxblood-primary',   'from-accent-blue'],
  ['to-oxblood-primary',     'to-accent-blue'],
  ['via-oxblood-primary',    'via-accent-blue'],
  ['outline-oxblood-primary','outline-accent-blue'],
  ['accent-oxblood-primary', 'accent-accent-blue'],
  ['ring-oxblood-primary',   'ring-accent-blue'],
  ['fill-oxblood-primary',   'fill-accent-blue'],
  ['stroke-oxblood-primary', 'stroke-accent-blue'],
  ['border-t-oxblood-primary','border-t-accent-blue'],
  ['border-l-oxblood-primary','border-l-accent-blue'],
  ['border-r-oxblood-primary','border-r-accent-blue'],
  ['border-b-oxblood-primary','border-b-accent-blue'],

  // Bone surfaces → dark navy
  ['bg-bone-surface',        'bg-ink-base'],
  ['bg-bone-muted',          'bg-ink-raised'],
  ['text-bone-surface',      'text-white'],
  ['text-bone-muted',        'text-white/70'],
  ['border-bone-surface',    'border-ink-raised'],
  ['border-bone-muted',      'border-white/10'],

  // Ink-primary text on light pages → white on dark
  ['text-ink-primary/85',    'text-white/85'],
  ['text-ink-primary/80',    'text-white/80'],
  ['text-ink-primary/75',    'text-white/75'],
  ['text-ink-primary/70',    'text-white/70'],
  ['text-ink-primary/65',    'text-white/65'],
  ['text-ink-primary/55',    'text-white/55'],
  ['text-ink-primary/30',    'text-white/30'],
  ['text-ink-primary',       'text-white'],
  ['hover:text-ink-primary', 'hover:text-white'],

  // Bg-ink-primary stays dark (already navy) but normalize naming
  ['bg-ink-primary',         'bg-ink-base'],
  ['bg-ink-soft',            'bg-ink-raised'],
  ['border-ink-primary',     'border-white/12'],
  ['border-ink-soft',        'border-white/10'],
  ['from-ink-primary',       'from-ink-base'],
  ['to-ink-primary',         'to-ink-base'],
  ['from-ink-soft',          'from-ink-raised'],
  ['to-ink-soft',            'to-ink-raised'],

  // Slate body/muted (was for light pages) → white alphas on dark
  ['text-slate-body',        'text-white/75'],
  ['text-slate-muted',       'text-white/55'],
  ['bg-slate-body',          'bg-white/15'],
  ['bg-slate-body/40',       'bg-white/20'],
  ['border-slate-body',      'border-white/15'],

  // Gold-muted (ISO chip + amber accents)
  ['text-gold-muted',        'text-accent-amber'],
  ['bg-gold-muted/20',       'bg-accent-amber/15'],
  ['bg-gold-muted',          'bg-accent-amber'],
  ['border-gold-muted/40',   'border-accent-amber/35'],
  ['border-gold-muted',      'border-accent-amber/50'],
  ['from-gold-muted',        'from-accent-amber'],
  ['to-gold-muted',          'to-accent-amber'],
  ['via-gold-muted',         'via-accent-amber'],
  ['ring-gold-muted',        'ring-accent-amber'],

  // Hairline → soft white ring
  ['border-hairline',        'border-white/10'],
  ['divide-hairline',        'divide-white/10'],
  ['bg-hairline',            'bg-white/10'],

  // Border-default residue
  ['border-default',         'border-white/10'],

  // Stray bg-white opaque (NOT bg-white/...) on pages → dark card
  // Only target standalone bg-white in className strings (negative lookahead for /)
];

const compiled = replacements.map(([f, t]) => ({ re: new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to: t }));

let touched = 0, total = 0;
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
    if (e.name === 'admin') continue; // Admin keeps its own surface
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!exts.has(path.extname(e.name).toLowerCase())) continue;
    let s = fs.readFileSync(p, 'utf8');
    const o = s;
    let c = 0;
    for (const { re, to } of compiled) s = s.replace(re, () => { c++; return to; });
    // Standalone bg-white (no slash) inside className strings → bg-ink-raised
    s = s.replace(/className="([^"]*)"/g, (m, cls) => {
      const out = cls.split(/\s+/).map(tok => {
        if (tok === 'bg-white') { c++; return 'bg-ink-raised'; }
        if (tok === 'hover:bg-white') { c++; return 'hover:bg-ink-glass'; }
        return tok;
      }).join(' ');
      return `className="${out}"`;
    });
    if (s !== o) {
      s = s.replace(/className="([^"]*)"/g, (m, cls) => `className="${cls.replace(/\s+/g, ' ').trim()}"`);
      fs.writeFileSync(p, s, 'utf8');
      touched++; total += c;
      console.log(`  ${path.relative(ROOT, p)}  (${c})`);
    }
  }
}
walk(SRC);
console.log(`\nUnify: ${touched} files, ${total} replacements.`);
