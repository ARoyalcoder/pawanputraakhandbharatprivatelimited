/**
 * Accessibility audit of server-rendered pages with axe-core in jsdom.
 *
 * Usage: start the site (pnpm build && pnpm start), then:
 *   node scripts/a11y-audit.mjs [baseUrl]
 *
 * jsdom cannot compute layout or colour, so contrast is not checked here; verify it in a
 * real browser (e.g. Chrome DevTools > Lighthouse).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const base = process.argv[2] || 'http://localhost:3200';
const routes = [
  '/',
  '/about',
  '/solutions',
  '/solutions/secure',
  '/solutions/connect',
  '/solutions/solar',
  '/solutions/digital',
  '/solutions/space',
  '/industries',
  '/industries/healthcare',
  '/projects',
  '/why-us',
  '/blog',
  '/blog/dome-bullet-ptz-ip-choosing-cctv-cameras',
  '/contact',
  '/privacy-policy',
  '/terms-conditions',
];

let failures = 0;
for (const route of routes) {
  const html = await (await fetch(base + route)).text();
  const dom = new JSDOM(html, { url: base + route, runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.eval(axeSource);
  const results = await dom.window.axe.run(dom.window.document, {
    rules: { 'color-contrast': { enabled: false } },
    resultTypes: ['violations'],
  });
  const violations = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical' || v.impact === 'moderate');
  if (violations.length) failures += violations.length;
  console.log(`${violations.length ? '✗' : '✓'} ${route}`);
  for (const v of violations) {
    console.log(`   [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 3)) console.log(`      ${node.target.join(' ')}`);
  }
  dom.window.close();
}
console.log(failures ? `\n${failures} issue(s) found` : '\nNo serious, critical or moderate issues found');
process.exitCode = failures ? 1 : 0;
