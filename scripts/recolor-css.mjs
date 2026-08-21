// Re-skin the cloned stylesheet from its cyan->blue accent system to the Gmail palette.
// Runs on app/ces.css after scripts/localize-css.mjs, so the recolor is reproducible:
//   node scripts/localize-css.mjs && node scripts/recolor-css.mjs
import fs from 'node:fs';

// Gmail brand colours
export const GMAIL = {
  red: '#ea4335', redDark: '#c5221f', redDarker: '#a50e0e',
  blue: '#4285f4', yellow: '#fbbc04', green: '#34a853',
};

// The original ramps, remapped: primary(blue) -> red, secondary(cyan) -> yellow.
const MAP = {
  // --- primary ramp: blue -> red ---
  '#131f53': '#5c0f0d', '#21398e': '#8c1a16', '#1e3cb5': '#a50e0e',
  '#2144e1': '#c5221f', '#1d4afe': '#ea4335', '#4d7fff': '#ee6a5e',
  '#6ea2ff': '#f08e86', '#97c6ff': '#f5b5af', '#bedeff': '#fadad7',
  '#dbedff': '#fde8e6', '#ebf6ff': '#fef3f2',

  // --- secondary ramp: cyan -> yellow ---
  '#04384d': '#4d3600', '#065874': '#6b4b00', '#006b8d': '#8a6100',
  '#007fab': '#a87700', '#009fd4': '#c68f00', '#00ccff': '#fbbc04',
  '#2cd9ff': '#fdc93a', '#75e5ff': '#fdd86e', '#b6efff': '#fee7a3',
  '#def6ff': '#fef3d2', '#effbff': '#fffaec',

  // --- one-off accent blues scattered through the rules ---
  '#26b7ff': '#fbbc04', '#26b6ff': '#fbbc04', '#26b0ff': '#fbbc04',
  '#1d4efe': '#ea4335', '#1d4cfd': '#ea4335', '#0047ff': '#c5221f',
  '#2d62ff': '#ea4335', '#1a6eea': '#ea4335', '#3898ec': '#ea4335',
  '#4d65ff': '#ea4335', '#bcd8ff': '#fadad7', '#eef5ff': '#fef3f2',
  '#0080ff': '#ea4335', '#007fff': '#ea4335', '#2176fe': '#ea4335',
  // one-offs found on the contact form / success message
  '#004fec': '#ea4335', '#00aaff': '#fbbc04', '#002eff': '#ea4335',
  '#00bfff': '#fbbc04', '#006aff': '#c5221f', '#0095ff': '#ea4335',
  '#007aff': '#ea4335', '#06a2f1': '#ea4335', '#57ebe7': '#ea4335',
  '#58ede7': '#ea4335', '#3bbbdd': '#c5221f', '#3bbadc': '#c5221f',
};

// rgb()/rgba() forms of the same accents, matched on their numeric triples.
const RGB_MAP = {
  '38,183,255': '251,188,4',   // #26b7ff
  '29,74,254': '234,67,53',    // #1d4afe
  '45,98,255': '234,67,53',    // #2d62ff
  '77,127,255': '238,106,94',  // #4d7fff
  '0,204,255': '251,188,4',    // #0cf
};

const expand = h => h.length === 4 ? '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] : h;

function recolor(css) {
  const hits = {};
  let out = css.replace(/#[0-9a-fA-F]{3,8}\b/g, (m) => {
    const base = expand(m.slice(0, 7).toLowerCase());
    // keep any 8-digit alpha suffix (webflow writes #26b7ff33)
    const alpha = m.length === 9 ? m.slice(7) : m.length === 5 ? m[4] + m[4] : '';
    const to = MAP[base];
    if (!to) return m;
    hits[base] = (hits[base] || 0) + 1;
    return to + alpha;
  });

  out = out.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*([,)])/g, (m, r, g, b, tail) => {
    const to = RGB_MAP[`${r},${g},${b}`];
    if (!to) return m;
    hits[`rgb(${r},${g},${b})`] = (hits[`rgb(${r},${g},${b})`] || 0) + 1;
    return m.slice(0, m.indexOf('(') + 1) + to.split(',').join(', ') + tail;
  });

  return { out, hits };
}


// --- Flatten pass -----------------------------------------------------------
// The brief is one flat colour: no gradients, no glows, no coloured shadows.
// Any gradient that contains an accent collapses to a single-stop gradient of
// FLAT (kept as a gradient function so it stays valid in `background-image` and
// keeps working under `-webkit-background-clip: text`). Any box-shadow or
// drop-shadow tinted with an accent is dropped.
const FLAT = '#ea4335';
const ACCENTS = ['#ea4335', '#c5221f', '#a50e0e', '#ee6a5e', '#fbbc04', '#fdc93a',
                 '#f08e86', '#f5b5af', '#5c0f0d', '#8c1a16', '#c68f00',
                 '234, 67, 53', '234,67,53', '251, 188, 4', '251,188,4',
                 '238, 106, 94', '238,106,94'];
// Accent tokens can also arrive as var() references — `.text-span-2` builds its
// gradient from --secondary-color--500 and --primary-color--600, which the hex
// scan alone would miss.
const ACCENT_VARS = ['--primary-color--', '--secondary-color--', '--blue-text',
                     '--base-color-brand--blue'];
const hasAccent = (s) => {
  const l = s.toLowerCase();
  return ACCENTS.some(a => l.includes(a)) || ACCENT_VARS.some(v => l.includes(v));
};

// Walk `fn(` ... matching `)` so nested colour functions don't truncate the match.
function mapFunctions(css, names, fn) {
  let out = '', i = 0;
  while (i < css.length) {
    let start = -1, name = null;
    for (const n of names) {
      const idx = css.toLowerCase().indexOf(n + '(', i);
      if (idx !== -1 && (start === -1 || idx < start)) { start = idx; name = n; }
    }
    if (start === -1) { out += css.slice(i); break; }
    out += css.slice(i, start);
    let depth = 0, j = start + name.length;
    for (; j < css.length; j++) {
      if (css[j] === '(') depth++;
      else if (css[j] === ')') { depth--; if (depth === 0) { j++; break; } }
    }
    out += fn(css.slice(start, j), name);
    i = j;
  }
  return out;
}

function flatten(css) {
  let flatGradients = 0, killedShadows = 0;

  css = mapFunctions(css, ['linear-gradient', 'radial-gradient', 'conic-gradient',
                           'repeating-linear-gradient'], (whole) => {
    if (!hasAccent(whole)) return whole;
    flatGradients++;
    return `linear-gradient(${FLAT}, ${FLAT})`;
  });

  // Coloured glows: drop any box-shadow / filter drop-shadow tinted with an accent.
  css = css.replace(/(box-shadow|-webkit-box-shadow)\s*:\s*([^;}]+)/gi, (m, prop, val) => {
    if (!hasAccent(val)) return m;
    killedShadows++;
    return `${prop}:none`;
  });
  css = mapFunctions(css, ['drop-shadow'], (whole) => {
    if (!hasAccent(whole)) return whole;
    killedShadows++;
    return 'drop-shadow(0 0 0 transparent)';
  });

  return { css, flatGradients, killedShadows };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const svgDir = 'public/ces/img';
  let svgTouched = 0;
  for (const name of fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'))) {
    const file = `${svgDir}/${name}`;
    const src = fs.readFileSync(file, 'utf8');
    const { out } = recolor(src);
    // An SVG gradient that carries the accent becomes a solid fill: every stop in
    // THAT gradient takes FLAT, so it renders flat without touching the geometry.
    // (Half-flattening leaves an accent->white ramp, which is still a gradient.)
    const solid = out.replace(/<(linear|radial)Gradient\b[\s\S]*?<\/\1Gradient>/g, (g) =>
      hasAccent(g)
        ? g.replace(/stop-color="[^"]*"/g, `stop-color="${FLAT}"`)
           .replace(/stopColor="[^"]*"/g, `stopColor="${FLAT}"`)
        : g);
    if (solid !== src) { fs.writeFileSync(file, solid); svgTouched++; }
  }
  console.log(`recoloured ${svgTouched} SVG assets`);

  for (const file of ['app/ces.css', 'app/ces-inline.css']) {
    const { out, hits } = recolor(fs.readFileSync(file, 'utf8'));
    const f = flatten(out);
    fs.writeFileSync(file, f.css);
    const total = Object.values(hits).reduce((a, b) => a + b, 0);
    console.log(`${file}: ${total} colour tokens remapped, ${f.flatGradients} gradients flattened, ${f.killedShadows} coloured shadows removed`);
  }
}
export { recolor, flatten };
