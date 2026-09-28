import Image from 'next/image';
import { Phone } from 'lucide-react';
import { Container } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { telHref, whatsappHref } from '@/lib/contact';
import type { DivisionId } from '@/types/content';

function Orbits() {
  const rings = [
    { r: 150, dash: '2 10', speed: '60s', dir: 'normal' },
    { r: 230, dash: '1 0', speed: '0s', dir: 'normal' },
    { r: 310, dash: '4 14', speed: '90s', dir: 'reverse' },
    { r: 400, dash: '1 0', speed: '0s', dir: 'normal' },
  ];
  return (
    <svg aria-hidden="true" viewBox="-450 -450 900 900" className="absolute left-1/2 top-1/2 -z-10 size-[56rem] -translate-x-1/2 -translate-y-1/2 opacity-70 sm:size-[64rem]">
      {rings.map((ring, i) => (
        <g
          key={ring.r}
          className={ring.speed !== '0s' ? 'motion-safe:animate-[ppab-spin_var(--speed)_linear_infinite]' : undefined}
          style={{ ['--speed' as string]: ring.speed, animationDirection: ring.dir, transformOrigin: 'center' }}
        >
          <circle r={ring.r} fill="none" stroke="#d8a62a" strokeOpacity={0.35 - i * 0.06} strokeDasharray={ring.dash} />
          {i % 2 === 0 && <circle cx={ring.r} cy="0" r="4" fill="#f4c95d" />}
        </g>
      ))}
    </svg>
  );
}

interface FinalCtaProps {
  title?: React.ReactNode;
  description?: string;
  division?: DivisionId;
  source?: string;
}

/** Closing call to action used on every page. */
export function FinalCta({
  title = (
    <>
      Have a requirement? <em>Let&apos;s build the right solution.</em>
    </>
  ),
  description = 'Tell us what you need. Our team will understand your requirement and suggest the right solution.',
  division,
  source = 'final-cta',
}: FinalCtaProps) {
  return (
    <section data-theme="ppab-night" aria-labelledby="final-cta-title" className="relative isolate overflow-hidden border-b border-white/10 bg-navy-950 py-28 text-white sm:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(50%_60%_at_50%_50%,#123260_0%,#020b1d_75%)]" />
      <Orbits />
      <Container className="relative flex flex-col items-center text-center">
        <div data-reveal="scale" className="grid size-20 place-items-center rounded-full border border-gold-500/40 bg-navy-900/80 backdrop-blur-sm">
          <Image src="/brand/ppab-mark.png" alt="" width={331} height={320} sizes="44px" className="h-10 w-auto" />
        </div>
        <h2
          id="final-cta-title"
          data-split
          className="mt-8 max-w-4xl text-h1 text-balance font-display [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal [&_em]:text-gold-300"
        >
          {title}
        </h2>
        <p data-reveal="up" className="mt-6 max-w-2xl text-body-lg text-white/70">
          {description}
        </p>
        <div data-reveal="up" className="mt-10 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row xs:flex-wrap">
          <QuoteButton size="lg" withArrow division={division} source={source}>
            Get Free Consultation
          </QuoteButton>
          <ButtonLink href={telHref} size="lg" variant="outline-light" icon={<Phone aria-hidden="true" className="size-4" />}>
            Call Us
          </ButtonLink>
          <ButtonLink href={whatsappHref()} size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
            WhatsApp Us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
