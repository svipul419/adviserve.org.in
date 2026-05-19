import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';
import { WebsiteAssetsSection } from './sections/WebsiteAssetsSection';
import { WebsitePagesSection } from './sections/WebsitePagesSection';
import { WebsiteContentSection } from './sections/WebsiteContentSection';

interface Page {
  id: string;
  slug: string;
  title: string;
  is_visible: boolean;
  meta_description: string | null;
}

interface Content {
  id: string;
  page_id: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string | null;
  display_order: number;
  is_visible: boolean;
}

interface SiteAssets {
  id: string;
  logo_url: string;
  favicon_url: string;
}

export default function WebsiteManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [siteAssets, setSiteAssets] = useState<SiteAssets | null>(null);
  const [isEditingAssets, setIsEditingAssets] = useState(false);
  const [newContent, setNewContent] = useState({
    section_key: '',
    section_label: '',
    content_type: 'text',
    content_value: '',
    display_order: 0,
    is_visible: true,
  });

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (editingContent) saveContent(editingContent);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  useEffect(() => {
    fetchPages();
    fetchSiteAssets();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchContents(selectedPage.id);
    }
  }, [selectedPage]);

  const fetchPages = async () => {
    const { data, error } = await adminDb
      .from('website_pages')
      .select('*')
      .order('slug');

    if (error) { console.error('Error fetching pages:', error); return; }
    setPages(data || []);
    if (data && data.length > 0 && !selectedPage) {
      setSelectedPage(data[0]);
    }
  };

  const fetchSiteAssets = async () => {
    const { data, error } = await adminDb
      .from('site_assets')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) { console.error('Error fetching site assets:', error); return; }
    setSiteAssets(data);
  };

  const saveSiteAssets = async () => {
    if (!siteAssets) return;
    const { error } = await adminDb
      .from('site_assets')
      .update({ logo_url: siteAssets.logo_url, favicon_url: siteAssets.favicon_url, updated_at: new Date().toISOString() })
      .eq('id', siteAssets.id);

    if (error) { console.error('Error updating site assets:', error); toast.error('Error updating logo and favicon'); return; }
    setIsEditingAssets(false);
    toast.success('Logo and favicon updated successfully!');
  };

  const fetchContents = async (pageId: string) => {
    const { data, error } = await adminDb
      .from('website_content')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order');

    if (error) { console.error('Error fetching contents:', error); return; }
    setContents(data || []);
  };

  const togglePageVisibility = async (page: Page) => {
    const { error } = await adminDb
      .from('website_pages')
      .update({ is_visible: !page.is_visible })
      .eq('id', page.id);

    if (error) { console.error('Error updating page:', error); return; }
    fetchPages();
  };

  const toggleContentVisibility = async (content: Content) => {
    const { error } = await adminDb
      .from('website_content')
      .update({ is_visible: !content.is_visible })
      .eq('id', content.id);

    if (error) { console.error('Error updating content:', error); return; }
    if (selectedPage) fetchContents(selectedPage.id);
  };

  const deleteContent = async (contentId: string) => {
    const { error } = await adminDb
      .from('website_content')
      .delete()
      .eq('id', contentId);

    if (error) { console.error('Error deleting content:', error); return; }
    if (selectedPage) fetchContents(selectedPage.id);
  };

  const saveContent = async (content: Content) => {
    const { error } = await adminDb
      .from('website_content')
      .update({
        section_key: content.section_key,
        section_label: content.section_label,
        content_type: content.content_type,
        content_value: content.content_value,
        display_order: content.display_order,
        is_visible: content.is_visible,
        updated_at: new Date().toISOString(),
      })
      .eq('id', content.id);

    if (error) { console.error('Error updating content:', error); return; }
    setEditingContent(null);
    setDirty(false);
    if (selectedPage) fetchContents(selectedPage.id);
  };

  const addContent = async () => {
    if (!selectedPage || !newContent.section_key || !newContent.section_label) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { error } = await adminDb
      .from('website_content')
      .insert({ page_id: selectedPage.id, ...newContent });

    if (error) { console.error('Error adding content:', error); toast.error('Error adding content. Make sure the section key is unique.'); return; }
    setIsAddingContent(false);
    setDirty(false);
    setNewContent({ section_key: '', section_label: '', content_type: 'text', content_value: '', display_order: 0, is_visible: true });
    fetchContents(selectedPage.id);
  };

  return (
    <div onChangeCapture={() => setDirty(true)}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Website Content Management</h1>

      <WebsiteAssetsSection
        siteAssets={siteAssets}
        setSiteAssets={setSiteAssets}
        isEditingAssets={isEditingAssets}
        setIsEditingAssets={setIsEditingAssets}
        saveSiteAssets={saveSiteAssets}
        fetchSiteAssets={fetchSiteAssets}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <WebsitePagesSection
            pages={pages}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            togglePageVisibility={togglePageVisibility}
          />
        </div>

        <div className="lg:col-span-3">
          <WebsiteContentSection
            selectedPage={selectedPage}
            contents={contents}
            editingContent={editingContent}
            setEditingContent={setEditingContent}
            isAddingContent={isAddingContent}
            setIsAddingContent={setIsAddingContent}
            newContent={newContent}
            setNewContent={setNewContent}
            pendingDeleteId={pendingDeleteId}
            setPendingDeleteId={setPendingDeleteId}
            saveContent={saveContent}
            addContent={addContent}
            deleteContent={deleteContent}
            toggleContentVisibility={toggleContentVisibility}
          />
        </div>
      </div>
    </div>
  );
}
