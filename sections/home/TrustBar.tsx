import { trustPillars } from '@/data/company';
import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/components/animation/Magnetic';
import { AnimatedCounter } from '@/components/animation/AnimatedCounter';

const pillarMetrics = [
  { prefix: '', val: 5, suffix: ' Divisions', label: 'Under One Roof' },
  { prefix: '', val: 100, suffix: '%', label: 'Transparent Quotes' },
  { prefix: '', val: 1, suffix: ' Team', label: 'End-to-End Delivery' },
  { prefix: '', val: 24, suffix: '/7', label: 'AMC & Care Support' },
];

export function TrustBar() {
  return (
    <section aria-label="How we work" className="border-b border-line bg-white">
      <div className="container-ppab">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar, i) => {
            const metric = pillarMetrics[i];
            return (
              <li
                key={pillar.id}
                data-reveal="up"
                className="group relative flex flex-col justify-between bg-white p-7 transition-all duration-300 hover:bg-surface sm:px-6 lg:py-8"
              >
                <div className="flex items-start gap-4">
                  <Magnetic strength={0.25}>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-900 text-gold-300 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-gold-500 group-hover:text-navy-950">
                      <Icon name={pillar.icon} size={20} />
                    </span>
                  </Magnetic>
                  <div>
                    <p className="type-eyebrow text-gold-700">0{i + 1}</p>
                    <h2 className="mt-1 type-h4 text-navy-900 transition-colors group-hover:text-gold-700">
                      {pillar.title}
                    </h2>
                    <p className="mt-1 text-small text-muted">{pillar.description}</p>
                  </div>
                </div>

                {metric && (
                  <div className="mt-6 flex items-baseline justify-between border-t border-line/60 pt-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted">
                      {metric.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-navy-900">
                      <AnimatedCounter
                        value={metric.val}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                      />
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
