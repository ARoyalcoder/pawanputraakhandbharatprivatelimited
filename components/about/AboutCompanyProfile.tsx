import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { companyProfile } from '@/data/company-profile';

const { whoWeAre, about, identity, vision, mission, whyChoose } = companyProfile;

/** Who we are, our purpose, vision and mission unified into one connected section. */
export function AboutWhoWeAre() {
  return (
    <Section tone="white" id="who-we-are" aria-labelledby="who-we-are-title">
      <Container className="space-y-12 lg:space-y-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p data-reveal="fade" className="inline-flex items-center gap-3 type-eyebrow text-gold-700">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              {whoWeAre.eyebrow}
            </p>
            <h2 id="who-we-are-title" className="sr-only">
              {whoWeAre.eyebrow}
            </h2>
            <div className="mt-8 space-y-4">
              {whoWeAre.paragraphs.map((text) => (
                <p key={text} data-reveal="up" className="type-body text-muted leading-relaxed">
                  {text}
                </p>
              ))}
            </div>
          </div>
          <aside data-reveal="up" className="self-start rounded-panel bg-navy-950 p-8 text-white shadow-card lg:col-span-5 lg:mt-6">
            <p className="type-eyebrow text-gold-300">Our purpose</p>
            <p className="mt-4 type-h4 text-white leading-snug">{whoWeAre.purpose}</p>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[vision, mission].map((block, i) => (
            <article
              key={block.eyebrow}
              data-reveal="up"
              className="flex flex-col rounded-panel bg-navy-950 p-8 text-white shadow-card border border-white/10"
            >
              <p className="type-eyebrow text-gold-300">{block.eyebrow}</p>
              <h3 id={i === 0 ? 'vision-title' : undefined} className="mt-3 type-h3 text-white">
                {block.title}
              </h3>
              <div className="mt-4 space-y-3">
                {block.paragraphs.map((text) => (
                  <p key={text} className="type-body-sm text-white/75 leading-relaxed">
                    {text}
                  </p>
                ))}
              </div>
            </article>
          ))}
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
