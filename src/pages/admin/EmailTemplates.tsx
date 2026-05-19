import { useEffect, useState } from 'react';
import { Plus, Pencil as Edit2, Trash2, FileText, Eye } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { sanitizeHTML } from '../../lib/sanitize';
import ConfirmDialog from '../../components/ui/confirm-dialog';
import RichTextEditor from '../../components/RichTextEditor';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview_text: string | null;
  html_content: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [useRawHTML, setUseRawHTML] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preview_text: '',
    html_content: '',
    category: 'marketing',
    is_active: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await adminDb
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name.trim()) {
      setError('Template name is required');
      return;
    }

    if (!formData.subject.trim()) {
      setError('Email subject is required');
      return;
    }

    if (!formData.html_content.trim()) {
      setError('Email content is required');
      return;
    }

    if (editingTemplate) {
      const { error } = await adminDb
        .from('email_templates')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingTemplate.id);

      if (error) {
        console.error('Error updating template:', error);
        setError(`Failed to update template: ${error.message}`);
        return;
      }
      setSuccess('Template updated successfully!');
    } else {
      const { error } = await adminDb
        .from('email_templates')
        .insert([{
          ...formData,
        }]);

      if (error) {
        console.error('Error creating template:', error);
        setError(`Failed to create template: ${error.message}`);
        return;
      }
      setSuccess('Template created successfully!');
    }

    setTimeout(() => {
      setShowForm(false);
      setEditingTemplate(null);
      setUseRawHTML(false);
      setFormData({
        name: '',
        subject: '',
        preview_text: '',
        html_content: '',
        category: 'marketing',
        is_active: true,
      });
      setSuccess(null);
    }, 1500);

    fetchTemplates();
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      preview_text: template.preview_text || '',
      html_content: template.html_content,
      category: template.category || 'marketing',
      is_active: template.is_active,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb
      .from('email_templates')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting template:', error);
    } else {
      fetchTemplates();
    }
    setDeleteId(null);
  };

  const handlePreview = (content: string) => {
    setPreviewContent(content);
    setShowPreview(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setUseRawHTML(false);
    setError(null);
    setSuccess(null);
    setFormData({
      name: '',
      subject: '',
      preview_text: '',
      html_content: '',
      category: 'marketing',
      is_active: true,
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
          >
            <Plus size={20} />
            Create Template
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview Text
                </label>
                <input
                  type="text"
                  value={formData.preview_text}
                  onChange={(e) => setFormData({ ...formData, preview_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  placeholder="Text shown in email preview"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                >
                  <option value="marketing">Marketing</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="transactional">Transactional</option>
                  <option value="notification">Notification</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Content
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseRawHTML(!useRawHTML)}
                    className="text-sm text-oxblood-primary hover:text-oxblood-hover/80"
                  >
                    {useRawHTML ? 'Switch to Rich Editor' : 'Switch to Raw HTML'}
                  </button>
                </div>
                {useRawHTML ? (
                  <textarea
                    value={formData.html_content}
                    onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary font-mono text-sm"
                    placeholder="Paste your HTML email template here..."
                  />
                ) : (
                  <RichTextEditor
                    content={formData.html_content}
                    onChange={(content) => setFormData({ ...formData, html_content: content })}
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-oxblood-primary focus:ring-oxblood-primary/30"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
                >
                  {editingTemplate ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => handlePreview(formData.html_content)}
                  className="px-4 py-2 bg-gray-600 text-black rounded-lg hover:bg-gray-700"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading templates...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                      <p>No templates yet. Create your first template!</p>
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{template.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {template.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-oxblood-primary/10 text-oxblood-primary">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
 template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
 }`}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePreview(template.html_content)}
                            className="text-gray-600 hover:text-oxblood-hover"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(template)}
                            className="text-gray-600 hover:text-oxblood-hover"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(template.id)}
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

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Email Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(previewContent) }}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Email Template?"
        description="This template will be permanently removed and cannot be recovered."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
