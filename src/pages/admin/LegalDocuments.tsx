import { useEffect, useState } from 'react';
import { Plus, Trash2, FileText, Save, X, Eye } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { ConfirmDialog } from '../../components/admin';
import RichTextEditor from '../../components/RichTextEditor';

interface LegalDocument {
  id: string;
  document_type: string;
  title: string;
  slug: string;
  content: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  effective_date: string | null;
  is_current: boolean;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const DOCUMENT_TYPES = [
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'terms_of_service', label: 'Terms of Service' },
  { value: 'data_policy', label: 'Data Policy' },
  { value: 'cookie_policy', label: 'Cookie Policy' },
  { value: 'refund_policy', label: 'Refund Policy' },
  { value: 'disclaimer', label: 'Disclaimer' },
  { value: 'acceptable_use', label: 'Acceptable Use Policy' },
  { value: 'other', label: 'Other' },
];

export default function LegalDocuments() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageError, setPageError] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishDoc, setPublishDoc] = useState<LegalDocument | null>(null);
  const [formData, setFormData] = useState({
    document_type: 'privacy_policy',
    title: '',
    slug: '',
    content: '',
    version: '1.0',
    status: 'draft' as 'draft' | 'published' | 'archived',
    effective_date: '',
    is_current: false,
    meta_description: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, [filterType]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let query = adminDb
        .from('legal_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('document_type', filterType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        setError('Failed to load documents: ' + error.message);
      } else {
        setDocuments(data || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. The legal_documents table may not exist yet.');
      setDocuments([]);
      setPageError(true);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    const dataToSave = {
      ...formData,
      effective_date: formData.effective_date || null,
      meta_description: formData.meta_description || null,
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    };

    if (editingDoc) {
      const { error: updateError } = await adminDb
        .from('legal_documents')
        .update(dataToSave)
        .eq('id', editingDoc.id);

      if (updateError) {
        setError(`Failed to update document: ${updateError.message}`);
        return;
      }

      setSuccess('Document updated successfully!');
    } else {
      const { error: insertError } = await adminDb
        .from('legal_documents')
        .insert([dataToSave]);

      if (insertError) {
        setError(`Failed to create document: ${insertError.message}`);
        return;
      }

      setSuccess('Document created successfully!');
    }

    setTimeout(() => {
      setShowForm(false);
      setEditingDoc(null);
      resetForm();
      setSuccess(null);
      fetchDocuments();
    }, 1500);
  };

  const handleEdit = (doc: LegalDocument) => {
    setEditingDoc(doc);
    setFormData({
      document_type: doc.document_type,
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      version: doc.version,
      status: doc.status,
      effective_date: doc.effective_date || '',
      is_current: doc.is_current,
      meta_description: doc.meta_description || '',
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb
      .from('legal_documents')
      .delete()
      .eq('id', deleteId);

    if (error) {
      setError(`Failed to delete: ${error.message}`);
    } else {
      setSuccess('Document deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      fetchDocuments();
    }
    setDeleteId(null);
  };

  const confirmPublish = async () => {
    if (!publishDoc) return;
    const doc = publishDoc;

    if (doc.is_current) {
      const { error: updateError } = await adminDb
        .from('legal_documents')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', doc.id);

      if (updateError) {
        setError(`Failed to publish: ${updateError.message}`);
        setPublishDoc(null);
        return;
      }
    } else {
      // Set the new one to true first, then unset others — safer if second call fails
      const { error: updateError } = await adminDb
        .from('legal_documents')
        .update({
          status: 'published',
          is_current: true,
          published_at: new Date().toISOString()
        })
        .eq('id', doc.id);

      if (updateError) {
        setError(`Failed to publish: ${updateError.message}`);
        setPublishDoc(null);
        return;
      }

      // Now unset is_current on other docs of the same type
      await adminDb
        .from('legal_documents')
        .update({ is_current: false })
        .eq('document_type', doc.document_type)
        .eq('is_current', true)
        .neq('id', doc.id);
    }

    setSuccess('Document published successfully!');
    setTimeout(() => setSuccess(null), 3000);
    setPublishDoc(null);
    fetchDocuments();
  };

  const resetForm = () => {
    setFormData({
      document_type: 'privacy_policy',
      title: '',
      slug: '',
      content: '',
      version: '1.0',
      status: 'draft',
      effective_date: '',
      is_current: false,
      meta_description: '',
    });
    setError(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  };

  if (pageError) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Legal Documents</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p className="text-amber-800 font-medium mb-2">Unable to load Legal Documents</p>
          <p className="text-amber-600 text-sm mb-4">The legal_documents table may not exist in your database yet. Run the legal documents migration in Supabase to set it up.</p>
          <button onClick={() => { setPageError(false); setLoading(true); fetchDocuments(); }} className="px-4 py-2 bg-oxblood-primary text-black rounded-lg text-sm hover:bg-oxblood-hover/90">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Legal Documents</h1>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
            >
              <option value="all">All Types</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingDoc(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80"
            >
              <Plus size={20} />
              Add Document
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            {success}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingDoc ? 'Edit Document' : 'Create New Document'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select
                    required
                    value={formData.document_type}
                    onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  >
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  placeholder="Privacy Policy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  placeholder="privacy-policy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  rows={2}
                  placeholder="Brief description for search engines"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 mt-7">
                    <input
                      type="checkbox"
                      checked={formData.is_current}
                      onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                      className="rounded border-gray-300 text-oxblood-primary focus:ring-oxblood-primary/30"
                    />
                    <span className="text-sm font-medium text-gray-700">Set as Current Version</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80"
                >
                  <Save size={18} />
                  {editingDoc ? 'Update Document' : 'Create Document'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoc(null);
                    resetForm();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                      <p>No documents yet. Create your first legal document!</p>
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">{doc.title}</div>
                          {doc.is_current && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-oxblood-primary/10 text-oxblood-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">/{doc.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getDocumentTypeLabel(doc.document_type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.version}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.effective_date ? new Date(doc.effective_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {doc.status === 'draft' && (
                            <button
                              onClick={() => setPublishDoc(doc)}
                              className="flex items-center gap-1 px-3 py-1 bg-oxblood-primary text-black text-sm rounded hover:bg-oxblood-hover/80"
                            >
                              <Eye size={14} />
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(doc)}
                            className="px-3 py-1 bg-oxblood-primary text-black text-sm rounded hover:bg-oxblood-hover/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(doc.id)}
                            className="text-gray-600 hover:text-red-600"
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

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Document"
          message="Are you sure? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />

        <ConfirmDialog
          open={!!publishDoc}
          title="Publish Document"
          message="Publish this document? This will make it live on your website."
          onConfirm={confirmPublish}
          onCancel={() => setPublishDoc(null)}
        />
    </div>
  );
}
