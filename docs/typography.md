# PPAB typography system

Everything typographic lives in [`styles/typography.css`](../styles/typography.css). Components use the role utilities (`type-*`) or the wrappers in [`components/ui/Typography.tsx`](../components/ui/Typography.tsx), and do not combine sizes, weights and tracking by hand. A live reference renders at `/typography-preview` in development. In production it is hidden unless `NEXT_PUBLIC_TYPOGRAPHY_PREVIEW=true`, and it is always `noindex`.

## Families

| Role | Family | Why |
| --- | --- | --- |
| Display and headings | **Manrope** (variable, 400–800) | Engineered, slightly squared geometry. It reads as infrastructure and technology without looking like a startup or crypto brand, and it was already the brand face. |
| Body and interface | **Inter** (variable) | Denser and crisper than Manrope at 14–19px, with excellent figures. It suits forms, navigation and long articles. |
| Accent only | **Instrument Serif** italic 400 | Gold accent phrases ("& Growth") and division taglines. Never body text. |

All three are self-hosted by `next/font` ([`app/fonts.ts`](../app/fonts.ts)), Latin subset, `display: swap`. next/font generates metric-matched fallbacks ("Manrope Fallback", "Inter Fallback"), so the swap does not shift layout. No request goes to Google at runtime. Every stack ends in system fonts.

### Pairings evaluated

Each pairing rendered the same specimen (navigation, hero, section heading, cards, division taglines, form, blog article, footer) through the real role utilities:

| Pairing | Verdict |
| --- | --- |
| **Manrope + Inter** | **Chosen.** Strong, corporate headlines; crisp, neutral reading text; clear hierarchy between the two. |
| Plus Jakarta Sans + Inter | Friendly, but softer and closer to generic SaaS; less authority for security and infrastructure. |
| Space Grotesk + Inter | Idiosyncratic letterforms read as startup or crypto, which is off-brand for a services company. |
| Sora + Inter | Wide and heavy at display sizes; long words such as "Connectivity" crowd small screens. |
| DM Sans + Manrope | Generic headlines; Manrope as body text sets wide and airy, so paragraphs lose density. |
| Manrope only (previous) | Good headlines, but body copy and forms are less dense and less legible than with Inter. |

Hero emphasis options were compared the same way. Gold keywords, a gradient word and gold underlines were all rejected as busier. We kept the **serif-italic accent on "& Growth"**: calm, premium, and the established brand device.

## Scale

Fluid sizes use `clamp()` between 320px and about 1440px and are capped above that. Line height loosens on small screens, where lines are shorter.

| Role | Utility | Size (320 → 1440px) | Weight | Tracking |
| --- | --- | --- | --- | --- |
| Display XL | `type-display-xl` (+ `font-extrabold`) | 38 → 100px | 800 | −0.038em |
| Display LG | `type-display-lg` | 36 → 76px | 700 | −0.038em |
| Display MD | `type-display-md` | 32 → 64px | 700 | −0.034em |
| H1 | `type-h1` | 32 → 56px | 700 | −0.03em |
| H2 | `type-h2` | 28 → 48px | 700 | −0.026em |
| H3 | `type-h3` | 22 → 30px | 600 | −0.016em |
| H4 | `type-h4` | 18 → 21px | 600 | −0.012em |
| H5 | `type-h5` | 16 → 17px | 600 | −0.008em |
| Lead | `type-lead` | 17 → 19px | 400 | −0.006em |
| Body | `type-body` | 16px | 400 | 0 |
| Body S | `type-body-sm` | 15px | 400 | 0 |
| Nav | `type-nav` / `type-nav-lg` | 15px / 22px | 500 / 600 | −0.008em |
| Button | `type-button` | 15px | 600 | +0.012em |
| Label / Help / Error | `type-label` / `type-help` / `type-error` | 14px | 600 / 400 / 500 | 0 |
| Meta | `type-meta` | 14px, tabular | 400 | 0 |
| Caption | `type-caption` | 13px | 500 | 0 |
| Eyebrow | `type-eyebrow` | 12px, uppercase | 600 | +0.16em |
| Index | `type-index` | 12px, tabular | 600 | +0.08em |
| Accent | `type-accent` | 1.04em of its heading | 400 | −0.01em |
| Tagline | `type-tagline-sm` / `type-tagline` / `type-tagline-lg` | 17px / 19 → 22px / 22 → 28px | 400 | 0 |
| Quote | `type-quote` | 20 → 26px | 400 | 0 |
| Ordinal | `type-ordinal` | 32 → 44px | 400 | −0.01em |
| Numeric | `type-numeric` | set by context | 700 | −0.03em |

**Weights:** 400 for reading text; 500 for navigation and captions; 600 for titles, labels and buttons; 700 for headings and display; 800 only for the homepage hero headline.

**Rules:**
- Uppercase appears only in `type-eyebrow`, the logo sub-line and the service ticker. Navigation, buttons and badges use sentence or title case.
- Nothing readable is smaller than 12px. Form text is 14px or more, and inputs are 16px so iOS does not zoom.
- Long-form text is capped at about 70 characters per line: `.prose-ppab` at 36em (684px at 19px), legal pages at 38rem.
- `type-numeric` is for verified company figures only, never placeholder statistics.

## Colour

Text colour comes from the surface, not the role. Every pair below is checked by `node scripts/check-contrast.mjs`, which reads the tokens from `globals.css` and fails if any pair is below WCAG AA.

- **Gold accents:** `gold-300` on navy. On light surfaces, `gold-600` is used only for large type (accent phrases in h1/h2/display, 3.2:1); smaller accents use `gold-700` (5.3:1). `Display`, `Heading` and `SectionHeading` apply this automatically.
- **Division taglines:** the division accent (`hex`) on dark surfaces and the darker division ink (`ink`, `text-*-ink`) on light ones, all ≥ 4.5:1. Use `<Tagline division="solar" surface="light">`.
- **Over imagery and 3D:** text stays in the DOM, sits on a scrim (hero gradient, image overlays) and can add `text-legible` for a soft shadow.

## Motion

- **Homepage headline:** a per-word mask reveal in CSS (`.hero-word`). It starts at first paint because the headline is the LCP element; a GSAP reveal would hold it back until hydration. "& Growth" arrives last.
- **Section headings:** `data-split` reveals each line from its own mask. `data-split="words"` (the final CTA) reveals words in sequence. `data-split="chars"` is for short labels only. All three run through `lib/animations/scroll.ts` and GSAP SplitText, which keeps an `aria-label` with the full text.
- **Navigation:** a hairline indicator draws in under the active section and previews on hover.
- **Reduced motion:** with `prefers-reduced-motion`, nothing splits or moves and text renders static and complete.

## Adding text

1. Pick the role by meaning. A visual `type-h3` on an `<h2>` is fine; never skip heading levels for looks.
2. Set colour for the surface.
3. Wrap at most one phrase per heading in `<em>` for the gold serif accent.
4. If no role fits, add one to `styles/typography.css` and this table. Do not reach for `text-[…]`.
