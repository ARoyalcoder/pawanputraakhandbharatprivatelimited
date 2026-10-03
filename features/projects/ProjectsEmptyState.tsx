import { ImageOff, ShieldCheck } from 'lucide-react';
import { QuoteButton } from '@/components/forms/QuoteButton';
import { cn } from '@/lib/utils';

const anatomy = ['Project type', 'Industry', 'Location (if publishable)', 'Solution', 'Scope', 'Completion status'];

/**
 * Shown until verified projects exist. Explains the verification policy and shows what
 * each case study will contain, instead of filling the space with invented work.
 */
export function ProjectsEmptyState({ tone = 'light', divisionLabel }: { tone?: 'light' | 'dark'; divisionLabel?: string }) {
  const dark = tone === 'dark';
  return (
    <div className={cn('grid overflow-hidden rounded-panel border lg:grid-cols-[1.05fr_1fr]', dark ? 'border-white/10 bg-navy-900' : 'border-line bg-white shadow-card')}>
      {/* Wireframe project card */}
      <div className={cn('relative p-5 sm:p-7', dark ? 'bg-navy-950' : 'bg-surface bg-blueprint-light')}>
        <div className={cn('rounded-card border border-dashed p-4', dark ? 'border-white/20' : 'border-navy-900/20 bg-white/70')}>
          <div className={cn('grid aspect-[16/9] place-items-center rounded-xl border border-dashed sm:aspect-[5/2]', dark ? 'border-white/15' : 'border-navy-900/15')}>
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <ImageOff aria-hidden="true" className={cn('size-7', dark ? 'text-white/40' : 'text-navy-900/35')} />
              <p className={cn('text-small font-medium', dark ? 'text-white/70' : 'text-navy-900/70')}>
                Project imagery will be added after content verification.
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            {anatomy.map((label) => (
              <div key={label}>
                <dt className={cn('type-caption font-semibold', dark ? 'text-gold-300' : 'text-gold-700')}>{label}</dt>
                <dd aria-hidden="true" className={cn('mt-1.5 h-2.5 w-4/5 rounded-full', dark ? 'bg-white/10' : 'bg-navy-900/8')} />
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8">
        <span className={cn('grid size-11 place-items-center rounded-full', dark ? 'bg-gold-500/15 text-gold-300' : 'bg-navy-900 text-gold-300')}>
          <ShieldCheck aria-hidden="true" className="size-5" />
        </span>
        <h3 className={cn('mt-4 type-h3', dark ? 'text-white' : 'text-navy-900')}>
          {divisionLabel ? `${divisionLabel} case studies are being verified` : 'Case studies are being verified'}
        </h3>
        <p className={cn('mt-3 type-body', dark ? 'text-white/65' : 'text-muted')}>
          We only publish projects with client approval and real site photographs. Until then, we are happy to talk you
          through relevant work directly.
        </p>
        <div className="mt-6">
          <QuoteButton withArrow source="projects-empty">
            Discuss your project
          </QuoteButton>
        </div>
      </div>
    </div>
  );
}
