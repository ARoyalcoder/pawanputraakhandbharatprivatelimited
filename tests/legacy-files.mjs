/**
 * Tests written for the pre-redesign frontend. They import modules that no longer exist
 * and are excluded from Vitest, ESLint and tsc until they are deleted by hand.
 * (tsconfig.json lists the same files in "exclude".)
 */
export const legacyTestFiles = [
  'tests/3d-quality-tiers.test.ts',
  'tests/blog-system.test.tsx',
  'tests/business-content-audit.test.ts',
  'tests/components.test.tsx',
  'tests/contact-system.test.tsx',
  'tests/experience-polish.test.tsx',
  'tests/foundation.test.ts',
  'tests/hero.test.tsx',
  'tests/homepage-structure.test.tsx',
  'tests/industries.test.tsx',
  'tests/lead-generation.test.tsx',
  'tests/media-system.test.ts',
  'tests/navigation.test.ts',
  'tests/process-system.test.tsx',
  'tests/production-deployment.test.ts',
  'tests/projects.test.tsx',
  'tests/shell.test.tsx',
  'tests/solutions-system.test.tsx',
  'tests/three-capability.test.ts',
  'tests/three-performance.test.ts',
  'tests/trust-content.test.tsx',
  'tests/verified-data.test.ts',
  'tests/why-us.test.tsx',
];
