import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Icon } from '@/components/ui/Icon';
import { QuoteButton } from '@/components/forms/QuoteButton';
import type { IconName } from '@/types/content';
import { cn } from '@/lib/utils';

const cards: { title: string; description: string; icon: IconName; span?: string; visual: 'browser' | 'phone' | 'code' | 'erp' | 'crm' | 'chart' }[] = [
  { title: 'Website', description: 'Fast, responsive websites that turn visitors into enquiries.', icon: 'code', span: 'lg:col-span-2', visual: 'browser' },
  { title: 'App', description: 'Android and iOS apps for customers and teams.', icon: 'smartphone', visual: 'phone' },
  { title: 'Software', description: 'Custom tools built around your workflow.', icon: 'software', visual: 'code' },
  { title: 'ERP', description: 'Inventory, accounts, HR and operations in one place.', icon: 'erp', visual: 'erp' },
  { title: 'CRM', description: 'Every lead and customer tracked and followed up.', icon: 'crm', visual: 'crm' },
  { title: 'Marketing', description: 'SEO, Google Ads, Meta Ads and social media.', icon: 'meta-ads', span: 'lg:col-span-2', visual: 'chart' },
];

/** Tiny abstract UI sketches — decorative, animated on hover. */
function Visual({ kind }: { kind: (typeof cards)[number]['visual'] }) {
  const bar = 'rounded-full bg-white/15';
  switch (kind) {
    case 'browser':
      return (
        <div className="rounded-lg border border-white/10 bg-navy-950/60 p-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-white/20" />)}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <span className="col-span-2 h-14 rounded-md bg-digital/40 transition-colors duration-500 group-hover:bg-digital/70" />
            <span className="h-14 rounded-md bg-white/10" />
          </div>
          <div className={cn('mt-2 h-2 w-2/3', bar)} />
        </div>
      );
    case 'phone':
      return (
        <div className="mx-auto h-24 w-14 rounded-xl border border-white/15 bg-navy-950/60 p-1.5">
          <span className="block h-8 rounded-md bg-digital/50 transition-transform duration-500 group-hover:scale-95" />
          <span className={cn('mt-1.5 block h-1.5', bar)} />
          <span className={cn('mt-1 block h-1.5 w-2/3', bar)} />
        </div>
      );
    case 'code':
      return (
        <div className="space-y-1.5 font-mono text-[0.65rem] text-white/40">
          {['<App>', '  <Workflow />', '</App>'].map((l) => (
            <p key={l} className="whitespace-pre transition-colors duration-500 group-hover:text-digital">{l}</p>
          ))}
        </div>
      );
    case 'erp':
      return (
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={cn('h-6 rounded-md', i === 1 ? 'bg-gold-500/60' : 'bg-white/10', 'transition-transform duration-500 group-hover:-translate-y-0.5')} />
          ))}
        </div>
      );
    case 'crm':
      return (
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={cn('size-4 rounded-full', i === 0 ? 'bg-digital/70' : 'bg-white/15')} />
              <span className={cn('h-1.5 flex-1', bar)} />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div className="flex h-16 items-end gap-2">
          {[35, 55, 40, 70, 60, 90, 75].map((h, i) => (
            <span
              key={i}
              className={cn('flex-1 rounded-t-sm transition-all duration-700 ease-out-expo', i === 5 ? 'bg-gold-500' : 'bg-digital/50')}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
  }
}

export function DigitalSection() {
  return (
    <Section tone="darker" id="digital" aria-labelledby="digital-title" className="overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40%_45%_at_20%_15%,rgb(140_115_247/0.18),transparent)]" />
      <Container>
        <div className="mb-12 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="digital-title"
            tone="dark"
            eyebrow="Pawan Putra Digital"
            title={
              <>
                Take your business <em>digital.</em>
              </>
            }
            description="Website, App, Software, ERP, CRM & Digital Marketing solutions designed around your business."
          />
          <div data-reveal="fade" className="flex shrink-0 flex-wrap items-center gap-5">
            <QuoteButton division="digital" source="home-digital" withArrow>
              Discuss Your Project
            </QuoteButton>
            <Link href="/solutions/digital" className="inline-flex items-center gap-1.5 text-small font-semibold text-white/80 hover:text-white">
              All digital services <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li
              key={card.title}
              data-reveal="up"
              className={cn(
                'group relative flex flex-col justify-between gap-8 overflow-hidden rounded-card border border-white/10 bg-navy-900/70 p-6 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-digital/50',
                card.span
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-h4 text-white">{card.title}</h3>
                  <p className="mt-2 max-w-xs text-small text-white/60">{card.description}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-digital/15 text-digital">
                  <Icon name={card.icon} size={18} />
                </span>
              </div>
              <div aria-hidden="true">
                <Visual kind={card.visual} />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
