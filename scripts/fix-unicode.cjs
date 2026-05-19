/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Walk src/ for any tsx/ts file (skip node_modules, admin pages are low-risk too).
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p);
  }
  return out;
}
const files = walk(path.resolve(__dirname, '..', 'src')).map((p) => path.relative(path.resolve(__dirname, '..'), p));

const reps = [
  ['\\u00B0', '°'],
  ['\\u00b0', '°'],
  ['\\u00B7', '·'],
  ['\\u00b7', '·'],
  ['\\u2014', '—'],
  ['\\u2013', '–'],
  ['\\u2018', '‘'],
  ['\\u2019', '’'],
  ['\\u201C', '“'],
  ['\\u201D', '”'],
  ['\\u20B9', '₹'],
  ['\\u20b9', '₹'],
  ['\\u2192', '→'],
  ['\\u2193', '↓'],
  ['\\u2190', '←'],
  ['\\u2191', '↑'],
  ['\\u00A0', ' '],
  ['\\u00a0', ' '],
];

for (const f of files) {
  const p = path.resolve(__dirname, '..', f);
  if (!fs.existsSync(p)) {
    console.log('SKIP missing', f);
    continue;
  }
  let s = fs.readFileSync(p, 'utf8');
  let n = 0;
  for (const [needle, replacement] of reps) {
    const parts = s.split(needle);
    if (parts.length > 1) {
      n += parts.length - 1;
      s = parts.join(replacement);
    }
  }
  if (n > 0) {
    fs.writeFileSync(p, s);
    console.log(f, '->', n, 'replaced');
  } else {
    console.log(f, '0');
  }
}
