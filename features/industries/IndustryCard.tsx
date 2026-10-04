import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AIImage } from '@/components/media/AIImage';
import { Icon } from '@/components/ui/Icon';
import type { Industry } from '@/types/content';

export function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-shadow duration-500 hover:shadow-lift">
      <div className="relative aspect-[2/1] overflow-hidden">
        <div className="size-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]">
          <div data-depth className="size-full">
            <AIImage id={industry.imageId} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" showLabel={false} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center justify-between type-eyebrow text-gold-700">
          <span className="inline-flex items-center gap-2">
            <Icon name={industry.icon} size={16} className="text-navy-900" />
            {industry.name}
          </span>
          <span className="text-navy-900/30">0{index + 1}</span>
        </p>
        <h3 className="mt-3 type-h4 text-navy-900">
          <Link href={`/industries/${industry.id}`} data-cursor="view" className="after:absolute after:inset-0">
            {industry.headline}
          </Link>
        </h3>
        <p className="mt-2 text-small text-muted">{industry.audience}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-semibold text-navy-900">
          Explore {industry.name.toLowerCase()} <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
