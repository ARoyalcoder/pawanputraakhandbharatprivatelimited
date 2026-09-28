import { serviceTicker } from '@/data/company';

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {[...serviceTicker, ...serviceTicker].map((word, i) => (
        <li key={`${word}-${i}`} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? 'px-6 font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.6rem)] font-semibold uppercase tracking-[-0.02em] text-navy-950 sm:px-10'
                : 'px-6 font-serif text-[clamp(1.6rem,1.2rem+1.7vw,2.8rem)] italic text-navy-950/75 sm:px-10'
            }
          >
            {word}
          </span>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0 text-navy-950/60 sm:size-4">
            <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Gold marquee band. CSS-driven (compositor only); stops under reduced motion and on hover. */
export function ServiceTicker() {
  return (
    <section aria-label="What we do" className="relative overflow-hidden border-y border-gold-600/40 bg-gold-500 py-5 sm:py-6">
      <p className="sr-only">PPAB works across {serviceTicker.join(', ')}.</p>
      <div className="group flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused]">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
