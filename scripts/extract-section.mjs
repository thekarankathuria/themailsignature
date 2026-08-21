// Extract a section's HTML subtree + every CSS rule that touches its classes.
// Usage: node scripts/extract-section.mjs ".hero" [outName]
import { parse } from 'node-html-parser';
import fs from 'node:fs';
import path from 'node:path';

const RAW = 'docs/research/raw';
const html = fs.readFileSync(path.join(RAW, 'home.html'), 'utf8');
const css = fs.readFileSync(path.join(RAW, 'site.css'), 'utf8');

const selector = process.argv[2];
const outName = process.argv[3] || selector.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

const root = parse(html, { blockTextElements: { script: true, style: true } });
const el = root.querySelector(selector);
if (!el) { console.error('NOT FOUND: ' + selector); process.exit(1); }

// --- collect classes ---
const classes = new Set();
const walk = (n) => {
  if (n.classList) for (const c of n.classList.values()) classes.add(c);
  (n.childNodes || []).forEach(walk);
};
walk(el);

// --- split css into rules (naive but adequate for webflow's flat minified css) ---
function splitRules(text) {
  const out = [];
  let depth = 0, start = 0, atRule = null, atStart = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      if (depth === 0) {
        const sel = text.slice(start, i).trim();
        if (sel.startsWith('@media') || sel.startsWith('@supports')) { atRule = sel; atStart = i + 1; depth++; continue; }
      }
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        if (atRule) { out.push({ at: atRule, body: text.slice(atStart, i) }); atRule = null; }
        else out.push({ at: null, sel: text.slice(start, text.indexOf('{', start)).trim(), body: text.slice(text.indexOf('{', start) + 1, i) });
        start = i + 1;
      }
    }
  }
  return out;
}

function matchRules(text, at) {
  const res = [];
  const rules = splitRules(text);
  for (const r of rules) {
    if (r.at) { const inner = matchRules(r.body, r.at); if (inner.length) res.push(...inner); continue; }
    if (!r.sel) continue;
    for (const part of r.sel.split(',')) {
      const used = [...part.matchAll(/\.([A-Za-z0-9_-]+)/g)].map(m => m[1]);
      if (used.length && used.every(c => classes.has(c))) { res.push({ at: at || r.at, sel: r.sel.trim(), body: r.body.trim() }); break; }
    }
  }
  return res;
}

const matched = matchRules(css, null);

// --- pretty print html ---
function pretty(node, indent = 0) {
  const pad = '  '.repeat(indent);
  if (node.nodeType === 3) { const t = node.rawText.replace(/\s+/g, ' ').trim(); return t ? pad + t + '\n' : ''; }
  if (!node.tagName) return (node.childNodes || []).map(c => pretty(c, indent)).join('');
  const tag = node.tagName.toLowerCase();
  if (tag === 'script' || tag === 'noscript') return pad + `<!-- ${tag} omitted -->\n`;
  const attrs = Object.entries(node.attributes || {}).map(([k, v]) => ` ${k}="${v}"`).join('');
  const kids = (node.childNodes || []).map(c => pretty(c, indent + 1)).join('');
  if (!kids) return pad + `<${tag}${attrs}></${tag}>\n`;
  return pad + `<${tag}${attrs}>\n` + kids + pad + `</${tag}>\n`;
}

let out = `# Extract: ${selector}\n\n## HTML\n\n\`\`\`html\n${pretty(el)}\`\`\`\n\n## CSS rules (${matched.length})\n\n\`\`\`css\n`;
let curAt = null;
for (const r of matched) {
  if (r.at !== curAt) { if (curAt) out += '}\n'; if (r.at) out += `${r.at} {\n`; curAt = r.at; }
  out += `${r.at ? '  ' : ''}${r.sel} { ${r.body} }\n`;
}
if (curAt) out += '}\n';
out += '```\n';

fs.mkdirSync('docs/research/extract', { recursive: true });
const p = `docs/research/extract/${outName}.md`;
fs.writeFileSync(p, out);
console.log(`${p}  |  ${classes.size} classes, ${matched.length} rules, ${out.length} bytes`);
