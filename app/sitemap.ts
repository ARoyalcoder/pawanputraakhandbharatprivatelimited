import type { MetadataRoute } from 'next';
import { divisions } from '@/data/divisions';
import { industries } from '@/data/industries';
import { projects } from '@/data/projects';
import { cmsContentService } from '@/lib/cms/content.service';
import { absoluteUrl } from '@/lib/seo/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages carry no lastModified: the only date available is the build time, which would
  // claim every page changed on every deploy. Blog posts use their real publication date.
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly') => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });

  const posts = await cmsContentService.getBlogs();

  return [
    page('/', 1, 'weekly'),
    page('/about', 0.8),
    page('/solutions', 0.9),
    ...divisions.map((d) => page(d.href, 0.9)),
    page('/industries', 0.8),
    ...industries.map((i) => page(`/industries/${i.id}`, 0.7)),
    page('/projects', 0.7, 'weekly'),
    ...projects.map((p) => page(`/projects/${p.slug}`, 0.6)),
    page('/why-us', 0.7),
    page('/blog', 0.7, 'weekly'),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.publishedAt), changeFrequency: 'yearly' as const, priority: 0.6 })),
    page('/contact', 0.8),
    page('/privacy-policy', 0.2, 'yearly'),
    page('/terms-conditions', 0.2, 'yearly'),
  ];
}
