import type { Division } from '@/types/content';

export const digital: Division = {
  id: 'digital',
  name: 'Pawan Putra Digital',
  short: 'Digital',
  tagline: 'Har Business Ki Digital Pehchaan',
  subTagline: 'All you need, under one roof.',
  summary:
    'Websites, mobile apps, software, ERP, CRM, SEO, Google & Meta Ads, social media, branding and graphic design.',
  overview:
    'Pawan Putra Digital gives businesses one team for building, running and growing online. We design and develop websites, apps and custom software, set up ERP and CRM for operations, and drive growth with SEO, Google Ads, Meta Ads and social media, backed by branding and graphic design.',
  icon: 'code',
  href: '/solutions/digital',
  imageId: 'digital-overview',
  services: [
    { id: 'website', name: 'Website Development', summary: 'Fast, responsive business websites designed around your customers and goals.', icon: 'code' },
    { id: 'mobile-app', name: 'Mobile App Development', summary: 'Android and iOS apps for your customers, teams and operations.', icon: 'smartphone' },
    { id: 'software', name: 'Software Development', summary: 'Custom software for workflows that off-the-shelf tools do not fit.', icon: 'software' },
    { id: 'erp', name: 'ERP', summary: 'Connect inventory, accounts, HR and operations in one system.', icon: 'erp' },
    { id: 'crm', name: 'CRM', summary: 'Track leads, customers and follow-ups in one place.', icon: 'crm' },
    { id: 'seo', name: 'SEO', summary: 'Search engine optimisation that helps customers find your business.', icon: 'seo' },
    { id: 'google-ads', name: 'Google Ads', summary: 'Search and display campaigns set up around your business goals.', icon: 'google-ads' },
    { id: 'meta-ads', name: 'Meta Ads', summary: 'Facebook and Instagram advertising aimed at the customers you want.', icon: 'meta-ads' },
    { id: 'smm', name: 'Social Media Marketing', summary: 'Content and campaigns that keep your brand active and consistent.', icon: 'social' },
    { id: 'branding', name: 'Branding', summary: 'Logo, colours, typography and voice, made consistent everywhere.', icon: 'branding' },
    { id: 'graphic-design', name: 'Graphic Designing', summary: 'Creatives for digital and print: posts, brochures, banners and more.', icon: 'design' },
  ],
  additionalServices: [
    'School ERP / School Software',
    'GST Software',
    'Content & Copywriting',
    'Digital Marketing',
    'Email Marketing',
    'WhatsApp Marketing',
    'E-commerce Solutions',
    'Cloud Solutions',
    'Website Maintenance & Support',
    'Analytics & Reporting',
  ],
  faqs: [
    {
      id: 'digital-offer',
      question: 'What does Pawan Putra Digital offer?',
      answer:
        'Website, mobile app and software development; ERP and CRM; SEO, Google Ads, Meta Ads and social media marketing; plus branding and graphic design.',
    },
    {
      id: 'digital-erp',
      question: 'Can you build ERP or CRM for my business?',
      answer: 'Yes. ERP and CRM are part of Pawan Putra Digital, including school ERP and school software.',
    },
    {
      id: 'digital-marketing',
      question: 'Do you also handle marketing after the website is live?',
      answer: 'Yes. SEO, Google Ads, Meta Ads and social media marketing are all handled by the same team.',
    },
    {
      id: 'digital-start',
      question: 'How do we start a project?',
      answer:
        'Tell us about your business and what you want to achieve through the form on this page, or call or WhatsApp +91 87967 16111. We will discuss scope before recommending a solution.',
    },
  ],
  seo: {
    title: 'Pawan Putra Digital: Websites, Apps, Software, ERP, CRM & Marketing',
    description:
      'Website, app and software development, ERP, CRM, SEO, Google Ads, Meta Ads, social media marketing, branding and graphic design. Har Business Ki Digital Pehchaan.',
  },
};

export interface DigitalCluster {
  id: 'build' | 'operate' | 'grow' | 'brand';
  label: string;
  description: string;
  serviceIds: string[];
}

/** How the digital services fit together around a business. */
export const digitalClusters: DigitalCluster[] = [
  { id: 'build', label: 'Build', description: 'Your presence and products online.', serviceIds: ['website', 'mobile-app', 'software'] },
  { id: 'operate', label: 'Operate', description: 'Systems that run the business day to day.', serviceIds: ['erp', 'crm'] },
  { id: 'grow', label: 'Grow', description: 'Reach and win more customers.', serviceIds: ['seo', 'google-ads', 'meta-ads', 'smm'] },
  { id: 'brand', label: 'Brand', description: 'A consistent, recognisable identity.', serviceIds: ['branding', 'graphic-design'] },
];
