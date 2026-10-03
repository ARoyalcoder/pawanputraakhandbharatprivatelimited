import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
      style-src 'self' 'unsafe-inline' https:;
      img-src 'self' blob: data: https:;
      font-src 'self' https: data:;
      connect-src 'self' https: wss:;
      worker-src 'self' blob:;
      frame-src 'self' https://maps.google.com https://www.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  // Development only. An early version of this config served dev chunks with
  // `Cache-Control: immutable`, so browsers that visited then keep year-long copies under
  // unchanged chunk URLs ("module factory is not available" errors). The deployment id adds
  // `?dpl=…` to every chunk URL so those stale copies are never used. Bump it if that recurs.
  deploymentId: process.env.NODE_ENV === 'development' ? 'dev-2026-09-28' : undefined,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Only local images are served. Add specific hosts here if a CDN is introduced.
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-conditions', permanent: true },
      { source: '/careers', destination: '/contact', permanent: false },
    ];
  },
  // Note: no custom Cache-Control for /_next/static — Next.js already marks hashed production
  // assets immutable, and forcing it in development pins stale chunks in the browser.
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
