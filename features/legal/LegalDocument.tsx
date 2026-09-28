import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { slugify } from '@/lib/blog/markdown';

export interface LegalSection {
  title: string;
  body: string[];
}

interface LegalDocumentProps {
  title: string;
  path: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalDocument({ title, path, updated, intro, sections }: LegalDocumentProps) {
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: title, href: path },
        ]}
        eyebrow="Legal"
        title={title}
        description={intro}
        size="compact"
      >
        <p className="mt-6 text-small text-white/55">Last updated: {updated}</p>
      </PageHero>
      <Section tone="white" aria-label={title}>
        <Container className="grid gap-12 lg:grid-cols-12">
          <nav aria-label="Sections" className="lg:col-span-3">
            <ol className="space-y-2.5 border-l border-line pl-4 text-small lg:sticky lg:top-32">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#${slugify(s.title)}`} className="text-muted hover:text-navy-900">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <section key={s.title} id={slugify(s.title)} className="scroll-mt-32 border-b border-line py-8 first:pt-0 last:border-0">
                <h2 className="text-h4 text-navy-900">
                  {i + 1}. {s.title}
                </h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-3 text-body text-ink-soft">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
