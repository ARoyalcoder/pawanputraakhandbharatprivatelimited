'use client';

import { useEffect } from 'react';
import { Phone, RotateCcw } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { telHref } from '@/lib/contact';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section data-theme="ppab-night" className="flex min-h-[80dvh] items-center bg-navy-950 pt-24 text-white">
      <div className="container-ppab">
        <p className="font-mono text-caption uppercase text-gold-300">Something went wrong</p>
        <h1 className="mt-5 max-w-2xl text-h1 font-display">This page failed to load.</h1>
        <p className="mt-5 max-w-xl text-body-lg text-white/65">
          Please try again. If the problem continues, call us and we&apos;ll help directly.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button onClick={reset} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
            Try again
          </Button>
          <ButtonLink href={telHref} variant="outline-light" icon={<Phone className="size-4" aria-hidden="true" />}>
            Call us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
