import { describe, expect, it } from 'vitest';
import { buildMetadata, absoluteUrl } from '@/lib/seo/metadata';
import { articleSchema, breadcrumbSchema, faqSchema, organizationSchema, serviceSchema } from '@/lib/seo/schema';
import { secure } from '@/data/divisions';

describe('SEO metadata', () => {
  it('builds canonical URLs and Open Graph data', () => {
    const meta = buildMetadata({ title: 'Test', description: 'Desc', path: '/solutions/secure' });
    expect(meta.alternates?.canonical).toBe(absoluteUrl('/solutions/secure'));
    expect(meta.openGraph?.url).toBe(absoluteUrl('/solutions/secure'));
    expect(meta.title).toBe('Test');
  });

  it('supports absolute titles for the homepage', () => {
    const meta = buildMetadata({ title: 'Home', description: 'd', path: '/', absoluteTitle: true });
    expect(meta.title).toEqual({ absolute: 'Home' });
  });
});

describe('structured data', () => {
  it('describes the organisation with verified contact details', () => {
    const org = organizationSchema();
    expect(org['@type']).toBe('Organization');
    expect(org.telephone).toBe('+918796716111');
    expect(org.email).toBe('pawanputraakhandbharat@gmail.com');
    expect(org.address.addressLocality).toBe('Lucknow');
    expect(org.sameAs).toEqual([
      'https://www.facebook.com/profile.php?id=61590670627127',
      'https://www.instagram.com/pawanputraakhandbharat',
    ]);
  });

  it('lists every division service in the Service schema', () => {
    const schema = serviceSchema(secure);
    expect(schema['@type']).toBe('Service');
    expect(schema.hasOfferCatalog.itemListElement).toHaveLength(secure.services.length);
  });

  it('numbers breadcrumb positions from 1', () => {
    const schema = breadcrumbSchema([
      { label: 'Home', href: '/' },
      { label: 'Solutions', href: '/solutions' },
    ]);
    expect(schema.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });

  it('builds FAQPage and Article schemas', () => {
    expect(faqSchema([{ id: 'a', question: 'Q?', answer: 'A.' }]).mainEntity[0].acceptedAnswer.text).toBe('A.');
    const article = articleSchema({ title: 'T', description: 'D', slug: 's', publishedAt: '2026-09-25', author: 'PPAB Team' });
    expect(article.mainEntityOfPage).toBe(absoluteUrl('/blog/s'));
  });
});
