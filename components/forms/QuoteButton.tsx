'use client';

import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/Button';
import type { DivisionId } from '@/types/content';
import { useQuote } from './QuoteProvider';

type QuoteButtonProps = Omit<ComponentProps<typeof Button>, 'onClick' | 'type'> & {
  division?: DivisionId;
  source?: string;
};

/** Opens the site-wide consultation dialog. Usable from server components. */
export function QuoteButton({ division, source, children = 'Get Free Consultation', magnetic = true, ...rest }: QuoteButtonProps) {
  const { openQuote } = useQuote();
  return (
    <Button aria-haspopup="dialog" magnetic={magnetic} onClick={() => openQuote({ division, source })} {...rest}>
      {children}
    </Button>
  );
}
