import type { Metadata } from 'next';
import { HeroSection } from '@/sections/home/hero/HeroSection';
import { ServiceTicker } from '@/sections/home/ServiceTicker';
import { TrustBar } from '@/sections/home/TrustBar';
import { SolutionsSection } from '@/sections/home/SolutionsSection';
import { IndustriesSection } from '@/sections/home/IndustriesSection';
import { WhyUsSection } from '@/sections/home/WhyUsSection';
import { ProcessSection } from '@/sections/home/ProcessSection';
import { ProjectsSection } from '@/sections/home/ProjectsSection';
import { TestimonialsSection } from '@/sections/home/TestimonialsSection';
import { FaqSection } from '@/sections/home/FaqSection';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/config/site.config';

import { CinematicIntro } from '@/components/intro/CinematicIntro';

export const metadata: Metadata = buildMetadata({
  title: siteConfig.seoTitle,
  absoluteTitle: true,
  description: siteConfig.seoDescription,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <CinematicIntro />
      <HeroSection />
      <ServiceTicker />
      <TrustBar />
      <SolutionsSection />
      <IndustriesSection />
      <WhyUsSection />
      <ProcessSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
