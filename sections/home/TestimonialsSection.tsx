import { MessageSquareQuote } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TestimonialCard } from '@/features/testimonials/TestimonialCard';
import { testimonials } from '@/data/testimonials';

export function TestimonialsSection() {
  return (
    <Section tone="white" id="testimonials" aria-labelledby="testimonials-title" spacing="compact">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <SectionHeading
            id="testimonials-title"
            eyebrow="Testimonials"
            index="07"
            title={
              <>
                What Our Clients <em>Say.</em>
              </>
            }
            description="Real experiences from clients who have worked with PPAB. Their feedback reflects our commitment to quality, reliable service, and professional support."
            className="lg:col-span-5"
          />
          {testimonials.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {testimonials.map((t) => (
                <li key={t.id} data-reveal="up">
                  <TestimonialCard testimonial={t} />
                </li>
              ))}
            </ul>
          ) : (
            <div data-reveal="up" className="flex items-start gap-5 rounded-card border border-dashed border-navy-900/20 bg-surface p-7 lg:col-span-7">
              <MessageSquareQuote aria-hidden="true" className="size-8 shrink-0 text-gold-600" />
              <div>
                <p className="type-h4 text-navy-900">Client testimonials will be published here after verification.</p>
                <p className="mt-2 text-small text-muted">
                  We publish only genuine feedback, with the client&apos;s written permission.
                </p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
