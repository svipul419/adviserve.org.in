import { useEffect, useState } from 'react';
import { Plus, Pencil as Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import toast from 'react-hot-toast';

interface Page {
  id: string;
  slug: string;
  title: string;
  is_visible: boolean;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function PageManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    meta_description: '',
    is_visible: true,
  });

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await adminDb
      .from('website_pages')
      .select('*')
      .order('slug');

    if (error) {
      console.error('Error fetching pages:', error);
    } else {
      setPages(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPage) {
      const { error } = await adminDb
        .from('website_pages')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPage.id);

      if (error) {
        console.error('Error updating page:', error);
        toast.error('Failed to save page');
        return;
      }
      toast.success('Page saved');
    } else {
      const { error } = await adminDb
        .from('website_pages')
        .insert([formData]);

      if (error) {
        console.error('Error creating page:', error);
        toast.error('Failed to save page');
        return;
      }
      toast.success('Page saved');
    }

    resetForm();
    fetchPages();
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      meta_description: page.meta_description || '',
      is_visible: page.is_visible,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb
      .from('website_pages')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    } else {
      toast.success('Page deleted');
      fetchPages();
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await adminDb
      .from('website_pages')
      .update({ is_visible: !currentVisibility })
      .eq('id', id);

    if (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
      return;
    }

    fetchPages();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPage(null);
    setFormData({
      slug: '',
      title: '',
      meta_description: '',
      is_visible: true,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80"
        >
          <Plus size={20} />
          Add New Page
        </button>
      </div>

      {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingPage ? 'Edit Page' : 'Create New Page'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const updates: Partial<typeof formData> = { title: newTitle };
                      if (!formData.slug || formData.slug === generateSlug(formData.title)) {
                        updates.slug = generateSlug(newTitle);
                      }
                      setFormData({ ...formData, ...updates });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                    placeholder="about-us"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  placeholder="Brief description for SEO"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">
                  Visible
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80"
                >
                  {editingPage ? 'Update' : 'Create'} Page
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Loading pages...
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No pages found. Create your first page!
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">/{page.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVisibility(page.id, page.is_visible)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {page.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-oxblood-primary hover:text-oxblood-hover/80"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(page.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Page?"
          description="This page will be permanently removed."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
    </div>
  );
}
