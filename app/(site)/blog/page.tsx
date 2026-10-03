import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Section, Container } from '@/components/ui/Section';
import { BlogCard } from '@/features/blog/BlogCard';
import { BlogExplorer } from '@/features/blog/BlogExplorer';
import { FinalCta } from '@/sections/shared/FinalCta';
import { cmsContentService } from '@/lib/cms/content.service';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Blog: Guides on CCTV, Networking, Solar & Digital',
  description: 'Practical guides from PPAB on choosing CCTV cameras, planning business networks, solar system types and getting your business online.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await cmsContentService.getBlogs();
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <>
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
        ]}
        eyebrow="Blog"
        title={
          <>
            Guides to make <em>better decisions.</em>
          </>
        }
        description="Plain-language guides on security, networking, solar and digital, written to help you plan before you buy."
        size="compact"
      />
      <Section tone="light" aria-labelledby="articles-title">
        <Container>
          <h2 id="articles-title" className="sr-only">
            All articles
          </h2>
          {posts.length ? (
            <BlogExplorer categories={categories} items={posts.map((post) => ({ key: post.slug, category: post.category, node: <BlogCard post={post} /> }))} />
          ) : (
            <p className="text-center type-body text-muted">New articles will be published here soon.</p>
          )}
        </Container>
      </Section>
      <FinalCta source="blog-final" />
    </>
  );
}
