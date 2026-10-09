import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, Link2 } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { OptimizedImage } from '@/components/media/images';
import { IllustrativeLabel } from '@/components/ui/Badge';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/seo/JsonLd';
import { BlogCard, getBlogImage, formatDate } from '@/features/blog/BlogCard';
import { FinalCta } from '@/sections/shared/FinalCta';
import { cmsContentService } from '@/lib/cms/content.service';
import { Markdown, headingsOf } from '@/lib/blog/markdown';
import { absoluteUrl, buildMetadata } from '@/lib/seo/metadata';
import { articleSchema } from '@/lib/seo/schema';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await cmsContentService.getBlogs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await cmsContentService.getBlogBySlug(slug);
  if (!post || post.status !== 'PUBLISHED') return {};
  return buildMetadata({ title: post.title, absoluteTitle: true, description: post.excerpt, path: `/blog/${post.slug}`, type: 'article', publishedTime: post.publishedAt });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await cmsContentService.getBlogBySlug(slug);
  if (!post || post.status !== 'PUBLISHED') notFound();

  const related = (await cmsContentService.getBlogs()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const toc = headingsOf(post.content);
  const url = absoluteUrl(`/blog/${post.slug}`);

  return (
    <>
      <JsonLd data={articleSchema({ title: post.title, description: post.excerpt, slug: post.slug, publishedAt: post.publishedAt, author: post.author })} />
      <PageHero
        titleStyle="article"
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        size="compact"
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 type-meta text-white/65">
          <span>{post.author}</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-4" /> {post.readTime}
          </span>
        </p>
      </PageHero>

      <Section tone="white" aria-label="Article">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="order-2 lg:order-1 lg:col-span-3">
            <div className="space-y-8 lg:sticky lg:top-32">
              {toc.length > 1 && (
                <nav aria-label="On this page">
                  <p className="type-eyebrow text-gold-700">On this page</p>
                  <ul className="mt-4 space-y-2.5 border-l border-line pl-4 text-small">
                    {toc.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="text-muted hover:text-navy-900">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
              <div>
                <p className="type-eyebrow text-gold-700">Share</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className="grid size-10 place-items-center rounded-full border border-line text-navy-900 hover:border-navy-900/40"
                  >
                    <WhatsAppIcon size={17} />
                  </a>
                  <a href={url} aria-label="Permanent link to this article" className="grid size-10 place-items-center rounded-full border border-line text-navy-900 hover:border-navy-900/40">
                    <Link2 aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
          <article className="order-1 lg:order-2 lg:col-span-8 lg:col-start-5">
            <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-panel bg-navy-950 shadow-card">
              <OptimizedImage
                src={getBlogImage(post)}
                alt={`Guide: ${post.title}`}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="size-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
              <IllustrativeLabel className="absolute bottom-4 right-4" />
            </div>
            <Markdown source={post.content} />
          </article>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="light" aria-labelledby="related-title">
          <Container>
            <h2 id="related-title" className="type-h3 text-navy-900">
              More guides
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
      <FinalCta source={`blog-${post.slug}`} />
    </>
  );
}
