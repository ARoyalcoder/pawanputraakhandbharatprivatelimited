import { siteConfig } from '@/config/site.config';
import type { Division, FaqItem } from '@/types/content';
import { absoluteUrl } from './metadata';

const orgId = absoluteUrl('/#organization');

export function organizationSchema() {
  const [head, branch] = siteConfig.offices;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: siteConfig.companyName,
    alternateName: siteConfig.brandName,
    url: siteConfig.url,
    logo: absoluteUrl('/brand/ppab-logo.png'),
    slogan: siteConfig.masterTagline,
    description: siteConfig.positioning,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'BCC Tower, Arjunganj',
      addressLocality: head.city,
      addressRegion: head.region,
      addressCountry: 'IN',
    },
    location: [
      {
        '@type': 'Place',
        name: `${siteConfig.brandName} ${branch.type}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'C400, 3rd Floor, near Ramphal Chowk Road, Sector 7, Block C, Palam Extension, Dwarka',
          addressLocality: branch.city,
          addressRegion: branch.region,
          postalCode: branch.postalCode,
          addressCountry: 'IN',
        },
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.contact.phoneE164,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
    ...(siteConfig.social.length ? { sameAs: siteConfig.social.map((s) => s.href) } : {}),
  };
}

export function serviceSchema(division: Division) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: division.name,
    serviceType: division.services.map((s) => s.name),
    description: division.summary,
    slogan: division.tagline,
    url: absoluteUrl(division.href),
    provider: { '@id': orgId },
    areaServed: { '@type': 'Country', name: 'India' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${division.name} services`,
      itemListElement: division.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.summary },
      })),
    },
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema(article: { title: string; description: string; slug: string; publishedAt: string; author: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: article.author },
    publisher: { '@id': orgId },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
  };
}
