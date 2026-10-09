import type { Division, IconName } from '@/types/content';

export const space: Division = {
  id: 'space',
  name: 'Pawan Putra Space',
  short: 'Space',
  tagline: 'Har Space Ka Bharosa',
  summary:
    'Real estate, architecture, interior design, construction and property solutions, from plot to finished space.',
  overview:
    'Pawan Putra Space supports your property journey from start to finish. Whether you are buying, planning, building or renovating, we bring real estate guidance, architecture, construction and interior design together, so the space you finish with matches the one you imagined.',
  icon: 'building',
  href: '/solutions/space',
  imageId: 'space-overview',
  services: [
    { id: 'real-estate', name: 'Real Estate', summary: 'Guidance on buying and selling residential and commercial property.', icon: 'property' },
    { id: 'architecture', name: 'Architecture', summary: 'Architectural planning and design for homes, commercial and institutional buildings.', icon: 'architecture' },
    { id: 'interior-design', name: 'Interior Design', summary: 'Interiors planned around how you live and work: layout, materials, lighting and finish.', icon: 'interior' },
    { id: 'construction', name: 'Construction', summary: 'Construction for residential and commercial projects.', icon: 'construction' },
    { id: 'property-solutions', name: 'Property Solutions', summary: 'Consultation and support for plots, flats, villas and commercial spaces.', icon: 'building' },
  ],
  additionalServices: ['Property Consultant', 'Plot Sale', 'Flat Sale', 'Villa Sale', 'Renovation'],
  faqs: [
    {
      id: 'space-offer',
      question: 'What does Pawan Putra Space cover?',
      answer:
        'Real estate, architecture, interior design, construction and property solutions, including property consultation, plot, flat and villa sale, and renovation.',
    },
    {
      id: 'space-single',
      question: 'Can one team handle design, construction and interiors?',
      answer:
        'Yes. Architecture, construction and interior design are all part of Pawan Putra Space, so the project can move from plan to finished space with one partner.',
    },
    {
      id: 'space-listings',
      question: 'Do you list properties on this website?',
      answer:
        'Not currently. Share what you are looking for through the form on this page and our team will get in touch.',
    },
  ],
  seo: {
    title: 'Pawan Putra Space: Real Estate, Design & Construction',
    description:
      'Real estate, architecture, interior design, construction and property solutions, from plot to finished space. Har Space Ka Bharosa.',
  },
};

export interface SpaceStage {
  id: 'plot' | 'design' | 'construction' | 'interior' | 'finished';
  index: string;
  label: string;
  description: string;
  icon: IconName;
}

export const spaceJourney: SpaceStage[] = [
  { id: 'plot', index: '01', label: 'Plot', description: 'Find or assess the right land, with real estate and property guidance.', icon: 'plot' },
  { id: 'design', index: '02', label: 'Design', description: 'Architectural planning turns your brief into a buildable design.', icon: 'architecture' },
  { id: 'construction', index: '03', label: 'Construction', description: 'The structure is built to the approved design.', icon: 'construction' },
  { id: 'interior', index: '04', label: 'Interior', description: 'Interior design shapes layout, materials, lighting and finish.', icon: 'interior' },
  { id: 'finished', index: '05', label: 'Finished Space', description: 'A space ready to live or work in, delivered by one partner.', icon: 'home' },
];
