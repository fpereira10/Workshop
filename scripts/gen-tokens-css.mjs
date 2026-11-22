import { readFileSync, writeFileSync } from 'node:fs';

// Lê os 4 sets de docs/figma-import e gera src/styles/tokens.css
const dir = new URL('../docs/figma-import/', import.meta.url);
const src = Object.fromEntries(['primitive', 'semantic-base', 'semantic-dark', 'semantic-light'].map((n) => [n, JSON.parse(readFileSync(new URL(n + '.json', dir), 'utf8'))]));
const out = new URL('../src/styles/tokens.css', import.meta.url);

const px = (v) => `${v}px`;
const FAMILIES = {
  'font-family-sans': '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  'font-family-mono': '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
};
const WEIGHTS = { Regular: 400, Medium: 500, SemiBold: 600 };

// Converte uma referência {x} ou rgba({x}, a) em CSS
function refs(v) {
  const rgba = v.match(/^rgba\(\{([a-z0-9-]+)\},\s*([\d.]+)\)$/);
  if (rgba) return `color-mix(in srgb, var(--bn-${rgba[1]}) ${Math.round(Number(rgba[2]) * 1000) / 10}%, transparent)`;
  return v.replace(/\{([a-z0-9-]+)\}/g, 'var(--bn-$1)');
}

function value(name, tok) {
  const v = tok.value;
  if (typeof v === 'string' && v.includes('{')) return refs(v);
  switch (tok.type) {
    case 'color': return v;
    case 'opacity': return String(parseFloat(v) / 100);
    case 'fontFamilies': return FAMILIES[name] ?? v;
    case 'fontWeights': return String(WEIGHTS[v] ?? v);
    case 'fontSizes': case 'spacing': case 'sizing': case 'borderRadius': case 'borderWidth': case 'dimension': return px(v);
    case 'lineHeights': return String(v).endsWith('%') ? String(parseFloat(v) / 100) : px(v);
    case 'letterSpacing': return `${parseFloat(v) / 100}em`;
    case 'boxShadow': return `${v.x}px ${v.y}px ${v.blur}px ${v.spread}px ${v.color}`;
    case 'other': return /^-?\d+$/.test(v) && !name.startsWith('breakpoint') ? String(v) : /^\d+$/.test(String(v)) ? px(v) : String(v);
    default: return String(v);
  }
}

function block(selector, set, title, skip = () => false) {
  const lines = Object.entries(set)
    .filter(([n, t]) => !skip(n, t))
    .map(([n, t]) => `  --bn-${n}: ${value(n, t)};`);
  return `/* ${title} */\n${selector} {\n${lines.join('\n')}\n}\n`;
}

const header = `/* GERADO por scripts/gen-tokens-css.mjs a partir de docs/figma-import. Não edite à mão.
   Primitivos (--bn-<nome>) → semânticos (alias com var()). Nomes em kebab-case. */\n\n`;

const css =
  header +
  block(':root', src.primitive, 'Tokens primitivos') + '\n' +
  block(':root', src['semantic-base'], 'Tokens semânticos (comuns aos dois modos)', (n) => n.endsWith('-tone')) + '\n' +
  block('[data-tone="dark"]', src['semantic-dark'], 'Semânticos · modo dark', (n) => n === 'color-text-primary' || n === 'color-text-inverse') + '\n' +
  block('[data-tone="light"]', src['semantic-light'], 'Semânticos · modo light', (n) => n === 'color-text-primary' || n === 'color-text-inverse');

writeFileSync(out, css);
console.log('linhas:', css.split('\n').length);
