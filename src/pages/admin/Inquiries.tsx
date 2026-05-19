import { useEffect, useState } from 'react';
import { Mail, Phone, Building, Calendar, Trash2 } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { ConfirmDialog } from '../../components/admin';
import toast from 'react-hot-toast';

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchInquiries();
  }, [filter, page]);

  async function fetchInquiries() {
    setLoading(true);

    // Get total count
    let countQuery = adminDb
      .from('contact_inquiries')
      .select('*', { count: 'exact', head: true });

    if (filter !== 'all') {
      countQuery = countQuery.eq('status', filter);
    }

    const { count } = await countQuery;
    setTotalCount(count || 0);

    // Get paginated data
    let query = adminDb
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (data && !error) {
      setInquiries(data);
    }
    setLoading(false);
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await adminDb
      .from('contact_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchInquiries();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await adminDb
      .from('contact_inquiries')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast.error('Failed to delete inquiry');
    } else {
      toast.success('Inquiry deleted');
      fetchInquiries();
    }
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-oxblood-primary/10 text-oxblood-primary';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Inquiries</h1>

        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter('all');
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-md font-medium ${
 filter === 'all'
 ? 'bg-oxblood-primary text-white'
 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
 }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilter('new');
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-md font-medium ${
 filter === 'new'
 ? 'bg-oxblood-primary text-white'
 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
 }`}
              >
                New
              </button>
              <button
                onClick={() => {
                  setFilter('in_progress');
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-md font-medium ${
 filter === 'in_progress'
 ? 'bg-oxblood-primary text-white'
 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
 }`}
              >
                In Progress
              </button>
              <button
                onClick={() => {
                  setFilter('resolved');
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-md font-medium ${
 filter === 'resolved'
 ? 'bg-oxblood-primary text-white'
 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
 }`}
              >
                Resolved
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood-primary mx-auto"></div>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No inquiries found
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
 inquiry.status
 )}`}
                        >
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Mail size={16} />
                          {inquiry.email}
                        </span>
                        {inquiry.phone && (
                          <span className="flex items-center gap-1">
                            <Phone size={16} />
                            {inquiry.phone}
                          </span>
                        )}
                        {inquiry.company && (
                          <span className="flex items-center gap-1">
                            <Building size={16} />
                            {inquiry.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(inquiry.created_at)}
                        </span>
                      </div>
                      {inquiry.service_interest && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Interest:</span>{' '}
                          {inquiry.service_interest}
                        </p>
                      )}
                      <p className="text-gray-700">{inquiry.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => {
                        setDeleteId(inquiry.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-600 hover:text-red-900 p-1"
                      aria-label="Delete inquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {page + 1} of {totalPages} ({totalCount} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-md font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-md font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <ConfirmDialog
          open={showDeleteConfirm}
          title="Delete Inquiry"
          message="Are you sure you want to delete this inquiry? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteId(null);
            setShowDeleteConfirm(false);
          }}
        />
    </div>
  );
}
