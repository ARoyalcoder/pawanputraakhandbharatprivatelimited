import { describe, expect, it } from 'vitest';
import { aiImages, getAIImageEntry } from '@/content/image-prompts';
import { divisions } from '@/data/divisions';
import { industries } from '@/data/industries';

describe('AI image manifest', () => {
  it('marks every entry as illustrative and labels its alt text', () => {
    for (const image of aiImages) {
      expect(image.illustrative).toBe(true);
      expect(image.alt.startsWith('Illustrative concept:')).toBe(true);
    }
  });

  it('asks the generator for clean imagery with no text or logos', () => {
    for (const image of aiImages) {
      expect(image.prompt).toMatch(/no text/);
      expect(image.prompt).toMatch(/no logos/);
    }
  });

  it('stores each image under its category folder with a web format', () => {
    for (const image of aiImages) {
      expect(image.filename).toMatch(new RegExp(`^${image.category}/[a-z0-9-]+\\.(webp|avif|jpg|png)$`));
    }
  });

  it('has unique ids and filenames', () => {
    expect(new Set(aiImages.map((i) => i.id)).size).toBe(aiImages.length);
    expect(new Set(aiImages.map((i) => i.filename)).size).toBe(aiImages.length);
  });

  it('covers every division and industry image the site references', () => {
    for (const id of [...divisions.map((d) => d.imageId), ...industries.map((i) => i.imageId), 'hero-integrated']) {
      expect(getAIImageEntry(id), id).toBeDefined();
    }
  });
});
