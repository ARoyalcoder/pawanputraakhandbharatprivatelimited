import { Compass, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { companyProfile } from '@/data/company-profile';

const { whoWeAre, about, identity, vision, mission, whyChoose } = companyProfile;

/** Who we are, our purpose, vision and mission unified into an executive connected section. */
export function AboutWhoWeAre() {
  return (
    <Section tone="white" id="who-we-are" aria-labelledby="who-we-are-title">
      <Container className="space-y-16 lg:space-y-20">
        {/* ============================================================= */}
        {/* Top: Who We Are & Executive Purpose Card                      */}
        {/* ============================================================= */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Overview */}
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              id="who-we-are-title"
              eyebrow={whoWeAre.eyebrow}
              title={
                <>
                  {whoWeAre.title} <em>{whoWeAre.titleAccent}</em>
                </>
              }
            />

            {/* Lead paragraph */}
            <p data-reveal="up" className="type-lead text-navy-950/90 font-normal leading-relaxed">
              {whoWeAre.paragraphs[0]}
            </p>

            {/* Secondary paragraph with structured capability chips */}
            <div data-reveal="up" className="space-y-3 pt-1">
              <p className="type-body text-muted leading-relaxed">
                {whoWeAre.paragraphs[1]}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  'Security Infrastructure',
                  'Enterprise Connectivity',
                  'Solar Energy',
                  'Digital Solutions',
                  'Real Estate & Projects',
                ].map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-navy-50/70 px-3 py-1 text-xs font-medium text-navy-900"
                  >
                    <span className="size-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Approach callout */}
            <div
              data-reveal="up"
              className="mt-6 rounded-2xl border-l-4 border-gold-500 bg-gold-400/[0.08] p-5 text-sm text-navy-900 leading-relaxed"
            >
              <p className="font-semibold text-navy-950 mb-1">Our Approach</p>
              <p className="text-muted">{whoWeAre.paragraphs[2]}</p>
            </div>
          </div>

          {/* Right Column: Architectural Purpose Card */}
          <div className="lg:col-span-5" data-reveal="up">
            <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 sm:p-10 text-white shadow-2xl">
              {/* Subtle ambient light & blueprint grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold-400/15 blur-3xl"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-blueprint opacity-30" />

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-mono uppercase tracking-widest text-gold-300 font-semibold">
                  <Sparkles className="size-3.5 text-gold-300" aria-hidden="true" />
                  <span>Our Purpose</span>
                </div>

                <blockquote className="font-serif text-xl sm:text-2xl text-white font-normal italic leading-snug">
                  &ldquo;{whoWeAre.purpose}&rdquo;
                </blockquote>

                <div className="border-t border-white/10 pt-6 flex items-center justify-between text-xs text-white/50 font-mono uppercase tracking-wider">
                  <span>Founding Charter</span>
                  <span className="text-gold-300 font-semibold">Nationwide Vision</span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ============================================================= */}
        {/* Bottom: Cohesive Vision & Mission Executive Cards             */}
        {/* ============================================================= */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* 1. Vision Card */}
          <article
            data-reveal="up"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-navy-900/15 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 sm:p-10 text-white shadow-xl transition-all duration-300 hover:border-gold-400/30"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-gold-400/10 blur-3xl transition-opacity group-hover:opacity-100"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-blueprint opacity-20" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-gold-400/30 bg-gold-400/10 text-gold-300">
                  <Compass className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="type-eyebrow text-gold-300">{vision.eyebrow}</p>
                  <p className="text-xs text-white/50 font-mono">Future Strategy</p>
                </div>
              </div>

              <h3 className="type-h3 text-white leading-snug">
                {vision.title}
              </h3>

              <p className="type-body-sm text-white/80 leading-relaxed">
                {vision.paragraphs[0]}
              </p>

              <div className="space-y-3 pt-2">
                {vision.paragraphs.slice(1).map((para) => (
                  <div key={para} className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
                    <CheckCircle2 className="size-4 shrink-0 text-gold-300 mt-0.5" aria-hidden="true" />
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {para}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 2. Mission Card */}
          <article
            data-reveal="up"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-navy-900/15 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 sm:p-10 text-white shadow-xl transition-all duration-300 hover:border-gold-400/30"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-emerald-400/10 blur-3xl transition-opacity group-hover:opacity-100"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-blueprint opacity-20" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-gold-400/30 bg-gold-400/10 text-gold-300">
                  <Target className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="type-eyebrow text-gold-300">{mission.eyebrow}</p>
                  <p className="text-xs text-white/50 font-mono">Core Execution</p>
                </div>
              </div>

              <h3 className="type-h3 text-white leading-snug">
                {mission.title}
              </h3>

              <p className="type-body-sm text-white/80 leading-relaxed">
                {mission.paragraphs[0]}
              </p>

              <div className="space-y-3 pt-2">
                {mission.paragraphs.slice(1).map((para) => (
                  <div key={para} className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3.5">
                    <CheckCircle2 className="size-4 shrink-0 text-gold-300 mt-0.5" aria-hidden="true" />
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {para}
                    </p>
                  </div>
                ))}
              </div>
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

/** Our Identity: Who We Are & What We Stand For. */
export function AboutIdentity() {
  return (
    <Section tone="light" aria-labelledby="identity-title">
      <Container>
        <article data-reveal="up" className="rounded-3xl bg-white p-8 sm:p-12 shadow-card border border-navy-900/10">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="type-eyebrow text-gold-700">{identity.eyebrow}</p>
              <h2 id="identity-title" className="type-h2 text-navy-900">
                {identity.title} <em className="type-accent text-gold-600">{identity.titleAccent}</em>
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4">
              {identity.paragraphs.map((text) => (
                <p key={text} className="type-body text-muted leading-relaxed">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </article>
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
