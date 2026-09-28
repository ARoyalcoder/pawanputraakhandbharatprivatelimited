import type { Metadata } from 'next';
import { LegalDocument } from '@/features/legal/LegalDocument';
import { siteConfig } from '@/config/site.config';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: `Terms for using the ${siteConfig.companyName} website.`,
  path: '/terms-conditions',
});

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      path="/terms-conditions"
      updated="25 September 2026"
      intro={`These terms apply to your use of the ${siteConfig.companyName} website. By using the website, you agree to them.`}
      sections={[
        {
          title: 'Information on this website',
          body: [
            'The content on this website is general information about PPAB and its services. It is not a quotation or an offer, and service scope, pricing and timelines are confirmed only in a written quotation or agreement.',
          ],
        },
        {
          title: 'Illustrative imagery',
          body: [
            'Some images on this website are illustrative concepts created for design purposes. They do not depict specific PPAB projects, clients or installations. Project case studies, when published, use real photographs approved by the client.',
          ],
        },
        {
          title: 'Enquiries',
          body: [
            'When you submit an enquiry, you confirm that the details you provide are accurate and that you are happy for PPAB to contact you about your requirement.',
          ],
        },
        {
          title: 'Services and quotations',
          body: [
            'Any services we provide are governed by the quotation, agreement or invoice issued for that work, including its terms on scope, payment, warranty and maintenance.',
          ],
        },
        {
          title: 'Intellectual property',
          body: ['The PPAB name, logo and website content belong to PPAB and may not be copied or used without permission.'],
        },
        {
          title: 'Links to other websites',
          body: ['Links to third-party websites are provided for convenience. PPAB is not responsible for their content or practices.'],
        },
        {
          title: 'Liability',
          body: [
            'We work to keep this website accurate and available, but we do not guarantee that it will be error-free or uninterrupted. To the extent permitted by law, PPAB is not liable for losses arising from use of the website.',
          ],
        },
        {
          title: 'Governing law and contact',
          body: [`These terms are governed by the laws of India. Questions about these terms can be sent to ${siteConfig.contact.email}.`],
        },
      ]}
    />
  );
}
