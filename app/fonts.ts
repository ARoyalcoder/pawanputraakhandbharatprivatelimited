import { Instrument_Serif, Inter, Manrope } from 'next/font/google';

/**
 * Site fonts, self-hosted by next/font (no external requests, size-adjusted fallbacks to
 * avoid layout shift). The CSS variables feed the families in styles/typography.css.
 *
 * Chosen after comparing Manrope + Inter, Plus Jakarta Sans + Inter, Space Grotesk + Inter,
 * Sora + Inter, DM Sans + Manrope and Manrope alone on the real PPAB specimen
 * (see docs/typography.md). Manrope's engineered geometry carries headlines with authority;
 * Inter is denser and crisper at body and UI sizes.
 */

/** Display: hero, headings, numerals. Variable font, one file covers 400–800. */
export const displayFace = Manrope({
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
});

/** Body and interface: paragraphs, navigation, buttons, forms, metadata. Variable font. */
export const bodyFace = Inter({
  subsets: ['latin'],
  variable: '--font-body-face',
  display: 'swap',
});

/** Special-purpose accent: serif italic for gold accent phrases and division taglines only. */
export const accentFace = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-accent-face',
  display: 'swap',
});

export const fontVariables = [displayFace.variable, bodyFace.variable, accentFace.variable].join(' ');
