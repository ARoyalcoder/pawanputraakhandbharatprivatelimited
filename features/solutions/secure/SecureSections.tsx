import { Check } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { cctvProducts, cctvSectors } from '@/data/divisions';
import type { IconName } from '@/types/content';

export function CctvSectors() {
  return (
    <Section tone="white" id="cctv-solutions" aria-labelledby="cctv-solutions-title">
      <Container>
        <SectionHeading
          id="cctv-solutions-title"
          eyebrow="CCTV solutions"
          title={
            <>
              CCTV planned for <em>your kind of property.</em>
            </>
          }
          description="Every property has different entry points, blind spots and recording needs. We plan camera placement around them."
          className="mb-12"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cctvSectors.map((sector) => (
            <li key={sector.id} data-reveal="up" className="group rounded-card border border-line bg-surface p-6 transition-colors duration-500 hover:border-secure/50 hover:bg-white">
              <span className="grid size-11 place-items-center rounded-full bg-navy-900 text-secure">
                <Icon name={sector.icon} size={20} />
              </span>
              <h3 className="mt-5 type-h4 text-navy-900">{sector.name}</h3>
              <p className="mt-2 text-small text-muted">{sector.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

const features: { id: string; title: string; icon: IconName; description: string; points: string[] }[] = [
  {
    id: 'video-door-phone',
    title: 'Video Door Phone',
    icon: 'video-door',
    description: 'See and speak to visitors before opening the door. Suited to independent homes, apartments and offices.',
    points: ['Indoor monitor with outdoor camera unit', 'Talk to visitors before you open', 'Installed and configured by our team'],
  },
  {
    id: 'biometric-attendance',
    title: 'Biometric Attendance',
    icon: 'fingerprint',
    description: 'Fingerprint and face-based attendance for staff and students, replacing registers and manual entries.',
    points: ['Fingerprint and face-based devices', 'For offices, schools, factories and institutions', 'Installation and configuration included'],
  },
];

export function SecureFeatures() {
  return (
    <Section tone="darker" aria-label="Video door phone and biometric attendance">
      <Container className="grid gap-5 lg:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.id}
            id={feature.id}
            data-reveal="up"
            className="relative scroll-mt-32 overflow-hidden rounded-panel border border-white/10 bg-navy-900 p-8 sm:p-10"
          >
            <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(47_181_167/0.18),transparent_65%)]" />
            <span className="grid size-14 place-items-center rounded-2xl bg-secure/15 text-secure">
              <Icon name={feature.icon} size={26} />
            </span>
            <h2 className="mt-7 type-h2 text-white">{feature.title}</h2>
            <p className="mt-4 max-w-lg type-body text-white/70">{feature.description}</p>
            <ul className="mt-7 space-y-2.5">
              {feature.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-small text-white/80">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secure" />
                  {point}
                </li>
              ))}
            </ul>
            <QuoteButton division="secure" source={`secure-${feature.id}`} variant="outline-light" className="mt-9">
              Ask about {feature.title}
            </QuoteButton>
          </article>
        ))}
      </Container>
    </Section>
  );
}

const productIcons: Record<string, IconName> = {
  dome: 'cctv',
  bullet: 'cctv',
  ptz: 'eye',
  ip: 'globe',
  'nvr-dvr': 'server',
  hdd: 'database',
  poe: 'switch',
  accessories: 'fiber',
};

export function SecureProducts() {
  return (
    <Section tone="light" id="products" aria-labelledby="products-title">
      <Container>
        <SectionHeading
          id="products-title"
          eyebrow="Products"
          title={
            <>
              The equipment behind <em>a complete system.</em>
            </>
          }
          description="We recommend the right combination for your property. Cameras, recording, storage and networking are chosen to work together."
          className="mb-12"
        />
        <ul className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cctvProducts.map((product, i) => (
            <li key={product.id} data-reveal="fade" className="bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <Icon name={productIcons[product.id]} size={22} className="text-navy-900" />
                <span className="type-index text-navy-900/60">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-6 type-h4 text-navy-900">{product.name}</h3>
              <p className="mt-2 text-small text-muted">{product.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

const installSteps = [
  { title: 'Site survey', description: 'We walk the property with you and note the areas that need coverage.' },
  { title: 'Plan & quotation', description: 'Camera types, positions, recording and cabling, with a clear quotation.' },
  { title: 'Cabling & mounting', description: 'Neat cable routing, camera mounting and recorder setup.' },
  { title: 'Configuration & handover', description: 'Viewing is set up, the system is tested and explained to you.' },
];

export function SecureInstallation() {
  return (
    <Section tone="white" id="installation" aria-labelledby="installation-title">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="installation-title"
            eyebrow="Installation"
            title={
              <>
                Installed by <em>our own team.</em>
              </>
            }
            description="From the first survey to handover, installation is handled end to end."
          />
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {installSteps.map((step, i) => (
            <li key={step.title} data-reveal="up" className="rounded-card border border-line p-6">
              <p className="type-ordinal text-secure-ink">0{i + 1}</p>
              <h3 className="mt-4 type-h4 text-navy-900">{step.title}</h3>
              <p className="mt-2 text-small text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export function SecureAmc() {
  return (
    <section id="amc" aria-labelledby="amc-title" className="relative overflow-hidden bg-secure py-16 text-navy-950 sm:py-20">
      <div aria-hidden="true" className="absolute inset-0 bg-blueprint-light opacity-60" />
      <div className="container-ppab relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="type-eyebrow">Maintenance & AMC</p>
          <h2 id="amc-title" data-split suppressHydrationWarning className="mt-4 type-h2">
            Security that keeps working after handover.
          </h2>
          <p data-reveal="up" className="mt-4 type-lead text-navy-950/75">
            Annual maintenance contracts and scheduled maintenance keep your cameras, recorders and storage in working order.
          </p>
        </div>
        <div data-reveal="fade" className="shrink-0">
          <QuoteButton division="secure" source="secure-amc" variant="navy" withArrow>
            Ask about AMC
          </QuoteButton>
        </div>
      </div>
    </section>
  );
}
