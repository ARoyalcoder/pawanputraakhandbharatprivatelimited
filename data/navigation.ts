import type { NavItem, NavLink } from '@/types/content';
import { divisions } from '@/data/divisions';
import { industries } from '@/data/industries';

export const solutionLinks: NavLink[] = divisions.map((d) => ({
  label: d.name,
  href: d.href,
  description: d.tagline,
  icon: d.icon,
}));

export const industryLinks: NavLink[] = industries.map((i) => ({
  label: i.name,
  href: `/industries/${i.id}`,
  description: i.audience,
  icon: i.icon,
}));

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions', children: solutionLinks },
  { label: 'Industries', href: '/industries', children: industryLinks },
  { label: 'Projects', href: '/projects' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About PPAB', href: '/about' },
      { label: 'Why Us', href: '/why-us' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  { title: 'Solutions', links: solutionLinks.map(({ label, href }) => ({ label, href })) },
  { title: 'Industries', links: industryLinks.map(({ label, href }) => ({ label, href })) },
  {
    title: 'Projects',
    links: [
      { label: 'All Projects', href: '/projects' },
      ...divisions.map((d) => ({ label: `${d.short} Projects`, href: `/projects?division=${d.id}` })),
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Get a Quote', href: '/contact#quote' },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
];
