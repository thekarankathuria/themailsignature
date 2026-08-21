// Download every asset referenced by the cloned homepage into public/ces/
import fs from 'node:fs';
import path from 'node:path';

const RAW = 'docs/research/raw';
const OUT = 'public/ces';
const files = ['home.html', 'site.css', ...fs.readdirSync(path.join(RAW, 'pages')).map(f => 'pages/' + f)];
const sources = files.map(f => fs.readFileSync(path.join(RAW, f), 'utf8')).join('\n');

const RE = /https:\/\/(?:cdn\.prod\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net)\/[^"'\s\\]+?\.(?:png|jpe?g|svg|webp|avif|gif|mp4|webm|json|otf|woff2?|ttf)/gi;
const urls = [...new Set([...sources.matchAll(RE)].map(m => m[0]))];

const bucket = (u) => {
  const e = u.split('.').pop().toLowerCase();
  if (['otf', 'woff', 'woff2', 'ttf'].includes(e)) return 'fonts';
  if (['mp4', 'webm'].includes(e)) return 'video';
  if (e === 'json') return 'lottie';
  return 'img';
};
const localName = (u) => {
  const base = decodeURIComponent(u.split('/').pop());
  return base.replace(/[^A-Za-z0-9._-]+/g, '-');
};

const map = {};
let ok = 0, fail = 0;

async function get(u) {
  const dir = path.join(OUT, bucket(u));
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, localName(u));
  map[u] = '/' + path.relative('public', file).split(path.sep).join('/');
  if (fs.existsSync(file) && fs.statSync(file).size > 0) { ok++; return; }
  try {
    const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(r.status);
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    ok++;
  } catch (e) { fail++; console.error('FAIL', u, String(e.message)); }
}

for (let i = 0; i < urls.length; i += 6) {
  await Promise.all(urls.slice(i, i + 6).map(get));
}
fs.writeFileSync(path.join(RAW, 'asset-map.json'), JSON.stringify(map, null, 2));
console.log(`downloaded ${ok}/${urls.length} (${fail} failed) -> ${OUT}`);
