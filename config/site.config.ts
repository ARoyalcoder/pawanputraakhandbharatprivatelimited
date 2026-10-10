/**
 * Verified PPAB company information.
 *
 * Every value here is traceable to PPAB's own collateral (the posters in
 * public/images/posters) or the authoritative project brief. Do not add
 * addresses, social handles, statistics or certifications that are not
 * verified — leave the field empty instead.
 */

export interface Office {
  id: 'lucknow' | 'delhi';
  type: 'Head Office' | 'Branch Office';
  city: string;
  addressLines: string[];
  region: string;
  postalCode?: string;
  mapQuery: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const siteConfig = {
  companyName: 'Pawan Putra Akhand Bharat Pvt. Ltd.',
  brandName: 'PPAB',
  shortName: 'Pawan Putra Akhand Bharat',
  masterTagline: 'Powering Security, Connectivity & Growth',
  secondaryTagline: 'Smart Technology. Safe Tomorrow.',
  positioning: 'One trusted partner for Security, Connectivity, Solar, Digital Technology and Infrastructure.',
  /** Search-result title and description for the homepage: 50-60 and 120-160 characters. */
  seoTitle: 'Pawan Putra Akhand Bharat | CCTV, Solar & IT Solutions',
  seoDescription:
    'CCTV, networking, solar, websites, apps, ERP, real estate and construction for homes, businesses and institutions in Lucknow and New Delhi.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pawanputraakhandbharat.com',
  locale: 'en_IN',
  contact: {
    phone: '8796716111',
    phoneDisplay: '+91 87967 16111',
    phoneE164: '+918796716111',
    whatsapp: '+918796716111',
    email: 'pawanputraakhandbharat@gmail.com',
    website: 'https://www.pawanputraakhandbharat.com',
  },
  offices: [
    {
      id: 'lucknow',
      type: 'Head Office',
      city: 'Lucknow',
      addressLines: ['BCC Tower, Arjunganj', 'Lucknow, Uttar Pradesh'],
      region: 'Uttar Pradesh',
      mapQuery: 'BCC Tower, Arjunganj, Lucknow, Uttar Pradesh',
    },
    {
      id: 'delhi',
      type: 'Branch Office',
      city: 'New Delhi',
      addressLines: [
        'C400, 3rd Floor, near Ramphal Chowk Road',
        'Sector 7, Block C, Palam Extension, Dwarka',
        'New Delhi, Delhi 110077',
      ],
      region: 'Delhi',
      postalCode: '110077',
      mapQuery: 'C400, Sector 7, Block C, Palam Extension, Dwarka, New Delhi 110077',
    },
  ] satisfies Office[],
  /** Verified corporate social profiles. */
  social: [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61590670627127',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/pawanputraakhandbharat',
    },
  ] satisfies SocialLink[],
} as const;

export type SiteConfig = typeof siteConfig;
