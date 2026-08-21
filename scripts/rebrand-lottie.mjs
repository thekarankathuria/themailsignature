// Rebrand the text layers inside the cloned Lottie animations.
// Lottie stores type-layer copy as plain JSON (`layer.t.d.k[].s.t`), so the brand
// can be replaced properly here — unlike the raster artwork, where it is baked in.
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'public/ces/lottie';
const SUBS = [
  [/app\.customesignature\.com/gi, 'app.mailsignature.com'],
  [/www\.\s*customesignature\.com/gi, 'www.mailsignature.com'],
  [/customesignature\.com/gi, 'mailsignature.com'],
  [/CustomEsignature/g, 'Mail Signature'],
  [/Custom\s+Esignature/gi, 'Mail Signature'],
  [/Customesignature/gi, 'Mail Signature'],
];
const apply = (s) => SUBS.reduce((acc, [re, to]) => acc.replace(re, to), s);

let files = 0, strings = 0;
for (const name of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const file = path.join(DIR, name);
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  let touched = 0;

  // Walk the whole document; rewrite only the two places that hold display copy:
  // a text document's `t` string, and a layer's `nm` name (used by some renderers).
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    for (const [key, val] of Object.entries(node)) {
      if ((key === 't' || key === 'nm' || key === 'cl') && typeof val === 'string') {
        const next = apply(val);
        if (next !== val) { node[key] = next; touched++; }
      } else walk(val);
    }
  };
  walk(doc);

  if (touched) {
    fs.writeFileSync(file, JSON.stringify(doc));
    files++; strings += touched;
  }
}
console.log(`rebranded ${strings} text strings across ${files} Lottie files`);
