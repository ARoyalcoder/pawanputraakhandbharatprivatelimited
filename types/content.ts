export type DivisionId = 'secure' | 'connect' | 'solar' | 'digital' | 'space';

export type IndustryId =
  | 'residential'
  | 'education'
  | 'healthcare'
  | 'corporate'
  | 'hospitality'
  | 'manufacturing'
  | 'commercial';

export type IconName =
  | 'cctv'
  | 'video-door'
  | 'fingerprint'
  | 'wrench'
  | 'shield'
  | 'intercom'
  | 'speaker'
  | 'fiber'
  | 'lan'
  | 'wifi'
  | 'router'
  | 'switch'
  | 'server'
  | 'support'
  | 'isp'
  | 'sun'
  | 'on-grid'
  | 'off-grid'
  | 'hybrid'
  | 'pump'
  | 'street-light'
  | 'meter'
  | 'cleaning'
  | 'battery'
  | 'inverter'
  | 'code'
  | 'smartphone'
  | 'software'
  | 'erp'
  | 'crm'
  | 'seo'
  | 'google-ads'
  | 'meta-ads'
  | 'social'
  | 'branding'
  | 'design'
  | 'building'
  | 'architecture'
  | 'interior'
  | 'construction'
  | 'property'
  | 'home'
  | 'education'
  | 'healthcare'
  | 'corporate'
  | 'hospitality'
  | 'manufacturing'
  | 'commercial'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'clipboard'
  | 'calendar'
  | 'handshake'
  | 'settings'
  | 'layers'
  | 'workflow'
  | 'eye'
  | 'globe'
  | 'cloud'
  | 'database'
  | 'check'
  | 'scale'
  | 'plot';

/** Concept art variants rendered when an AI image asset is not present on disk. */
export type ConceptArtVariant = 'hero' | DivisionId | IndustryId;

export interface ServiceItem {
  id: string;
  name: string;
  summary: string;
  icon: IconName;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type FaqCategory = 'General' | 'CCTV' | 'Solar' | 'Networking' | 'Digital';

export interface CategorisedFaq extends FaqItem {
  category: FaqCategory;
}

export interface Division {
  id: DivisionId;
  name: string;
  short: string;
  tagline: string;
  /** Secondary English line taken from PPAB's own division collateral, when one exists. */
  subTagline?: string;
  summary: string;
  overview: string;
  icon: IconName;
  href: `/solutions/${DivisionId}`;
  imageId: string;
  services: ServiceItem[];
  /** Additional offerings listed on PPAB's division posters. */
  additionalServices: string[];
  faqs: FaqItem[];
  seo: { title: string; description: string };
}

export interface Industry {
  id: IndustryId;
  name: string;
  icon: IconName;
  audience: string;
  headline: string;
  summary: string;
  tagline?: string;
  needs: string[];
  solutions: { division: DivisionId; services: string[] }[];
  imageId: string;
  seo: { title: string; description: string };
}

export interface NumberedPoint {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  /** Short name for compact UI ("Secure"). */
  short?: string;
  /** Accent colour for this entry's preview in the desktop menu. */
  accent?: string;
  /** A few verified services or divisions shown as chips in the menu preview. */
  chips?: string[];
}

export interface NavItem extends NavLink {
  children?: NavLink[];
}

/**
 * A project may only be published once it has verified, client-approved details and
 * real photography. AI imagery can never be attached to a project record.
 */
export interface Project {
  slug: string;
  title: string;
  division: DivisionId;
  industry: IndustryId;
  /** Omit when the client has not approved publishing the location. */
  location?: string;
  solution: string;
  scope: string[];
  status: 'Completed' | 'In progress';
  summary: string;
  media: { src: string; alt: string; width: number; height: number; source: 'ppab-photography' | 'client-supplied' }[];
  verification: { verifiedBy: string; verifiedOn: string };
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  organisation?: string;
  division?: DivisionId;
  /** Written consent reference; testimonials without consent must not be published. */
  consentReference: string;
  verifiedOn: string;
}
