import { useEffect, useRef, useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';

export default function FooterEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Branding
  const [footerCopyrightName, setFooterCopyrightName] = useState('Adviserve');

  // ISO Certifications (JSON array)
  const [isoCerts, setIsoCerts] = useState([
    { id: 'iso9001', num: '9001', label: 'Quality Management', band: 'QUALITY \u2022 MANAGEMENT \u2022 SYSTEM \u2022 ISO 9001:2026 \u2022 ' },
    { id: 'iso20000', num: '20000', label: 'IT Service Management', band: 'IT \u2022 SERVICE \u2022 MANAGEMENT \u2022 ISO 20000:2026 \u2022 ' },
    { id: 'iso27001', num: '27001', label: 'Information Security', band: 'INFORMATION \u2022 SECURITY \u2022 MGMT \u2022 ISO 27001:2026 \u2022 ' },
  ]);

  // Footer content from website_content
  const [footerPageId, setFooterPageId] = useState<string | null>(null);
  const [footerHeaderContact, setFooterHeaderContact] = useState('Contact');
  const [footerHeaderNavigation, setFooterHeaderNavigation] = useState('Navigation');
  const [footerHeaderSubscribe, setFooterHeaderSubscribe] = useState('Subscribe');
  const [footerHeaderCertifications, setFooterHeaderCertifications] = useState('Certifications');
  const [footerLegalLinks, setFooterLegalLinks] = useState([
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]);

  const [footerFv, setFooterFv] = useState<Record<string, boolean>>({});

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  const handleSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    setLoading(true);
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'footer').maybeSingle();
    if (!pageData) {
      const { data: newPage } = await adminDb.from('website_pages').insert({ slug: 'footer', title: 'Footer', is_visible: true }).select('id').single();
      if (newPage) setFooterPageId(newPage.id);
      setLoading(false);
      return;
    }
    setFooterPageId(pageData.id);
    const { data: contents } = await adminDb.from('website_content').select('section_key, content_value').eq('page_id', pageData.id);
    if (contents) {
      contents.forEach((c: { section_key: string; content_value: string }) => {
        switch (c.section_key) {
          case 'footer_copyright_name': setFooterCopyrightName(c.content_value || ''); break;
          case 'footer_header_contact': setFooterHeaderContact(c.content_value || ''); break;
          case 'footer_header_navigation': setFooterHeaderNavigation(c.content_value || ''); break;
          case 'footer_header_subscribe': setFooterHeaderSubscribe(c.content_value || ''); break;
          case 'footer_header_certifications': setFooterHeaderCertifications(c.content_value || ''); break;
          case 'footer_legal_links': try { setFooterLegalLinks(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'iso_certifications': try { setIsoCerts(JSON.parse(c.content_value || '[]')); } catch {} break;
          case 'footer_field_visibility': try { setFooterFv(JSON.parse(c.content_value || '{}')); } catch {} break;
        }
      });
    }
    setLoading(false);
  };

  const upsertFooterContent = async (sectionKey: string, sectionLabel: string, contentType: string, contentValue: string, displayOrder: number) => {
    if (!footerPageId) return;
    const { data: existing } = await adminDb.from('website_content').select('id').eq('page_id', footerPageId).eq('section_key', sectionKey).maybeSingle();
    if (existing) {
      await adminDb.from('website_content').update({ section_label: sectionLabel, content_type: contentType, content_value: contentValue, is_visible: true, display_order: displayOrder, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await adminDb.from('website_content').insert({ page_id: footerPageId, section_key: sectionKey, section_label: sectionLabel, content_type: contentType, content_value: contentValue, is_visible: true, display_order: displayOrder });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await Promise.all([
        upsertFooterContent('footer_copyright_name', 'Copyright Name', 'text', footerCopyrightName, 14),
        upsertFooterContent('footer_header_contact', 'Footer Header — Contact', 'text', footerHeaderContact, 10),
        upsertFooterContent('footer_header_navigation', 'Footer Header — Navigation', 'text', footerHeaderNavigation, 11),
        upsertFooterContent('footer_header_subscribe', 'Footer Header — Subscribe', 'text', footerHeaderSubscribe, 12),
        upsertFooterContent('footer_header_certifications', 'Footer Header — Certifications', 'text', footerHeaderCertifications, 13),
        upsertFooterContent('footer_legal_links', 'Footer Legal Links', 'json', JSON.stringify(footerLegalLinks), 15),
        upsertFooterContent('iso_certifications', 'ISO Certifications', 'json', JSON.stringify(isoCerts), 20),
        upsertFooterContent('footer_field_visibility', 'Footer Field Visibility', 'json', JSON.stringify(footerFv), 21),
      ]);
      setDirty(false);
      setSuccess('Footer settings saved successfully!');
      toast.success('Footer updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save footer settings.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleFv = (key: string) => { setFooterFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const fvIcon = (key: string) => footerFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-oxblood-primary/20 border-t-oxblood-primary rounded-full animate-spin" />
      <span className="ml-3 text-sm text-gray-400">Loading...</span>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Editor</h1>
          <p className="mt-1 text-gray-600">Edit footer content and visibility</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">{success}</div>}

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>
        {/* Branding */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Branding</h2>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Copyright Name</label>
              <button type="button" onClick={() => toggleFv('copyright_name')} className="text-slate-400 hover:text-slate-600">{fvIcon('copyright_name')}</button>
            </div>
            <input type="text" value={footerCopyrightName} onChange={(e) => setFooterCopyrightName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            <p className="text-xs text-gray-500 mt-1">Displays as "&copy; 2026 [name]. All rights reserved."</p>
          </div>
        </div>

        {/* ─── SECTION HEADERS ─── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Section Headers</h2>
          <p className="text-xs text-gray-400 mb-4">Column titles shown in the live footer (Contact, Navigation, Subscribe, Certifications).</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Contact column header</label>
                <button type="button" onClick={() => toggleFv('contact_header')} className="text-slate-400 hover:text-slate-600">{fvIcon('contact_header')}</button>
              </div>
              <input type="text" value={footerHeaderContact} onChange={e => { setFooterHeaderContact(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Navigation column header</label>
                <button type="button" onClick={() => toggleFv('nav_header')} className="text-slate-400 hover:text-slate-600">{fvIcon('nav_header')}</button>
              </div>
              <input type="text" value={footerHeaderNavigation} onChange={e => { setFooterHeaderNavigation(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Subscribe column header</label>
                <button type="button" onClick={() => toggleFv('subscribe_header')} className="text-slate-400 hover:text-slate-600">{fvIcon('subscribe_header')}</button>
              </div>
              <input type="text" value={footerHeaderSubscribe} onChange={e => { setFooterHeaderSubscribe(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Certifications section header</label>
                <button type="button" onClick={() => toggleFv('certs_header')} className="text-slate-400 hover:text-slate-600">{fvIcon('certs_header')}</button>
              </div>
              <input type="text" value={footerHeaderCertifications} onChange={e => { setFooterHeaderCertifications(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* ─── LEGAL LINKS ─── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900">Legal Links</h2>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => toggleFv('legal_links')} className="text-slate-400 hover:text-slate-600">{fvIcon('legal_links')}</button>
              <button type="button" onClick={() => { setFooterLegalLinks([...footerLegalLinks, { label: '', href: '' }]); setDirty(true); }} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Link</button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Bottom-bar links (Privacy Policy, Terms of Service, etc.)</p>
          {footerLegalLinks.map((link, i) => (
            <div key={i} className="flex gap-3 mb-2">
              <input type="text" value={link.label} onChange={e => { const u = [...footerLegalLinks]; u[i] = { ...u[i], label: e.target.value }; setFooterLegalLinks(u); setDirty(true); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Label" />
              <input type="text" value={link.href} onChange={e => { const u = [...footerLegalLinks]; u[i] = { ...u[i], href: e.target.value }; setFooterLegalLinks(u); setDirty(true); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="/privacy" />
              <button type="button" onClick={() => { setFooterLegalLinks(footerLegalLinks.filter((_, j) => j !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        {/* ─── ISO CERTIFICATIONS ─── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ISO Certifications</h2>
          <p className="text-sm text-gray-500 mb-4">Manage the certification seals shown in the footer.</p>
          <div className="space-y-4">
            {isoCerts.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">ID</label>
                    <input type="text" value={cert.id} onChange={(e) => { const c = [...isoCerts]; c[idx] = { ...c[idx], id: e.target.value }; setIsoCerts(c); setDirty(true); }} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Number</label>
                    <input type="text" value={cert.num} onChange={(e) => { const c = [...isoCerts]; c[idx] = { ...c[idx], num: e.target.value }; setIsoCerts(c); setDirty(true); }} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Label</label>
                    <input type="text" value={cert.label} onChange={(e) => { const c = [...isoCerts]; c[idx] = { ...c[idx], label: e.target.value }; setIsoCerts(c); setDirty(true); }} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                  </div>
                </div>
                <button onClick={() => { setIsoCerts(isoCerts.filter((_, i) => i !== idx)); setDirty(true); }} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => { setIsoCerts([...isoCerts, { id: `iso${Date.now()}`, num: '', label: '', band: '' }]); setDirty(true); }}
              className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80 transition-colors"
            >
              <Plus size={16} /> Add Certification
            </button>
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
