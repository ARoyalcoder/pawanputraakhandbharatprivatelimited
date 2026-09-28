import type { Metadata } from 'next';
import { Mail, Phone } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { LeadFormTabs } from '@/components/forms/LeadFormTabs';
import { LazyMap } from '@/features/contact/LazyMap';
import { siteConfig } from '@/config/site.config';
import { mailHref, mapsHref, telHref, whatsappHref } from '@/lib/contact';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Contact PPAB: Call, WhatsApp or Request a Free Consultation',
  description: `Call or WhatsApp ${siteConfig.contact.phoneDisplay}, email ${siteConfig.contact.email}, or visit our Lucknow head office or New Delhi branch.`,
  path: '/contact',
});

const channels = [
  { label: 'Call us', value: siteConfig.contact.phoneDisplay, href: telHref, icon: <Phone aria-hidden="true" className="size-5" /> },
  { label: 'WhatsApp', value: siteConfig.contact.phoneDisplay, href: whatsappHref(), icon: <WhatsAppIcon size={20} /> },
  { label: 'Email', value: siteConfig.contact.email, href: mailHref, icon: <Mail aria-hidden="true" className="size-5" /> },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk about <em>your requirement.</em>
          </>
        }
        description="Call, WhatsApp or send a request below. Consultations are free, and our team will get back to you."
        size="compact"
      >
        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full items-center gap-4 rounded-card border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-gold-500/50"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">{c.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[0.78rem] text-white/55">{c.label}</span>
                  <span className="block truncate font-semibold text-white">{c.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section tone="light" id="quote" aria-labelledby="quote-title" className="scroll-mt-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div data-theme="ppab" className="rounded-panel bg-white p-6 shadow-card sm:p-10">
              <p className="font-mono text-caption uppercase text-gold-700">Free consultation</p>
              <h2 id="quote-title" className="mb-8 mt-2 text-h3 text-navy-900">
                What would you like help with?
              </h2>
              <LeadFormTabs />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-5">
            {siteConfig.offices.map((office) => (
              <article key={office.id} data-reveal="up">
                <p className="font-mono text-caption uppercase text-gold-700">{office.type}</p>
                <h3 className="mt-2 text-h3 text-navy-900">{office.city}</h3>
                <address className="mt-2 text-body not-italic text-muted">
                  {office.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={mapsHref(office.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-small font-semibold text-navy-900 underline underline-offset-4 hover:text-gold-700"
                >
                  Open in Google Maps
                </a>
                <div className="mt-5">
                  <LazyMap query={office.mapQuery} title={`${office.city} ${office.type.toLowerCase()}`} />
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
