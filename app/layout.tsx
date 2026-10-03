import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { siteConfig } from '@/config/site.config';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { fontVariables } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.companyName} | ${siteConfig.masterTagline}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    'Security, connectivity, solar, digital and infrastructure solutions for homes, businesses, institutions and industries. CCTV, networking, solar, websites, apps, ERP, real estate and construction.',
  applicationName: siteConfig.companyName,
  authors: [{ name: siteConfig.companyName }],
  keywords: [
    'PPAB',
    'Pawan Putra Akhand Bharat',
    'CCTV installation Lucknow',
    'networking and Wi-Fi',
    'solar installation',
    'website and app development',
    'ERP and CRM',
    'architecture and construction',
  ],
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.companyName,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#06152f',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint: marks JS as available (so reveal targets start hidden) and
 * re-shows everything if the motion runtime has not started within 4 seconds.
 */
const motionBootstrap = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('motion-fallback')},4000)})(document.documentElement)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-theme="ppab"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="min-h-dvh">
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
