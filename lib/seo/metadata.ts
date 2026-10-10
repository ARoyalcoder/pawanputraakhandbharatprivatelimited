import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

interface PageMeta {
  title: string;
  description: string;
  path: string;
  /** Absolute title that bypasses the "%s | PPAB" template. */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  noIndex?: boolean;
}

export const absoluteUrl = (path = '/') => new URL(path, siteConfig.url).toString();

/**
 * The branded social card: a saved copy of what app/opengraph-image.tsx renders, served as a
 * plain .png because some crawlers only accept image URLs with a file extension. Re-save it
 * from /opengraph-image if that design changes. A page that sets its own `openGraph` object
 * replaces the one inherited from the root segment, image included, so it is named explicitly.
 */
const socialImage = {
  url: '/brand/ppab-social-card.png',
  width: 1200,
  height: 630,
  alt: `${siteConfig.companyName}: ${siteConfig.masterTagline}`,
};

/** Page metadata with canonical URL and Open Graph / Twitter cards. */
export function buildMetadata({ title, description, path, absoluteTitle, type = 'website', publishedTime, noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, types: { 'text/plain': absoluteUrl('/llms.txt') } },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.companyName,
      locale: siteConfig.locale,
      images: [socialImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [socialImage] },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
