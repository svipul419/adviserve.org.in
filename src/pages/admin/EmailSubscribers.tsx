import { useEffect, useState } from 'react';
import { Mail, Download, Upload, Search, Filter, Plus, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import { ConfirmDialog } from '../../components/admin';

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  source: string | null;
  subscribed_at: string;
}

export default function EmailSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSub, setNewSub] = useState({ email: '', first_name: '', last_name: '', company: '' });
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    let query = adminDb
      .from('email_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subscribers:', error);
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, [statusFilter]);

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.first_name && sub.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.last_name && sub.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.company && sub.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'complained': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.email.trim()) { toast.error('Email is required'); return; }
    setAdding(true);
    const { error } = await adminDb.from('email_subscribers').insert([{
      email: newSub.email.trim(),
      first_name: newSub.first_name.trim() || null,
      last_name: newSub.last_name.trim() || null,
      company: newSub.company.trim() || null,
      status: 'active',
      source: 'manual',
      subscribed_at: new Date().toISOString(),
    }]);
    if (error) {
      toast.error(error.message.includes('duplicate') ? 'This email already exists' : 'Failed to add subscriber');
    } else {
      toast.success('Subscriber added');
      setNewSub({ email: '', first_name: '', last_name: '', company: '' });
      setShowAddForm(false);
      fetchSubscribers();
    }
    setAdding(false);
  };

  const handleStatusChange = async (subscriberId: string, newStatus: string) => {
    const { error } = await adminDb
      .from('email_subscribers')
      .update({ status: newStatus })
      .eq('id', subscriberId);
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Status updated to ${newStatus}`);
      fetchSubscribers();
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb.from('email_subscribers').delete().eq('id', deleteId);
    if (!error) {
      toast.success('Subscriber removed');
      fetchSubscribers();
    } else {
      toast.error('Failed to remove subscriber');
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Email Subscribers</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80">
              <Plus size={20} />
              Add Subscriber
            </button>
            <button
              disabled
              title="Coming soon"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg opacity-50 cursor-not-allowed"
            >
              <Upload size={20} />
              Import
            </button>
            <button
              disabled
              title="Coming soon"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg opacity-50 cursor-not-allowed"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add New Subscriber</h2>
              <button onClick={() => setShowAddForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddSubscriber} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input type="email" required placeholder="Email *" value={newSub.email} onChange={(e) => setNewSub({ ...newSub, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input type="text" placeholder="First Name" value={newSub.first_name} onChange={(e) => setNewSub({ ...newSub, first_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input type="text" placeholder="Last Name" value={newSub.last_name} onChange={(e) => setNewSub({ ...newSub, last_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Company" value={newSub.company} onChange={(e) => setNewSub({ ...newSub, company: e.target.value })} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary" />
                  <button type="submit" disabled={adding} className="px-6 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:opacity-50 whitespace-nowrap">
                    {adding ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
              <option value="complained">Complained</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading subscribers...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
                  const safePage = Math.min(page, Math.max(1, totalPages));
                  const paginatedSubscribers = filteredSubscribers.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
                  if (filteredSubscribers.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <Mail className="mx-auto mb-4 text-gray-400" size={48} />
                          <p>No subscribers found</p>
                        </td>
                      </tr>
                    );
                  }
                  return paginatedSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {subscriber.first_name || subscriber.last_name
                              ? `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim()
                              : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{subscriber.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.company || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={subscriber.status}
                          onChange={(e) => handleStatusChange(subscriber.id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 ${getStatusColor(subscriber.status)}`}
                        >
                          <option value="active">active</option>
                          <option value="pending">pending</option>
                          <option value="unsubscribed">unsubscribed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.source || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => setDeleteId(subscriber.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Remove subscriber">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>

            {/* Pagination controls */}
            {(() => {
              const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
              if (totalPages <= 1) return null;
              const safePage = Math.min(page, totalPages);
              return (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                  <span className="text-sm text-gray-700">
                    Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredSubscribers.length)} of {filteredSubscribers.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {safePage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <ConfirmDialog
          open={!!deleteId}
          title="Remove Subscriber"
          message="Are you sure? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
    </div>
  );
}
