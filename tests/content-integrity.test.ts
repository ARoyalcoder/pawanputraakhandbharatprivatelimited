import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { divisions, getDivision } from '@/data/divisions';
import { industries } from '@/data/industries';
import { projects } from '@/data/projects';
import { testimonials } from '@/data/testimonials';
import { faqs, faqCategories } from '@/data/faq';
import { processSteps, whyUs, trustPillars } from '@/data/company';
import { mainNav } from '@/data/navigation';
import { siteConfig } from '@/config/site.config';
import type { DivisionId } from '@/types/content';

/** The authoritative service lists from the PPAB project brief. */
const briefServices: Record<string, string[]> = {
  secure: ['CCTV Camera', 'Video Door Phone', 'Biometric Attendance', 'Installation', 'Maintenance & AMC'],
  connect: ['Fiber Networking', 'LAN / CAN', 'Wi-Fi', 'Routers', 'Switches', 'Server Racks', 'IT Support'],
  solar: [
    'On-Grid Solar',
    'Off-Grid Solar',
    'Hybrid Solar',
    'Solar Water Pump',
    'Solar Street Light',
    'Net Metering',
    'Solar Cleaning',
    'Solar AMC',
    'Solar Battery',
    'Solar Inverter',
  ],
  digital: [
    'Website Development',
    'Mobile App Development',
    'Software Development',
    'ERP',
    'CRM',
    'SEO',
    'Google Ads',
    'Meta Ads',
    'Social Media Marketing',
    'Branding',
    'Graphic Designing',
  ],
  space: ['Real Estate', 'Architecture', 'Interior Design', 'Construction', 'Property Solutions'],
};

const briefTaglines: Record<string, string> = {
  secure: 'Har Nazar Se Suraksha',
  connect: 'Har Connection Mein Bharosa',
  solar: 'Suraj Ki Shakti, Aapki Bachat',
  digital: 'Har Business Ki Digital Pehchaan',
  space: 'Har Space Ka Bharosa',
};

describe('Verified company information', () => {
  it('uses the contact details printed on PPAB collateral', () => {
    expect(siteConfig.masterTagline).toBe('Powering Security, Connectivity & Growth');
    expect(siteConfig.contact.phoneE164).toBe('+918796716111');
    expect(siteConfig.contact.whatsapp).toBe('+918796716111');
    expect(siteConfig.contact.email).toBe('pawanputraakhandbharat@gmail.com');
    expect(siteConfig.offices.map((o) => o.city)).toEqual(['Lucknow', 'New Delhi']);
  });

  it('publishes verified corporate social profiles', () => {
    expect(siteConfig.social).toEqual([
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/profile.php?id=61590670627127',
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/pawanputraakhandbharat',
      },
    ]);
  });
});

describe('Divisions', () => {
  it('has the five divisions in brief order', () => {
    expect(divisions.map((d) => d.id)).toEqual(['secure', 'connect', 'solar', 'digital', 'space']);
  });

  it.each(Object.keys(briefServices))('%s lists exactly the services in the brief', (id) => {
    const division = getDivision(id as DivisionId);
    expect(division.services.map((s) => s.name)).toEqual(briefServices[id]);
    expect(division.tagline).toBe(briefTaglines[id]);
    expect(division.href).toBe(`/solutions/${id}`);
  });

  it('has unique service ids within each division', () => {
    for (const d of divisions) {
      const ids = d.services.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('Industries', () => {
  it('covers the seven industries from the brief', () => {
    expect(industries.map((i) => i.id)).toEqual(['residential', 'education', 'healthcare', 'corporate', 'hospitality', 'manufacturing', 'commercial']);
  });

  it('only recommends services that a division actually offers', () => {
    for (const industry of industries) {
      for (const rec of industry.solutions) {
        const division = getDivision(rec.division);
        const offered = [...division.services.map((s) => s.name), ...division.additionalServices];
        for (const service of rec.services) {
          expect(offered, `${industry.id} → ${rec.division} → ${service}`).toContain(service);
        }
      }
    }
  });
});

describe('Business trust rules', () => {
  it('only publishes verified projects with real photography', () => {
    for (const project of projects) {
      expect(project.verification.verifiedBy).toBeTruthy();
      expect(project.media.length).toBeGreaterThan(0);
      for (const m of project.media) {
        expect(m.src.startsWith('/images/ai/')).toBe(false);
        expect(['ppab-photography', 'client-supplied']).toContain(m.source);
      }
    }
  });

  it('only publishes testimonials with written consent', () => {
    for (const t of testimonials) {
      expect(t.consentReference).toBeTruthy();
      expect(t.verifiedOn).toBeTruthy();
    }
  });

  it('keeps the brief structure for trust, why-us and process content', () => {
    expect(trustPillars.map((t) => t.title)).toEqual(['Professional Solutions', 'Transparent Process', 'Installation Support', 'After-Sales Service']);
    expect(whyUs.map((w) => w.title)).toEqual([
      'One Partner, Multiple Solutions',
      'Professional Execution',
      'Transparent Process',
      'After-Sales Support',
      'Scalable Solutions',
    ]);
    expect(processSteps).toHaveLength(6);
    expect(faqCategories).toEqual(['General', 'CCTV', 'Solar', 'Networking', 'Digital']);
    for (const c of faqCategories) expect(faqs.some((f) => f.category === c)).toBe(true);
  });

  it('has no unverifiable claims anywhere in UI source', () => {
    // "100% Genuine"-style claims (not CSS lengths), and guarantees other than disclaimers.
    const banned = [/24\s*\/\s*7/, /\bISO\b/, /PAN India/i, /100%\s+[A-Za-z]/, /\bTier-1\b/i, /\baward/i, /years of experience/i, /happy clients/i, /(?<!not )\bguarantee/i, /\bcertified\b/i];
    const roots = ['app', 'components', 'sections', 'features', 'data', 'content', 'lib/cms', 'config/site.config.ts'];
    const files: string[] = [];
    const walk = (p: string) => {
      const full = path.join(process.cwd(), p);
      if (!fs.existsSync(full)) return;
      if (fs.statSync(full).isFile()) return void files.push(full);
      for (const entry of fs.readdirSync(full)) {
        if (p === 'app' && (entry === 'admin' || entry === 'api')) continue;
        walk(path.join(p, entry));
      }
    };
    roots.forEach(walk);

    const offenders: string[] = [];
    for (const file of files.filter((f) => /\.(tsx?|mjs)$/.test(f))) {
      const text = fs.readFileSync(file, 'utf8');
      for (const pattern of banned) if (pattern.test(text)) offenders.push(`${path.relative(process.cwd(), file)} ~ ${pattern}`);
    }
    expect(offenders).toEqual([]);
  });
});

describe('Navigation', () => {
  it('matches the desktop navigation in the brief', () => {
    expect(mainNav.map((n) => n.label)).toEqual(['Home', 'About', 'Solutions', 'Industries', 'Projects', 'Why Us', 'Blog', 'Contact']);
    expect(mainNav.find((n) => n.label === 'Solutions')?.children?.map((c) => c.label)).toEqual([
      'Pawan Putra Secure',
      'Pawan Putra Connect',
      'Pawan Putra Solar',
      'Pawan Putra Digital',
      'Pawan Putra Space',
    ]);
    expect(mainNav.find((n) => n.label === 'Industries')?.children).toHaveLength(7);
  });
});
