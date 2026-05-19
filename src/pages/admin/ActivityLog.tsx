import { useEffect, useState } from 'react';
import { Activity, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

/* ───── Types ───── */

interface LogEntry {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

const PAGE_SIZE = 20;

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
};

const ACTION_OPTIONS = ['all', 'create', 'update', 'delete'];
const ENTITY_OPTIONS = ['all', 'blog_post', 'service', 'contact_inquiry', 'email_campaign', 'email_template', 'legal_document', 'menu_item', 'site_setting', 'page'];

/* ───── Helper ───── */

function getAuthToken(): string | null {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('sb-') && key.endsWith('-auth-token')) {
        const data = JSON.parse(localStorage.getItem(key) || '');
        return data?.access_token || null;
      }
    }
  } catch {}
  return null;
}

/* ───── Component ───── */

export default function ActivityLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, entityFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    const token = getAuthToken();
    if (!token) { setLoading(false); return; }

    try {
      // Use the admin crud endpoint to query activity_logs
      const body: Record<string, any> = {
        action: 'select',
        table: 'activity_logs',
        options: {
          orderBy: 'created_at',
          ascending: false,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        },
      };

      const filters: Record<string, any> = {};
      if (actionFilter !== 'all') filters.action = actionFilter;
      if (entityFilter !== 'all') filters.entity_type = entityFilter;
      if (Object.keys(filters).length > 0) body.filters = filters;

      const res = await fetch('/api/admin/crud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
        // Get total count for pagination
        const countRes = await fetch('/api/admin/crud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: 'count',
            table: 'activity_logs',
            filters: Object.keys(filters).length > 0 ? filters : undefined,
          }),
        });
        if (countRes.ok) {
          const countData = await countRes.json();
          setTotalCount(countData?.count ?? 0);
        }
      }
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Activity size={22} className="text-oxblood-primary" />
            Activity Log
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track all admin actions across the CMS.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filters:</span>
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Actions' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
        >
          {ENTITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Entities' : opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + j * 15}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      <span className="text-xs">{log.user_email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      <span className="text-xs font-medium">{log.entity_type.replace(/_/g, ' ')}</span>
                      <span className="text-gray-400 text-[10px] ml-1.5">#{log.entity_id.slice(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[300px] truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages} ({totalCount} entries)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
