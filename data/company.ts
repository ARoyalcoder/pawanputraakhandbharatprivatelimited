import type { IconName, NumberedPoint } from '@/types/content';

export const serviceTicker = ['CCTV', 'Networking', 'Solar', 'Digital', 'IT', 'Infrastructure'];

export const heroBadges = serviceTicker;

export const trustPillars: { id: string; title: string; description: string; icon: IconName }[] = [
  { id: 'solutions', title: 'Professional Solutions', description: 'Recommendations shaped around your site and requirement.', icon: 'layers' },
  { id: 'process', title: 'Transparent Process', description: 'Clear scope and quotation before any work begins.', icon: 'clipboard' },
  { id: 'installation', title: 'Installation Support', description: 'Our team installs, configures and hands over.', icon: 'wrench' },
  { id: 'after-sales', title: 'After-Sales Service', description: 'Maintenance, AMC and support after go-live.', icon: 'support' },
];

export const whyUs: NumberedPoint[] = [
  {
    id: 'one-partner',
    index: '01',
    title: 'One Partner, Multiple Solutions',
    description:
      'Security, networking, solar, digital and infrastructure from one company, with fewer vendors to coordinate and one point of accountability.',
    icon: 'handshake',
  },
  {
    id: 'execution',
    index: '02',
    title: 'Professional Execution',
    description:
      'Every requirement follows a defined path: understand, survey, plan, implement, test and hand over.',
    icon: 'settings',
  },
  {
    id: 'transparent',
    index: '03',
    title: 'Transparent Process',
    description: 'You receive a clear solution and quotation before work begins, so you know exactly what you are getting.',
    icon: 'clipboard',
  },
  {
    id: 'after-sales',
    index: '04',
    title: 'After-Sales Support',
    description: 'Maintenance, AMC and IT support options continue after installation, not just until handover.',
    icon: 'support',
  },
  {
    id: 'scalable',
    index: '05',
    title: 'Scalable Solutions',
    description: 'Solutions sized for a single home, a growing business or a multi-site institution, and ready to expand.',
    icon: 'scale',
  },
];

export const whyChooseUsHome: NumberedPoint[] = [
  {
    id: 'integrated',
    index: '01',
    title: 'Integrated Solutions',
    description: 'Comprehensive services across Security, Connectivity, Solar, Spaces and Digital Solutions.',
    icon: 'layers',
  },
  {
    id: 'quality',
    index: '02',
    title: 'Quality & Reliability',
    description: 'Professional execution, dependable products and consistent service standards.',
    icon: 'check',
  },
  {
    id: 'customer',
    index: '03',
    title: 'Customer-Centric Approach',
    description: 'Solutions designed around each client’s specific requirements and budget.',
    icon: 'handshake',
  },
  {
    id: 'expertise',
    index: '04',
    title: 'Professional Expertise',
    description: 'Structured teams and processes covering sales, project execution, installation and support.',
    icon: 'settings',
  },
  {
    id: 'communication',
    index: '05',
    title: 'Transparent Communication',
    description: 'Clear proposals, honest guidance and smooth coordination at every stage.',
    icon: 'clipboard',
  },
  {
    id: 'scalable',
    index: '06',
    title: 'Flexible & Scalable',
    description: 'Solutions suitable for individuals, businesses, institutions and large-scale projects.',
    icon: 'scale',
  },
  {
    id: 'support',
    index: '07',
    title: 'Long-Term Support',
    description: 'Continued assistance through maintenance, service and customer support after project completion.',
    icon: 'support',
  },
];

export const processSteps: NumberedPoint[] = [
  {
    id: 'requirement',
    index: '01',
    title: 'Tell Us Your Requirement',
    description: 'Call, WhatsApp or send the form. Tell us what you need and where.',
    icon: 'phone',
  },
  {
    id: 'consultation',
    index: '02',
    title: 'Free Consultation / Site Survey',
    description: 'We discuss your needs and, where required, visit the site to understand it properly.',
    icon: 'map-pin',
  },
  {
    id: 'quotation',
    index: '03',
    title: 'Solution & Quotation',
    description: 'You receive a recommended solution with a clear quotation.',
    icon: 'clipboard',
  },
  {
    id: 'implementation',
    index: '04',
    title: 'Installation / Implementation',
    description: 'Our team installs the equipment or builds the solution as agreed.',
    icon: 'wrench',
  },
  {
    id: 'handover',
    index: '05',
    title: 'Testing & Handover',
    description: 'Everything is tested, explained and handed over to you.',
    icon: 'check',
  },
  {
    id: 'support',
    index: '06',
    title: 'Support & AMC',
    description: 'Ongoing support and annual maintenance options keep things running.',
    icon: 'support',
  },
];

export const aboutPillars: { id: string; title: string; description: string }[] = [
  {
    id: 'integrated',
    title: 'Integrated by design',
    description:
      'Cameras need networks, networks need power, and businesses need both online and offline infrastructure. PPAB plans them together.',
  },
  {
    id: 'one-contact',
    title: 'One point of contact',
    description: 'One team understands your full requirement, instead of several vendors each seeing one part of it.',
  },
  {
    id: 'lifecycle',
    title: 'From survey to support',
    description: 'Consultation, installation or implementation, handover, and maintenance: the whole lifecycle, handled.',
  },
];
