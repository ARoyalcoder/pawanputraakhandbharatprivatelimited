import { cn } from '@/lib/utils';

/**
 * The company name beside the emblem, set in gold foil: a brushed-gold gradient on the name,
 * a hairline rule, and the second line letter-spaced beneath it.
 */
export function LogoWordmark({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const foil = tone === 'dark' ? 'gold-foil' : 'gold-foil-deep';
  return (
    <span className="flex flex-col leading-none">
      <span className={cn('type-wordmark', foil)}>Pawan Putra</span>{' '}
      <span aria-hidden="true" className={cn('mt-1.5 h-px w-full bg-gradient-to-r to-transparent', tone === 'dark' ? 'from-gold-300/70 via-gold-400/30' : 'from-gold-700/70 via-gold-600/30')} />
      <span className={cn('mt-1.5 type-wordmark-sub', foil)}>Akhand Bharat</span>
    </span>
  );
}
