import { ArrowUpRight, ChevronDown, ChevronRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Display, Eyebrow, Heading, Numeric, Tagline, Text } from '@/components/ui/Typography';
import { TextField, TextareaField } from '@/components/forms/fields';
import { divisions } from '@/data/divisions';
import { cn } from '@/lib/utils';

const nav = ['Home', 'About', 'Solutions', 'Industries', 'Projects', 'Why Us', 'Blog', 'Contact'];

/** A full specimen sheet rendered with whatever families the parent sets. */
export function Specimen() {
  const secure = divisions[0];
  return (
    <div className="space-y-6">
      {/* Navbar + hero */}
      <div data-theme="ppab-night" className="overflow-hidden rounded-panel bg-navy-950 text-white">
        <div className="flex items-center justify-between gap-6 border-b border-white/10 px-5 py-4 sm:px-8">
          <div className="leading-none">
            <p className="type-wordmark text-white">Pawan Putra</p>
            <p className="mt-1.5 type-wordmark-sub text-gold-300">Akhand Bharat</p>
          </div>
          <nav aria-label="Specimen navigation" className="hidden flex-wrap gap-x-5 gap-y-2 xl:flex">
            {nav.map((item) => (
              <span key={item} className={cn('type-nav inline-flex items-center gap-1', item === 'Solutions' ? 'text-gold-300' : 'text-white/80')}>
                {item}
                {(item === 'Solutions' || item === 'Industries') && <ChevronDown aria-hidden="true" className="size-3.5" />}
              </span>
            ))}
          </nav>
          <span className="type-button rounded-full bg-gold-500 px-4 py-2.5 text-navy-950">WhatsApp</span>
        </div>
        <div className="max-w-4xl px-5 py-12 sm:px-8 sm:py-14">
          <Eyebrow tone="dark">One company. Multiple advanced solutions.</Eyebrow>
          <Display as="p" className="mt-6 text-white">
            Powering Security, Connectivity <em>&amp; Growth</em>
          </Display>
          <Text size="lead" className="mt-6 max-w-xl text-white/75">
            Complete technology, security, solar, digital and infrastructure solutions for Homes, Businesses, Institutions &amp; Industries.
          </Text>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" withArrow>
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline-light" icon={<WhatsAppIcon size={18} className="text-gold-300" />}>
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Section heading + reading text */}
        <div className="rounded-panel bg-white p-8 shadow-card">
          <SectionHeading
            eyebrow="Company Divisions"
            index="02"
            title={
              <>
                Specialist team. <em>Complete solutions.</em>
              </>
            }
            description="Each division is managed by a specialist team with expertise in its field. Together, we provide complete solutions to help businesses and properties stay secure, connected, powered and online."
          />
          <div className="mt-8 space-y-4 text-ink-soft">
            <Text>
              Most requirements do not stop at one service. A new office needs cameras, a network to carry them, reliable power, and a
              website to be found. A new home needs design, construction, security and solar. PPAB&apos;s five divisions are built to work
              together on exactly these requirements.
            </Text>
            <Text size="sm" className="text-muted">
              Consultation, installation or implementation, handover, and maintenance — the whole lifecycle, handled by one team.
            </Text>
          </div>
        </div>

        {/* Card */}
        <div className="grid gap-6">
          <article className="rounded-panel border border-line bg-white p-8 shadow-card">
            <p className="flex items-center justify-between type-eyebrow text-gold-700">
              <span>Division · Secure</span>
              <span className="type-index text-navy-900/60">01</span>
            </p>
            <Heading as="h3" className="mt-4 text-navy-900">
              {secure.name}
            </Heading>
            <Tagline division="secure" surface="light" className="mt-1">
              {secure.tagline}
            </Tagline>
            <Text size="sm" className="mt-3 text-muted">
              {secure.summary}
            </Text>
            <ul className="mt-5 flex flex-wrap gap-2">
              {secure.services.slice(0, 3).map((s) => (
                <li key={s.id} className="type-caption rounded-full bg-surface px-3 py-1 text-ink-soft">
                  {s.name}
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-1.5 type-button text-navy-900">
              Explore Secure <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600" />
            </span>
          </article>

          {/* Division taglines */}
          <div data-theme="ppab-night" className="rounded-panel bg-navy-900 p-8 text-white">
            <p className="type-eyebrow text-gold-300">Division taglines</p>
            <ul className="mt-4 space-y-3">
              {divisions.map((d) => (
                <li key={d.id} className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-3 last:border-0">
                  <span className="type-h5 text-white">{d.name}</span>
                  <Tagline as="span" division={d.id} className="text-right">
                    {d.tagline}
                  </Tagline>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div data-theme="ppab" className="rounded-panel bg-white p-8 shadow-card">
          <Heading as="h3" size="h3" className="text-navy-900">
            Request a free site survey
          </Heading>
          <div className="mt-6 grid gap-5">
            <TextField label="Name" defaultValue="Asha Verma" readOnly />
            <TextField label="Mobile" placeholder="10-digit mobile" hint="We'll only use this to discuss your requirement." readOnly />
            <TextField label="City / Area" defaultValue="Gomti" error="Please enter your city or area" readOnly />
            <TextareaField label="Tell us your requirement" placeholder="For example: 8 CCTV cameras for a two-floor office" optional readOnly />
          </div>
        </div>

        {/* Blog */}
        <article className="rounded-panel bg-white p-8 shadow-card">
          <p className="type-meta text-muted">
            <span className="font-semibold text-gold-700">Solar</span> · 25 September 2026 · 5 min read · PPAB Team
          </p>
          <Heading as="h3" size="h2" className="mt-3 text-navy-900">
            On-Grid, Off-Grid or Hybrid Solar: Which System Fits Your Property?
          </Heading>
          <div className="prose-ppab mt-6">
            <h2>Three ways to use solar power</h2>
            <p>
              Every solar system starts the same way: panels convert sunlight into electricity, and an inverter turns it into power your
              property can use. <strong>Net metering</strong> records what is exchanged with the grid.
            </p>
            <ul>
              <li>How dependable is the grid supply at your property?</li>
              <li>Do you need backup during power cuts?</li>
            </ul>
            <blockquote>Your monthly bill is the best starting point.</blockquote>
          </div>
        </article>

        {/* Numbers, labels, footer */}
        <div className="rounded-panel bg-white p-8 shadow-card">
          <p className="type-eyebrow text-gold-700">Verified figures only</p>
          <div className="mt-4 flex gap-10">
            <div>
              <Numeric className="text-[3rem] text-navy-900">05</Numeric>
              <p className="type-caption mt-2 text-muted">Divisions</p>
            </div>
            <div>
              <Numeric className="text-[3rem] text-navy-900">02</Numeric>
              <p className="type-caption mt-2 text-muted">Offices</p>
            </div>
          </div>
          <nav aria-label="Specimen breadcrumb" className="mt-8 flex items-center gap-1.5 type-meta text-muted">
            Home <ChevronRight aria-hidden="true" className="size-3.5" /> Solutions <ChevronRight aria-hidden="true" className="size-3.5" />
            <span className="text-navy-900">Secure</span>
          </nav>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="type-caption rounded-full border border-navy-900/10 px-3 py-1 text-navy-800">Completed</span>
            <span className="type-caption rounded-full bg-gold-500/15 px-3 py-1 text-gold-800">Illustrative concept</span>
            <span className="type-caption rounded-full bg-navy-900 px-3 py-1 text-white">In progress</span>
          </div>
        </div>

        <div data-theme="ppab-night" className="rounded-panel bg-navy-950 p-8 text-white">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="type-eyebrow text-gold-300">Solutions</p>
              <ul className="mt-4 space-y-2.5">
                {divisions.slice(0, 4).map((d) => (
                  <li key={d.id} className="type-body-sm text-white/75">
                    {d.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="type-eyebrow text-gold-300">Contact</p>
              <p className="mt-4 flex items-center gap-2 type-body-sm text-white/75">
                <Phone aria-hidden="true" className="size-4 text-gold-300" /> +91 87967 16111
              </p>
              <p className="mt-2 type-caption text-white/55">© 2026 Pawan Putra Akhand Bharat Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
