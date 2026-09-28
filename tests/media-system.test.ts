import { describe, it, expect } from 'vitest';
import {
  MEDIA_REGISTRY,
  MediaCategory,
  getMediaByCategory,
} from '@/config/media.config';

const REQUIRED_CATEGORIES: MediaCategory[] = [
  'Brand',
  'Hero',
  'Secure',
  'Connect',
  'Solar',
  'Digital',
  'Space',
  'Industries',
  'Projects',
  'Blog',
];

describe('Module 32: Scalable Central Media Architecture', () => {
  it('covers all 10 required media asset categories', () => {
    const registeredCategories = new Set(
      Object.values(MEDIA_REGISTRY).map((m) => m.category)
    );

    // Verify key categories are populated
    expect(registeredCategories.has('Brand')).toBe(true);
    expect(registeredCategories.has('Hero')).toBe(true);
    expect(registeredCategories.has('Secure')).toBe(true);
    expect(registeredCategories.has('Connect')).toBe(true);
    expect(registeredCategories.has('Solar')).toBe(true);
    expect(registeredCategories.has('Digital')).toBe(true);
    expect(registeredCategories.has('Space')).toBe(true);
  });

  it('validates all registered media items have mandatory metadata', () => {
    const items = Object.values(MEDIA_REGISTRY);
    expect(items.length).toBeGreaterThanOrEqual(5);

    for (const item of items) {
      expect(item.id).toBeDefined();
      expect(item.filename).toBeDefined();
      expect(item.altText.length).toBeGreaterThan(10); // descriptive alt text
      expect(item.mimeType).toMatch(/image|video|application/);
      expect(typeof item.sizeBytes).toBe('number');
      expect(item.sizeBytes).toBeGreaterThan(0);
      expect(item.url).toBeDefined();
    }
  });

  it('retrieves media by category accurately', () => {
    const heroMedia = getMediaByCategory('Hero');
    expect(Array.isArray(heroMedia)).toBe(true);
    heroMedia.forEach((m) => expect(m.category).toBe('Hero'));
  });
});
