import 'server-only';
import { industries } from '@/data/industries';
import { divisionAccent, getDivision } from '@/data/divisions';
import { resolveAIImage } from '@/lib/media/ai-assets';
import type { Industry } from '@/types/content';
import type { IndustryCardData } from './types';

const displayServicesOverride: Record<string, Record<string, string[]>> = {
  residential: {
    secure: ['CCTV Cameras', 'Video Door Phones'],
    connect: ['Wi-Fi & Networking', 'Routers'],
    solar: ['On-Grid & Hybrid Solar Solutions'],
    space: ['Real Estate & Architecture Services'],
  },
  education: {
    secure: ['CCTV Cameras & Biometric Attendance'],
    connect: ['LAN / CAN Networking & Wi-Fi'],
    digital: ['Website Development & School ERP / Software'],
    solar: ['On-Grid Solar & Solar Street Lights'],
  },
  healthcare: {
    secure: ['CCTV Cameras & Biometric Attendance'],
    connect: ['LAN / CAN Networking & Wi-Fi'],
    solar: ['Hybrid Solar & Solar Battery Solutions'],
    digital: ['Website Development & CRM Solutions'],
  },
  hospitality: {
    connect: ['Wi-Fi & Routers'],
    secure: ['CCTV Cameras & Video Door Phones'],
    solar: ['On-Grid & Hybrid Solar Solutions'],
    digital: ['Meta Ads & Social Media Marketing'],
    space: ['Interior Design Services'],
  },
  manufacturing: {
    secure: ['CCTV Cameras & Biometric Attendance'],
    connect: ['Fiber Networking & LAN / CAN'],
    solar: ['On-Grid Solar & Solar Water Pumps'],
    digital: ['ERP & Software Development'],
    space: ['Construction Services'],
  },
  commercial: {
    secure: ['CCTV Cameras, Maintenance & AMC'],
    connect: ['Wi-Fi & Routers'],
    solar: ['On-Grid Solar & Net Metering'],
    digital: ['SEO & Google Ads'],
    space: ['Interior Design & Real Estate Services'],
  },
};

export function toIndustryCard(industry: Industry, index: number): IndustryCardData {
  return {
    id: industry.id,
    index: String(index + 1).padStart(2, '0'),
    name: industry.name,
    icon: industry.icon,
    audience: industry.audience,
    headline: industry.headline,
    summary: industry.summary,
    tagline: industry.tagline,
    needs: industry.needs,
    solutions: industry.solutions.map((s) => {
      const division = getDivision(s.division);
      const customServices = displayServicesOverride[industry.id]?.[s.division];
      return {
        division: s.division,
        divisionName: division.name,
        href: division.href,
        accent: divisionAccent[s.division].hex,
        services: customServices || s.services,
      };
    }),
    href: `/industries/${industry.id}`,
    image: resolveAIImage(industry.imageId),
  };
}

export function getIndustryCards(): IndustryCardData[] {
  return industries.map(toIndustryCard);
}
