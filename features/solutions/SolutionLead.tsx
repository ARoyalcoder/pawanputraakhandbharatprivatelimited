import type { ReactNode } from 'react';
import { Check, Phone } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { telHref, whatsappHref } from '@/lib/contact';
import { siteConfig } from '@/config/site.config';

interface SolutionLeadProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  points: string[];
  formTitle: string;
  form: ReactNode;
}

/** Division lead-capture block: promise on the left, form card on the right. */
export function SolutionLead({ id, eyebrow, title, description, points, formTitle, form }: SolutionLeadProps) {
  return (
    <Section tone="dark" id={id} aria-labelledby={`${id}-title`} className="overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial opacity-50" />
      <Container className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id={`${id}-title`} tone="dark" eyebrow={eyebrow} title={title} description={description} />
          <ul className="mt-9 space-y-3">
            {points.map((point) => (
              <li key={point} data-reveal="up" className="flex items-start gap-3 type-body text-white/80">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div data-reveal="fade" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-small text-white/70">
            <a href={telHref} className="inline-flex items-center gap-2 hover:text-white">
              <Phone aria-hidden="true" className="size-4 text-gold-300" /> {siteConfig.contact.phoneDisplay}
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
              <WhatsAppIcon size={16} className="text-gold-300" /> WhatsApp us
            </a>
          </div>
        </div>
        <div data-reveal="up" className="lg:col-span-7">
          <div data-theme="ppab" className="rounded-panel bg-white p-6 text-ink shadow-lift sm:p-8">
            <h3 className="mb-5 type-h3 text-navy-900">{formTitle}</h3>
            {form}
          </div>
        </div>
      </Container>
    </Section>
  );
}
