import type { CategorisedFaq, FaqCategory } from '@/types/content';

export const faqCategories: FaqCategory[] = ['General', 'CCTV', 'Solar', 'Networking', 'Digital'];

/** Answers only use information from PPAB's verified collateral and project brief. */
export const faqs: CategorisedFaq[] = [
  {
    id: 'general-what',
    category: 'General',
    question: 'What does Pawan Putra Akhand Bharat do?',
    answer:
      'PPAB provides security, connectivity, solar, digital and infrastructure solutions through five divisions: Pawan Putra Secure, Connect, Solar, Digital and Space.',
  },
  {
    id: 'general-where',
    category: 'General',
    question: 'Where are you located?',
    answer:
      'Our head office is at BCC Tower, Arjunganj, Lucknow, and our branch office is in Palam Extension, Dwarka, New Delhi.',
  },
  {
    id: 'general-multiple',
    category: 'General',
    question: 'Can one company handle several of our requirements?',
    answer:
      'Yes. That is the idea behind PPAB: one trusted partner for security, networking, solar, digital and infrastructure, so you do not have to coordinate separate vendors.',
  },
  {
    id: 'general-consultation',
    category: 'General',
    question: 'How do I book a consultation?',
    answer:
      'Use any form on this website, call +91 87967 16111, or message us on WhatsApp at the same number. Consultations are free.',
  },
  {
    id: 'cctv-types',
    category: 'CCTV',
    question: 'Which CCTV cameras do you work with?',
    answer:
      'Dome, bullet, PTZ and IP cameras, with NVR/DVR recorders, hard disks, PoE switches and networking accessories. We recommend the right combination for your property.',
  },
  {
    id: 'cctv-survey',
    category: 'CCTV',
    question: 'Is the CCTV site survey free?',
    answer: 'Yes. You can request a free CCTV site survey from the CCTV section or the Secure page.',
  },
  {
    id: 'cctv-amc',
    category: 'CCTV',
    question: 'Do you offer CCTV maintenance?',
    answer: 'Yes. Maintenance and AMC are part of Pawan Putra Secure.',
  },
  {
    id: 'solar-types',
    category: 'Solar',
    question: 'What types of solar systems do you install?',
    answer:
      'On-grid, off-grid and hybrid solar systems, as well as solar water pumps and solar street lights, with batteries and inverters as needed.',
  },
  {
    id: 'solar-net-metering',
    category: 'Solar',
    question: 'Do you help with net metering?',
    answer: 'Yes. Net metering support is part of Pawan Putra Solar.',
  },
  {
    id: 'solar-savings',
    category: 'Solar',
    question: 'How much can solar reduce my bill?',
    answer:
      'It depends on your consumption, property and system type, so we do not quote generic figures. Share your monthly bill and our team will assess your requirement.',
  },
  {
    id: 'networking-scope',
    category: 'Networking',
    question: 'What networking work do you take on?',
    answer: 'Fiber networking, LAN/CAN cabling, Wi-Fi, routers, switches, server racks and IT support.',
  },
  {
    id: 'networking-support',
    category: 'Networking',
    question: 'Do you provide IT support after setup?',
    answer: 'Yes. IT support and maintenance are part of Pawan Putra Connect.',
  },
  {
    id: 'digital-scope',
    category: 'Digital',
    question: 'What digital services do you offer?',
    answer:
      'Website, mobile app and software development, ERP, CRM, SEO, Google Ads, Meta Ads, social media marketing, branding and graphic design.',
  },
  {
    id: 'digital-marketing',
    category: 'Digital',
    question: 'Can you market our business after building the website?',
    answer: 'Yes. SEO, Google Ads, Meta Ads and social media marketing are handled by the same Digital team.',
  },
];
