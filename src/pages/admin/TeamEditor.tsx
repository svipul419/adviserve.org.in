import { useEffect, useRef, useState } from 'react';
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';
import ConfirmDialog from '../../components/ui/confirm-dialog';

interface Founder {
  name: string;
  initials: string;
  title: string;
  bio: string;
  linkedin: string;
}

interface TeamMember {
  name: string;
  initials: string;
  title: string;
  department: string;
  bio: string;
  linkedin: string;
}

const DEFAULT_FOUNDER: Founder = {
  name: 'Ritu Raj',
  initials: 'RR',
  title: 'Founder',
  bio: '',
  linkedin: '#',
};

const DEFAULT_MEMBER: TeamMember = {
  name: '',
  initials: '',
  title: '',
  department: '',
  bio: '',
  linkedin: '#',
};

export default function TeamEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [founder, setFounder] = useState<Founder>(DEFAULT_FOUNDER);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Chrome fields
  const [founderEyebrow, setFounderEyebrow] = useState('// Founder');
  const [teamCtaHeading, setTeamCtaHeading] = useState('Want To Join Our Team?');
  const [teamCtaBody, setTeamCtaBody] = useState('We are always looking for talented professionals who share our passion for helping businesses succeed.');
  const [teamCtaButtonText, setTeamCtaButtonText] = useState('View Open Positions');
  const [teamCtaButtonHref, setTeamCtaButtonHref] = useState('/careers');

  const [founderFv, setFounderFv] = useState<Record<string, boolean>>({});
  const [ctaFv, setCtaFv] = useState<Record<string, boolean>>({});

  const [pendingDelete, setPendingDelete] = useState<{ index: number; type: 'founder' | 'member' } | null>(null);

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  const handleSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data: pageData } = await adminDb
      .from('website_pages')
      .select('id')
      .eq('slug', 'team')
      .maybeSingle();

    if (!pageData) {
      const { data: newPage } = await adminDb
        .from('website_pages')
        .insert({ slug: 'team', title: 'Team', is_visible: true })
        .select('id')
        .single();
      if (newPage) setPageId(newPage.id);
      setLoading(false);
      return;
    }

    setPageId(pageData.id);

    const { data: contents } = await adminDb
      .from('website_content')
      .select('*')
      .eq('page_id', pageData.id)
      .order('display_order');

    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'founder':
            try {
              setFounder(JSON.parse(c.content_value));
            } catch {
              /* keep default */
            }
            break;
          case 'team_members':
            try {
              setTeamMembers(JSON.parse(c.content_value));
            } catch {
              /* keep default */
            }
            break;
          case 'team_founder_eyebrow': setFounderEyebrow(c.content_value || ''); break;
          case 'team_cta_heading': setTeamCtaHeading(c.content_value || ''); break;
          case 'team_cta_body': setTeamCtaBody(c.content_value || ''); break;
          case 'team_cta_button_text': setTeamCtaButtonText(c.content_value || ''); break;
          case 'team_cta_button_href': setTeamCtaButtonHref(c.content_value || ''); break;
          case 'team_founder_field_visibility': try { setFounderFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'team_cta_field_visibility': try { setCtaFv(JSON.parse(c.content_value || '{}')); } catch {} break;
        }
      });
    }
    setLoading(false);
  };

  const upsertContent = async (
    key: string,
    label: string,
    type: string,
    value: string,
    visible: boolean,
    order: number
  ) => {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb
      .from('website_content')
      .select('id')
      .eq('page_id', pageId)
      .eq('section_key', key)
      .maybeSingle();
    if (selectError) {
      console.error('Fetch error:', selectError);
      throw selectError;
    }
    if (existing) {
      const { error: writeError } = await adminDb
        .from('website_content')
        .update({
          section_label: label,
          content_type: type,
          content_value: value,
          is_visible: visible,
          display_order: order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (writeError) {
        console.error('Write error:', writeError);
        throw writeError;
      }
    } else {
      const { error: writeError } = await adminDb
        .from('website_content')
        .insert({
          page_id: pageId,
          section_key: key,
          section_label: label,
          content_type: type,
          content_value: value,
          is_visible: visible,
          display_order: order,
        });
      if (writeError) {
        console.error('Write error:', writeError);
        throw writeError;
      }
    }
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await Promise.all([
        upsertContent('founder', 'Founder', 'json', JSON.stringify(founder), true, 1),
        upsertContent('team_members', 'Team Members', 'json', JSON.stringify(teamMembers), true, 2),
        upsertContent('team_founder_eyebrow', 'Founder Eyebrow', 'text', founderEyebrow, true, 3),
        upsertContent('team_cta_heading', 'Team CTA Heading', 'text', teamCtaHeading, true, 4),
        upsertContent('team_cta_body', 'Team CTA Body', 'text', teamCtaBody, true, 5),
        upsertContent('team_cta_button_text', 'Team CTA Button Text', 'text', teamCtaButtonText, true, 6),
        upsertContent('team_cta_button_href', 'Team CTA Button Href', 'text', teamCtaButtonHref, true, 7),
        upsertContent('team_founder_field_visibility', 'Founder Field Visibility', 'json', JSON.stringify(founderFv), true, 8),
        upsertContent('team_cta_field_visibility', 'CTA Field Visibility', 'json', JSON.stringify(ctaFv), true, 9),
      ]);
      setDirty(false);
      setSuccess('Team page content saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save content.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleFounderFv = (key: string) => { setFounderFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleCtaFv = (key: string) => { setCtaFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const fFvIcon = (key: string) => founderFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;
  const ctaFvIcon = (key: string) => ctaFv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

  const updateFounder = (field: keyof Founder, value: string) => {
    setFounder((prev) => ({ ...prev, [field]: value }));
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMember = () => {
    setTeamMembers((prev) => [...prev, { ...DEFAULT_MEMBER }]);
    setDirty(true);
  };

  const removeMember = (index: number) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const moveMember = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= teamMembers.length) return;
    setTeamMembers((prev) => {
      const updated = [...prev];
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
    setDirty(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-oxblood-primary/20 border-t-oxblood-primary rounded-full animate-spin" />
        <span className="ml-3 text-sm text-gray-400">Loading...</span>
      </div>
    );

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Page Editor</h1>
          <p className="mt-1 text-gray-600">Edit founder and team member information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>
        {/* Founder Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Founder</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Eyebrow</label>
                <button type="button" onClick={() => toggleFounderFv('eyebrow')} className="text-slate-400 hover:text-slate-600">{fFvIcon('eyebrow')}</button>
              </div>
              <input type="text" value={founderEyebrow} onChange={(e) => setFounderEyebrow(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={founder.name}
                  onChange={(e) => updateFounder('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initials <span className="text-gray-400">(2 chars)</span>
                </label>
                <input
                  type="text"
                  value={founder.initials}
                  onChange={(e) => updateFounder('initials', e.target.value.slice(0, 2).toUpperCase())}
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={founder.title}
                  onChange={(e) => updateFounder('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={founder.bio}
                onChange={(e) => updateFounder('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={founder.linkedin}
                onChange={(e) => updateFounder('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Team Members{' '}
              <span className="text-sm font-normal text-gray-400">({teamMembers.length})</span>
            </h2>
            <button
              onClick={addMember}
              className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary/10 text-oxblood-primary rounded-lg hover:bg-oxblood-hover/20 text-sm font-medium"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          {teamMembers.length === 0 && (
            <p className="text-gray-400 text-sm py-4 text-center">
              No team members yet. Click "Add Member" to get started.
            </p>
          )}

          <div className="space-y-4">
            {teamMembers.map((member, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    Member {i + 1}
                    {member.name ? ` — ${member.name}` : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveMember(i, -1)}
                      disabled={i === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move up"
                      aria-label={`Move ${member.name || `member ${i + 1}`} up`}
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveMember(i, 1)}
                      disabled={i === teamMembers.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Move down"
                      aria-label={`Move ${member.name || `member ${i + 1}`} down`}
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() => setPendingDelete({ index: i, type: 'member' })}
                      className="p-1 text-red-500 hover:text-red-700 ml-2"
                      title="Delete member"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(i, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Initials <span className="text-gray-400">(2 chars)</span>
                    </label>
                    <input
                      type="text"
                      value={member.initials}
                      onChange={(e) =>
                        updateMember(i, 'initials', e.target.value.slice(0, 2).toUpperCase())
                      }
                      maxLength={2}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => updateMember(i, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={member.department}
                      onChange={(e) => updateMember(i, 'department', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
                  <textarea
                    value={member.bio}
                    onChange={(e) => updateMember(i, 'bio', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={member.linkedin}
                    onChange={(e) => updateMember(i, 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                  />
                </div>
              </div>
            ))}
          </div>

          {teamMembers.length > 0 && (
            <button
              onClick={addMember}
              className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80 mt-4"
            >
              <Plus size={16} /> Add Member
            </button>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CTA Section</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <button type="button" onClick={() => toggleCtaFv('heading')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('heading')}</button>
              </div>
              <input type="text" value={teamCtaHeading} onChange={(e) => setTeamCtaHeading(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Body Text</label>
                <button type="button" onClick={() => toggleCtaFv('body')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('body')}</button>
              </div>
              <textarea value={teamCtaBody} onChange={(e) => setTeamCtaBody(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Button</label>
                <button type="button" onClick={() => toggleCtaFv('button')} className="text-slate-400 hover:text-slate-600">{ctaFvIcon('button')}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={teamCtaButtonText} onChange={(e) => setTeamCtaButtonText(e.target.value)} placeholder="Button text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                <input type="text" value={teamCtaButtonHref} onChange={(e) => setTeamCtaButtonHref(e.target.value)} placeholder="URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            removeMember(pendingDelete.index);
          }
          setPendingDelete(null);
        }}
        title="Delete Team Member?"
        description="This person will be permanently removed from the team page."
      />
    </div>
  );
}
