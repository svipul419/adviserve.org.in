#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html']);

let count = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!exts.has(path.extname(e.name).toLowerCase())) continue;
    let s = fs.readFileSync(p, 'utf8');
    const o = s;
    s = s.replace(/border-border-hairline/g, 'border-hairline');
    if (s !== o) { fs.writeFileSync(p, s, 'utf8'); count++; }
  }
}
walk(SRC);
console.log(`Fixed border-border-hairline in ${count} files.`);
