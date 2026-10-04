import type { Division, IconName } from '@/types/content';

export const secure: Division = {
  id: 'secure',
  name: 'Pawan Putra Secure',
  short: 'Secure',
  tagline: 'Har Nazar Se Suraksha',
  subTagline: 'Smart Technology. Safer Tomorrow.',
  summary:
    'CCTV cameras, video door phones, and biometric attendance systems planned, installed, configured, and maintained for homes, businesses, institutions, and commercial properties.',
  overview:
    'Pawan Putra Secure brings security, surveillance, and access-control solutions together in one integrated system. We begin by understanding your property and security concerns, then recommend the right combination of cameras, recording systems, video door phones, and attendance solutions.\n\nOur team handles installation, configuration, testing, and handover, with ongoing maintenance and AMC support to keep your security systems working reliably.',
  icon: 'cctv',
  href: '/solutions/secure',
  imageId: 'secure-overview',
  services: [
    {
      id: 'cctv-camera',
      name: 'CCTV Camera',
      summary:
        'Camera systems planned around entrances, perimeters and critical areas, with recording and viewing set up the way you use them.',
      icon: 'cctv',
    },
    {
      id: 'video-door-phone',
      name: 'Video Door Phone',
      summary: 'See and speak to visitors before you open the door: for homes, apartments and offices.',
      icon: 'video-door',
    },
    {
      id: 'biometric-attendance',
      name: 'Biometric Attendance',
      summary: 'Fingerprint and face-based attendance systems for offices, schools, factories and institutions.',
      icon: 'fingerprint',
    },
    {
      id: 'installation',
      name: 'Installation',
      summary: 'Site survey, cabling, mounting, configuration and handover, handled by our team.',
      icon: 'wrench',
    },
    {
      id: 'maintenance-amc',
      name: 'Maintenance & AMC',
      summary: 'Scheduled maintenance and annual maintenance contracts to keep your security systems working.',
      icon: 'shield',
    },
  ],
  additionalServices: ['Intercom Systems', 'PA Systems'],
  faqs: [
    {
      id: 'secure-offer',
      question: 'What does Pawan Putra Secure offer?',
      answer:
        'CCTV cameras, video door phones, biometric attendance, installation, and maintenance & AMC. Intercom and PA systems are also available.',
    },
    {
      id: 'secure-install',
      question: 'Do you install the equipment as well?',
      answer:
        'Yes. Installation is part of the Secure offering: site survey, cabling, mounting, configuration and handover.',
    },
    {
      id: 'secure-properties',
      question: 'Which kinds of properties do you cover?',
      answer: 'Residential, commercial, industrial, education and healthcare properties.',
    },
    {
      id: 'secure-amc',
      question: 'Do you offer maintenance after installation?',
      answer:
        'Yes. Maintenance and AMC (Annual Maintenance Contract) are part of Pawan Putra Secure, so your system has support after handover.',
    },
    {
      id: 'secure-quote',
      question: 'How do I get a CCTV quotation?',
      answer:
        'Request a free CCTV site survey with the form on this page, or call or WhatsApp us on +91 87967 16111. We recommend a setup after understanding your property.',
    },
  ],
  seo: {
    title: 'Pawan Putra Secure: CCTV, Video Door Phone & Biometric Attendance',
    description:
      'CCTV cameras, video door phones, biometric attendance, installation and AMC for homes, businesses and institutions. Har Nazar Se Suraksha.',
  },
};

export interface SecureSector {
  id: string;
  name: string;
  description: string;
  icon: IconName;
}

export const cctvSectors: SecureSector[] = [
  {
    id: 'residential',
    name: 'Residential',
    description: 'Homes, villas and housing societies: gates, entrances, parking and common areas.',
    icon: 'home',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Shops, showrooms and offices: counters, entrances, stock areas and after-hours coverage.',
    icon: 'commercial',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Factories and warehouses: perimeters, loading bays, production floors and yards.',
    icon: 'manufacturing',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Schools and colleges: gates, corridors, classrooms, labs and transport areas.',
    icon: 'education',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Hospitals and clinics: entrances, wards, pharmacies and visitor areas.',
    icon: 'healthcare',
  },
];

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
}

export const cctvProducts: ProductCategory[] = [
  { id: 'dome', name: 'Dome Cameras', description: 'Compact, discreet cameras suited to ceilings, corridors and reception areas.' },
  { id: 'bullet', name: 'Bullet Cameras', description: 'Directional cameras for perimeters, gates, parking and outdoor coverage.' },
  { id: 'ptz', name: 'PTZ Cameras', description: 'Pan-tilt-zoom cameras that can be steered to follow activity across wide areas.' },
  { id: 'ip', name: 'IP Cameras', description: 'Network cameras that stream over your LAN, allowing flexible placement.' },
  { id: 'nvr-dvr', name: 'NVR / DVR', description: 'Recorders that store and manage footage from IP (NVR) or analog (DVR) cameras.' },
  { id: 'hdd', name: 'Hard Disk', description: 'Surveillance storage sized to the recording duration you need.' },
  { id: 'poe', name: 'PoE Switches', description: 'Switches that carry power and data to IP cameras over a single cable.' },
  { id: 'accessories', name: 'Networking Accessories', description: 'Cabling, connectors, racks and power accessories that complete the installation.' },
];
