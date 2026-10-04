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
    subtitle: 'Share What You Need',
    description: 'Call, WhatsApp, or submit the enquiry form. Tell us about your requirement, location, and goals.',
    icon: 'phone',
  },
  {
    id: 'consultation',
    index: '02',
    title: 'Consultation & Site Survey',
    subtitle: 'Understand Your Needs',
    description: 'We discuss your requirements and, when needed, conduct a site visit to understand the location and recommend the right approach.',
    icon: 'map-pin',
  },
  {
    id: 'quotation',
    index: '03',
    title: 'Solution & Quotation',
    subtitle: 'Get a Clear Proposal',
    description: 'We prepare a practical solution based on your needs, along with a transparent quotation and scope of work.',
    icon: 'clipboard',
  },
  {
    id: 'implementation',
    index: '04',
    title: 'Installation & Implementation',
    subtitle: 'We Put the Solution in Place',
    description: 'Our team installs, configures, or implements the agreed solution with proper attention to quality and execution.',
    icon: 'wrench',
  },
  {
    id: 'handover',
    index: '05',
    title: 'Testing & Handover',
    subtitle: 'Ready to Use',
    description: 'We test the system, explain its operation, complete the necessary checks, and hand it over to you.',
    icon: 'check',
  },
  {
    id: 'support',
    index: '06',
    title: 'Support & AMC',
    subtitle: "We're There After Installation",
    description: 'Get ongoing technical support, maintenance, and AMC options to help keep your systems reliable and performing well.',
    icon: 'support',
  },
];

export const aboutPillars: { id: string; title: string; subtitle?: string; description: string }[] = [
  {
    id: 'integrated',
    title: 'Integrated by Design',
    subtitle: 'Solutions Planned to Work Together',
    description:
      'Cameras need reliable networks, networks need dependable power, and businesses need both physical and digital infrastructure. PPAB plans these requirements together for better coordination and performance.',
  },
  {
    id: 'one-contact',
    title: 'One Point of Contact',
    subtitle: 'One Team. One Clear Communication.',
    description:
      'Instead of managing multiple vendors for different services, you have one PPAB team that understands your complete requirement and coordinates the solution from start to finish.',
  },
  {
    id: 'lifecycle',
    title: 'From Survey to Support',
    subtitle: 'Complete Support Throughout the Journey',
    description:
      'From consultation and site survey to installation, implementation, testing, handover, and ongoing maintenance, PPAB stays involved throughout the complete project lifecycle.',
  },
];
