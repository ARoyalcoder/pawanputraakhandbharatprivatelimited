export type MediaCategory =
  | 'Brand'
  | 'Hero'
  | 'Secure'
  | 'Connect'
  | 'Solar'
  | 'Digital'
  | 'Space'
  | 'Industries'
  | 'Projects'
  | 'Blog';

export type MediaType = 'image' | 'video' | '3d' | 'icon';

export interface MediaItem {
  id: string;
  filename: string;
  altText: string;
  category: MediaCategory;
  type: MediaType;
  mimeType: string;
  width?: number;
  height?: number;
  sizeBytes: number;
  url: string;
  posterUrl?: string;
  blurDataUrl?: string;
}

export const MEDIA_REGISTRY: Record<string, MediaItem> = {
  'ppab-logo': {
    id: 'm-logo',
    filename: 'ppab-logo.png',
    altText: 'Pawan Putra Akhand Bharat (PPAB) Official Corporate Logo',
    category: 'Brand',
    type: 'image',
    mimeType: 'image/png',
    width: 512,
    height: 512,
    sizeBytes: 45000,
    url: '/images/brand/ppab-logo.png',
  },
  'hero-poster': {
    id: 'm-hero-poster',
    filename: 'hero-poster.webp',
    altText: 'PPAB Integrated Engineering and Infrastructure Solutions Overview',
    category: 'Hero',
    type: 'image',
    mimeType: 'image/webp',
    width: 1920,
    height: 1080,
    sizeBytes: 145000,
    url: '/images/hero/hero-poster.webp',
  },
  'secure-cctv-preview': {
    id: 'm-sec-1',
    filename: 'secure-cctv.webp',
    altText: 'Pawan Putra Secure AI surveillance camera and control room monitoring',
    category: 'Secure',
    type: 'image',
    mimeType: 'image/webp',
    width: 1200,
    height: 800,
    sizeBytes: 95000,
    url: '/images/secure/secure-cctv.webp',
  },
  'connect-fiber-preview': {
    id: 'm-con-1',
    filename: 'connect-fiber.webp',
    altText: 'Pawan Putra Connect high-speed fiber backbone and enterprise rack',
    category: 'Connect',
    type: 'image',
    mimeType: 'image/webp',
    width: 1200,
    height: 800,
    sizeBytes: 92000,
    url: '/images/connect/connect-fiber.webp',
  },
  'solar-panel-preview': {
    id: 'm-sol-1',
    filename: 'solar-panel.webp',
    altText: 'Pawan Putra Solar rooftop photovoltaic engineering array',
    category: 'Solar',
    type: 'image',
    mimeType: 'image/webp',
    width: 1200,
    height: 800,
    sizeBytes: 110000,
    url: '/images/solar/solar-panel.webp',
  },
  'digital-ecosystem-preview': {
    id: 'm-dig-1',
    filename: 'digital-ecosystem.webp',
    altText: 'Pawan Putra Digital enterprise web and cloud architecture',
    category: 'Digital',
    type: 'image',
    mimeType: 'image/webp',
    width: 1200,
    height: 800,
    sizeBytes: 88000,
    url: '/images/digital/digital-ecosystem.webp',
  },
  'space-architecture-preview': {
    id: 'm-spa-1',
    filename: 'space-architecture.webp',
    altText: 'Pawan Putra Space commercial structural development and interior planning',
    category: 'Space',
    type: 'image',
    mimeType: 'image/webp',
    width: 1200,
    height: 800,
    sizeBytes: 98000,
    url: '/images/space/space-architecture.webp',
  },
};

export function getMediaByCategory(category: MediaCategory): MediaItem[] {
  return Object.values(MEDIA_REGISTRY).filter((item) => item.category === category);
}
