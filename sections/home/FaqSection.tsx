import { Phone } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { FaqExplorer } from '@/features/faq/FaqExplorer';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqCategories, faqs } from '@/data/faq';
import { faqSchema } from '@/lib/seo/schema';
import { telHref } from '@/lib/contact';
import { siteConfig } from '@/config/site.config';

export function FaqSection() {
  return (
    <Section tone="light" id="faq" aria-labelledby="faq-title">
      <JsonLd data={faqSchema(faqs)} />
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              index="08"
              title={
                <>
                  Questions, <em>answered.</em>
                </>
              }
              description="Can't find what you're looking for? Call or WhatsApp us and we'll answer directly."
            />
            <div data-reveal="fade" className="mt-8">
              <ButtonLink href={telHref} variant="outline-dark" icon={<Phone aria-hidden="true" className="size-4" />}>
                {siteConfig.contact.phoneDisplay}
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-8" data-reveal="up">
          <FaqExplorer faqs={faqs} categories={faqCategories} />
        </div>
      </Container>
    </Section>
  );
}
