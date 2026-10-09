import { siteConfig } from '@/config/site.config';
import { divisions } from '@/data/divisions';
import { industries } from '@/data/industries';
import { absoluteUrl } from '@/lib/seo/metadata';

export const dynamic = 'force-static';

/** llms.txt (https://llmstxt.org): a plain-text map of the site for AI crawlers, built from the same verified data as the pages. */
export function GET() {
  const lines = [
    `# ${siteConfig.companyName}`,
    '',
    `> ${siteConfig.positioning} ${siteConfig.seoDescription}`,
    '',
    '## Solutions',
    '',
    ...divisions.map(
      (d) => `- [${d.name}](${absoluteUrl(d.href)}): ${d.summary} Services: ${d.services.map((s) => s.name).join(', ')}.`
    ),
    '',
    '## Industries',
    '',
    ...industries.map((i) => `- [${i.name}](${absoluteUrl(`/industries/${i.id}`)}): ${i.audience}. ${i.summary}`),
    '',
    '## Company',
    '',
    `- [About](${absoluteUrl('/about')})`,
    `- [Why Us](${absoluteUrl('/why-us')})`,
    `- [Projects](${absoluteUrl('/projects')})`,
    `- [Blog](${absoluteUrl('/blog')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    '',
    '## Contact',
    '',
    `- Phone and WhatsApp: ${siteConfig.contact.phoneDisplay}`,
    `- Email: ${siteConfig.contact.email}`,
    ...siteConfig.offices.map((o) => `- ${o.type}: ${o.addressLines.join(', ')}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
