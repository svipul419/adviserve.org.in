import { useEffect, useRef, useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import toast from 'react-hot-toast';
import { useUnsavedChanges } from '../../components/admin';
import ConfirmDialog from '../../components/ui/confirm-dialog';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = ['General', 'Services', 'Pricing', 'Process'];

export default function FAQEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Chrome fields
  const [faqHeroHeading, setFaqHeroHeading] = useState('Frequently Asked Questions');
  const [faqHeroIntro, setFaqHeroIntro] = useState('Everything you need to know about working with Adviserve.');
  const [faqSearchPlaceholder, setFaqSearchPlaceholder] = useState('Search questions...');
  const [faqCtaHeading, setFaqCtaHeading] = useState('Still Have Questions?');
  const [faqCtaBody, setFaqCtaBody] = useState('Our team is happy to walk you through anything. Book a free consultation and get straight answers.');
  const [faqCtaPrimaryText, setFaqCtaPrimaryText] = useState('Book a Free Call');
  const [faqCtaPrimaryHref, setFaqCtaPrimaryHref] = useState('/book');
  const [faqCtaSecondaryText, setFaqCtaSecondaryText] = useState('Contact Us');
  const [faqCtaSecondaryHref, setFaqCtaSecondaryHref] = useState('/contact');

  const [chromeFv, setChromeFv] = useState<Record<string, boolean>>({});
  const [ctaFv, setCtaFv] = useState<Record<string, boolean>>({});
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

    const { data: pageData } = await adminDb
      .from('website_pages')
      .select('id')
      .eq('slug', 'faq')
      .maybeSingle();

    let currentPageId: string;

    if (!pageData) {
      const { data: newPage } = await adminDb
        .from('website_pages')
        .insert({ slug: 'faq', title: 'FAQ', is_visible: true })
        .select('id')
        .single();
      if (newPage) {
        currentPageId = newPage.id;
        setPageId(newPage.id);
      } else {
        setLoading(false);
        return;
      }
    } else {
      currentPageId = pageData.id;
      setPageId(pageData.id);
    }

    const { data: contents } = await adminDb
      .from('website_content')
      .select('*')
      .eq('page_id', currentPageId)
      .order('display_order');

    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'faq_items':
            try {
              const parsed = JSON.parse(c.content_value);
              if (Array.isArray(parsed)) {
                setFaqItems(parsed.map((item: FAQItem) => ({ ...item, id: item.id || crypto.randomUUID() })));
              }
            } catch { /* ignore */ }
            break;
          case 'faq_hero_heading': setFaqHeroHeading(c.content_value || ''); break;
          case 'faq_hero_intro': setFaqHeroIntro(c.content_value || ''); break;
          case 'faq_search_placeholder': setFaqSearchPlaceholder(c.content_value || ''); break;
          case 'faq_cta_heading': setFaqCtaHeading(c.content_value || ''); break;
          case 'faq_cta_body': setFaqCtaBody(c.content_value || ''); break;
          case 'faq_cta_primary_text': setFaqCtaPrimaryText(c.content_value || ''); break;
          case 'faq_cta_primary_href': setFaqCtaPrimaryHref(c.content_value || ''); break;
          case 'faq_cta_secondary_text': setFaqCtaSecondaryText(c.content_value || ''); break;
          case 'faq_cta_secondary_href': setFaqCtaSecondaryHref(c.content_value || ''); break;
          case 'faq_chrome_field_visibility': try { setChromeFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'faq_cta_field_visibility': try { setCtaFv(JSON.parse(c.content_value || '{}')); } catch {} break;
        }
      });
    }

    setLoading(false);
  };

  const upsertContent = async (key: string, label: string, type: string, value: string, visible: boolean, order: number) => {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb.from('website_content').select('id').eq('page_id', pageId).eq('section_key', key).maybeSingle();
    if (selectError) throw selectError;
    if (existing) {
      const { error } = await adminDb.from('website_content').update({ section_label: label, content_type: type, content_value: value, is_visible: visible, display_order: order, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await adminDb.from('website_content').insert({ page_id: pageId, section_key: key, section_label: label, content_type: type, content_value: value, is_visible: visible, display_order: order });
      if (error) throw error;
    }
  };

  const handleSave = async () => {
    if (!pageId) return;

    // Validate: no empty questions or answers
    const emptyItems = faqItems.filter(item => !item.question.trim() || !item.answer.trim());
    if (emptyItems.length > 0) {
      toast.error('All FAQ items must have both a question and answer');
      return;
    }

    setSaving(true);

    try {
      await Promise.all([
        upsertContent('faq_items', 'FAQ Items', 'json', JSON.stringify(faqItems), true, 1),
        upsertContent('faq_hero_heading', 'FAQ Hero Heading', 'text', faqHeroHeading, true, 2),
        upsertContent('faq_hero_intro', 'FAQ Hero Intro', 'text', faqHeroIntro, true, 3),
        upsertContent('faq_search_placeholder', 'FAQ Search Placeholder', 'text', faqSearchPlaceholder, true, 4),
        upsertContent('faq_cta_heading', 'FAQ CTA Heading', 'text', faqCtaHeading, true, 5),
        upsertContent('faq_cta_body', 'FAQ CTA Body', 'text', faqCtaBody, true, 6),
        upsertContent('faq_cta_primary_text', 'FAQ CTA Primary Text', 'text', faqCtaPrimaryText, true, 7),
        upsertContent('faq_cta_primary_href', 'FAQ CTA Primary Href', 'text', faqCtaPrimaryHref, true, 8),
        upsertContent('faq_cta_secondary_text', 'FAQ CTA Secondary Text', 'text', faqCtaSecondaryText, true, 9),
        upsertContent('faq_cta_secondary_href', 'FAQ CTA Secondary Href', 'text', faqCtaSecondaryHref, true, 10),
        upsertContent('faq_chrome_field_visibility', 'Chrome Field Visibility', 'json', JSON.stringify(chromeFv), true, 11),
        upsertContent('faq_cta_field_visibility', 'CTA Field Visibility', 'json', JSON.stringify(ctaFv), true, 12),
      ]);
      setDirty(false);
      toast.success('FAQ content saved successfully!');
    } catch {
      toast.error('Failed to save FAQ content. Please try again.');
    }

    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleChromeFv = (key: string) => { setChromeFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleCtaFv = (key: string) => { setCtaFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const cFvIcon = (key: string) => chromeFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;
  const ctaFvIcon = (key: string) => ctaFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqItems];
    updated[index] = { ...updated[index], [field]: value };
    setFaqItems(updated);
    setDirty(true);
  };

  const addItem = () => {
    setFaqItems([...faqItems, { id: crypto.randomUUID(), category: 'General', question: '', answer: '' }]);
    setDirty(true);
  };

  const removeItem = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading FAQ content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Editor</h1>
          <p className="mt-1 text-gray-600">Manage frequently asked questions</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Page Chrome */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Chrome</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Hero Heading</label>
                <button type="button" onClick={() => toggleChromeFv('heading')} className="text-slate-400 hover:text-slate-600">{cFvIcon('heading')}</button>
              </div>
              <input type="text" value={faqHeroHeading} onChange={(e) => { setFaqHeroHeading(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Hero Intro</label>
                <button type="button" onClick={() => toggleChromeFv('intro')} className="text-slate-400 hover:text-slate-600">{cFvIcon('intro')}</button>
              </div>
              <input type="text" value={faqHeroIntro} onChange={(e) => { setFaqHeroIntro(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Search Placeholder</label>
                <button type="button" onClick={() => toggleChromeFv('search')} className="text-slate-400 hover:text-slate-600">{cFvIcon('search')}</button>
              </div>
              <input type="text" value={faqSearchPlaceholder} onChange={(e) => { setFaqSearchPlaceholder(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CTA Section</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <button type="button" onClick={() => toggleCtaFv('heading')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('heading')}</button>
              </div>
              <input type="text" value={faqCtaHeading} onChange={(e) => { setFaqCtaHeading(e.target.value); setDirty(true); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Body Text</label>
                <button type="button" onClick={() => toggleCtaFv('body')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('body')}</button>
              </div>
              <textarea value={faqCtaBody} onChange={(e) => { setFaqCtaBody(e.target.value); setDirty(true); }} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Primary Button</label>
                  <button type="button" onClick={() => toggleCtaFv('primary_cta')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('primary_cta')}</button>
                </div>
                <input type="text" value={faqCtaPrimaryText} onChange={(e) => { setFaqCtaPrimaryText(e.target.value); setDirty(true); }} placeholder="Button text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 mb-2" />
                <input type="text" value={faqCtaPrimaryHref} onChange={(e) => { setFaqCtaPrimaryHref(e.target.value); setDirty(true); }} placeholder="URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Secondary Button</label>
                  <button type="button" onClick={() => toggleCtaFv('secondary_cta')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('secondary_cta')}</button>
                </div>
                <input type="text" value={faqCtaSecondaryText} onChange={(e) => { setFaqCtaSecondaryText(e.target.value); setDirty(true); }} placeholder="Button text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 mb-2" />
                <input type="text" value={faqCtaSecondaryHref} onChange={(e) => { setFaqCtaSecondaryHref(e.target.value); setDirty(true); }} placeholder="URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        {faqItems.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">FAQ #{index + 1}</span>
              <button
                onClick={() => setDeleteIndex(index)}
                className="text-red-500 hover:text-red-700"
                title="Delete FAQ item"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={item.category}
                  onChange={(e) => updateItem(index, 'category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                >
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateItem(index, 'question', e.target.value)}
                  placeholder="Enter the question..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  value={item.answer}
                  onChange={(e) => updateItem(index, 'answer', e.target.value)}
                  placeholder="Enter the answer..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80 font-medium"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {/* Save button at bottom */}
      <div className="flex justify-end pb-8 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Delete FAQ?"
        description="This FAQ will be permanently removed."
        onConfirm={() => {
          if (deleteIndex !== null) {
            removeItem(deleteIndex);
          }
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
}
