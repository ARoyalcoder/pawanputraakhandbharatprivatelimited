import { resolveAIImage } from '@/lib/media/ai-assets';
import { AIImageView } from './AIImageView';

interface AIImageProps {
  /** Id from content/image-prompts.ts */
  id: string;
  sizes?: string;
  priority?: boolean;
  showLabel?: boolean;
  className?: string;
  imgClassName?: string;
}

/** Server component: resolves an AI concept image by id and renders it (or its illustration). */
export function AIImage({ id, ...rest }: AIImageProps) {
  return <AIImageView image={resolveAIImage(id)} {...rest} />;
}
