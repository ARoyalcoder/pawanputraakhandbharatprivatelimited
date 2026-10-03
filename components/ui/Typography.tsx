import type { HTMLAttributes, ReactNode } from 'react';
import { divisionAccent } from '@/data/divisions';
import type { DivisionId } from '@/types/content';
import { cn } from '@/lib/utils';

/*
 * Thin semantic wrappers over the role utilities in styles/typography.css.
 * The element (`as`) and the visual size are chosen independently, so heading
 * order stays correct while the look follows the design system.
 */

type Tone = 'light' | 'dark';

const displayClass = { xl: 'type-display-xl', lg: 'type-display-lg', md: 'type-display-md' } as const;
const headingClass = { h1: 'type-h1', h2: 'type-h2', h3: 'type-h3', h4: 'type-h4', h5: 'type-h5' } as const;
const textClass = {
  lead: 'type-lead',
  body: 'type-body',
  sm: 'type-body-sm',
  meta: 'type-meta',
  caption: 'type-caption',
} as const;
const taglineClass = { sm: 'type-tagline-sm', md: 'type-tagline', lg: 'type-tagline-lg' } as const;

/**
 * Gold serif-italic emphasis inside headings, e.g. "& Growth".
 * On light surfaces gold-600 is reserved for large type (≥ 3:1); smaller headings use gold-700 (≥ 4.5:1).
 */
export const accentTone = {
  dark: '[&_em]:type-accent [&_em]:text-gold-300',
  lightLarge: '[&_em]:type-accent [&_em]:text-gold-600',
  light: '[&_em]:type-accent [&_em]:text-gold-700',
} as const;

const accentFor = (tone: Tone, large: boolean) => (tone === 'dark' ? accentTone.dark : large ? accentTone.lightLarge : accentTone.light);

interface DisplayProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'p';
  size?: keyof typeof displayClass;
  tone?: Tone;
}

/** Cinematic display type: hero and page-hero headlines, large CTAs. */
export function Display({ as: Tag = 'h1', size = 'xl', tone = 'dark', className, ...rest }: DisplayProps) {
  return <Tag className={cn(displayClass[size], accentFor(tone, true), className)} {...rest} />;
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: keyof typeof headingClass;
  tone?: Tone;
}

/** Semantic heading; `size` defaults to the element's own level. */
export function Heading({ as: Tag, size, tone = 'light', className, ...rest }: HeadingProps) {
  const visual = size ?? (Tag === 'h6' ? 'h5' : Tag);
  return <Tag className={cn(headingClass[visual], accentFor(tone, visual === 'h1' || visual === 'h2'), className)} {...rest} />;
}

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'li' | 'figcaption' | 'time';
  size?: keyof typeof textClass;
}

/** Body copy. Reading text stays high-contrast; colour is set by the caller's surface. */
export function Text({ as = 'p', size = 'body', className, ...rest }: TextProps) {
  const Tag = as as 'p';
  return <Tag className={cn(textClass[size], className)} {...rest} />;
}

interface EyebrowProps {
  children: ReactNode;
  index?: string;
  tone?: Tone;
  /** Overrides the gold label colour, e.g. with a division accent. */
  color?: string;
  as?: 'p' | 'span' | 'h2' | 'h3';
  className?: string;
}

/** Small uppercase section label with the gold hairline from the PPAB logo lockup. */
export function Eyebrow({ children, index, tone = 'light', color, as: Tag = 'p', className }: EyebrowProps) {
  return (
    <Tag
      className={cn('inline-flex items-center gap-3 type-eyebrow', tone === 'dark' ? 'text-gold-300' : 'text-gold-700', className)}
      style={color ? { color } : undefined}
    >
      <span aria-hidden="true" className="h-px w-8 shrink-0 bg-current opacity-70" />
      {index && <span className={cn('type-index', tone === 'dark' ? 'text-white/55' : 'text-navy-900/60')}>{index}</span>}
      <span>{children}</span>
    </Tag>
  );
}

/** Standalone gold accent phrase (when not inside a Display/Heading `<em>`). */
export function Accent({ children, tone = 'light', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <em className={cn('type-accent', tone === 'dark' ? 'text-gold-300' : 'text-gold-700', className)}>{children}</em>;
}

/** Restrained gold gradient for a single highlighted word. Never for paragraphs. */
export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-gold-gradient', className)}>{children}</span>;
}

interface TaglineProps {
  children: ReactNode;
  /** Colours the tagline with the division accent: bright on dark surfaces, ink on light ones. */
  division?: DivisionId;
  surface?: Tone;
  /** Explicit colour; wins over `division`. */
  color?: string;
  size?: keyof typeof taglineClass;
  as?: 'p' | 'span';
  className?: string;
}

/** Division tagline in the PPAB accent serif. The same voice everywhere a division speaks. */
export function Tagline({ children, division, surface = 'dark', color, size = 'md', as: Tag = 'p', className }: TaglineProps) {
  const resolved = color ?? (division ? divisionAccent[division][surface === 'dark' ? 'hex' : 'ink'] : undefined);
  return (
    <Tag className={cn(taglineClass[size], className)} style={resolved ? { color: resolved } : undefined}>
      {children}
    </Tag>
  );
}

/** Verified company figures only — never placeholder or invented statistics. */
export function Numeric({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('type-numeric', className)}>{children}</span>;
}
