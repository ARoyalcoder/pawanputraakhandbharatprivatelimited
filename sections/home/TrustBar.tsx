import { trustPillars } from '@/data/company';
import { Icon } from '@/components/ui/Icon';

export function TrustBar() {
  return (
    <section aria-label="How we work" className="border-b border-line bg-white">
      <div className="container-ppab">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar, i) => (
            <li key={pillar.id} data-reveal="up" className="flex items-start gap-4 bg-white py-7 sm:px-6 lg:py-9">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-900 text-gold-300">
                <Icon name={pillar.icon} size={20} />
              </span>
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold-700">0{i + 1}</p>
                <h2 className="mt-1 text-h4 text-navy-900">{pillar.title}</h2>
                <p className="mt-1 text-small text-muted">{pillar.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
