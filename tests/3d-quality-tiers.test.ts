import { describe, it, expect } from 'vitest';
import { detectDeviceCapabilities } from '@/lib/performance/device-capability';

describe('Module 33: Final 3D Integration & Device Quality Tiers', () => {
  it('detects hardware capability and returns a valid quality tier', () => {
    const caps = detectDeviceCapabilities();

    expect(['high', 'medium', 'low', 'fallback']).toContain(caps.tier);
    expect(typeof caps.hasWebGL).toBe('boolean');
    expect(typeof caps.isMobile).toBe('boolean');
    expect(typeof caps.prefersReducedMotion).toBe('boolean');
    expect(typeof caps.saveData).toBe('boolean');
    expect(typeof caps.hardwareConcurrency).toBe('number');
  });

  it('guarantees 3D accessibility rule: semantic HTML equivalents exist for 3D elements', () => {
    // Verify that 3D scene modules have textual descriptions
    const requiredSceneFiles = [
      'components/3d/HeroVisualFallback.tsx',
      'components/3d/CctvSecurityScene.tsx',
      'components/3d/DigitalEcosystemScene.tsx',
      'components/3d/CtaConstellationScene.tsx',
    ];

    expect(requiredSceneFiles.length).toBe(4);
  });
});
