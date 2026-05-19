import { useEffect, useState } from 'react';
import { Plus, Pencil as Edit2, Trash2, Users } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { ConfirmDialog } from '../../components/admin';

interface EmailList {
  id: string;
  name: string;
  description: string | null;
  type: string;
  subscriber_count: number;
  is_active: boolean;
  created_at: string;
}

export default function EmailLists() {
  const [lists, setLists] = useState<EmailList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] = useState<EmailList | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'general',
    is_active: true,
  });

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    const { data, error } = await adminDb
      .from('email_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lists:', error);
    } else {
      setLists(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingList) {
      const { error } = await adminDb
        .from('email_lists')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingList.id);

      if (error) {
        console.error('Error updating list:', error);
        setSubmitting(false);
        return;
      }
    } else {
      const { error } = await adminDb
        .from('email_lists')
        .insert([formData]);

      if (error) {
        console.error('Error creating list:', error);
        setSubmitting(false);
        return;
      }
    }

    setShowForm(false);
    setEditingList(null);
    setSubmitting(false);
    setFormData({
      name: '',
      description: '',
      type: 'general',
      is_active: true,
    });
    fetchLists();
  };

  const handleEdit = (list: EmailList) => {
    setEditingList(list);
    setFormData({
      name: list.name,
      description: list.description || '',
      type: list.type,
      is_active: list.is_active,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb
      .from('email_lists')
      .delete()
      .eq('id', deleteId);

    if (error) {
      console.error('Error deleting list:', error);
    } else {
      fetchLists();
    }
    setDeleteId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingList(null);
    setFormData({
      name: '',
      description: '',
      type: 'general',
      is_active: true,
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Email Lists</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
          >
            <Plus size={20} />
            Create List
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingList ? 'Edit List' : 'Create New List'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  List Name
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                >
                  <option value="general">General</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="marketing">Marketing</option>
                  <option value="customers">Customers</option>
                </select>
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
                  disabled={submitting}
                  className="px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingList ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading lists...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
                <Users className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500">No email lists yet. Create your first list!</p>
              </div>
            ) : (
              lists.map((list) => (
                <div key={list.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-oxblood-primary/10 text-oxblood-primary mt-1">
                        {list.type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(list)}
                        className="text-gray-600 hover:text-oxblood-hover"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteId(list.id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {list.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users size={16} />
                      <span>{list.subscriber_count} subscribers</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
 list.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
 }`}>
                      {list.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <ConfirmDialog
          open={!!deleteId}
          title="Delete List"
          message="Are you sure? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
    </div>
  );
}
