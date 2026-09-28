import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Right-hand visual on desktop; stacks below the copy on mobile. */
  visual?: ReactNode;
  /** Accent colour for the eyebrow rule and glow (division colour). */
  accent?: string;
  children?: ReactNode;
  size?: 'default' | 'compact';
}

const delay = (step: number) => ({ animationDelay: `${0.05 + step * 0.08}s` });

/** Dark page header shared by all inner pages. Emits BreadcrumbList structured data. */
export function PageHero({ crumbs, eyebrow, title, description, actions, visual, accent = '#d8a62a', children, size = 'default' }: PageHeroProps) {
  return (
    <section data-theme="ppab-night" className="relative isolate overflow-hidden bg-navy-950 text-white">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{ background: `radial-gradient(60% 70% at 78% 35%, ${accent}26 0%, transparent 60%), radial-gradient(90% 80% at 20% 0%, #0d2a55 0%, #020b1d 70%)` }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint mask-fade-radial opacity-60" />

      <div
        className={cn(
          'container-ppab grid items-center gap-10 pt-32 lg:grid-cols-12 lg:gap-12 lg:pt-44',
          size === 'compact' ? 'pb-16 lg:pb-20' : 'pb-16 lg:pb-24',
          visual ? '' : 'lg:grid-cols-1'
        )}
      >
        <div className={visual ? 'lg:col-span-6' : 'max-w-4xl'}>
          <div style={delay(0)} className="motion-safe:animate-rise">
            <Breadcrumbs items={crumbs} />
          </div>
          <p style={{ ...delay(1), color: accent }} className="mt-8 inline-flex items-center gap-3 font-mono text-caption uppercase motion-safe:animate-rise">
            <span aria-hidden="true" className="h-px w-8 bg-current" />
            {eyebrow}
          </p>
          <h1
            style={delay(2)}
            className="mt-5 text-h1 text-balance font-display motion-safe:animate-rise [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal [&_em]:text-gold-300"
          >
            {title}
          </h1>
          {description && (
            <div style={delay(3)} className="mt-6 max-w-2xl text-pretty text-body-lg text-white/70 motion-safe:animate-rise">
              {description}
            </div>
          )}
          {actions && (
            <div style={delay(4)} className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap motion-safe:animate-rise">
              {actions}
            </div>
          )}
          {children}
        </div>
        {visual && (
          <div style={delay(3)} className="relative lg:col-span-6 motion-safe:animate-rise">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
