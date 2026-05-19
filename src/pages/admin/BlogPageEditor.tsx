import { useEffect, useRef, useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';

export default function BlogPageEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [pageTitle, setPageTitle] = useState('Insights & Ideas');
  const [pageSubtitle, setPageSubtitle] = useState('Practical thinking on HR, business, compliance, and growth — from the team at Adviserve.');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search articles...');
  const [emptyHeading, setEmptyHeading] = useState('No articles found');
  const [emptyBody, setEmptyBody] = useState('Check back soon for new content from the Adviserve team.');
  const [cardReadMore, setCardReadMore] = useState('Read more');

  const [chromeFv, setChromeFv] = useState<Record<string, boolean>>({});

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
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'blog').maybeSingle();

    if (!pageData) {
      const { data: newPage } = await adminDb.from('website_pages').insert({ slug: 'blog', title: 'Blog', is_visible: true }).select('id').single();
      if (newPage) setPageId(newPage.id);
      setLoading(false);
      return;
    }

    setPageId(pageData.id);

    const { data: contents } = await adminDb.from('website_content').select('*').eq('page_id', pageData.id).order('display_order');

    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'blog_page_title': setPageTitle(c.content_value || ''); break;
          case 'blog_page_subtitle': setPageSubtitle(c.content_value || ''); break;
          case 'blog_search_placeholder': setSearchPlaceholder(c.content_value || ''); break;
          case 'blog_empty_heading': setEmptyHeading(c.content_value || ''); break;
          case 'blog_empty_body': setEmptyBody(c.content_value || ''); break;
          case 'blog_card_read_more': setCardReadMore(c.content_value || ''); break;
          case 'blog_chrome_field_visibility': try { setChromeFv(JSON.parse(c.content_value || '{}')); } catch {} break;
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
        upsertContent('blog_page_title', 'Blog Page Title', pageTitle, 1),
        upsertContent('blog_page_subtitle', 'Blog Page Subtitle', pageSubtitle, 2),
        upsertContent('blog_search_placeholder', 'Search Placeholder', searchPlaceholder, 3),
        upsertContent('blog_empty_heading', 'Empty State Heading', emptyHeading, 4),
        upsertContent('blog_empty_body', 'Empty State Body', emptyBody, 5),
        upsertContent('blog_card_read_more', 'Card Read More Label', cardReadMore, 6),
        upsertContent('blog_chrome_field_visibility', 'Chrome Field Visibility', JSON.stringify(chromeFv), 7),
      ]);
      setDirty(false);
      setSuccess('Blog page content saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save content.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleFv = (key: string) => {
    setChromeFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false }));
    setDirty(true);
  };
  const fvIcon = (key: string) => chromeFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

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
          <h1 className="text-2xl font-bold text-gray-900">Blog Page Editor</h1>
          <p className="mt-1 text-gray-600">Edit hero, search, empty state, and card labels</p>
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
                <label className="text-sm font-medium text-gray-700">Title</label>
                <button type="button" onClick={() => toggleFv('title')} className="text-slate-400 hover:text-slate-600">{fvIcon('title')}</button>
              </div>
              <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Subtitle</label>
                <button type="button" onClick={() => toggleFv('subtitle')} className="text-slate-400 hover:text-slate-600">{fvIcon('subtitle')}</button>
              </div>
              <textarea value={pageSubtitle} onChange={(e) => setPageSubtitle(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* UI Labels */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">UI Labels</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Search Placeholder</label>
                <button type="button" onClick={() => toggleFv('search_placeholder')} className="text-slate-400 hover:text-slate-600">{fvIcon('search_placeholder')}</button>
              </div>
              <input type="text" value={searchPlaceholder} onChange={(e) => setSearchPlaceholder(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Card "Read More" Label</label>
                <button type="button" onClick={() => toggleFv('read_more')} className="text-slate-400 hover:text-slate-600">{fvIcon('read_more')}</button>
              </div>
              <input type="text" value={cardReadMore} onChange={(e) => setCardReadMore(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Empty State</h2>
          <p className="text-sm text-gray-500 mb-4">Shown when no articles match the current filter or search.</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <button type="button" onClick={() => toggleFv('empty_heading')} className="text-slate-400 hover:text-slate-600">{fvIcon('empty_heading')}</button>
              </div>
              <input type="text" value={emptyHeading} onChange={(e) => setEmptyHeading(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Body Text</label>
                <button type="button" onClick={() => toggleFv('empty_body')} className="text-slate-400 hover:text-slate-600">{fvIcon('empty_body')}</button>
              </div>
              <textarea value={emptyBody} onChange={(e) => setEmptyBody(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
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
