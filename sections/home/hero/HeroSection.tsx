import { QuoteButton } from '@/components/forms/QuoteButton';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { divisions, divisionAccent } from '@/data/divisions';
import { heroBadges } from '@/data/company';
import { whatsappHref } from '@/lib/contact';
import { HeroStage, type HeroDivision } from './HeroStage';

const heroDivisions: HeroDivision[] = divisions.map((d) => ({
  id: d.id,
  short: d.short,
  name: d.name,
  tagline: d.tagline,
  summary: d.summary,
  href: d.href,
  accent: divisionAccent[d.id].hex,
}));

/** Staggered CSS entrance (`motion-safe:animate-rise`): runs at first paint, independent of JavaScript. */
const delay = (step: number) => ({ animationDelay: `${0.08 + step * 0.09}s` });

export function HeroSection() {
  return (
    <HeroStage divisions={heroDivisions}>
      <p style={delay(0)} className="inline-flex items-center gap-3 font-mono text-caption uppercase text-gold-300 motion-safe:animate-rise">
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        One company. Multiple advanced solutions.
      </p>

      <h1 style={delay(1)} className="mt-6 text-display text-balance font-display text-white motion-safe:animate-rise">
        Powering Security, Connectivity{' '}
        <em className="font-serif font-normal italic tracking-normal text-gold-300">&amp; Growth</em>
      </h1>

      <p style={delay(2)} className="mt-6 max-w-xl text-pretty text-body-lg text-white/70 motion-safe:animate-rise">
        Complete technology, security, solar, digital and infrastructure solutions for Homes, Businesses,
        Institutions &amp; Industries.
      </p>

      <ul style={delay(3)} className="mt-7 flex flex-wrap gap-2 motion-safe:animate-rise" aria-label="What we cover">
        {heroBadges.map((badge) => (
          <li
            key={badge}
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/75"
          >
            {badge}
          </li>
        ))}
      </ul>

      <div style={delay(4)} className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap motion-safe:animate-rise">
        <QuoteButton size="lg" withArrow source="hero">
          Get Free Consultation
        </QuoteButton>
        <ButtonLink href={whatsappHref()} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
          WhatsApp Us
        </ButtonLink>
      </div>
    </HeroStage>
  );
}
