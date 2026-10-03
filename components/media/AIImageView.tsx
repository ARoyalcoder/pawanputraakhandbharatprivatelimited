import type { ResolvedAIImage } from '@/lib/media/ai-assets';
import { IllustrativeLabel } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ConceptArt } from './ConceptArt';
import { OptimizedImage } from './images';

interface AIImageViewProps {
  image: ResolvedAIImage;
  sizes?: string;
  priority?: boolean;
  /** Use "eager" for imagery that is mounted on demand (for example a menu preview). */
  loading?: 'eager' | 'lazy';
  /** Show the "Illustrative concept" label on generated imagery (default true). */
  showLabel?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Renders resolved AI concept imagery. Safe in client components: it receives plain data.
 * Generated images are always labelled as illustrative so they are never mistaken for
 * real PPAB project photography.
 */
export function AIImageView({ image, sizes, priority, loading, showLabel = true, className, imgClassName }: AIImageViewProps) {
  return (
    <div className={cn('relative size-full overflow-hidden bg-navy-900', className)}>
      {image.src ? (
        <>
          <OptimizedImage src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} loading={loading} className={imgClassName} />
          {showLabel && <IllustrativeLabel className="absolute bottom-3 left-3 z-10" />}
        </>
      ) : (
        <ConceptArt variant={image.fallbackArt} label={image.alt.replace(/^Illustrative concept: /, 'Illustration: ')} className={imgClassName} />
      )}
    </div>
  );
}
