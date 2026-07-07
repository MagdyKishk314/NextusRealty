/**
 * Static copy for the legal pages (Privacy Policy + Terms of Service), rendered
 * by views/legal.ejs. Paragraphs may contain inline HTML (e.g. a mailto link),
 * so the view outputs them unescaped — keep the content trusted/author-written.
 *
 * NOTE: standard boilerplate, not legal advice. Have counsel review and adapt
 * (governing state, specific practices) before relying on it in production.
 */

export type LegalSection = { heading: string; paragraphs: string[] };
export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const CONTACT = '<a href="mailto:hello@nextusrealty.com">hello@nextusrealty.com</a>';

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  updated: "July 7, 2026",
  intro:
    'Nextus Realty ("we," "us," or "our") respects your privacy. This policy explains what information we collect through nextusrealty.com, how we use it, and the choices you have.',
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "<strong>Information you give us.</strong> When you submit our contact or lead-request form, we collect the details you provide, such as your name, work email, phone number, market or city, and the lead volume you're interested in.",
        "<strong>Information collected automatically.</strong> Like most websites, we may collect standard technical data such as your IP address, browser type, pages visited, and referring URLs, using cookies and similar technologies.",
      ],
    },
    {
      heading: "How we use your information",
      paragraphs: [
        "We use the information you provide to respond to your inquiry, discuss and deliver our lead-generation services, and follow up about your request. We use automatically collected data to operate, secure, and improve the site.",
      ],
    },
    {
      heading: "How we share information",
      paragraphs: [
        "We do not sell your personal information. We share it only with service providers who help us operate the site and communicate with you (for example, email delivery), and only as needed to provide our services.",
        "We may disclose information if required by law, to enforce our terms, or to protect the rights, property, or safety of Nextus Realty, our clients, or others.",
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "We use cookies and similar technologies to keep the site working, remember preferences, and understand how the site is used. You can control cookies through your browser settings; disabling them may affect some features.",
      ],
    },
    {
      heading: "Data retention",
      paragraphs: [
        "We keep the information you submit for as long as needed to respond to your request and provide our services, and as required to meet legal, accounting, or reporting obligations.",
      ],
    },
    {
      heading: "Your choices and rights",
      paragraphs: [
        `You may request access to, correction of, or deletion of the personal information you've given us, and you may opt out of marketing communications at any time. To make a request, email us at ${CONTACT}.`,
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "We take reasonable measures to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "Children's privacy",
      paragraphs: [
        "Our site and services are intended for businesses and professionals and are not directed to children under 13. We do not knowingly collect personal information from children.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        'We may update this policy from time to time. When we do, we\'ll revise the "last updated" date above. Your continued use of the site means you accept the updated policy.',
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [`Questions about this policy? Email ${CONTACT}.`],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Service",
  updated: "July 7, 2026",
  intro:
    "These Terms of Service (\"Terms\") govern your access to and use of the Nextus Realty website at nextusrealty.com. By using the site, you agree to these Terms. If you do not agree, please do not use the site.",
  sections: [
    {
      heading: "The service",
      paragraphs: [
        "Nextus Realty provides a marketing website and information about our real estate lead-generation services. Any leads or services we provide are subject to a separate agreement between you and Nextus Realty.",
      ],
    },
    {
      heading: "Use of the site",
      paragraphs: [
        "You agree to use the site only for lawful purposes and not to misuse it, including by attempting to gain unauthorized access, disrupt the site, scrape content at scale, or use it in any way that could harm Nextus Realty or others.",
      ],
    },
    {
      heading: "Lead services",
      paragraphs: [
        "Descriptions of our lead services on this site are for general information and are not a guarantee of any particular result, close rate, or return. The specific terms, pricing, and deliverables of any engagement are set out in a separate written agreement.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The site and its content, including text, graphics, logos, and design, are owned by Nextus Realty or its licensors and are protected by law. You may not copy, reproduce, or reuse the content without our prior written permission.",
      ],
    },
    {
      heading: "Disclaimer",
      paragraphs: [
        'The site is provided "as is" and "as available" without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the site will be uninterrupted, error-free, or secure.',
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, Nextus Realty will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising out of your use of the site.",
      ],
    },
    {
      heading: "Third-party links",
      paragraphs: [
        "The site may link to third-party websites we don't control. We are not responsible for the content, policies, or practices of any third-party sites.",
      ],
    },
    {
      heading: "Changes to these Terms",
      paragraphs: [
        'We may update these Terms from time to time. Changes take effect when posted, and we\'ll update the "last updated" date above. Your continued use of the site means you accept the updated Terms.',
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the United States and the state in which Nextus Realty operates, without regard to conflict-of-laws principles.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [`Questions about these Terms? Email ${CONTACT}.`],
    },
  ],
};
