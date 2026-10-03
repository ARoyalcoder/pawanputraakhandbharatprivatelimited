import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { ConceptArt } from '@/components/media/ConceptArt';
import type { CMSBlog } from '@/lib/cms/content.service';
import type { ConceptArtVariant } from '@/types/content';

const artByCategory: Record<string, ConceptArtVariant> = {
  Solar: 'solar',
  CCTV: 'secure',
  Networking: 'connect',
  Digital: 'digital',
  Space: 'space',
};

export const blogArt = (category: string): ConceptArtVariant => artByCategory[category] ?? 'hero';

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

export function BlogCard({ post }: { post: CMSBlog }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-shadow duration-500 hover:shadow-lift">
      <div className="relative aspect-[2/1] overflow-hidden">
        <div className="size-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]">
          <ConceptArt variant={blogArt(post.category)} />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 type-caption font-semibold text-navy-900">{post.category}</span>
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
  );
}
