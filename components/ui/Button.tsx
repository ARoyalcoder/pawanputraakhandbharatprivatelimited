import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'group/btn relative isolate inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full',
    'font-semibold text-button whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-expo',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gold-500 text-navy-950 hover:bg-gold-400 hover:shadow-gold',
          // Sheen sweep
          'before:absolute before:inset-y-0 before:-left-1/2 before:-z-10 before:w-1/3 before:skew-x-[-20deg]',
          'before:bg-white/35 before:opacity-0 before:transition-[left,opacity] before:duration-700 before:ease-out-expo',
          'hover:before:left-[120%] hover:before:opacity-100',
        ],
        navy: 'bg-navy-900 text-white hover:bg-navy-700',
        'outline-light': 'border border-white/25 text-white hover:border-white/70 hover:bg-white/[0.06]',
        'outline-dark': 'border border-navy-900/20 text-navy-900 hover:border-navy-900/70 hover:bg-navy-900/[0.04]',
        'ghost-light': 'text-white/85 hover:text-white',
        'ghost-dark': 'text-navy-900 hover:text-navy-700',
      },
      size: {
        sm: 'h-10 px-4 text-small',
        md: 'h-12 px-6',
        lg: 'h-14 px-7 text-base',
      },
      withArrow: {
        true: 'pr-2',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', withArrow: true, className: 'pr-1.5' },
      { variant: ['ghost-light', 'ghost-dark'], className: 'px-0 h-auto' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', withArrow: false },
  }
);

type Variants = VariantProps<typeof buttonVariants>;

function ArrowBadge({ variant = 'primary', size = 'md' }: { variant: Variants['variant']; size: Variants['size'] }) {
  const dark = variant === 'primary' || variant === 'outline-dark' || variant === 'ghost-dark';
  const dim = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-10' : 'size-8';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative ml-1 grid place-items-center overflow-hidden rounded-full',
        dim,
        dark ? 'bg-navy-950 text-gold-300' : 'bg-gold-500 text-navy-950'
      )}
    >
      <ArrowRight className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-6" />
      <ArrowRight className="absolute size-4 -translate-x-6 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0" />
    </span>
  );
}

interface CommonProps extends Variants {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function Button({
  variant,
  size,
  withArrow,
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size, withArrow }), className)} {...rest}>
      {icon}
      <span>{children}</span>
      {withArrow && <ArrowBadge variant={variant} size={size} />}
    </button>
  );
}

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href);

export function ButtonLink({
  href,
  variant,
  size,
  withArrow,
  icon,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const classes = cn(buttonVariants({ variant, size, withArrow }), className);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {withArrow && <ArrowBadge variant={variant} size={size} />}
    </>
  );

  if (isExternal(href)) {
    const newTab = href.startsWith('http');
    return (
      <a href={href} className={classes} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
