import { CheckCircle2, Compass, Eye, Sparkles, Target } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { companyProfile } from '@/data/company-profile';

const { whoWeAre, about, identity, vision, mission, whyChoose } = companyProfile;

/** Who we are, our purpose, vision and mission unified with enhanced UI/UX. */
export function AboutWhoWeAre() {
  return (
    <Section tone="white" id="who-we-are" aria-labelledby="who-we-are-title">
      <Container className="space-y-12 lg:space-y-16">
        {/* Top: Who We Are & Our Purpose */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start">
          <div className="lg:col-span-7">
            <div data-reveal="fade" className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-gold-700 font-mono">
              <Sparkles className="size-3 text-gold-600" aria-hidden="true" />
              <span>{whoWeAre.eyebrow.toUpperCase()}</span>
            </div>

            <h2 id="who-we-are-title" className="mt-4 type-h2 text-navy-900 leading-tight">
              Reliable Technology &amp; Infrastructure for{' '}
              <em className="type-accent text-gold-600 font-serif italic">Modern Bharat.</em>
            </h2>

            <div className="mt-6 space-y-4">
              {whoWeAre.paragraphs.map((text, idx) => (
                <p
                  key={text}
                  data-reveal="up"
                  className={
                    idx === 0
                      ? 'type-lead text-navy-900/90 font-medium leading-relaxed'
                      : 'type-body text-muted leading-relaxed'
                  }
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Core Capability Pillars */}
            <div className="mt-7 flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-surface px-3 py-1 text-xs font-medium text-navy-900">
                <CheckCircle2 className="size-3.5 text-gold-600" aria-hidden="true" /> Security &amp; Surveillance
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-surface px-3 py-1 text-xs font-medium text-navy-900">
                <CheckCircle2 className="size-3.5 text-gold-600" aria-hidden="true" /> High-Speed Networking
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-surface px-3 py-1 text-xs font-medium text-navy-900">
                <CheckCircle2 className="size-3.5 text-gold-600" aria-hidden="true" /> Solar &amp; Renewable Energy
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-surface px-3 py-1 text-xs font-medium text-navy-900">
                <CheckCircle2 className="size-3.5 text-gold-600" aria-hidden="true" /> Digital &amp; Web Systems
              </span>
            </div>
          </div>

          {/* Elevated Executive Purpose Card */}
          <aside
            data-reveal="up"
            className="relative self-start overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-7 sm:p-8 text-white shadow-2xl lg:col-span-5 lg:mt-3"
          >
            {/* Ambient gold glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-gold-400/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-12 size-36 rounded-full bg-blue-500/10 blur-2xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-lg bg-gold-400/20 text-gold-400">
                  <Compass className="size-4" aria-hidden="true" />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-300 font-semibold">
                  Our Purpose
                </p>
              </div>

              <blockquote className="mt-5 font-serif text-lg sm:text-xl font-normal leading-relaxed text-white italic">
                &ldquo;{whoWeAre.purpose}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] font-mono text-white/60">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Foundational Commitment to Clients Across India</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom: Vision & Mission Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Our Vision Card */}
          <article
            data-reveal="up"
            className="group relative flex flex-col justify-between rounded-2xl border border-navy-900/10 bg-white p-7 sm:p-8 shadow-card transition-all duration-300 hover:border-gold-500/40 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-gold-700">
                  <Eye className="size-3.5 text-gold-600" aria-hidden="true" />
                  {vision.eyebrow}
                </span>
                <span className="font-mono text-xs text-muted/60">01 / Long-Term Horizon</span>
              </div>

              <h3 id="vision-title" className="mt-4 type-h3 text-navy-900">
                {vision.title}
              </h3>

              <div className="mt-4 space-y-3">
                {vision.paragraphs.map((text, idx) => (
                  <p
                    key={text}
                    className={
                      idx === 0
                        ? 'type-body font-medium text-navy-900/85 leading-relaxed'
                        : 'type-body-sm text-muted leading-relaxed'
                    }
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-navy-900/10 pt-4 text-xs text-muted">
              <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-navy-900">
                <span className="size-1.5 rounded-full bg-gold-500" />
                Nationwide Service Network
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-navy-900">
                <span className="size-1.5 rounded-full bg-blue-500" />
                Technology with Service
              </span>
            </div>
          </article>

          {/* Our Mission Card */}
          <article
            data-reveal="up"
            className="group relative flex flex-col justify-between rounded-2xl border border-navy-900/10 bg-white p-7 sm:p-8 shadow-card transition-all duration-300 hover:border-gold-500/40 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-gold-700">
                  <Target className="size-3.5 text-gold-600" aria-hidden="true" />
                  {mission.eyebrow}
                </span>
                <span className="font-mono text-xs text-muted/60">02 / Actionable Value</span>
              </div>

              <h3 className="mt-4 type-h3 text-navy-900">
                {mission.title}
              </h3>

              <div className="mt-4 space-y-3">
                {mission.paragraphs.map((text, idx) => (
                  <p
                    key={text}
                    className={
                      idx === 0
                        ? 'type-body font-medium text-navy-900/85 leading-relaxed'
                        : 'type-body-sm text-muted leading-relaxed'
                    }
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-navy-900/10 pt-4 text-xs text-muted">
              <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-navy-900">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Scalable Solutions
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-navy-900">
                <span className="size-1.5 rounded-full bg-purple-500" />
                Measurable Client Growth
              </span>
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}

/** Connected into AboutWhoWeAre */
export function AboutVisionMission() {
  return null;
}

/** About us and our identity, side by side. */
export function AboutIdentity() {
  return (
    <Section tone="light" aria-labelledby="about-us-title">
      <Container className="grid gap-6 lg:grid-cols-2">
        {[about, identity].map((block, i) => (
          <article key={block.eyebrow} data-reveal="up" className="flex flex-col rounded-panel bg-white p-8 shadow-card">
            <p className="type-eyebrow text-gold-700">{block.eyebrow}</p>
            <h2 id={i === 0 ? 'about-us-title' : undefined} className="mt-3 type-h3 text-navy-900">
              {block.title} <em className="type-accent text-gold-600">{block.titleAccent}</em>
            </h2>
            <div className="mt-4 space-y-3">
              {block.paragraphs.map((text) => (
                <p key={text} className="type-body-sm text-muted">
                  {text}
                </p>
              ))}
            </div>
            {block.motto && <p className="mt-auto pt-6 type-h5 text-navy-900">{block.motto}</p>}
          </article>
        ))}
      </Container>
    </Section>
  );
}

/** Seven reasons to choose PPAB, and the closing line. */
export function AboutWhyChoose() {
  return (
    <Section tone="white" id="why-choose-us" aria-labelledby="why-choose-title">
      <Container>
        <SectionHeading
          id="why-choose-title"
          eyebrow={whyChoose.eyebrow}
          title={
            <>
              Why Choose <em>Us</em>
            </>
          }
          className="mb-10"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChoose.points.map((point) => (
            <li key={point.id} data-reveal="up" className="rounded-card border border-line p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-gold-100 text-gold-700">
                <Icon name={point.icon} size={18} />
              </span>
              <h3 className="mt-4 type-h5 text-navy-900">{point.title}</h3>
              <p className="mt-1.5 type-body-sm text-muted">{point.description}</p>
            </li>
          ))}
          <li data-reveal="up" className="flex items-center rounded-card bg-navy-950 p-5">
            <p className="type-body-sm font-medium text-white">{whyChoose.closing}</p>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
