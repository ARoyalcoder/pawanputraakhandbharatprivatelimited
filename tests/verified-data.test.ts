import { describe, it, expect } from 'vitest';
import { verifiedPricingPlans } from '@/data/pricing.data';
import {
  solarSystemTypes,
  solarProductsSupplied,
  solarInstallationSteps,
  solarBenefits,
} from '@/data/solar.data';
import {
  cctvProductsOffered,
  cctvInstallationSteps,
  cctvMaintenanceFeatures,
} from '@/data/cctv.data';
import { whyChoosePPAB, companyVision } from '@/data/company.data';

describe('Verified PPAB Collateral & Brochure Data Integrity', () => {
  describe('Digital Marketing & Web Services Pricing', () => {
    it('contains all 3 monthly plans with verified pricing', () => {
      const plans = verifiedPricingPlans.monthly;
      expect(plans).toHaveLength(3);

      const seo = plans.find((p) => p.id === 'seo-growth');
      expect(seo).toBeDefined();
      expect(seo?.price).toBe('₹10,000');
      expect(seo?.billing).toBe('Monthly');

      const ads = plans.find((p) => p.id === 'ads-boost');
      expect(ads).toBeDefined();
      expect(ads?.price).toBe('₹15,000');
      expect(ads?.popular).toBe(true);

      const sm = plans.find((p) => p.id === 'social-media-growth');
      expect(sm).toBeDefined();
      expect(sm?.price).toBe('₹20,000');
    });

    it('contains all 3 yearly plans with verified pricing', () => {
      const plans = verifiedPricingPlans.yearly;
      expect(plans).toHaveLength(3);

      const care = plans.find((p) => p.id === 'website-care');
      expect(care?.price).toBe('₹10,000');
      expect(care?.billing).toBe('Yearly');

      const gmb = plans.find((p) => p.id === 'gmb-visibility');
      expect(gmb?.price).toBe('₹25,000');
      expect(gmb?.popular).toBe(true);

      const content = plans.find((p) => p.id === 'content-visibility');
      expect(content?.price).toBe('₹25,000');
    });

    it('contains all 3 one-time plans with verified pricing', () => {
      const plans = verifiedPricingPlans.oneTime;
      expect(plans).toHaveLength(3);

      const shoot = plans.find((p) => p.id === 'business-shoot');
      expect(shoot?.price).toBe('₹12,000');

      const webDev = plans.find((p) => p.id === 'website-development');
      expect(webDev?.price).toBe('₹15,000');
      expect(webDev?.popular).toBe(true);

      const ecommerce = plans.find((p) => p.id === 'ecommerce-website');
      expect(ecommerce?.price).toBe('₹35,000');
    });
  });

  describe('Solar Systems Collateral', () => {
    it('contains all 3 solar system types', () => {
      expect(solarSystemTypes).toHaveLength(3);
      const titles = solarSystemTypes.map((s) => s.title);
      expect(titles).toContain('On-Grid Solar System');
      expect(titles).toContain('Off-Grid Solar System');
      expect(titles).toContain('Hybrid Solar System');
    });

    it('contains 6 verified solar products supplied', () => {
      expect(solarProductsSupplied).toHaveLength(6);
      const names = solarProductsSupplied.map((p) => p.name);
      expect(names).toEqual([
        'Solar Panels',
        'Solar Inverters',
        'Solar Batteries',
        'Mounting Structures',
        'ACDB / DCDB',
        'Earthing Systems',
      ]);
    });

    it('contains 7-step solar installation workflow', () => {
      expect(solarInstallationSteps).toHaveLength(7);
      expect(solarInstallationSteps[0].title).toBe('Site Survey');
      expect(solarInstallationSteps[6].title).toBe('After-Sales Support');
    });

    it('contains 6 solar benefits', () => {
      expect(solarBenefits).toHaveLength(6);
      expect(solarBenefits[0].title).toBe('Reduce Electricity Bills');
    });
  });

  describe('CCTV Surveillance Collateral', () => {
    it('contains 8 verified product categories', () => {
      expect(cctvProductsOffered).toHaveLength(8);
      const names = cctvProductsOffered.map((p) => p.name);
      expect(names).toContain('Dome Cameras');
      expect(names).toContain('Bullet Cameras');
      expect(names).toContain('PTZ Cameras');
      expect(names).toContain('IP Cameras');
      expect(names).toContain('NVR & DVR Systems');
      expect(names).toContain('Hard Disk Storage');
      expect(names).toContain('PoE Switches');
      expect(names).toContain('Networking Accessories');
    });

    it('contains 7-step CCTV deployment process', () => {
      expect(cctvInstallationSteps).toHaveLength(7);
      expect(cctvInstallationSteps[0].title).toBe('Site Survey');
      expect(cctvInstallationSteps[6].title).toBe('Ongoing Support');
    });

    it('contains AMC maintenance contract features', () => {
      expect(cctvMaintenanceFeatures).toHaveLength(5);
      expect(cctvMaintenanceFeatures).toContain('Annual Maintenance Contracts (AMC)');
    });
  });

  describe('Company Values and Vision', () => {
    it('contains 6 official value propositions', () => {
      expect(whyChoosePPAB).toHaveLength(6);
      const ids = whyChoosePPAB.map((v) => v.id);
      expect(ids).toEqual([
        'team',
        'partner-network',
        'quality-products',
        'competitive-pricing',
        'fast-installation',
        'pan-india',
      ]);
    });

    it('matches official 2026-2027 vision cycle headline', () => {
      expect(companyVision.headline).toBe(
        'Building a stronger nation through vision, values and relentless commitment.'
      );
      expect(companyVision.cycle).toBe('Business Brochure 2026 - 2027');
    });
  });
});
