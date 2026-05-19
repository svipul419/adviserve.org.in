import { useEffect, useState } from 'react';
import { Plus, Pencil as Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import ConfirmDialog from '../../components/ui/confirm-dialog';

const INPUT = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary";
const LABEL = "block text-sm font-medium text-gray-700 mb-2";
const BTN = "bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80";

interface WorkSection { practice: string; actions: string[]; }
interface Result { metric: string; before: string; after: string; }

const EMPTY_FORM = {
  title: '', slug: '', industry: '', timeline: '', client_name: '',
  client_description: '', challenge: '',
  practices: [] as string[],
  work_sections: [] as WorkSection[],
  results: [] as Result[],
  integration_quote: '',
  seo_title: '', seo_description: '',
  is_visible: true, sort_order: 0,
};

export default function CaseStudiesManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data, error } = await adminDb.from('case_studies').select('*').order('sort_order', { ascending: true });
    if (data && !error) setItems(data);
    else if (error) toast.error('Failed to load case studies');
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (editingItem) {
      const { error } = await adminDb.from('case_studies').update(payload).eq('id', editingItem.id);
      if (!error) { toast.success('Case study updated'); fetchItems(); resetForm(); }
      else toast.error('Failed to update');
    } else {
      const { error } = await adminDb.from('case_studies').insert([payload]);
      if (!error) { toast.success('Case study created'); fetchItems(); resetForm(); }
      else toast.error('Failed to create');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    const parse = (v: any) => typeof v === 'string' ? JSON.parse(v) : v || [];
    setFormData({
      title: item.title || '', slug: item.slug || '', industry: item.industry || '',
      timeline: item.timeline || '', client_name: item.client_name || '',
      client_description: item.client_description || '', challenge: item.challenge || '',
      practices: parse(item.practices), work_sections: parse(item.work_sections),
      results: parse(item.results), integration_quote: item.integration_quote || '',
      seo_title: item.seo_title || '', seo_description: item.seo_description || '',
      is_visible: item.is_visible ?? true, sort_order: item.sort_order || 0,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb.from('case_studies').delete().eq('id', deleteId);
    if (!error) { toast.success('Deleted'); fetchItems(); } else toast.error('Failed to delete');
    setDeleteId(null);
  };

  const toggleVisibility = async (id: string, vis: boolean) => {
    const { error } = await adminDb.from('case_studies').update({ is_visible: !vis }).eq('id', id);
    if (!error) { toast.success(vis ? 'Hidden' : 'Visible'); fetchItems(); }
  };

  const resetForm = () => { setShowForm(false); setEditingItem(null); setManualSlugEdit(false); setFormData(EMPTY_FORM); };
  const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const set = (k: string, v: any) => setFormData(prev => ({ ...prev, [k]: v }));

  const addPractice = () => set('practices', [...formData.practices, '']);
  const removePractice = (i: number) => set('practices', formData.practices.filter((_, idx) => idx !== i));
  const updatePractice = (i: number, v: string) => set('practices', formData.practices.map((p, idx) => idx === i ? v : p));

  const addWorkSection = () => set('work_sections', [...formData.work_sections, { practice: '', actions: [''] }]);
  const removeWorkSection = (i: number) => set('work_sections', formData.work_sections.filter((_, idx) => idx !== i));
  const updateWorkPractice = (i: number, v: string) => set('work_sections', formData.work_sections.map((w, idx) => idx === i ? { ...w, practice: v } : w));
  const addWorkAction = (wi: number) => { const ws = [...formData.work_sections]; ws[wi] = { ...ws[wi], actions: [...ws[wi].actions, ''] }; set('work_sections', ws); };
  const removeWorkAction = (wi: number, ai: number) => { const ws = [...formData.work_sections]; ws[wi] = { ...ws[wi], actions: ws[wi].actions.filter((_: string, idx: number) => idx !== ai) }; set('work_sections', ws); };
  const updateWorkAction = (wi: number, ai: number, v: string) => { const ws = [...formData.work_sections]; ws[wi] = { ...ws[wi], actions: ws[wi].actions.map((a: string, idx: number) => idx === ai ? v : a) }; set('work_sections', ws); };

  const addResult = () => set('results', [...formData.results, { metric: '', before: '', after: '' }]);
  const removeResult = (i: number) => set('results', formData.results.filter((_, idx) => idx !== i));
  const updateResult = (i: number, field: string, v: string) => set('results', formData.results.map((r, idx) => idx === i ? { ...r, [field]: v } : r));

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-oxblood-primary/20 border-t-oxblood-primary rounded-full animate-spin" />
      <span className="ml-3 text-sm text-gray-400">Loading...</span>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Case Studies Management</h1>
        <button onClick={() => setShowForm(!showForm)} className={`${BTN} flex items-center gap-2`}>
          <Plus size={20} /> Add Case Study
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{editingItem ? 'Edit Case Study' : 'Add New Case Study'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={LABEL}>Title *</label><input type="text" required value={formData.title} onChange={e => { set('title', e.target.value); if (!manualSlugEdit && !editingItem) set('slug', autoSlug(e.target.value)); }} className={INPUT} /></div>
              <div><label className={LABEL}>Slug *</label><input type="text" required value={formData.slug} onChange={e => { setManualSlugEdit(true); set('slug', e.target.value); }} className={INPUT} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={LABEL}>Industry</label><input type="text" value={formData.industry} onChange={e => set('industry', e.target.value)} className={INPUT} placeholder="e.g. Fintech" /></div>
              <div><label className={LABEL}>Timeline</label><input type="text" value={formData.timeline} onChange={e => set('timeline', e.target.value)} className={INPUT} placeholder="e.g. 90 days" /></div>
              <div><label className={LABEL}>Client Name</label><input type="text" value={formData.client_name} onChange={e => set('client_name', e.target.value)} className={INPUT} /></div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">Client & Challenge</h3>
              <div><label className={LABEL}>Client Description</label><textarea rows={3} value={formData.client_description} onChange={e => set('client_description', e.target.value)} className={INPUT} /></div>
              <div><label className={LABEL}>Challenge</label><textarea rows={5} value={formData.challenge} onChange={e => set('challenge', e.target.value)} className={INPUT} /></div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Practices Used ({formData.practices.length})</h3>
                <button type="button" onClick={addPractice} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add</button>
              </div>
              {formData.practices.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={p} onChange={e => updatePractice(i, e.target.value)} placeholder="e.g. Recruitment" className={`${INPUT} flex-1`} />
                  <button type="button" onClick={() => removePractice(i)} className="text-red-500 hover:text-red-700 px-2"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">What We Did ({formData.work_sections.length} sections)</h3>
                <button type="button" onClick={addWorkSection} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add Section</button>
              </div>
              {formData.work_sections.map((ws, wi) => (
                <div key={wi} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Section {wi + 1}</span>
                    <button type="button" onClick={() => removeWorkSection(wi)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </div>
                  <input type="text" placeholder="Practice name" value={ws.practice} onChange={e => updateWorkPractice(wi, e.target.value)} className={INPUT} />
                  <div className="pl-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">Actions</span>
                      <button type="button" onClick={() => addWorkAction(wi)} className="text-xs text-oxblood-primary hover:underline">+ Add Action</button>
                    </div>
                    {ws.actions.map((a, ai) => (
                      <div key={ai} className="flex gap-2">
                        <input type="text" value={a} onChange={e => updateWorkAction(wi, ai, e.target.value)} placeholder="Action description" className={`${INPUT} flex-1`} />
                        <button type="button" onClick={() => removeWorkAction(wi, ai)} className="text-red-500 hover:text-red-700 px-2"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Results ({formData.results.length})</h3>
                <button type="button" onClick={addResult} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add Result</button>
              </div>
              {formData.results.map((r, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input type="text" placeholder="Metric" value={r.metric} onChange={e => updateResult(i, 'metric', e.target.value)} className={`${INPUT} flex-1`} />
                  <input type="text" placeholder="Before" value={r.before} onChange={e => updateResult(i, 'before', e.target.value)} className={`${INPUT} w-32`} />
                  <input type="text" placeholder="After" value={r.after} onChange={e => updateResult(i, 'after', e.target.value)} className={`${INPUT} w-32`} />
                  <button type="button" onClick={() => removeResult(i)} className="text-red-500 hover:text-red-700 px-2 mt-2"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div><label className={LABEL}>Why Integration Mattered (Quote)</label><textarea rows={4} value={formData.integration_quote} onChange={e => set('integration_quote', e.target.value)} className={INPUT} /></div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">SEO Settings</h3>
              <div><label className={LABEL}>SEO Title</label><input type="text" value={formData.seo_title} onChange={e => set('seo_title', e.target.value)} className={INPUT} /><p className="text-xs text-gray-500 mt-1">50-60 characters</p></div>
              <div><label className={LABEL}>SEO Description</label><textarea rows={2} value={formData.seo_description} onChange={e => set('seo_description', e.target.value)} className={INPUT} /><p className="text-xs text-gray-500 mt-1">150-160 characters</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={LABEL}>Sort Order</label><input type="number" value={formData.sort_order} onChange={e => set('sort_order', parseInt(e.target.value, 10) || 0)} className={INPUT} /></div>
              <div><label className={LABEL}>Visible</label><select value={formData.is_visible ? 'true' : 'false'} onChange={e => set('is_visible', e.target.value === 'true')} className={INPUT}><option value="true">Yes</option><option value="false">No</option></select></div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className={BTN}>{editingItem ? 'Update' : 'Create'} Case Study</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {(Array.isArray(items) ? items : []).map(item => {
          let practices: string[] = [];
          try {
            practices = typeof item.practices === 'string'
              ? JSON.parse(item.practices)
              : Array.isArray(item.practices) ? item.practices : [];
          } catch { practices = []; }
          return (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                  {item.industry && <span className="text-xs px-2 py-0.5 bg-oxblood-primary/10 text-oxblood-primary rounded-full font-medium">{item.industry}</span>}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {practices.map((p: string) => (
                    <span key={p} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{p}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs px-2 py-1 rounded-full ${item.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.is_visible ? 'Visible' : 'Hidden'}
                </span>
                <button onClick={() => toggleVisibility(item.id, item.is_visible)} className="p-2 text-gray-400 hover:text-gray-600">
                  {item.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:text-blue-700"><Edit size={16} /></button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="text-center py-8 text-gray-500">No case studies yet. Click "Add Case Study" to create one.</p>}
      </div>

      <ConfirmDialog open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} title="Delete Case Study?" description="This case study and all its content will be permanently removed." />
    </div>
  );
}
