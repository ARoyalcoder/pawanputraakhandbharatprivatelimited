import { describe, it, expect } from 'vitest';
import { cmsContentService } from '@/lib/cms/content.service';

describe('Content Management System (CMS)', () => {
  it('loads the verified master tagline as default hero content', async () => {
    const hero = await cmsContentService.getHeroContent();
    expect(`${hero.title} ${hero.headlineHighlight}`).toBe('Powering Security, Connectivity & Growth');
    // Only verifiable facts: five divisions and the two office cities.
    expect(hero.stats).toEqual([
      { label: 'Divisions', value: '5' },
      { label: 'Offices', value: 'Lucknow · New Delhi' },
    ]);
  });

  it('seed content carries no unverified claims', async () => {
    const hero = await cmsContentService.getHeroContent();
    const cta = await cmsContentService.getCtaContent();
    const blogs = await cmsContentService.getAllBlogsAdmin();
    const text = JSON.stringify({ hero, cta, blogs });
    for (const claim of ['ISO', '24/7', '100%', 'Tier-1', 'ANPR', 'certified', 'guarantee']) {
      expect(text).not.toContain(claim);
    }
  });

  it('updates hero content and reflects changes', async () => {
    const updated = await cmsContentService.updateHeroContent({ badgeText: 'Updated badge' });
    expect(updated.badgeText).toBe('Updated badge');
    expect((await cmsContentService.getHeroContent()).badgeText).toBe('Updated badge');
  });

  it('manages blog posts with publication statuses', async () => {
    const allBlogs = await cmsContentService.getAllBlogsAdmin();
    expect(allBlogs.length).toBeGreaterThanOrEqual(4);

    const testSlug = `test-article-${Date.now()}`;
    const newBlog = await cmsContentService.upsertBlog({
      slug: testSlug,
      title: 'Testing CMS Article Publishing',
      excerpt: 'Short excerpt for verification test of publishing pipeline.',
      content: '## Heading\nTest content body paragraph.',
      category: 'CCTV',
      author: 'QA',
      readTime: '3 min read',
      status: 'PUBLISHED',
      tags: ['Testing'],
    });

    expect(newBlog.slug).toBe(testSlug);
    expect((await cmsContentService.getBlogBySlug(testSlug))?.title).toBe('Testing CMS Article Publishing');
    expect(await cmsContentService.deleteBlog(newBlog.id)).toBe(true);
    expect(await cmsContentService.getBlogBySlug(testSlug)).toBeNull();
  });

  it('ships no seed projects until verified case studies are supplied', async () => {
    expect(await cmsContentService.getAllProjectsAdmin()).toEqual([]);
    const secure = await cmsContentService.getProjects({ division: 'Secure' });
    secure.forEach((p) => expect(p.division).toBe('Secure'));
  });
});
