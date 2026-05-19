import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';

interface DPDPAssessment {
  id: string;
  full_name: string;
  email: string;
  company: string;
  company_size: string | null;
  notes: string | null;
  total_score: number;
  tier: string;
  answers: Record<string, number>;
  gaps: number[];
  submitted_at: string;
}

const TIER_COLORS: Record<string, string> = {
  Critical:   'bg-red-100 text-red-800',
  Developing: 'bg-orange-100 text-orange-800',
  Progressing:'bg-yellow-100 text-yellow-800',
  Ready:      'bg-green-100 text-green-800',
};

const QUESTION_LABELS: Record<number, string> = {
  1:  'Designated DPO / privacy lead',
  2:  'Formal privacy policy',
  3:  'Leadership awareness',
  4:  'Data inventory',
  5:  'Data-flow mapping',
  6:  'Record of Processing (RoPA)',
  7:  'Consent collection',
  8:  'Privacy notices',
  9:  'Data access request process',
  10: 'Erasure / right-to-be-forgotten',
  11: 'Technical safeguards',
  12: 'Breach response plan',
};

const SCORE_LABELS = ['Not started', 'Partial', 'In progress', 'Fully implemented'];

const TIERS = ['', 'Critical', 'Developing', 'Progressing', 'Ready'];
const SIZES = ['', '1-10', '11-50', '51-200', '201-500', '500+'];

export default function DPDPAssessments() {
  const [rows, setRows] = useState<DPDPAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  const fetchRows = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await adminDb
      .from('dpdp_assessments')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (err) { setError(err.message); }
    else { setRows((data as DPDPAssessment[]) || []); }
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const filtered = rows.filter((r) => {
    if (tierFilter && r.tier !== tierFilter) return false;
    if (sizeFilter && r.company_size !== sizeFilter) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ['Submitted', 'Name', 'Email', 'Company', 'Size', 'Score', 'Tier', 'Notes'];
    const csvRows = filtered.map((r) => [
      new Date(r.submitted_at).toISOString().split('T')[0],
      r.full_name,
      r.email,
      r.company,
      r.company_size || '',
      r.total_score,
      r.tier,
      r.notes || '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dpdp-assessments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DPDP Assessments</h1>
          <p className="text-sm text-gray-500 mt-1">Self-assessment submissions from the free DPDP readiness tool.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchRows}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-oxblood-primary border border-oxblood-primary/30 rounded-lg hover:bg-oxblood-hover/5 transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white border border-gray-200 rounded-xl p-4">
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-oxblood-primary"
        >
          {TIERS.map((t) => <option key={t} value={t}>{t || 'All tiers'}</option>)}
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-oxblood-primary"
        >
          {SIZES.map((s) => <option key={s} value={s}>{s || 'All sizes'}</option>)}
        </select>
        {(tierFilter || sizeFilter) && (
          <button
            onClick={() => { setTierFilter(''); setSizeFilter(''); }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-oxblood-primary/20 border-t-oxblood-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No submissions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-[12px] uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-[12px] uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-[12px] uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-[12px] uppercase tracking-wider">Size</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-[12px] uppercase tracking-wider">Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-[12px] uppercase tracking-wider">Tier</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => (
                <>
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                  >
                    <td className="px-4 py-3 text-gray-500 font-mono text-[12px]">
                      {new Date(row.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{row.full_name}</div>
                      <div className="text-[12px] text-gray-400">{row.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.company}</td>
                    <td className="px-4 py-3 text-gray-500">{row.company_size || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-gray-900">{row.total_score}</span>
                      <span className="text-gray-400 text-[11px]">/36</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${TIER_COLORS[row.tier] || 'bg-gray-100 text-gray-700'}`}>
                        {row.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {expanded === row.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                  </tr>
                  {expanded === row.id && (
                    <tr key={`${row.id}-detail`}>
                      <td colSpan={7} className="px-6 py-5 bg-gray-50 border-b border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Answers */}
                          <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Question Scores</h3>
                            <div className="space-y-2">
                              {Object.entries(row.answers).map(([qid, score]) => (
                                <div key={qid} className="flex items-center gap-3">
                                  <div className="flex gap-0.5 flex-shrink-0">
                                    {[0, 1, 2, 3].map((s) => (
                                      <div
                                        key={s}
                                        className={`w-3 h-3 rounded-sm ${s <= score ? 'bg-oxblood-primary' : 'bg-gray-200'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[12px] text-gray-700">{QUESTION_LABELS[Number(qid)] || `Q${qid}`}</span>
                                  <span className="ml-auto text-[11px] text-gray-400">{SCORE_LABELS[score]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Gaps + Notes */}
                          <div className="space-y-4">
                            {row.gaps && row.gaps.length > 0 && (
                              <div>
                                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Top Gaps Identified</h3>
                                <ul className="space-y-1.5">
                                  {row.gaps.map((gid) => (
                                    <li key={gid} className="flex items-start gap-2 text-[12px] text-gray-700">
                                      <span className="text-red-400 font-mono mt-0.5">→</span>
                                      {QUESTION_LABELS[gid] || `Q${gid}`}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {row.notes && (
                              <div>
                                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Notes</h3>
                                <p className="text-[12px] text-gray-600 leading-relaxed">{row.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
