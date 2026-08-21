// Rewrite the cloned Webflow stylesheet so every url() points at public/ces
import fs from 'node:fs';
const css = fs.readFileSync('docs/research/raw/site.css', 'utf8');
const map = JSON.parse(fs.readFileSync('docs/research/raw/asset-map.json', 'utf8'));
let missing = 0;
const out = css.replace(/https:\/\/(?:cdn\.prod\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net)\/[^)"'\s]+/g, (u) => {
  const clean = u.replace(/["')]+$/, '');
  if (map[clean]) return map[clean];
  missing++; console.error('unmapped:', clean); return u;
});
fs.writeFileSync('app/ces.css', '/* Cloned from customesignature.com — Webflow stylesheet, asset URLs localized to /ces */\n' + out);
console.log('app/ces.css written,', out.length, 'bytes,', missing, 'unmapped');
