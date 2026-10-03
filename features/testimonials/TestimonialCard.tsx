import { Quote } from 'lucide-react';
import type { Testimonial } from '@/types/content';

/** A verified, consented client testimonial. No photos: avoids implying faces we don't have. */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-card">
      <Quote aria-hidden="true" className="size-7 text-gold-500" />
      <blockquote className="mt-5 flex-1 type-lead text-ink">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-6 border-t border-line pt-5">
        <p className="font-semibold text-navy-900">{testimonial.name}</p>
        {(testimonial.role || testimonial.organisation) && (
          <p className="text-small text-muted">{[testimonial.role, testimonial.organisation].filter(Boolean).join(', ')}</p>
        )}
      </figcaption>
    </figure>
  );
}
