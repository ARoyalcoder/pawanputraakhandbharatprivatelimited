import { cn } from '@/lib/utils';

/**
 * Viewfinder-style corner brackets — a nod to camera framing and engineering drawings.
 * Purely decorative; place inside a relatively positioned element.
 */
export function CornerFrame({ className, inset = 12, size = 18 }: { className?: string; inset?: number; size?: number }) {
  const corner = 'absolute border-current';
  const style = { width: size, height: size };
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0 text-gold-300/70', className)}>
      <span className={cn(corner, 'border-t border-l')} style={{ ...style, top: inset, left: inset }} />
      <span className={cn(corner, 'border-t border-r')} style={{ ...style, top: inset, right: inset }} />
      <span className={cn(corner, 'border-b border-l')} style={{ ...style, bottom: inset, left: inset }} />
      <span className={cn(corner, 'border-b border-r')} style={{ ...style, bottom: inset, right: inset }} />
    </span>
  );
}
