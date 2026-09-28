import { Icon } from '@/components/ui/Icon';
import type { ServiceItem } from '@/types/content';
import { cn } from '@/lib/utils';

interface ServiceGridProps {
  services: ServiceItem[];
  accent: string;
  tone?: 'light' | 'dark';
  columns?: 3 | 4;
}

/** Service cards: icon, name, summary, with an accent line revealed on hover/focus. */
export function ServiceGrid({ services, accent, tone = 'light', columns = 3 }: ServiceGridProps) {
  const dark = tone === 'dark';
  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2', columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
      {services.map((service, i) => (
        <li
          key={service.id}
          id={service.id}
          data-reveal="up"
          className={cn(
            'group relative scroll-mt-32 overflow-hidden rounded-card border p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 sm:p-7',
            dark ? 'border-white/10 bg-navy-900/70 hover:border-white/25' : 'border-line bg-white shadow-card hover:shadow-lift'
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
            style={{ backgroundColor: accent }}
          />
          <div className="flex items-start justify-between gap-4">
            <span
              className="grid size-12 place-items-center rounded-xl"
              style={{ backgroundColor: `${accent}1f`, color: dark ? accent : undefined }}
            >
              <Icon name={service.icon} size={22} className={dark ? undefined : 'text-navy-900'} />
            </span>
            <span className={cn('font-mono text-caption', dark ? 'text-white/35' : 'text-navy-900/30')}>{String(i + 1).padStart(2, '0')}</span>
          </div>
          <h3 className={cn('mt-6 text-h4', dark ? 'text-white' : 'text-navy-900')}>{service.name}</h3>
          <p className={cn('mt-2 text-small', dark ? 'text-white/65' : 'text-muted')}>{service.summary}</p>
        </li>
      ))}
    </ul>
  );
}
