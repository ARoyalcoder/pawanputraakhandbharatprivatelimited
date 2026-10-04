import type { IconName } from '@/types/content';

interface ProfilePoint {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

const whyChoosePoints: ProfilePoint[] = [
  { id: 'integrated', icon: 'layers', title: 'Integrated Solutions', description: 'Comprehensive services across Security, Connectivity, Solar, Spaces and Digital Solutions.' },
  { id: 'quality', icon: 'shield', title: 'Quality & Reliability', description: 'Professional execution, dependable products and consistent service standards.' },
  { id: 'customer', icon: 'handshake', title: 'Customer-Centric Approach', description: 'Solutions designed around each client’s specific requirements and budget.' },
  { id: 'expertise', icon: 'settings', title: 'Professional Expertise', description: 'Structured teams and processes covering sales, project execution, installation and support.' },
  { id: 'communication', icon: 'clipboard', title: 'Transparent Communication', description: 'Clear proposals, honest guidance and smooth coordination at every stage.' },
  { id: 'scalable', icon: 'scale', title: 'Flexible & Scalable', description: 'Solutions suitable for individuals, businesses, institutions and large-scale projects.' },
  { id: 'support', icon: 'support', title: 'Long-Term Support', description: 'Continued assistance through maintenance, service and customer support after project completion.' },
];

/** Company profile for the About page, in PPAB's own words as supplied. */
export const companyProfile = {
  whoWeAre: {
    eyebrow: 'Who we are',
    title: 'Built in Bharat.',
    titleAccent: 'Connected to Possibilities.',
    paragraphs: [
      'Pawan Putra Akhand Bharat Pvt. Ltd. is an emerging Indian business solutions company built with a clear purpose — to help businesses, institutions, property developers and individuals access reliable technology, infrastructure and growth solutions under one trusted brand.',
      'We bring together multiple business capabilities across Security, Connectivity, Solar, Digital Solutions and Real Estate & Projects, creating practical solutions that are designed around the real requirements of our customers.',
      'Our approach is simple: understand the requirement, design the right solution, execute it professionally and remain available for support even after the project is completed.',
    ],
    purpose: 'To make reliable technology, professional services and growth-oriented solutions accessible to customers across Bharat.',
  },
  about: {
    eyebrow: 'About us',
    title: 'Building Solutions.',
    titleAccent: 'Creating Growth.',
    paragraphs: [
      'Pawan Putra Akhand Bharat Pvt. Ltd. is a multi-vertical Indian business solutions company delivering trusted services across Security, Connectivity, Solar, Digital Solutions and Real Estate & Projects.',
      'We combine technology, quality and professional service to help businesses, institutions and individuals build safer, smarter and more connected environments.',
    ],
    motto: 'One Vision. Multiple Solutions. Trusted Service.',
  },
  identity: {
    eyebrow: 'Our identity',
    title: 'Who We Are &',
    titleAccent: 'What We Stand For',
    paragraphs: [
      'Pawan Putra Akhand Bharat Pvt. Ltd. is a multi-business solutions company focused on helping businesses, institutions and individuals build safer, smarter and more connected environments. Through our specialized verticals in Security, Connectivity, Solar, Spaces and Digital Solutions, we bring practical technology, reliable services and growth-focused solutions under one trusted brand.',
      'We believe in building long-term relationships through quality, transparency, innovation and dependable service—from the first consultation to installation, support and beyond.',
    ],
    motto: '',
  },
  vision: {
    eyebrow: 'Our vision',
    title: 'Building a Safer, Smarter & More Connected Bharat',
    paragraphs: [
      'Our vision is to build Pawan Putra Akhand Bharat Pvt. Ltd. into a trusted, technology-driven Indian company that delivers dependable solutions across Security, Connectivity, Solar, Digital Services and Real Estate & Projects.',
      'We aspire to create a strong nationwide service network where businesses, institutions, property developers and individuals can access the right technology, infrastructure and professional support through a trusted partner.',
      'As we grow, our focus is to combine innovation with reliability, technology with service, and business growth with long-term customer relationships.',
    ],
  },
  mission: {
    eyebrow: 'Our mission',
    title: 'Empowering Businesses. Driving Growth.',
    paragraphs: [
      'Our mission is to help businesses, institutions and individuals across India grow with the right combination of technology, security, connectivity, energy and digital solutions. We create practical, reliable and scalable solutions that improve everyday operations, strengthen businesses and unlock new opportunities for growth.',
      'From securing spaces and building connected environments to enabling smarter energy and digital transformation, Pawan Putra Akhand Bharat Pvt. Ltd. is committed to creating meaningful value—one solution, one partnership and one success story at a time.',
    ],
  },
  whyChoose: {
    eyebrow: 'Why choose us',
    points: whyChoosePoints,
    closing:
      'We don’t just deliver services—we create dependable solutions that help our customers operate smarter, grow stronger and move forward with confidence.',
  },
};
