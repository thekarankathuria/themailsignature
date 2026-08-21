// Report (or delete) files under public/ces that no source file references.
// The asset download mirrors all 35 pages of the original site; the clone ships
// fewer, so a chunk of what was fetched is dead weight in the repo.
import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOTS = ['components', 'app', 'lib'];
const EXT = /\.(tsx?|css|mjs|json)$/;

let src = '';
const walkSrc = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walkSrc(p); }
    else if (EXT.test(e.name)) src += fs.readFileSync(p, 'utf8');
  }
};
ROOTS.forEach(r => fs.existsSync(r) && walkSrc(r));

const assets = [];
const walkAssets = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkAssets(p); else assets.push(p);
  }
};
walkAssets('public/ces');

const used = [], unused = [];
for (const p of assets) {
  const base = path.basename(p);
  (src.includes(base) ? used : unused).push(p);
}

const size = (list) => list.reduce((n, p) => n + fs.statSync(p).size, 0);
const mb = (n) => (n / 1e6).toFixed(1) + ' MB';

console.log(`used:   ${used.length} files, ${mb(size(used))}`);
console.log(`unused: ${unused.length} files, ${mb(size(unused))}`);
const bigUnused = unused.filter(p => fs.statSync(p).size > 500_000)
  .sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
if (bigUnused.length) {
  console.log('\nlargest unused:');
  bigUnused.slice(0, 12).forEach(p => console.log(`  ${mb(fs.statSync(p).size).padStart(9)}  ${p}`));
}
if (APPLY) {
  unused.forEach(p => fs.unlinkSync(p));
  console.log(`\ndeleted ${unused.length} unused files`);
} else {
  console.log('\n(dry run — pass --apply to delete)');
}
