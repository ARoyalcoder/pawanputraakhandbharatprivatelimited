import { Check } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CornerFrame } from '@/components/ui/CornerFrame';
import { Icon } from '@/components/ui/Icon';
import { CCTVLeadForm } from '@/components/forms/CCTVLeadForm';
import type { IconName } from '@/types/content';

const properties: { label: string; icon: IconName }[] = [
  { label: 'Home', icon: 'home' },
  { label: 'Shop', icon: 'commercial' },
  { label: 'Office', icon: 'corporate' },
  { label: 'School', icon: 'education' },
  { label: 'Hospital', icon: 'healthcare' },
  { label: 'Warehouse', icon: 'building' },
  { label: 'Factory', icon: 'manufacturing' },
];

const included = [
  'Free site survey of your property',
  'Camera plan: dome, bullet, PTZ or IP',
  'Installation, configuration and handover',
  'Maintenance and AMC available',
];

export function CctvLeadSection() {
  return (
    <Section tone="dark" id="cctv" aria-labelledby="cctv-title" className="overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_85%_30%,rgb(47_181_167/0.14),transparent)]" />
      <Container className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="cctv-title"
            tone="dark"
            eyebrow="Pawan Putra Secure"
            title={
              <>
                Need CCTV for your <em>home or business?</em>
              </>
            }
            description="Tell us about your property. Our team will visit, understand the areas you want covered, and recommend the right cameras and recording setup."
          />
          <ul className="mt-9 grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
            {properties.map((p) => (
              <li
                key={p.label}
                data-reveal="scale"
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3.5 text-center"
              >
                <Icon name={p.icon} size={20} className="text-secure" />
                <span className="type-caption font-medium text-white/80">{p.label}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-9 space-y-3">
            {included.map((item) => (
              <li key={item} data-reveal="up" className="flex items-start gap-3 type-body text-white/80">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7" data-reveal="up">
          <div data-theme="ppab" className="relative rounded-panel bg-white p-6 text-ink shadow-lift sm:p-8">
            <CornerFrame className="text-gold-500/60" inset={14} size={16} />
            <p className="type-eyebrow text-gold-700">Free CCTV site survey</p>
            <h3 className="mb-5 mt-2 type-h3 text-navy-900">Where should we come and survey?</h3>
            <CCTVLeadForm source="home-cctv" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
