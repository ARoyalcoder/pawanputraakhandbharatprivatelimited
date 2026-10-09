import { TopUtilityBar } from '@/components/layout/TopUtilityBar';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FloatingContact } from '@/components/layout/FloatingContact';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { QuoteProvider } from '@/components/forms/QuoteProvider';
import { MotionProvider } from '@/components/animation/MotionProvider';
import { SmoothScroll } from '@/components/animation/SmoothScroll';
import { CustomCursor } from '@/components/animation/CustomCursor';
import { ScrollProgress } from '@/components/animation/ScrollProgress';
import { JsonLd } from '@/components/seo/JsonLd';
import { localBusinessSchema, organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { getNavMedia } from '@/lib/media/nav-media';
import { PageLoader } from '@/components/loading/PageLoader';
import { PageTransition } from '@/components/animation/PageTransition';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuoteProvider>
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-500 focus:px-5 focus:py-3 focus:font-semibold focus:text-navy-950"
      >
        Skip to main content
      </a>
      <JsonLd data={[organizationSchema(), websiteSchema(), ...localBusinessSchema()]} />
      <SiteHeader utilityBar={<TopUtilityBar />} navMedia={getNavMedia()} />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <FloatingContact />
      <MobileActionBar />
      <MotionProvider />
      <SmoothScroll />
    </QuoteProvider>
  );
}
