import { useState, useEffect, useMemo } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronRight, Search, RefreshCw, Layers } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';

// ─── Static schema ────────────────────────────────────────────────────────────

interface SectionDef {
  sectionKey: string;
  label: string;
  type: 'toggle' | 'field_visibility';
  fields?: Record<string, string>;
}

interface PageDef {
  slug: string;
  label: string;
  sections: SectionDef[];
}

const SCHEMA: PageDef[] = [
  { slug: 'home', label: 'Home', sections: [
    { sectionKey: 'home_hero_visible',              label: 'Hero Section',       type: 'toggle' },
    { sectionKey: 'home_framing_visible',            label: 'Framing',            type: 'toggle' },
    { sectionKey: 'home_service_verticals_visible',  label: 'Service Verticals',  type: 'toggle' },
    { sectionKey: 'home_cta_visible',                label: 'Final CTA',          type: 'toggle' },
    { sectionKey: 'home_framework_visible',          label: 'Framework Cards',    type: 'toggle' },
    { sectionKey: 'home_kickoff_visible',            label: 'Kickoff',            type: 'toggle' },
    { sectionKey: 'hero_field_visibility',           label: 'Hero Fields',        type: 'field_visibility',
      fields: { badge: 'Badge', h1_line1: 'H1 Line 1', h1_line2: 'H1 Line 2', credibility_line: 'Credibility Line', primary_cta: 'Primary CTA', secondary_cta: 'Secondary CTA', video: 'Video', trust_strip: 'Trust Strip' } },
    { sectionKey: 'framing_field_visibility',        label: 'Framing Fields',     type: 'field_visibility',
      fields: { badge: 'Badge', heading: 'Heading', body1: 'Body 1', body2: 'Body 2', cta: 'CTA' } },
    { sectionKey: 'practices_field_visibility',      label: 'Practices Fields',   type: 'field_visibility',
      fields: { badge: 'Badge', heading: 'Heading' } },
    { sectionKey: 'products_field_visibility',       label: 'Products Fields',    type: 'field_visibility',
      fields: { badge: 'Badge', title: 'Title', description: 'Description' } },
{ sectionKey: 'cta_field_visibility',            label: 'CTA Fields',         type: 'field_visibility',
      fields: { badge: 'Badge', heading: 'Heading', description: 'Description', primary_cta: 'Primary CTA', secondary_cta: 'Secondary CTA', reassurance: 'Reassurance' } },
  ]},
  { slug: 'about', label: 'About', sections: [
    { sectionKey: 'about_header_field_visibility',   label: 'Header Fields',   type: 'field_visibility', fields: { eyebrow: 'Eyebrow', title: 'Title', intro: 'Intro' } },
    { sectionKey: 'about_story_field_visibility',    label: 'Story Fields',    type: 'field_visibility', fields: { badge: 'Badge', title: 'Title' } },
    { sectionKey: 'about_approach_field_visibility', label: 'Approach Fields', type: 'field_visibility', fields: { badge: 'Badge', title: 'Title' } },
    { sectionKey: 'about_mission_field_visibility',  label: 'Mission Fields',  type: 'field_visibility', fields: { badge: 'Badge' } },
    { sectionKey: 'about_values_field_visibility',   label: 'Values Fields',   type: 'field_visibility', fields: { badge: 'Badge', title: 'Title' } },
    { sectionKey: 'about_cta_field_visibility',      label: 'CTA Fields',      type: 'field_visibility', fields: { heading: 'Heading', button: 'Button' } },
  ]},
  { slug: 'contact', label: 'Contact', sections: [
    { sectionKey: 'contact_header_field_visibility',  label: 'Header Fields',  type: 'field_visibility', fields: { title: 'Title', intro: 'Intro' } },
    { sectionKey: 'contact_form_field_visibility',    label: 'Form Fields',    type: 'field_visibility', fields: { title: 'Title', success_message: 'Success Message', disclaimer: 'Disclaimer' } },
    { sectionKey: 'contact_sidebar_field_visibility', label: 'Sidebar Fields', type: 'field_visibility', fields: { title: 'Title', email: 'Email', phone: 'Phone', address: 'Address', schedule: 'Schedule' } },
  ]},
  { slug: 'team', label: 'Team', sections: [
    { sectionKey: 'team_founder_field_visibility', label: 'Founder Fields', type: 'field_visibility', fields: { eyebrow: 'Eyebrow' } },
    { sectionKey: 'team_cta_field_visibility',     label: 'CTA Fields',     type: 'field_visibility', fields: { heading: 'Heading', body: 'Body', button: 'Button' } },
  ]},
  { slug: 'careers', label: 'Careers', sections: [
    { sectionKey: 'careers_hero_field_visibility',  label: 'Hero Fields',  type: 'field_visibility', fields: { title: 'Title', subtitle: 'Subtitle' } },
    { sectionKey: 'careers_cta_field_visibility',   label: 'CTA Fields',   type: 'field_visibility', fields: { title: 'Title', description: 'Description' } },
    { sectionKey: 'careers_modal_field_visibility', label: 'Modal Fields', type: 'field_visibility', fields: { header: 'Header', labels: 'Labels', cover_placeholder: 'Cover Placeholder', submit_btn: 'Submit Button', received: 'Received' } },
  ]},
  { slug: 'footer', label: 'Footer', sections: [
    { sectionKey: 'footer_field_visibility', label: 'Footer Fields', type: 'field_visibility',
      fields: { contact_header: 'Contact Header', nav_header: 'Nav Header', subscribe_header: 'Subscribe Header', certs_header: 'Certs Header', copyright_name: 'Copyright Name', legal_links: 'Legal Links' } },
  ]},
  { slug: 'blog', label: 'Blog', sections: [
    { sectionKey: 'blog_chrome_field_visibility', label: 'Page Chrome Fields', type: 'field_visibility',
      fields: { title: 'Title', subtitle: 'Subtitle', search_placeholder: 'Search Placeholder', empty_heading: 'Empty Heading', empty_body: 'Empty Body', read_more: 'Read More' } },
  ]},
  { slug: 'case-studies', label: 'Case Studies', sections: [
    { sectionKey: 'cs_hero_field_visibility', label: 'Hero Fields', type: 'field_visibility', fields: { heading: 'Heading', subtitle: 'Subtitle' } },
    { sectionKey: 'cs_cta_field_visibility',  label: 'CTA Fields',  type: 'field_visibility', fields: { heading: 'Heading', body: 'Body', primary_cta: 'Primary CTA', secondary_cta: 'Secondary CTA' } },
  ]},
  { slug: 'faq', label: 'FAQ', sections: [
    { sectionKey: 'faq_chrome_field_visibility', label: 'Page Chrome Fields', type: 'field_visibility', fields: { heading: 'Heading', intro: 'Intro', search: 'Search' } },
    { sectionKey: 'faq_cta_field_visibility',    label: 'CTA Fields',         type: 'field_visibility', fields: { heading: 'Heading', body: 'Body', primary_cta: 'Primary CTA', secondary_cta: 'Secondary CTA' } },
  ]},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConfirmState { title: string; body: string; onConfirm: () => void; }

export default function VisibilityManager() {
  const [loading, setLoading] = useState(true);
  const [rowIds, setRowIds] = useState<Record<string, string>>({});
  const [updatedAt, setUpdatedAt] = useState<Record<string, string>>({});
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({});
  const [fvValues, setFvValues] = useState<Record<string, Record<string, boolean>>>({});
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(SCHEMA.map(p => p.slug)));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [filterPage, setFilterPage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'visible' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  useEffect(() => { loadData(); }, []);

  // ─── Load ────────────────────────────────────────────────────────────────

  const loadData = async () => {
    setLoading(true);
    const { data: rows } = await adminDb
      .from('website_content')
      .select('id, section_key, content_type, content_value, updated_at')
      .order('display_order');

    const newRowIds: Record<string, string> = {};
    const newToggle: Record<string, boolean> = {};
    const newFv: Record<string, Record<string, boolean>> = {};
    const newUpdated: Record<string, string> = {};

    if (rows) {
      for (const row of rows) {
        const k = row.section_key;
        newRowIds[k] = row.id;
        if (row.updated_at) newUpdated[k] = row.updated_at;
        if (row.content_type === 'toggle') {
          newToggle[k] = row.content_value !== 'false';
        } else if (k.endsWith('_field_visibility') || k.endsWith('_visible') === false) {
          if (k.endsWith('_field_visibility')) {
            try { newFv[k] = JSON.parse(row.content_value || '{}'); } catch { newFv[k] = {}; }
          }
        }
      }
    }

    setRowIds(newRowIds);
    setToggleValues(newToggle);
    setFvValues(newFv);
    setUpdatedAt(newUpdated);
    setLoading(false);
  };

  // ─── Value helpers ────────────────────────────────────────────────────────

  const getToggle = (key: string) => toggleValues[key] !== false;
  const getField = (sectionKey: string, fieldKey: string) => {
    const fv = fvValues[sectionKey];
    return !fv || fv[fieldKey] !== false;
  };

  // ─── Write ────────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const markSaving = (key: string, on: boolean) =>
    setSavingKeys(prev => { const n = new Set(prev); on ? n.add(key) : n.delete(key); return n; });

  const saveToggle = async (sectionKey: string, newVal: boolean) => {
    const rowId = rowIds[sectionKey];
    if (!rowId) { showToast('Row not found — save from the page editor first', 'error'); return; }
    markSaving(sectionKey, true);
    setToggleValues(prev => ({ ...prev, [sectionKey]: newVal }));
    const { error } = await adminDb.from('website_content')
      .update({ content_value: String(newVal), updated_at: new Date().toISOString() })
      .eq('id', rowId);
    markSaving(sectionKey, false);
    if (error) {
      setToggleValues(prev => ({ ...prev, [sectionKey]: !newVal }));
      showToast('Save failed', 'error');
    } else {
      setUpdatedAt(prev => ({ ...prev, [sectionKey]: new Date().toISOString() }));
    }
  };

  const saveFvField = async (sectionKey: string, fieldKey: string, newVal: boolean) => {
    const rowId = rowIds[sectionKey];
    if (!rowId) { showToast('Row not found — save from the page editor first', 'error'); return; }
    const prev = fvValues[sectionKey] || {};
    const next = { ...prev, [fieldKey]: newVal };
    const saveKey = `${sectionKey}:${fieldKey}`;
    markSaving(saveKey, true);
    setFvValues(fv => ({ ...fv, [sectionKey]: next }));
    const { error } = await adminDb.from('website_content')
      .update({ content_value: JSON.stringify(next), updated_at: new Date().toISOString() })
      .eq('id', rowId);
    markSaving(saveKey, false);
    if (error) {
      setFvValues(fv => ({ ...fv, [sectionKey]: prev }));
      showToast('Save failed', 'error');
    } else {
      setUpdatedAt(at => ({ ...at, [sectionKey]: new Date().toISOString() }));
    }
  };

  // ─── Bulk ─────────────────────────────────────────────────────────────────

  type BulkItem =
    | { type: 'toggle'; sectionKey: string }
    | { type: 'fv'; sectionKey: string; fieldKey: string };

  const execBulk = async (items: BulkItem[], targetVal: boolean) => {
    if (items.length === 0) { showToast('Nothing to change', 'success'); setConfirm(null); return; }

    // Optimistic
    const toggleItems = items.filter(i => i.type === 'toggle');
    const fvItems = items.filter(i => i.type === 'fv') as Extract<BulkItem, { type: 'fv' }>[];
    setToggleValues(prev => {
      const n = { ...prev };
      for (const i of toggleItems) n[i.sectionKey] = targetVal;
      return n;
    });
    setFvValues(prev => {
      const n = { ...prev };
      for (const i of fvItems) n[i.sectionKey] = { ...(n[i.sectionKey] || {}), [i.fieldKey]: targetVal };
      return n;
    });

    // Group fv by sectionKey for single write per map
    const fvBySection: Record<string, Record<string, boolean>> = {};
    for (const i of fvItems) {
      if (!fvBySection[i.sectionKey]) fvBySection[i.sectionKey] = { ...(fvValues[i.sectionKey] || {}) };
      fvBySection[i.sectionKey][i.fieldKey] = targetVal;
    }

    const writes: any[] = [
      ...toggleItems
        .filter(i => rowIds[i.sectionKey])
        .map(i => adminDb.from('website_content')
          .update({ content_value: String(targetVal), updated_at: new Date().toISOString() })
          .eq('id', rowIds[i.sectionKey])),
      ...Object.entries(fvBySection)
        .filter(([k]) => rowIds[k])
        .map(([k, vals]) => adminDb.from('website_content')
          .update({ content_value: JSON.stringify(vals), updated_at: new Date().toISOString() })
          .eq('id', rowIds[k])),
    ];

    await Promise.all(writes);
    const now = new Date().toISOString();
    setUpdatedAt(prev => {
      const n = { ...prev };
      for (const i of items) n[i.sectionKey] = now;
      return n;
    });
    showToast(`${items.length} item${items.length !== 1 ? 's' : ''} updated`, 'success');
    setConfirm(null);
  };

  const buildBulkItems = (targetVal: boolean, pageSlugs?: string[], sectionKey?: string): BulkItem[] => {
    const items: BulkItem[] = [];
    for (const page of SCHEMA) {
      if (pageSlugs && !pageSlugs.includes(page.slug)) continue;
      for (const sec of page.sections) {
        if (sectionKey && sec.sectionKey !== sectionKey) continue;
        if (sec.type === 'toggle') {
          if (getToggle(sec.sectionKey) !== targetVal) items.push({ type: 'toggle', sectionKey: sec.sectionKey });
        } else if (sec.fields) {
          for (const fk of Object.keys(sec.fields)) {
            if (getField(sec.sectionKey, fk) !== targetVal) items.push({ type: 'fv', sectionKey: sec.sectionKey, fieldKey: fk });
          }
        }
      }
    }
    return items;
  };

  const handleGlobalBulk = (targetVal: boolean) => {
    const slugs = filterPage ? [filterPage] : undefined;
    const items = buildBulkItems(targetVal, slugs);
    if (items.length === 0) { showToast(`All already ${targetVal ? 'visible' : 'hidden'}`, 'success'); return; }
    setConfirm({
      title: targetVal ? `Show ${items.length} items` : `Hide ${items.length} items`,
      body: `${items.length} item${items.length !== 1 ? 's' : ''} will be ${targetVal ? 'shown on' : 'hidden from'} the live site. Continue?`,
      onConfirm: () => execBulk(items, targetVal),
    });
  };

  const handleSectionBulk = (sectionKey: string, targetVal: boolean) => {
    const items = buildBulkItems(targetVal, undefined, sectionKey);
    if (items.length === 0) { showToast(`All fields already ${targetVal ? 'visible' : 'hidden'}`, 'success'); return; }
    setConfirm({
      title: `${targetVal ? 'Show' : 'Hide'} all — ${items.length} field${items.length !== 1 ? 's' : ''}`,
      body: `${items.length} field${items.length !== 1 ? 's' : ''} will be ${targetVal ? 'shown on' : 'hidden from'} the live site.`,
      onConfirm: () => execBulk(items, targetVal),
    });
  };

  // ─── Filter ───────────────────────────────────────────────────────────────

  const q = searchQuery.toLowerCase();
  const matches = (text: string) => !q || text.toLowerCase().includes(q);

  const sectionVisible = (page: PageDef, sec: SectionDef): boolean => {
    if (sec.type === 'toggle') {
      const vis = getToggle(sec.sectionKey);
      if (filterStatus === 'visible' && !vis) return false;
      if (filterStatus === 'hidden' && vis) return false;
      return matches(page.label) || matches(sec.label) || matches(sec.sectionKey);
    }
    if (sec.fields) {
      const fieldEntries = Object.entries(sec.fields);
      return fieldEntries.some(([fk, fl]) => {
        const vis = getField(sec.sectionKey, fk);
        if (filterStatus === 'visible' && !vis) return false;
        if (filterStatus === 'hidden' && vis) return false;
        return matches(page.label) || matches(sec.label) || matches(fl) || matches(fk);
      });
    }
    return false;
  };

  const fieldVisible = (page: PageDef, sec: SectionDef, fk: string, fl: string): boolean => {
    const vis = getField(sec.sectionKey, fk);
    if (filterStatus === 'visible' && !vis) return false;
    if (filterStatus === 'hidden' && vis) return false;
    return matches(page.label) || matches(sec.label) || matches(fl) || matches(fk);
  };

  const filteredPages = useMemo(() =>
    SCHEMA.filter(page => {
      if (filterPage && page.slug !== filterPage) return false;
      return page.sections.some(sec => sectionVisible(page, sec));
    }),
  [filterPage, filterStatus, searchQuery, toggleValues, fvValues]);

  // ─── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    let total = 0, hidden = 0;
    for (const page of SCHEMA) {
      for (const sec of page.sections) {
        if (sec.type === 'toggle') { total++; if (!getToggle(sec.sectionKey)) hidden++; }
        else if (sec.fields) {
          for (const fk of Object.keys(sec.fields)) { total++; if (!getField(sec.sectionKey, fk)) hidden++; }
        }
      }
    }
    return { total, hidden, visible: total - hidden };
  }, [toggleValues, fvValues]);

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-oxblood-primary/20 border-t-oxblood-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layers size={20} className="text-oxblood-primary" />
            Visibility Manager
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="text-green-600 font-medium">{stats.visible}</span> visible ·{' '}
            <span className="text-red-500 font-medium">{stats.hidden}</span> hidden ·{' '}
            {stats.total} total
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => handleGlobalBulk(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <Eye size={12} /> Show all
          </button>
          <button onClick={() => handleGlobalBulk(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
            <EyeOff size={12} /> Hide all
          </button>
          <button onClick={loadData} title="Refresh"
            className="p-1.5 text-gray-400 hover:text-oxblood-hover transition-colors">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search sections and fields…"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/20 focus:border-oxblood-primary/40 bg-white" />
        </div>
        <select value={filterPage} onChange={e => setFilterPage(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-oxblood-primary/20 text-gray-700">
          <option value="">All Pages</option>
          {SCHEMA.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as 'all' | 'visible' | 'hidden')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-oxblood-primary/20 text-gray-700">
          <option value="all">All Status</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {filteredPages.length === 0 ? (
          <div className="py-16 text-center">
            <Search size={22} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No items match your filters</p>
          </div>
        ) : filteredPages.map(page => {
          const pageExpanded = expandedPages.has(page.slug);
          const visibleSections = page.sections.filter(sec => sectionVisible(page, sec));

          return (
            <div key={page.slug}>
              {/* Page row */}
              <button
                onClick={() => setExpandedPages(prev => {
                  const n = new Set(prev); n.has(page.slug) ? n.delete(page.slug) : n.add(page.slug); return n;
                })}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left bg-gray-50/60"
              >
                {pageExpanded ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
                <span className="font-semibold text-[13px] text-gray-900">{page.label}</span>
                <span className="ml-auto text-[11px] text-gray-400">{visibleSections.length} section{visibleSections.length !== 1 ? 's' : ''}</span>
              </button>

              {/* Sections */}
              {pageExpanded && visibleSections.map(sec => {
                if (sec.type === 'toggle') {
                  const vis = getToggle(sec.sectionKey);
                  const sk = savingKeys.has(sec.sectionKey);
                  return (
                    <div key={sec.sectionKey} className="flex items-center gap-3 px-4 py-2.5 pl-10 hover:bg-gray-50/60 transition-colors border-t border-gray-50">
                      <button onClick={() => saveToggle(sec.sectionKey, !vis)} disabled={sk}
                        className={`flex-shrink-0 transition-colors ${vis ? 'text-green-600 hover:text-green-700' : 'text-gray-300 hover:text-gray-400'}`}
                        title={vis ? 'Click to hide section' : 'Click to show section'}>
                        {sk ? <RefreshCw size={15} className="animate-spin text-gray-400" /> : vis ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <span className={`text-[13px] flex-1 ${vis ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{sec.label}</span>
                      <span className="text-[10px] font-mono text-gray-300 hidden sm:block">{sec.sectionKey}</span>
                      {updatedAt[sec.sectionKey] && (
                        <span className="text-[10px] text-gray-400 hidden md:block">{fmtTime(updatedAt[sec.sectionKey])}</span>
                      )}
                      {!vis && <span className="text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full">Hidden</span>}
                    </div>
                  );
                }

                // field_visibility group
                const secExpanded = expandedSections.has(sec.sectionKey);
                const visibleFields = Object.entries(sec.fields!).filter(([fk, fl]) => fieldVisible(page, sec, fk, fl));
                const hiddenCount = Object.keys(sec.fields!).filter(fk => !getField(sec.sectionKey, fk)).length;

                return (
                  <div key={sec.sectionKey} className="border-t border-gray-50">
                    {/* Group header */}
                    <div className="flex items-center gap-2 px-4 py-2 pl-10 bg-gray-50/30 hover:bg-gray-50/60 transition-colors">
                      <button
                        onClick={() => setExpandedSections(prev => {
                          const n = new Set(prev); n.has(sec.sectionKey) ? n.delete(sec.sectionKey) : n.add(sec.sectionKey); return n;
                        })}
                        className="flex items-center gap-1.5 flex-1 text-left min-w-0"
                      >
                        {secExpanded ? <ChevronDown size={12} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />}
                        <span className="text-[12px] font-medium text-gray-600">{sec.label}</span>
                        <span className="text-[10px] font-mono text-gray-300 ml-1.5 hidden sm:block truncate">{sec.sectionKey}</span>
                        {hiddenCount > 0 && <span className="ml-2 text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full flex-shrink-0">{hiddenCount} hidden</span>}
                      </button>
                      <button onClick={() => handleSectionBulk(sec.sectionKey, true)}
                        className="text-[10px] text-green-600 hover:text-green-700 px-2 py-0.5 rounded hover:bg-green-50 transition-colors flex-shrink-0">
                        Show all
                      </button>
                      <button onClick={() => handleSectionBulk(sec.sectionKey, false)}
                        className="text-[10px] text-red-500 hover:text-red-600 px-2 py-0.5 rounded hover:bg-red-50 transition-colors flex-shrink-0">
                        Hide all
                      </button>
                    </div>

                    {/* Fields */}
                    {secExpanded && visibleFields.map(([fk, fl]) => {
                      const vis = getField(sec.sectionKey, fk);
                      const saveKey = `${sec.sectionKey}:${fk}`;
                      const sk = savingKeys.has(saveKey);
                      return (
                        <div key={fk} className="flex items-center gap-3 px-4 py-2 pl-16 border-t border-gray-50/50 hover:bg-gray-50/30 transition-colors">
                          <button onClick={() => saveFvField(sec.sectionKey, fk, !vis)} disabled={sk}
                            className={`flex-shrink-0 transition-colors ${vis ? 'text-green-600 hover:text-green-700' : 'text-gray-300 hover:text-gray-400'}`}
                            title={vis ? 'Click to hide field' : 'Click to show field'}>
                            {sk ? <RefreshCw size={13} className="animate-spin text-gray-400" /> : vis ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>
                          <span className={`text-[12px] flex-1 ${vis ? 'text-gray-600' : 'text-gray-400 line-through'}`}>{fl}</span>
                          <span className="text-[10px] font-mono text-gray-300 hidden sm:block">{fk}</span>
                          {!vis && <span className="text-[10px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full">Hidden</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2 text-[15px]">{confirm.title}</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{confirm.body}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button onClick={confirm.onConfirm}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
