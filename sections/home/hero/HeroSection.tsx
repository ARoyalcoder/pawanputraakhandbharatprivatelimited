import { Fragment } from 'react';
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

/**
 * Staggered CSS entrance (`motion-safe:animate-rise`): runs at first paint, independent of JavaScript.
 * The headline is the LCP element, so its word-by-word mask reveal is CSS too (see .hero-word in
 * styles/typography.css) rather than GSAP, which would hold the text back until hydration.
 */
const delay = (step: number) => ({ animationDelay: `${0.08 + step * 0.09}s` });
const wordDelay = (step: number) => ({ animationDelay: `${0.16 + step * 0.085}s` });

const firstLine = ['Built', 'in', 'Bharat.'];
const secondLine = ['Connected', 'to'];

export function HeroSection() {
  return (
    <HeroStage divisions={heroDivisions}>
      <p style={delay(0)} className="inline-flex items-center gap-3 type-eyebrow text-gold-300 motion-safe:animate-rise">
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        One company. Multiple advanced solutions.
      </p>

      <h1 className="mt-6 type-display-xl font-extrabold text-white">
        {firstLine.map((word, i) => (
          <Fragment key={word}>
            <span className="hero-word">
              <span style={wordDelay(i)}>{word}</span>
            </span>{' '}
          </Fragment>
        ))}
        <span className="block mt-1 sm:mt-2">
          {secondLine.map((word, i) => (
            <Fragment key={word}>
              <span className="hero-word">
                <span style={wordDelay(firstLine.length + i)}>{word}</span>
              </span>{' '}
            </Fragment>
          ))}
          <span className="hero-word">
            <em style={wordDelay(firstLine.length + secondLine.length + 0.6)} className="type-accent text-gold-300">
              Possibilities.
            </em>
          </span>
        </span>
      </h1>

      <p style={delay(2)} className="mt-6 max-w-xl type-lead text-white/70 motion-safe:animate-rise">
        Complete technology, security, solar, digital and infrastructure solutions for Homes, Businesses,
        Institutions &amp; Industries.
      </p>

      <ul style={delay(3)} className="mt-7 flex flex-wrap gap-2 motion-safe:animate-rise" aria-label="What we cover">
        {heroBadges.map((badge) => (
          <li
            key={badge}
            className="cursor-default rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 type-caption text-white/80 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/10 hover:text-gold-200"
          >
            {badge}
          </li>
        ))}
      </ul>

      <div style={delay(4)} className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap motion-safe:animate-rise">
        <QuoteButton size="lg" withArrow source="hero">
          Get Free Consultation
        </QuoteButton>
        <ButtonLink
          href={whatsappHref()}
          size="lg"
          variant="outline-light"
          magnetic
          icon={<WhatsAppIcon size={18} className="text-gold-300" />}
        >
          WhatsApp Us
        </ButtonLink>
      </div>
    </HeroStage>
  );
}
