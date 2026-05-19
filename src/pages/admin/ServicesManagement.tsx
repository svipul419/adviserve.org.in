import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil as Edit, Trash2, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import RichTextEditor from '../../components/RichTextEditor';
import type { Service } from '../../lib/types';

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Services Page Header Content (saved to website_content for 'services' page) ──
  const [pageId, setPageId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Six practices. One team. Zero handoff headaches.');
  const [pageSubtitle, setPageSubtitle] = useState('Businesses don’t run in silos. Your HR decisions affect your legal exposure. Your IT setup affects how your teams collaborate. Your hiring pace affects your growth. That is why Adviserve covers all of it — connected, coordinated, and under one roof.');
  const [headerSaving, setHeaderSaving] = useState(false);

  const [manualSlugEdit, setManualSlugEdit] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    icon: '',
    meta_title: '',
    meta_description: '',
    is_visible: true,
    sort_order: 0,
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Ctrl+S shortcut to save when form is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (showForm && formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  useEffect(() => {
    fetchServices();
    fetchPageContent();
  }, []);

  // Fetch services page header content from website_content
  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  async function fetchPageContent() {
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'services').maybeSingle();
    if (!pageData) {
      // Create the 'services' page if it doesn't exist
      try {
        const { data: newPage, error: createError } = await adminDb.from('website_pages').insert({ slug: 'services', title: 'Services', is_visible: true }).select('id').single();
        if (createError) throw createError;
        if (newPage) setPageId(newPage.id);
      } catch {
        toast.error('Failed to create services page');
      }
      return;
    }
    setPageId(pageData.id);
    const { data: contents } = await adminDb.from('website_content').select('*').eq('page_id', pageData.id);
    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'services_page_title': setPageTitle(c.content_value || ''); break;
          case 'services_page_subtitle': setPageSubtitle(c.content_value || ''); break;
        }
      });
    }
  }

  async function upsertPageContent(key: string, label: string, value: string) {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb.from('website_content').select('id').eq('page_id', pageId).eq('section_key', key).maybeSingle();
    if (selectError) throw selectError;
    if (existing) {
      const { error: updateError } = await adminDb.from('website_content').update({ section_label: label, content_type: 'text', content_value: value, is_visible: true, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await adminDb.from('website_content').insert({ page_id: pageId, section_key: key, section_label: label, content_type: 'text', content_value: value, is_visible: true, display_order: 1 });
      if (insertError) throw insertError;
    }
  }

  async function savePageHeader() {
    setHeaderSaving(true);
    try {
      await Promise.all([
        upsertPageContent('services_page_title', 'Services Page Title', pageTitle),
        upsertPageContent('services_page_subtitle', 'Services Page Subtitle', pageSubtitle),
      ]);
      toast.success('Page header saved');
    } catch {
      toast.error('Failed to save page header');
    }
    setHeaderSaving(false);
  }

  async function fetchServices() {
    const { data, error } = await adminDb
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data && !error) {
      setServices(data);
    } else if (error) {
      toast.error('Failed to load services');
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingService) {
      const { error } = await adminDb
        .from('services')
        .update(formData)
        .eq('id', editingService.id);

      if (!error) {
        toast.success('Service updated successfully');
        fetchServices();
        resetForm();
      } else {
        toast.error('Failed to update service');
      }
    } else {
      const { error } = await adminDb.from('services').insert([formData]);

      if (!error) {
        toast.success('Service created successfully');
        fetchServices();
        resetForm();
      } else {
        toast.error('Failed to create service');
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description || '',
      content: service.content || '',
      icon: service.icon || '',
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      is_visible: service.is_visible ?? true,
      sort_order: service.sort_order || 0,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb.from('services').delete().eq('id', deleteId);
    if (!error) {
      toast.success('Service deleted');
      fetchServices();
    } else {
      toast.error('Failed to delete service');
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await adminDb
      .from('services')
      .update({ is_visible: !currentVisibility })
      .eq('id', id);

    if (!error) {
      toast.success(currentVisibility ? 'Service hidden' : 'Service visible');
      fetchServices();
    } else {
      toast.error('Failed to update visibility');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingService(null);
    setManualSlugEdit(false);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      icon: '',
      meta_title: '',
      meta_description: '',
      is_visible: true,
      sort_order: 0,
    });
  };

  return (
    <div>
      {/* ── Services Page Header Editor ── */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Services Page Header</h2>
            <p className="text-sm text-gray-500 mt-1">This content appears at the top of the public /services page</p>
          </div>
          <button onClick={savePageHeader} disabled={headerSaving} className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 text-sm font-medium">
            <Save size={16} />
            {headerSaving ? 'Saving...' : 'Save Header'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" placeholder="Six practices. One team. Zero handoff headaches." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
            <textarea rows={3} value={pageSubtitle} onChange={(e) => setPageSubtitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" placeholder="Businesses don't run in silos..." />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-oxblood-primary text-black px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title,
                        ...((!manualSlugEdit && !editingService) ? { slug: autoSlug(title) } : {}),
                      }));
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
                    onChange={(e) => { setManualSlugEdit(true); setFormData({ ...formData, slug: e.target.value }); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900">SEO Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="Leave empty to use service title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Brief description for search engines"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visible
                  </label>
                  <select
                    value={formData.is_visible ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({ ...formData, is_visible: e.target.value === 'true' })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-oxblood-primary text-black px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80"
                >
                  {editingService ? 'Update' : 'Create'} Service
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

        <div className="bg-white rounded-xl shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood-primary mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        No services yet. Click &quot;Add Service&quot; to create your first one.
                      </td>
                    </tr>
                  ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{service.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {service.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{service.slug}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {service.sort_order}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
 service.is_visible
 ? 'bg-green-100 text-green-800'
 : 'bg-gray-100 text-gray-800'
 }`}
                        >
                          {service.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleVisibility(service.id, service.is_visible ?? false)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label={service.is_visible ? 'Hide service' : 'Show service'}
                          >
                            {service.is_visible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-oxblood-primary hover:text-oxblood-hover/80"
                            aria-label="Edit service"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(service.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Delete service"
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
          )}
        </div>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Service?"
          description="This service and all its content will be permanently removed."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
    </div>
  );
}
