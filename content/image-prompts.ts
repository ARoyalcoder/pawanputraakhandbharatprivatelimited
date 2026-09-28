/**
 * AI conceptual imagery manifest.
 *
 * Every entry is an ILLUSTRATIVE marketing visual. None of these images may be used to
 * depict a real PPAB project, installation, client, property, certification or achievement.
 *
 * Generated files live in public/images/ai/<filename>. Until a file exists on disk, the
 * site renders the matching built-in concept illustration (see components/media/ConceptArt).
 *
 * This module has no imports so tooling can load it directly with Node.
 */

export type AIImageCategory = 'hero' | 'secure' | 'connect' | 'solar' | 'digital' | 'space' | 'industries';

export type AIConceptArt =
  | 'hero'
  | 'secure'
  | 'connect'
  | 'solar'
  | 'digital'
  | 'space'
  | 'residential'
  | 'education'
  | 'healthcare'
  | 'corporate'
  | 'hospitality'
  | 'manufacturing'
  | 'commercial';

export interface AIImageEntry {
  id: string;
  category: AIImageCategory;
  /** Path relative to public/images/ai/ */
  filename: string;
  prompt: string;
  alt: string;
  width: number;
  height: number;
  illustrative: true;
  /** Built-in illustration used until the generated file exists. */
  fallbackArt: AIConceptArt;
}

const STYLE =
  'photorealistic premium commercial photography, cinematic lighting, realistic materials, sophisticated composition, clean background, dark navy and warm gold colour atmosphere, no text, no logos, no watermark, no people facing camera, no distorted hands or faces, realistic equipment';

const entry = (e: Omit<AIImageEntry, 'illustrative'>): AIImageEntry => ({ ...e, illustrative: true });

export const aiImages: AIImageEntry[] = [
  entry({
    id: 'hero-integrated',
    category: 'hero',
    filename: 'hero/integrated-technology.webp',
    prompt: `Premium cinematic corporate technology environment combining modern CCTV security, fiber networking, solar energy, digital technology and contemporary architecture, wide composition, ${STYLE}.`,
    alt: 'Illustrative concept: a modern building combining security cameras, networking, solar panels and digital technology',
    width: 2400,
    height: 1600,
    fallbackArt: 'hero',
  }),
  entry({
    id: 'secure-overview',
    category: 'secure',
    filename: 'secure/security-environment.webp',
    prompt: `Professional modern security monitoring environment with high-end CCTV cameras and surveillance infrastructure, corporate architecture, ${STYLE}.`,
    alt: 'Illustrative concept: modern CCTV cameras mounted on a contemporary building facade',
    width: 1800,
    height: 1350,
    fallbackArt: 'secure',
  }),
  entry({
    id: 'connect-overview',
    category: 'connect',
    filename: 'connect/network-infrastructure.webp',
    prompt: `Premium enterprise fiber networking and server infrastructure, modern networking racks, fiber optic connections, clean corporate technology room, ${STYLE}.`,
    alt: 'Illustrative concept: a clean server rack with organised fiber optic and network cabling',
    width: 1800,
    height: 1350,
    fallbackArt: 'connect',
  }),
  entry({
    id: 'solar-overview',
    category: 'solar',
    filename: 'solar/solar-installation.webp',
    prompt: `Premium modern solar installation on a sophisticated building rooftop, clean solar panels, realistic warm sunlight, architectural composition, ${STYLE}.`,
    alt: 'Illustrative concept: solar panels on the roof of a modern building in warm sunlight',
    width: 1800,
    height: 1350,
    fallbackArt: 'solar',
  }),
  entry({
    id: 'digital-overview',
    category: 'digital',
    filename: 'digital/digital-workspace.webp',
    prompt: `Modern enterprise digital technology workspace showing abstract software dashboards, web application and mobile screens without readable text, ERP and CRM atmosphere, ${STYLE}.`,
    alt: 'Illustrative concept: a modern workspace with laptop and phone screens showing abstract dashboards',
    width: 1800,
    height: 1350,
    fallbackArt: 'digital',
  }),
  entry({
    id: 'space-overview',
    category: 'space',
    filename: 'space/contemporary-architecture.webp',
    prompt: `Contemporary luxury architecture, modern building exterior at dusk, refined architectural materials, premium real-estate photography style, ${STYLE}.`,
    alt: 'Illustrative concept: a contemporary building exterior at dusk with warm interior lighting',
    width: 1800,
    height: 1350,
    fallbackArt: 'space',
  }),
  entry({
    id: 'industry-residential',
    category: 'industries',
    filename: 'industries/residential.webp',
    prompt: `Modern Indian residential villa exterior with discreet security camera, video door phone at the entrance and rooftop solar panels, evening light, ${STYLE}.`,
    alt: 'Illustrative concept: a modern home with a video door phone, security camera and rooftop solar',
    width: 1600,
    height: 1200,
    fallbackArt: 'residential',
  }),
  entry({
    id: 'industry-education',
    category: 'industries',
    filename: 'industries/education.webp',
    prompt: `Modern school or college campus corridor with ceiling dome cameras and wireless access points, bright and orderly, ${STYLE}.`,
    alt: 'Illustrative concept: a bright campus corridor with dome cameras and Wi-Fi access points',
    width: 1600,
    height: 1200,
    fallbackArt: 'education',
  }),
  entry({
    id: 'industry-healthcare',
    category: 'industries',
    filename: 'industries/healthcare.webp',
    prompt: `Modern hospital reception and corridor, calm clean interior, discreet ceiling cameras and network equipment, ${STYLE}.`,
    alt: 'Illustrative concept: a calm, modern hospital corridor with discreet security equipment',
    width: 1600,
    height: 1200,
    fallbackArt: 'healthcare',
  }),
  entry({
    id: 'industry-corporate',
    category: 'industries',
    filename: 'industries/corporate.webp',
    prompt: `Premium corporate office interior with glass meeting rooms, biometric entry terminal and ceiling Wi-Fi access points, ${STYLE}.`,
    alt: 'Illustrative concept: a premium office interior with a biometric entry terminal',
    width: 1600,
    height: 1200,
    fallbackArt: 'corporate',
  }),
  entry({
    id: 'industry-hospitality',
    category: 'industries',
    filename: 'industries/hospitality.webp',
    prompt: `Elegant hotel lobby with warm lighting, refined interior design, discreet security cameras, ${STYLE}.`,
    alt: 'Illustrative concept: an elegant hotel lobby with warm lighting',
    width: 1600,
    height: 1200,
    fallbackArt: 'hospitality',
  }),
  entry({
    id: 'industry-manufacturing',
    category: 'industries',
    filename: 'industries/manufacturing.webp',
    prompt: `Modern clean factory and warehouse exterior with rooftop solar array, perimeter bullet cameras and loading bays, ${STYLE}.`,
    alt: 'Illustrative concept: a modern factory with a rooftop solar array and perimeter cameras',
    width: 1600,
    height: 1200,
    fallbackArt: 'manufacturing',
  }),
  entry({
    id: 'industry-commercial',
    category: 'industries',
    filename: 'industries/commercial.webp',
    prompt: `Premium retail showroom and commercial complex frontage at dusk, glass facade, discreet cameras, ${STYLE}.`,
    alt: 'Illustrative concept: a premium retail showroom frontage at dusk',
    width: 1600,
    height: 1200,
    fallbackArt: 'commercial',
  }),
];

export function getAIImageEntry(id: string): AIImageEntry | undefined {
  return aiImages.find((image) => image.id === id);
}
