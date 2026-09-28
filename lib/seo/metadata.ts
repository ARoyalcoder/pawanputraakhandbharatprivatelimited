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

/** Page metadata with canonical URL and Open Graph / Twitter cards. */
export function buildMetadata({ title, description, path, absoluteTitle, type = 'website', publishedTime, noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.companyName,
      locale: siteConfig.locale,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
