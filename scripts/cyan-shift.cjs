#!/usr/bin/env node
/* Shift remaining old-blue refs to new cyan/blue palette. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILES = [
  path.join(ROOT, 'src/index.css'),
  path.join(ROOT, 'src/pages/Home.tsx'),
  path.join(ROOT, 'src/components/CustomCursor.tsx'),
  path.join(ROOT, 'src/components/effects/AnimatedMeshBg.tsx'),
];
const reps = [
  // hex
  ['#1976D2', '#2196F3'],
  ['#1565C0', '#1976D2'],
  ['#4FA3E0', '#00D4FF'],
  // rgba spaces
  ['rgba(25, 118, 210', 'rgba(33, 150, 243'],
  ['rgba(25,118,210',   'rgba(33,150,243'],
  ['rgba(79, 163, 224', 'rgba(0, 212, 255'],
  ['rgba(79,163,224',   'rgba(0,212,255'],
];
let n = 0;
for (const f of FILES) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  for (const [a, b] of reps) s = s.split(a).join(b);
  if (s !== before) { fs.writeFileSync(f, s, 'utf8'); n++; console.log('  ' + path.relative(ROOT, f)); }
}
console.log(`\n${n} files updated`);
