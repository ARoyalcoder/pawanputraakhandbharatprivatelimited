#!/usr/bin/env node
/**
 * WCAG contrast check for the text/surface pairs the typography system uses.
 * Reads colour tokens from styles/globals.css, so a token change is re-verified here.
 *
 *   node scripts/check-contrast.mjs        (exits 1 if any pair fails)
 *
 * Minimums: 4.5 for body and UI text, 3.0 for large text (≥ 24px, or ≥ 18.66px bold).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../styles/globals.css', import.meta.url)), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]));
tokens.white = '#ffffff';

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Resolve "gold-300", "white/70" (alpha over the background, white by default) or a literal hex. */
function resolve(spec, background) {
  const [name, alpha] = spec.split('/');
  const hex = name.startsWith('#') ? name : tokens[name];
  if (!hex) throw new Error(`Unknown colour token: ${name}`);
  if (!alpha) return rgb(hex);
  const a = Number(alpha) / 100;
  const bg = resolve(background ?? 'white');
  return rgb(hex).map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
}

const luminance = (rgbValues) => {
  const [r, g, b] = rgbValues.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (fg, bg) => {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

const BODY = 4.5;
const LARGE = 3;
const divisions = ['secure', 'connect', 'solar', 'digital', 'space'];

/** [text, background, minimum, where it is used] */
const pairs = [
  // Light surfaces
  ['navy-900', 'white', BODY, 'Headings on white'],
  ['ink', 'surface', BODY, 'Body text on page surface'],
  ['ink-soft', 'white', BODY, 'Reading text (prose)'],
  ['muted', 'white', BODY, 'Secondary text on white'],
  ['muted', 'surface', BODY, 'Secondary text on surface'],
  ['gold-700', 'white', BODY, 'Eyebrows and small accents on white'],
  ['gold-700', 'surface', BODY, 'Eyebrows and small accents on surface'],
  ['gold-600', 'white', LARGE, 'Accent phrase in h1/h2/display (large text only)'],
  ['gold-800', 'gold-500/15', BODY, 'Illustrative badge'],
  ...divisions.flatMap((d) => [
    [`${d}-ink`, 'white', BODY, `${d} tagline on white`],
    [`${d}-ink`, 'surface', BODY, `${d} tagline on surface`],
  ]),
  // Dark surfaces
  ['white', 'navy-950', BODY, 'Headings on navy'],
  ['white/70', 'navy-950', BODY, 'Lead text on navy'],
  ['white/60', 'navy-950', BODY, 'Secondary text on navy'],
  ['white/55', 'navy-950', BODY, 'Footer legal line'],
  ['white/55', 'navy-900', BODY, 'Captions on navy cards'],
  ['gold-300', 'navy-950', BODY, 'Eyebrows and accent phrase on navy'],
  ['gold-300', 'navy-900', BODY, 'Eyebrows on navy cards'],
  ...divisions.map((d) => [d, 'navy-950', BODY, `${d} tagline on navy`]),
  ...divisions.map((d) => [d, 'navy-900', BODY, `${d} tagline on navy card`]),
  // Controls
  ['navy-950', 'gold-500', BODY, 'Primary button label'],
];

let failures = 0;
const rows = pairs.map(([fg, bg, min, use]) => {
  const value = ratio(resolve(fg, bg), resolve(bg));
  const pass = value >= min;
  if (!pass) failures++;
  return { pass: pass ? 'ok' : 'FAIL', ratio: value.toFixed(2), min, text: fg, background: bg, use };
});

console.table(rows);
if (failures) {
  console.error(`\n${failures} contrast pair(s) below the WCAG AA minimum.`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} pairs meet WCAG AA.`);
