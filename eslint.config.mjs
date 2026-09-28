import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import { legacyTestFiles } from './tests/legacy-files.mjs';

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'e2e/**',
      '.claude/**',
      // Local archive copy and the unused monorepo skeleton are not part of the site.
      '_archive_ppab/**',
      'apps/**',
      'packages/**',
      'infra/**',
      'playwright.config.ts',
      'next-env.d.ts',
      // Tests for the pre-redesign frontend, kept on disk until deleted by hand.
      ...legacyTestFiles,
    ],
  },
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    // Node maintenance scripts are CommonJS.
    files: ['scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default config;
