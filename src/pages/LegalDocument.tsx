import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { sanitizeHTML } from '../lib/sanitize';
import { publicApi } from '../lib/api';
import { FadeUp } from '../components/animations';
import SEOHead from '../components/SEOHead';
import EngineeringHero from '../components/sections/EngineeringHero';

interface LegalDoc {
  id: string;
  slug: string;
  title: string;
  content: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy / fallback-only fields kept optional for the default docs
  // bundled below; the DB-backed payload from /api/legal does not populate
  // them, so all reads must null-check before rendering.
  document_type?: string;
  version?: string;
  effective_date?: string;
}

// IMPORTANT — LEGAL TEMPLATES ONLY.
// The privacy and terms text below is a structural draft per spec §PRIVACY / §TERMS.
// Indian counsel must review and sign off before publication. Placeholders such as
// [date], [address], and [Name, designation, email — to be filled] must be completed
// by the user. Grievance officer details are required by the DPDP Act 2023.
const DEFAULT_LEGAL_DOCS: Record<string, { title: string; content: string }> = {
  privacy: {
    title: 'Privacy Policy',
    content: `
<p><em>Last updated: [date]</em></p>

<h2>1. Who we are</h2>
<p>Adviserve Talent &amp; Consulting Private Limited (CIN U78100BR2026PTC082936), registered office at [address]. Website: adviserve.in.</p>

<h2>2. What personal data we collect</h2>
<p>Name, email, phone, company, role, IP address, browser data, cookies, message content from forms or email.</p>

<h2>3. How we use personal data</h2>
<p>Respond to inquiries, schedule consultations, deliver resources, send newsletters (consent-based), administer accounts, comply with legal obligations, security and fraud prevention.</p>

<h2>4. Legal basis under DPDP Act 2023</h2>
<p>Consent for marketing. Legitimate use for inquiry response, contract performance, legal compliance.</p>

<h2>5. Retention</h2>
<p>Inquiry data: 24 months. Newsletter: until unsubscribe. Customer records: per contractual and statutory requirements.</p>

<h2>6. Sharing</h2>
<p>Sub-processors (hosting, email delivery, analytics — list available on request). No sale of personal data to third parties.</p>

<h2>7. Cross-border transfers</h2>
<p>Data may be processed outside India, subject to DPDP Act safeguards.</p>

<h2>8. Your rights</h2>
<p>Access, correction, erasure, grievance redressal, consent withdrawal. Contact: <a href="mailto:privacy@adviserve.in">privacy@adviserve.in</a>.</p>

<h2>9. Grievance officer</h2>
<p>[Name, designation, email — to be filled].</p>

<h2>10. Security</h2>
<p>ISO/IEC 27001-aligned ISMS. Encryption at rest and in transit, role-based access, audit logs.</p>

<h2>11. Cookies</h2>
<p>[Link to Cookie Policy].</p>

<h2>12. Children</h2>
<p>Services not directed at children under 18.</p>

<h2>13. Changes</h2>
<p>Posted here with revised "last updated" date.</p>

<h2>14. Contact</h2>
<p><a href="mailto:privacy@adviserve.in">privacy@adviserve.in</a></p>
`,
  },
  terms: {
    title: 'Terms of Service',
    content: `
<p><em>Last updated: [date]</em></p>

<h2>1. Acceptance</h2>
<p>Use of adviserve.in constitutes acceptance.</p>

<h2>2. Services</h2>
<p>Information, booking consultations, product trials, newsletter subscription.</p>

<h2>3. Eligibility</h2>
<p>18+. Authority to bind your organisation.</p>

<h2>4. Account and access</h2>
<p>Credentials are your responsibility.</p>

<h2>5. Acceptable use</h2>
<p>No scraping, reverse engineering, unauthorised access, misuse.</p>

<h2>6. Intellectual property</h2>
<p>All content owned by Adviserve. Limited licence to view.</p>

<h2>7. Third-party services</h2>
<p>Their terms govern your use of them.</p>

<h2>8. Disclaimers</h2>
<p>Site provided "as is."</p>

<h2>9. Limitation of liability</h2>
<p>Per applicable Indian law.</p>

<h2>10. Indemnity</h2>
<p>Standard.</p>

<h2>11. Governing law</h2>
<p>India. Courts of [jurisdiction].</p>

<h2>12. Changes</h2>
<p>Posted here with revised "last updated" date.</p>

<h2>13. Contact</h2>
<p><a href="mailto:legal@adviserve.in">legal@adviserve.in</a></p>
`,
  },
};

export default function LegalDocument() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [document, setDocument] = useState<LegalDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingDefault, setUsingDefault] = useState(false);

  const getSlugFromPath = () => {
    const path = location.pathname.replace(/^\//, '');
    return slug || path;
  };

  useEffect(() => {
    const documentSlug = slug || location.pathname.replace(/^\//, '');
    fetchDocument(documentSlug);
  }, [slug, location.pathname]);

  const fetchDocument = async (documentSlug: string) => {
    setLoading(true);
    setUsingDefault(false);
    try {
      const data = await publicApi.getLegalDocument(documentSlug);
      if (data) {
        setDocument(data);
      } else if (DEFAULT_LEGAL_DOCS[documentSlug]) {
        const fallback = DEFAULT_LEGAL_DOCS[documentSlug];
        setDocument({
          id: documentSlug,
          slug: documentSlug,
          document_type: documentSlug,
          title: fallback.title,
          content: fallback.content,
          version: '1.0',
          effective_date: '2026-03-29',
          updated_at: '2026-03-29',
        });
        setUsingDefault(true);
      } else {
        setDocument(null);
      }
    } catch (err) {
      console.error('Error fetching legal document:', err);
      if (DEFAULT_LEGAL_DOCS[documentSlug]) {
        const fallback = DEFAULT_LEGAL_DOCS[documentSlug];
        setDocument({
          id: documentSlug,
          slug: documentSlug,
          document_type: documentSlug,
          title: fallback.title,
          content: fallback.content,
          version: '1.0',
          effective_date: '2026-03-29',
          updated_at: '2026-03-29',
        });
        setUsingDefault(true);
      } else {
        setDocument(null);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-blue/20 border-t-accent-blue"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-[70vh] bg-gray-50/50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-accent-blue/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-accent-blue/40" />
          </div>
          <h1 className="text-2xl font-bold text-brand-navy mb-2">Document Not Found</h1>
          <p className="text-gray-400 text-sm mb-6">The legal document you're looking for doesn't exist or hasn't been published yet.</p>
          <Link to="/" className="text-accent-blue hover:text-accent-blue text-sm font-medium transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <SEOHead
        title={document.title}
        description={`${document.title} for Adviserve — India's trusted HR, recruitment & business advisory partner.`}
        canonical={`https://adviserve.in/${getSlugFromPath()}`}
      />

      {/* Header */}
      <EngineeringHero
        eyebrow="Legal"
        title={document.title}
        sheet="LGL"
        total="07"
        label="LEGAL · DOCUMENT"
        mark="LGL"
      />
      <div className="bg-transparent py-4 px-4 sm:px-6 lg:px-8 hidden">
        <FadeUp className="max-w-4xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-black text-sm font-medium transition-colors mb-6">
            <ArrowLeft className="mr-2" size={14} />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{document.title}</h1>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-black">
            {document.version && !usingDefault && (
              <span>Version {document.version}</span>
            )}
            {document.effective_date && (
              <span>
                Effective {new Date(document.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {!usingDefault && document.updated_at && (
              <span>
                Updated {new Date(document.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
          </div>
        </FadeUp>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-ink-raised rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 lg:p-16">
          <div
            className="prose prose-lg max-w-none text-gray-600 leading-relaxed prose-headings:text-brand-navy prose-a:text-accent-blue prose-strong:text-brand-navy prose-brand"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(document.content) }}
          />
        </div>
      </div>
    </div>
  );
}
