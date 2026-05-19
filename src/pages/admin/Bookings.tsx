import { useEffect, useState } from 'react';
import { Mail, Phone, Building, Calendar, Clock, Trash2, Briefcase } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { ConfirmDialog } from '../../components/admin';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  notes: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchBookings();
  }, [filter, page]);

  async function fetchBookings() {
    setLoading(true);

    let countQuery = adminDb
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    if (filter !== 'all') {
      countQuery = countQuery.eq('status', filter);
    }

    const { count } = await countQuery;
    setTotalCount(count || 0);

    let query = adminDb
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (data && !error) {
      setBookings(data);
    }
    setLoading(false);
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await adminDb
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchBookings();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await adminDb
      .from('bookings')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast.error('Failed to delete booking');
    } else {
      toast.success('Booking deleted');
      fetchBookings();
    }
    setDeleteId(null);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCreatedAt = (dateString: string) => {
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-oxblood-primary/10 text-oxblood-primary';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = (dateStr: string) => {
    const bookingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const filters = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(0); }}
                className={`px-4 py-2 rounded-md font-medium text-sm capitalize ${
 filter === f
 ? 'bg-oxblood-primary text-white'
 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
 }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood-primary mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {isUpcoming(booking.booking_date) && booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <span className="px-2 py-1 text-xs sm:text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      )}
                    </div>

                    {/* Booking date/time — prominent */}
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <span className="flex items-center gap-1.5 font-medium text-gray-900">
                        <Calendar size={16} className="text-oxblood-primary" />
                        {formatDate(booking.booking_date)}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-gray-900">
                        <Clock size={16} className="text-oxblood-primary" />
                        {booking.booking_time}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {booking.email}
                      </span>
                      {booking.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {booking.phone}
                        </span>
                      )}
                      {booking.company && (
                        <span className="flex items-center gap-1">
                          <Building size={14} />
                          {booking.company}
                        </span>
                      )}
                      {booking.service_interest && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {booking.service_interest}
                        </span>
                      )}
                    </div>

                    {booking.notes && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Submitted {formatCreatedAt(booking.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => { setDeleteId(booking.id); setShowDeleteConfirm(true); }}
                    className="text-red-600 hover:text-red-900 p-1"
                    aria-label="Delete booking"
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
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setShowDeleteConfirm(false); }}
      />
    </div>
  );
}
