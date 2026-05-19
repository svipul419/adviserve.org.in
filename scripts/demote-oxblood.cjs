#!/usr/bin/env node
/* Demote secondary oxblood elements per spec:
 *   - Eyebrow labels: text-oxblood-primary in mono/uppercase eyebrows → text-slate-body
 *   - Hairline bars adjacent to eyebrows: bg-oxblood-primary 1px → bg-slate-body/40
 *   - Inline "Read more" / arrow links inside paragraphs → text-ink-primary
 *   - Bullet markers, icons inside body text → text-slate-body
 *   - Forbidden gradients on oxblood → flat oxblood
 *   - Forbidden shadows referencing teal rgb → strip
 */
const fs = require('fs');
const path = require('path');

const PAGES = [
  'src/pages/About.tsx',
  'src/pages/Services.tsx',
  'src/pages/Products.tsx',
  'src/pages/Trust.tsx',
  'src/pages/Industries.tsx',
  'src/pages/Insights.tsx',
  'src/pages/Partnerships.tsx',
  'src/pages/Team.tsx',
  'src/pages/Careers.tsx',
  'src/pages/FAQ.tsx',
  'src/pages/Contact.tsx',
  'src/pages/CaseStudies.tsx',
  'src/pages/CaseStudyDetail.tsx',
  'src/pages/ProductDetail.tsx',
  'src/pages/ServiceDetail.tsx',
  'src/pages/ServiceCategory.tsx',
  'src/pages/DPDPAssessment.tsx',
  'src/pages/Home.tsx',
];
const ROOT = path.join(__dirname, '..');

const report = [];

for (const rel of PAGES) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, 'utf8');
  const orig = s;
  let count = 0;

  // Demote eyebrow text (mono+uppercase+tracking pattern with oxblood)
  s = s.replace(
    /text-oxblood-primary(\s+(?:mb-\d+|flex|items-center|gap-\d|font-mono|uppercase))/g,
    (m) => { count++; return m.replace('text-oxblood-primary', 'text-slate-body'); }
  );
  // Mono uppercase eyebrows: any class string mixing font-mono + uppercase + text-oxblood-primary
  s = s.replace(/(className="[^"]*\bfont-mono\b[^"]*\buppercase\b[^"]*?)text-oxblood-primary/g,
    (m, prefix) => { count++; return prefix + 'text-slate-body'; });
  s = s.replace(/(className="[^"]*\buppercase\b[^"]*\bfont-mono\b[^"]*?)text-oxblood-primary/g,
    (m, prefix) => { count++; return prefix + 'text-slate-body'; });

  // Hairline bars (w-7 h-[1px] bg-oxblood-primary) → slate-body/40
  s = s.replace(/w-\d+(?:\.\d+)? h-\[1px\] bg-oxblood-primary/g,
    (m) => { count++; return m.replace('bg-oxblood-primary', 'bg-slate-body/40'); });
  s = s.replace(/h-\[1px\] w-\d+(?:\.\d+)? bg-oxblood-primary/g,
    (m) => { count++; return m.replace('bg-oxblood-primary', 'bg-slate-body/40'); });

  // Inline links text-oxblood-primary inside paragraphs (heuristic: hover:text-ink-primary
  // suggests it was already styled as accent text-link; demote to text-ink-primary base
  // with hover oxblood). Specifically demote "text-oxblood-primary hover:text-ink-primary"
  s = s.replace(/text-oxblood-primary hover:text-ink-primary/g,
    (m) => { count++; return 'text-ink-primary hover:text-oxblood-primary'; });

  // Forbidden gradients on oxblood — flat oxblood instead
  s = s.replace(/bg-gradient-to-[a-z]+ from-oxblood-primary[^"`]*?to-(?:transparent|[a-z-/0-9]+)/g,
    (m) => { count++; return 'bg-oxblood-primary'; });

  // Stale teal rgba shadows — strip
  s = s.replace(/shadow-\[[^\]]*rgba\(10,\s*102,\s*194[^\]]*\][^\s"`]*/g,
    (m) => { count++; return ''; });
  s = s.replace(/hover:shadow-\[[^\]]*rgba\(10,\s*102,\s*194[^\]]*\][^\s"`]*/g,
    (m) => { count++; return ''; });
  // Any stale shadow-[...] custom drop shadows on cards
  s = s.replace(/\bshadow-md\b/g, () => { count++; return ''; });
  s = s.replace(/\bshadow-lg\b/g, () => { count++; return ''; });
  s = s.replace(/\bshadow-xl\b/g, () => { count++; return ''; });
  s = s.replace(/\bshadow-2xl\b/g, () => { count++; return ''; });
  s = s.replace(/\bhover:shadow-md\b/g, () => { count++; return ''; });
  s = s.replace(/\bhover:shadow-lg\b/g, () => { count++; return ''; });
  s = s.replace(/\bhover:shadow-xl\b/g, () => { count++; return ''; });

  // Cleanup multi-spaces in className strings
  s = s.replace(/className="([^"]*)"/g, (m, cls) => `className="${cls.replace(/\s+/g, ' ').trim()}"`);

  if (s !== orig) {
    fs.writeFileSync(p, s, 'utf8');
    report.push(`  ${rel}  (${count})`);
  }
}

console.log('Demotion sweep:');
report.forEach(r => console.log(r));
console.log(`\n${report.length} files modified.`);
