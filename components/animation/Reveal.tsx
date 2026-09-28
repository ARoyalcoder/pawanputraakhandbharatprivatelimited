import type { HTMLAttributes, ReactNode } from 'react';
import type { RevealVariant } from '@/lib/animations/presets';

type ContainerTag = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'ul' | 'ol' | 'li' | 'p' | 'span' | 'figure';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ContainerTag;
  variant?: RevealVariant;
  delay?: number;
  children?: ReactNode;
}

/**
 * Declarative scroll reveal. Renders on the server and is animated by MotionProvider;
 * without JavaScript (or with reduced motion) the content is simply visible.
 */
export function Reveal({ as = 'div', variant = 'up', delay, children, ...rest }: RevealProps) {
  const Tag = as as 'div';
  return (
    <Tag data-reveal={variant} data-reveal-delay={delay} {...rest}>
      {children}
    </Tag>
  );
}

interface ParallaxProps extends HTMLAttributes<HTMLElement> {
  as?: ContainerTag;
  speed?: number;
  children?: ReactNode;
}

/** Declarative scrubbed parallax (see MotionProvider). */
export function Parallax({ as = 'div', speed = 0.15, children, ...rest }: ParallaxProps) {
  const Tag = as as 'div';
  return (
    <Tag data-parallax={speed} {...rest}>
      {children}
    </Tag>
  );
}
