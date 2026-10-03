import { defineConfig } from 'vitest/config';
import path from 'path';
import { legacyTestFiles } from './tests/legacy-files.mjs';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', ...legacyTestFiles],
    testTimeout: 15000,
    env: {
      DATABASE_URL: '',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
