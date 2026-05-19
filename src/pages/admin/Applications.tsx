import { useState, useEffect } from 'react';
import { ExternalLink, X, RefreshCw } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';

interface Application {
  id: string;
  job_position_id: string | null;
  applicant_name: string;
  email: string;
  phone: string;
  linkedin_url: string | null;
  resume_url: string;
  cover_message: string | null;
  status: 'new' | 'reviewed' | 'contacted' | 'rejected' | 'hired';
  notes: string | null;
  created_at: string;
  updated_at: string;
  position_title?: string;
}

const STATUS_OPTIONS = ['new', 'reviewed', 'contacted', 'rejected', 'hired'] as const;

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-blue-100 text-blue-800',
  reviewed:  'bg-yellow-100 text-yellow-800',
  contacted: 'bg-purple-100 text-purple-800',
  rejected:  'bg-red-100 text-red-800',
  hired:     'bg-green-100 text-green-800',
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    const [appsResult, positionsResult] = await Promise.all([
      adminDb.from('job_applications').select('*').order('created_at', { ascending: false }),
      adminDb.from('job_positions').select('*'),
    ]);

    if (appsResult.error) {
      setError(appsResult.error.message);
      setLoading(false);
      return;
    }

    const positionMap = new Map<string, string>(
      ((positionsResult.data as Array<{ id: string; title: string }>) || []).map((p) => [p.id, p.title]),
    );

    const apps = ((appsResult.data as Application[]) || []).map((a) => ({
      ...a,
      position_title: a.job_position_id ? (positionMap.get(a.job_position_id) || undefined) : undefined,
    }));

    setApplications(apps);
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

  const selectApp = (app: Application) => {
    setSelected(app);
    setEditNotes(app.notes || '');
    setEditStatus(app.status);
    setSaveMsg('');
  };

  const saveChanges = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveMsg('');

    const { error: saveErr } = await adminDb.from('job_applications')
      .update({ status: editStatus, notes: editNotes, updated_at: new Date().toISOString() })
      .eq('id', selected.id);

    if (saveErr) {
      setSaveMsg('Save failed: ' + saveErr.message);
    } else {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? { ...a, status: editStatus as Application['status'], notes: editNotes }
            : a,
        ),
      );
      setSelected((prev) =>
        prev ? { ...prev, status: editStatus as Application['status'], notes: editNotes } : prev,
      );
      setSaveMsg('Saved.');
    }
    setSaving(false);
  };

  const filtered = statusFilter
    ? applications.filter((a) => a.status === statusFilter)
    : applications;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{applications.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={fetchApplications}
            className="p-2 text-gray-400 hover:text-oxblood-hover rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="flex gap-6 items-start">
        {/* Table */}
        <div className={`flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden min-w-0 ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-oxblood-primary/20 border-t-oxblood-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              {statusFilter ? `No ${statusFilter} applications.` : 'No applications yet.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Applicant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => selectApp(app)}
                    className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
 selected?.id === app.id ? 'bg-oxblood-primary/5' : ''
 }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{app.applicant_name}</div>
                      <div className="text-xs text-gray-400">{app.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {app.position_title || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-96 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-5 self-start">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Application Detail</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close detail panel"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <DetailField label="Name" value={selected.applicant_name} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.phone} />
              {selected.position_title && (
                <DetailField label="Position" value={selected.position_title} />
              )}
              {selected.linkedin_url && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">LinkedIn</p>
                  <a
                    href={selected.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-oxblood-primary flex items-center gap-1 hover:underline"
                  >
                    View Profile <ExternalLink size={12} />
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Resume</p>
                <a
                  href={selected.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-oxblood-primary flex items-center gap-1 hover:underline"
                >
                  Download Resume <ExternalLink size={12} />
                </a>
              </div>
              {selected.cover_message && (
                <DetailField label="Cover Message" value={selected.cover_message} multiline />
              )}
              <DetailField
                label="Applied"
                value={new Date(selected.created_at).toLocaleString()}
              />
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">Internal Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 resize-none"
                  placeholder="Add internal notes…"
                />
              </div>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="w-full py-2 text-sm font-medium bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {saveMsg && (
                <p className={`text-xs text-center ${saveMsg.startsWith('Save failed') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveMsg}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      {multiline ? (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-sm text-gray-700">{value}</p>
      )}
    </div>
  );
}
