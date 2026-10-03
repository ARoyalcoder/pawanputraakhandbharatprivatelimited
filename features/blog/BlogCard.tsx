import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';
import { OptimizedImage } from '@/components/media/images';
import { IllustrativeLabel } from '@/components/ui/Badge';
import { InteractiveTiltCard } from '@/components/animation/InteractiveTiltCard';
import type { CMSBlog } from '@/lib/cms/content.service';
import type { ConceptArtVariant } from '@/types/content';

const artByCategory: Record<string, ConceptArtVariant> = {
  Solar: 'solar',
  CCTV: 'secure',
  Networking: 'connect',
  Digital: 'digital',
  Space: 'space',
};

export const blogImageByCategory: Record<string, string> = {
  Solar: '/images/ai/blog/solar-guide.jpg',
  CCTV: '/images/ai/blog/cctv-guide.jpg',
  Networking: '/images/ai/blog/network-guide.jpg',
  Digital: '/images/ai/blog/digital-guide.jpg',
  Space: '/images/ai/blog/space-guide.jpg',
};

export const getBlogImage = (post: { category: string; featuredImage?: string }): string =>
  post.featuredImage || blogImageByCategory[post.category] || '/images/ai/blog/digital-guide.jpg';

export const blogArt = (category: string): ConceptArtVariant => artByCategory[category] ?? 'hero';

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

export function BlogCard({ post }: { post: CMSBlog }) {
  const imageSrc = getBlogImage(post);

  return (
    <InteractiveTiltCard maxTilt={4} glareOpacity={0.1} scaleOnHover={1.01} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-500 hover:shadow-lift">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
          <div className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]">
            <OptimizedImage
              src={imageSrc}
              alt={`Guide: ${post.title}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="size-full object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 type-caption font-semibold text-navy-900 shadow-sm backdrop-blur-sm">
            {post.category}
          </span>
          <IllustrativeLabel className="absolute bottom-3 right-3 text-[10px]" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="flex items-center gap-3 type-caption text-muted">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-3.5" /> {post.readTime}
            </span>
          </p>
          <h3 className="mt-2.5 type-h4 text-navy-900">
            <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-small text-muted">{post.excerpt}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-small font-semibold text-navy-900">
            Read article <ArrowUpRight aria-hidden="true" className="size-4 text-gold-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </InteractiveTiltCard>
  );
}
