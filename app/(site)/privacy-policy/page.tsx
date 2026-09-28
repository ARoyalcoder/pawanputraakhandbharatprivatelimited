import type { Metadata } from 'next';
import { LegalDocument } from '@/features/legal/LegalDocument';
import { siteConfig } from '@/config/site.config';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${siteConfig.companyName} collects, uses and protects the information you share through this website.`,
  path: '/privacy-policy',
});

const { email, phoneDisplay } = siteConfig.contact;

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      path="/privacy-policy"
      updated="25 September 2026"
      intro={`This policy explains what information ${siteConfig.companyName} ("PPAB", "we") collects through this website and how it is used.`}
      sections={[
        {
          title: 'Information you give us',
          body: [
            'When you submit an enquiry form, we collect the details you enter: typically your name, mobile number, city or area, and information about your requirement. Some forms also ask for an email address or business name.',
            'If you contact us by phone, WhatsApp or email, we receive the information you choose to share in that conversation.',
          ],
        },
        {
          title: 'How we use it',
          body: [
            'We use your information to respond to your enquiry, arrange consultations or site surveys, prepare quotations, and provide the services you ask for.',
            'We do not sell your personal information.',
          ],
        },
        {
          title: 'Website analytics',
          body: [
            'The website records basic usage events, such as which pages are viewed and when a form is submitted, to understand how the site is used. These events are not linked to your name or contact details.',
          ],
        },
        {
          title: 'Sharing',
          body: [
            'Your information is shared only with PPAB staff who need it to handle your enquiry, and with service providers who host and operate this website on our behalf. We may disclose information where required by law.',
          ],
        },
        {
          title: 'Retention',
          body: ['We keep enquiry information for as long as needed to respond to you and to maintain our business records, and then delete it.'],
        },
        {
          title: 'Your choices',
          body: [`You can ask us to access, correct or delete the personal information we hold about you by writing to ${email} or calling ${phoneDisplay}.`],
        },
        {
          title: 'Third-party services',
          body: [
            'Links to WhatsApp and Google Maps take you to services operated by those companies, which have their own privacy policies. Maps on our contact page load only when you choose to show them.',
          ],
        },
        {
          title: 'Changes and contact',
          body: [`We may update this policy from time to time; the date above shows the latest version. Questions about this policy can be sent to ${email}.`],
        },
      ]}
    />
  );
}
