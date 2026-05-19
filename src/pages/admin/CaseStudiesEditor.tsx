import { useEffect, useRef, useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';

export default function CaseStudiesEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [heroHeading, setHeroHeading] = useState('Real Results. Real Clients.');
  const [heroSubtitle, setHeroSubtitle] = useState('A selection of engagements where Adviserve delivered measurable impact across recruitment, HR, legal, and consulting.');
  const [ctaHeading, setCtaHeading] = useState('Ready To Write Your Own Case Study?');
  const [ctaBody, setCtaBody] = useState('Let\'s talk about your challenges and build a plan that works.');
  const [ctaPrimaryText, setCtaPrimaryText] = useState('Book a Free Consultation');
  const [ctaPrimaryHref, setCtaPrimaryHref] = useState('/book');
  const [ctaSecondaryText, setCtaSecondaryText] = useState('View Our Services');
  const [ctaSecondaryHref, setCtaSecondaryHref] = useState('/services');

  const [heroFv, setHeroFv] = useState<Record<string, boolean>>({});
  const [ctaFv, setCtaFv] = useState<Record<string, boolean>>({});

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
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'case-studies').maybeSingle();

    if (!pageData) {
      const { data: newPage } = await adminDb.from('website_pages').insert({ slug: 'case-studies', title: 'Case Studies', is_visible: true }).select('id').single();
      if (newPage) setPageId(newPage.id);
      setLoading(false);
      return;
    }

    setPageId(pageData.id);

    const { data: contents } = await adminDb.from('website_content').select('*').eq('page_id', pageData.id).order('display_order');

    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'cs_hero_heading': setHeroHeading(c.content_value || ''); break;
          case 'cs_hero_subtitle': setHeroSubtitle(c.content_value || ''); break;
          case 'cs_cta_heading': setCtaHeading(c.content_value || ''); break;
          case 'cs_cta_body': setCtaBody(c.content_value || ''); break;
          case 'cs_cta_primary_text': setCtaPrimaryText(c.content_value || ''); break;
          case 'cs_cta_primary_href': setCtaPrimaryHref(c.content_value || ''); break;
          case 'cs_cta_secondary_text': setCtaSecondaryText(c.content_value || ''); break;
          case 'cs_cta_secondary_href': setCtaSecondaryHref(c.content_value || ''); break;
          case 'cs_hero_field_visibility': try { setHeroFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'cs_cta_field_visibility': try { setCtaFv(JSON.parse(c.content_value || '{}')); } catch {} break;
        }
      });
    }
    setLoading(false);
  };

  const upsertContent = async (key: string, label: string, value: string, order: number) => {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb.from('website_content').select('id').eq('page_id', pageId).eq('section_key', key).maybeSingle();
    if (selectError) throw selectError;
    if (existing) {
      const { error: writeError } = await adminDb.from('website_content').update({ section_label: label, content_type: 'text', content_value: value, is_visible: true, display_order: order, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (writeError) throw writeError;
    } else {
      const { error: writeError } = await adminDb.from('website_content').insert({ page_id: pageId, section_key: key, section_label: label, content_type: 'text', content_value: value, is_visible: true, display_order: order });
      if (writeError) throw writeError;
    }
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await Promise.all([
        upsertContent('cs_hero_heading', 'Hero Heading', heroHeading, 1),
        upsertContent('cs_hero_subtitle', 'Hero Subtitle', heroSubtitle, 2),
        upsertContent('cs_cta_heading', 'CTA Heading', ctaHeading, 3),
        upsertContent('cs_cta_body', 'CTA Body', ctaBody, 4),
        upsertContent('cs_cta_primary_text', 'CTA Primary Text', ctaPrimaryText, 5),
        upsertContent('cs_cta_primary_href', 'CTA Primary Href', ctaPrimaryHref, 6),
        upsertContent('cs_cta_secondary_text', 'CTA Secondary Text', ctaSecondaryText, 7),
        upsertContent('cs_cta_secondary_href', 'CTA Secondary Href', ctaSecondaryHref, 8),
        upsertContent('cs_hero_field_visibility', 'Hero Field Visibility', JSON.stringify(heroFv), 9),
        upsertContent('cs_cta_field_visibility', 'CTA Field Visibility', JSON.stringify(ctaFv), 10),
      ]);
      setDirty(false);
      setSuccess('Case Studies page content saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save content.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleHeroFv = (key: string) => { setHeroFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleCtaFv = (key: string) => { setCtaFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const heroFvIcon = (key: string) => heroFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;
  const ctaFvIcon = (key: string) => ctaFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

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
          <h1 className="text-2xl font-bold text-gray-900">Case Studies Page Editor</h1>
          <p className="mt-1 text-gray-600">Edit hero and CTA sections</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">{success}</div>}

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>
        {/* Hero */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <button type="button" onClick={() => toggleHeroFv('heading')} className="text-slate-400 hover:text-slate-600">{heroFvIcon('heading')}</button>
              </div>
              <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Subtitle</label>
                <button type="button" onClick={() => toggleHeroFv('subtitle')} className="text-slate-400 hover:text-slate-600">{heroFvIcon('subtitle')}</button>
              </div>
              <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CTA Section</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <button type="button" onClick={() => toggleCtaFv('heading')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('heading')}</button>
              </div>
              <input type="text" value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Body Text</label>
                <button type="button" onClick={() => toggleCtaFv('body')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('body')}</button>
              </div>
              <textarea value={ctaBody} onChange={(e) => setCtaBody(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Primary Button</label>
                  <button type="button" onClick={() => toggleCtaFv('primary_cta')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('primary_cta')}</button>
                </div>
                <input type="text" value={ctaPrimaryText} onChange={(e) => setCtaPrimaryText(e.target.value)} placeholder="Button text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 mb-2" />
                <input type="text" value={ctaPrimaryHref} onChange={(e) => setCtaPrimaryHref(e.target.value)} placeholder="URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Secondary Button</label>
                  <button type="button" onClick={() => toggleCtaFv('secondary_cta')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('secondary_cta')}</button>
                </div>
                <input type="text" value={ctaSecondaryText} onChange={(e) => setCtaSecondaryText(e.target.value)} placeholder="Button text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 mb-2" />
                <input type="text" value={ctaSecondaryHref} onChange={(e) => setCtaSecondaryHref(e.target.value)} placeholder="URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
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
