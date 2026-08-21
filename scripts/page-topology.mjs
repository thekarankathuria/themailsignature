import { parse } from 'node-html-parser';
import fs from 'node:fs';
const cl = s => (s || '').replace(/\s+/g, ' ').trim();
for (const f of fs.readdirSync('docs/research/raw/pages').sort()) {
  const root = parse(fs.readFileSync('docs/research/raw/pages/' + f, 'utf8'));
  const main = root.querySelector('.main-wrapper') || root.querySelector('body');
  const kids = (main?.childNodes || []).filter(n => n.tagName && !['SCRIPT','NOSCRIPT','IFRAME'].includes(n.tagName));
  console.log(`\n## ${f}  — ${cl(root.querySelector('title')?.text).slice(0,70)}`);
  for (const el of kids) {
    const c = cl(el.getAttribute('class'));
    const inner = c.includes('background-color-alternate')
      ? '  -> ' + (el.childNodes.filter(n => n.tagName).map(n => cl(n.getAttribute('class'))).join(' | '))
      : '';
    console.log('  ' + el.tagName + ' .' + c + inner);
  }
}
