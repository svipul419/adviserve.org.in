import { useEffect, useRef, useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';

interface ApproachStep {
  num: string;
  title: string;
  desc: string;
}

interface MissionVisionItem {
  title: string;
  description: string;
  iconColor: string;
}

interface CoreValue {
  title: string;
  description: string;
  iconColor: string;
}

interface AboutStat {
  icon: string;
  value: string;
  label: string;
}

const STAT_ICON_OPTIONS = [
  { value: 'Users', label: 'Users' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Clock', label: 'Clock' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Target', label: 'Target' },
  { value: 'Award', label: 'Award' },
  { value: 'Star', label: 'Star' },
  { value: 'Zap', label: 'Zap' },
  { value: 'Heart', label: 'Heart' },
  { value: 'Briefcase', label: 'Briefcase' },
];

export default function AboutPageEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Header
  const [aboutTitle, setAboutTitle] = useState('We started Adviserve because we kept seeing the same problem.');
  const [aboutIntro, setAboutIntro] = useState('We started Adviserve because we kept seeing the same problem.');
  const [aboutEyebrow, setAboutEyebrow] = useState('// 00.03 — About');

  // Visibility
  const [headerVisible, setHeaderVisible] = useState(true);
  const [storyVisible, setStoryVisible] = useState(true);
  const [approachVisible, setApproachVisible] = useState(true);
  const [missionVisible, setMissionVisible] = useState(true);
  const [valuesVisible, setValuesVisible] = useState(true);

  // Who We Are
  const [storyBadge, setStoryBadge] = useState('// Our Story');
  const [storyTitle, setStoryTitle] = useState('The Story\nBehind\nAdviserve');
  const [storyParagraphs, setStoryParagraphs] = useState<string[]>([
    'Businesses — especially growing ones — spend an enormous amount of time and money trying to stitch together support from different directions. A recruitment agency here. A freelance HR consultant there. A law firm on retainer that charges for every email. An IT vendor that doesn’t understand the business context.',
    'Nobody was coordinating it. Nobody was taking ownership. And the people running the business were spending half their energy managing vendors instead of managing their company.',
    'We built Adviserve to be the firm we wished existed. One team. Multiple specialisms. A single point of accountability. The kind of partner that gets into the details of your business and genuinely cares about what happens next.',
    'We’re a startup ourselves — young, independent, and building our own reputation one client at a time. That keeps us honest. We can’t afford to coast on legacy brand name. Every engagement matters to us, and that shows in how we work.',
  ]);

  // Our Approach
  const [approachBadge, setApproachBadge] = useState('// Our Approach');
  const [approachTitle, setApproachTitle] = useState('How We Work');
  const [approachSteps, setApproachSteps] = useState<ApproachStep[]>([
    { num: '01', title: 'Diagnose', desc: 'We audit your current operations, people systems, compliance posture, and technology stack.' },
    { num: '02', title: 'Design', desc: 'We build a custom roadmap with clear milestones, KPIs, and a realistic timeline.' },
    { num: '03', title: 'Deploy', desc: 'Our specialists embed with your team to implement changes — not hand off a report.' },
    { num: '04', title: 'Optimize', desc: 'We track outcomes at 30, 60, and 90 days, iterating until targets are met.' },
  ]);

  // Impact badge
  const [impactBadge, setImpactBadge] = useState('// Mission');

  // Mission/Vision/Team
  const [missionItems, setMissionItems] = useState<MissionVisionItem[]>([
    { title: 'What we’re here to do', description: 'Help businesses of every size access the kind of integrated, expert support that used to only be available to large companies with large budgets — and deliver it in a way that’s honest, practical, and genuinely useful.', iconColor: 'teal' },
    { title: 'The people behind Adviserve', description: 'Our team brings experience from across HR, recruitment, law, business strategy, and technology. We’ve worked with startups and enterprises alike, which means we understand both the ambition and the chaos that comes with building something.', iconColor: 'orange' },
  ]);

  // Core Values
  const [valuesBadge, setValuesBadge] = useState('// Values');
  const [valuesTitle, setValuesTitle] = useState('Our Core Values');
  const [coreValues, setCoreValues] = useState<CoreValue[]>([
    { title: 'Honesty before comfort', description: 'We’ll tell you what we think, even when it’s not what you’re hoping to hear. You’re better served by the truth than by a consultant who nods along.', iconColor: 'yellow' },
    { title: 'Ownership over advice', description: 'There’s a difference between telling someone what to do and actually helping them do it. We lean toward the second one.', iconColor: 'red' },
    { title: 'Depth, not jargon', description: 'We have real specialists across all our service areas. They know their stuff. And they know how to explain it without making it complicated.', iconColor: 'blue' },
    { title: 'We grow with you', description: 'Our best relationships are the ones that evolve. A client who comes to us for recruitment ends up working with our HR and legal teams too. That’s how we know we’re doing something right.', iconColor: 'teal' },
  ]);

  // CTA
  const [aboutCtaHeading, setAboutCtaHeading] = useState('Want To Learn More?');
  const [aboutCtaButtonText, setAboutCtaButtonText] = useState('Book a Free Call');
  const [aboutCtaButtonHref, setAboutCtaButtonHref] = useState('/book');

  // Stats
  const [statsVisible, setStatsVisible] = useState(true);
  const [aboutStats, setAboutStats] = useState<AboutStat[]>([
    { icon: 'Users', value: '6', label: 'Practices, One Roof' },
    { icon: 'Globe', value: '48 hrs', label: 'Sign to Kickoff' },
    { icon: 'Clock', value: '<24 hr', label: 'Response Guarantee' },
    { icon: 'TrendingUp', value: 'All Sizes', label: 'Startup to Enterprise' },
  ]);

  const [headerFv, setHeaderFv] = useState<Record<string, boolean>>({});
  const [storyFv, setStoryFv] = useState<Record<string, boolean>>({});
  const [approachFv, setApproachFv] = useState<Record<string, boolean>>({});
  const [missionFv, setMissionFv] = useState<Record<string, boolean>>({});
  const [valuesFv, setValuesFv] = useState<Record<string, boolean>>({});
  const [ctaFv, setCtaFv] = useState<Record<string, boolean>>({});

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
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'about').maybeSingle();

    if (!pageData) {
      try {
        const { data: newPage, error: createError } = await adminDb.from('website_pages').insert({ slug: 'about', title: 'About', is_visible: true }).select('id').single();
        if (createError) throw createError;
        if (newPage) setPageId(newPage.id);
      } catch {
        setError('Failed to create about page. Please try again.');
      }
      setLoading(false);
      return;
    }

    setPageId(pageData.id);

    const { data: contents } = await adminDb.from('website_content').select('*').eq('page_id', pageData.id).order('display_order');

    if (contents) {
      contents.forEach((c: any) => {
        switch (c.section_key) {
          case 'about_title': setAboutTitle(c.content_value || ''); setHeaderVisible(c.is_visible); break;
          case 'about_intro': setAboutIntro(c.content_value || ''); break;
          case 'about_eyebrow': setAboutEyebrow(c.content_value || ''); break;
          case 'story_badge': setStoryBadge(c.content_value || ''); break;
          case 'story_title': setStoryTitle(c.content_value || ''); break;
          case 'story_paragraphs':
            try { setStoryParagraphs(JSON.parse(c.content_value || '[]')); } catch {}
            setStoryVisible(c.is_visible);
            break;
          case 'approach_badge': setApproachBadge(c.content_value || ''); break;
          case 'approach_title': setApproachTitle(c.content_value || ''); break;
          case 'approach_steps':
            try { setApproachSteps(JSON.parse(c.content_value || '[]')); } catch {}
            setApproachVisible(c.is_visible);
            break;
          case 'impact_badge': setImpactBadge(c.content_value || ''); break;
          case 'mission_items':
            try { setMissionItems(JSON.parse(c.content_value || '[]')); } catch {}
            setMissionVisible(c.is_visible);
            break;
          case 'values_badge': setValuesBadge(c.content_value || ''); break;
          case 'values_title': setValuesTitle(c.content_value || ''); break;
          case 'core_values':
            try { setCoreValues(JSON.parse(c.content_value || '[]')); } catch {}
            setValuesVisible(c.is_visible);
            break;
          case 'about_cta_heading': setAboutCtaHeading(c.content_value || ''); break;
          case 'about_cta_button_text': setAboutCtaButtonText(c.content_value || ''); break;
          case 'about_cta_button_href': setAboutCtaButtonHref(c.content_value || ''); break;
          case 'about_stats':
            try { setAboutStats(JSON.parse(c.content_value || '[]')); } catch {}
            setStatsVisible(c.is_visible);
            break;
          case 'about_header_field_visibility': try { setHeaderFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'about_story_field_visibility': try { setStoryFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'about_approach_field_visibility': try { setApproachFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'about_mission_field_visibility': try { setMissionFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'about_values_field_visibility': try { setValuesFv(JSON.parse(c.content_value || '{}')); } catch {} break;
          case 'about_cta_field_visibility': try { setCtaFv(JSON.parse(c.content_value || '{}')); } catch {} break;
        }
      });
    }
    setLoading(false);
  };

  const upsertContent = async (key: string, label: string, type: string, value: string, visible: boolean, order: number) => {
    if (!pageId) return;
    const { data: existing, error: selectError } = await adminDb.from('website_content').select('id').eq('page_id', pageId).eq('section_key', key).maybeSingle();
    if (selectError) { console.error('Fetch error:', selectError); throw selectError; }
    if (existing) {
      const { error: writeError } = await adminDb.from('website_content').update({ section_label: label, content_type: type, content_value: value, is_visible: visible, display_order: order, updated_at: new Date().toISOString() }).eq('id', existing.id);
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    } else {
      const { error: writeError } = await adminDb.from('website_content').insert({ page_id: pageId, section_key: key, section_label: label, content_type: type, content_value: value, is_visible: visible, display_order: order });
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    }
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await Promise.all([
        upsertContent('about_title', 'About Title', 'text', aboutTitle, headerVisible, 1),
        upsertContent('about_intro', 'About Intro', 'text', aboutIntro, headerVisible, 2),
        upsertContent('about_eyebrow', 'About Eyebrow', 'text', aboutEyebrow, headerVisible, 3),
        upsertContent('story_badge', 'Story Badge', 'text', storyBadge, storyVisible, 10),
        upsertContent('story_title', 'Story Title', 'text', storyTitle, storyVisible, 11),
        upsertContent('story_paragraphs', 'Story Paragraphs', 'json', JSON.stringify(storyParagraphs), storyVisible, 12),
        upsertContent('approach_badge', 'Approach Badge', 'text', approachBadge, approachVisible, 22),
        upsertContent('approach_title', 'Approach Title', 'text', approachTitle, approachVisible, 20),
        upsertContent('approach_steps', 'Approach Steps', 'json', JSON.stringify(approachSteps), approachVisible, 21),
        upsertContent('impact_badge', 'Impact Badge', 'text', impactBadge, missionVisible, 31),
        upsertContent('mission_items', 'Mission/Vision/Team', 'json', JSON.stringify(missionItems), missionVisible, 30),
        upsertContent('values_badge', 'Values Badge', 'text', valuesBadge, valuesVisible, 40),
        upsertContent('values_title', 'Values Title', 'text', valuesTitle, valuesVisible, 41),
        upsertContent('core_values', 'Core Values', 'json', JSON.stringify(coreValues), valuesVisible, 43),
        upsertContent('about_stats', 'Stats Section', 'json', JSON.stringify(aboutStats), statsVisible, 50),
        upsertContent('about_cta_heading', 'About CTA Heading', 'text', aboutCtaHeading, true, 51),
        upsertContent('about_cta_button_text', 'About CTA Button Text', 'text', aboutCtaButtonText, true, 52),
        upsertContent('about_cta_button_href', 'About CTA Button Href', 'text', aboutCtaButtonHref, true, 53),
        upsertContent('about_header_field_visibility', 'Header Field Visibility', 'json', JSON.stringify(headerFv), true, 4),
        upsertContent('about_story_field_visibility', 'Story Field Visibility', 'json', JSON.stringify(storyFv), true, 13),
        upsertContent('about_approach_field_visibility', 'Approach Field Visibility', 'json', JSON.stringify(approachFv), true, 24),
        upsertContent('about_mission_field_visibility', 'Mission Field Visibility', 'json', JSON.stringify(missionFv), true, 32),
        upsertContent('about_values_field_visibility', 'Values Field Visibility', 'json', JSON.stringify(valuesFv), true, 44),
        upsertContent('about_cta_field_visibility', 'CTA Field Visibility', 'json', JSON.stringify(ctaFv), true, 55),
      ]);
      setDirty(false);
      setSuccess('About page content saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to save content.');
    }
    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleHeaderFv = (key: string) => { setHeaderFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleStoryFv = (key: string) => { setStoryFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleApproachFv = (key: string) => { setApproachFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleMissionFv = (key: string) => { setMissionFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleValuesFv = (key: string) => { setValuesFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleCtaFv = (key: string) => { setCtaFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const fvAbout = (fv: Record<string, boolean>, key: string) => fv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-oxblood-primary/20 border-t-oxblood-primary rounded-full animate-spin" />
      <span className="ml-3 text-sm text-gray-400">Loading...</span>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Page Editor</h1>
          <p className="mt-1 text-gray-600">Edit all sections of the about page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">{success}</div>}

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Page Header</h2>
            <button onClick={() => setHeaderVisible(!headerVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${headerVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {headerVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {headerVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Eyebrow</label>
                <button type="button" onClick={() => toggleHeaderFv('eyebrow')} className="text-slate-400 hover:text-slate-600">{fvAbout(headerFv, 'eyebrow')}</button>
              </div>
              <input type="text" value={aboutEyebrow} onChange={(e) => setAboutEyebrow(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <button type="button" onClick={() => toggleHeaderFv('title')} className="text-slate-400 hover:text-slate-600">{fvAbout(headerFv, 'title')}</button>
              </div>
              <input type="text" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Intro Text</label>
                <button type="button" onClick={() => toggleHeaderFv('intro')} className="text-slate-400 hover:text-slate-600">{fvAbout(headerFv, 'intro')}</button>
              </div>
              <input type="text" value={aboutIntro} onChange={(e) => setAboutIntro(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Who We Are</h2>
            <button onClick={() => setStoryVisible(!storyVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${storyVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {storyVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {storyVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Badge</label>
                  <button type="button" onClick={() => toggleStoryFv('badge')} className="text-slate-400 hover:text-slate-600">{fvAbout(storyFv, 'badge')}</button>
                </div>
                <input type="text" value={storyBadge} onChange={(e) => setStoryBadge(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <button type="button" onClick={() => toggleStoryFv('title')} className="text-slate-400 hover:text-slate-600">{fvAbout(storyFv, 'title')}</button>
                </div>
                <input type="text" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paragraphs</label>
              {storyParagraphs.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea value={p} onChange={(e) => { const u = [...storyParagraphs]; u[i] = e.target.value; setStoryParagraphs(u); }} rows={3} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <button onClick={() => setStoryParagraphs(storyParagraphs.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 self-start mt-2"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setStoryParagraphs([...storyParagraphs, ''])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Paragraph</button>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Our Approach</h2>
            <button onClick={() => setApproachVisible(!approachVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${approachVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {approachVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {approachVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Badge</label>
                <button type="button" onClick={() => toggleApproachFv('badge')} className="text-slate-400 hover:text-slate-600">{fvAbout(approachFv, 'badge')}</button>
              </div>
              <input type="text" value={approachBadge} onChange={(e) => setApproachBadge(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <button type="button" onClick={() => toggleApproachFv('title')} className="text-slate-400 hover:text-slate-600">{fvAbout(approachFv, 'title')}</button>
              </div>
              <input type="text" value={approachTitle} onChange={(e) => setApproachTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
              {approachSteps.map((step, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                  <input type="text" value={step.num} onChange={(e) => { const u = [...approachSteps]; u[i] = { ...u[i], num: e.target.value }; setApproachSteps(u); }} className="w-12 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center font-bold" />
                  <div className="flex-1 space-y-2">
                    <input type="text" value={step.title} onChange={(e) => { const u = [...approachSteps]; u[i] = { ...u[i], title: e.target.value }; setApproachSteps(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium" placeholder="Title" />
                    <input type="text" value={step.desc} onChange={(e) => { const u = [...approachSteps]; u[i] = { ...u[i], desc: e.target.value }; setApproachSteps(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Description" />
                  </div>
                  <button onClick={() => setApproachSteps(approachSteps.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 self-center"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setApproachSteps([...approachSteps, { num: String(approachSteps.length + 1), title: '', desc: '' }])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Step</button>
            </div>
          </div>
        </div>

        {/* Mission/Vision/Team */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mission / Vision / Team</h2>
            <button onClick={() => setMissionVisible(!missionVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${missionVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {missionVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {missionVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Badge</label>
                <button type="button" onClick={() => toggleMissionFv('badge')} className="text-slate-400 hover:text-slate-600">{fvAbout(missionFv, 'badge')}</button>
              </div>
              <input type="text" value={impactBadge} onChange={(e) => setImpactBadge(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {missionItems.map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <input type="text" value={item.title} onChange={(e) => { const u = [...missionItems]; u[i] = { ...u[i], title: e.target.value }; setMissionItems(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium" placeholder="Title" />
                  <textarea value={item.description} onChange={(e) => { const u = [...missionItems]; u[i] = { ...u[i], description: e.target.value }; setMissionItems(u); }} rows={2} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Description" />
                </div>
                <button onClick={() => setMissionItems(missionItems.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 self-center"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => setMissionItems([...missionItems, { title: '', description: '', iconColor: 'teal' }])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Item</button>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Core Values</h2>
            <button onClick={() => setValuesVisible(!valuesVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${valuesVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {valuesVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {valuesVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Badge</label>
                  <button type="button" onClick={() => toggleValuesFv('badge')} className="text-slate-400 hover:text-slate-600">{fvAbout(valuesFv, 'badge')}</button>
                </div>
                <input type="text" value={valuesBadge} onChange={(e) => setValuesBadge(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <button type="button" onClick={() => toggleValuesFv('title')} className="text-slate-400 hover:text-slate-600">{fvAbout(valuesFv, 'title')}</button>
                </div>
                <input type="text" value={valuesTitle} onChange={(e) => setValuesTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
            <div className="space-y-3">
              {coreValues.map((val, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={val.title} onChange={(e) => { const u = [...coreValues]; u[i] = { ...u[i], title: e.target.value }; setCoreValues(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium" placeholder="Title" />
                    <input type="text" value={val.description} onChange={(e) => { const u = [...coreValues]; u[i] = { ...u[i], description: e.target.value }; setCoreValues(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Description" />
                  </div>
                  <button onClick={() => setCoreValues(coreValues.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 self-center"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={() => setCoreValues([...coreValues, { title: '', description: '', iconColor: 'blue' }])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Value</button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CTA Section</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Heading</label>
                <button type="button" onClick={() => toggleCtaFv('heading')} className="text-slate-400 hover:text-slate-600">{fvAbout(ctaFv, 'heading')}</button>
              </div>
              <input type="text" value={aboutCtaHeading} onChange={(e) => setAboutCtaHeading(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Button</label>
                <button type="button" onClick={() => toggleCtaFv('button')} className="text-slate-400 hover:text-slate-600">{fvAbout(ctaFv, 'button')}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={aboutCtaButtonText} onChange={(e) => setAboutCtaButtonText(e.target.value)} placeholder="Button text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                <input type="text" value={aboutCtaButtonHref} onChange={(e) => setAboutCtaButtonHref(e.target.value)} placeholder="URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Stats Section</h2>
            <button onClick={() => setStatsVisible(!statsVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statsVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {statsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {statsVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-3">
            {aboutStats.map((stat, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <select
                  value={stat.icon}
                  onChange={(e) => { const u = [...aboutStats]; u[i] = { ...u[i], icon: e.target.value }; setAboutStats(u); }}
                  className="w-32 px-2 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  {STAT_ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex-1 space-y-2">
                  <input type="text" value={stat.value} onChange={(e) => { const u = [...aboutStats]; u[i] = { ...u[i], value: e.target.value }; setAboutStats(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium" placeholder="Value (e.g. 6, 48 hrs, 96%)" />
                  <input type="text" value={stat.label} onChange={(e) => { const u = [...aboutStats]; u[i] = { ...u[i], label: e.target.value }; setAboutStats(u); }} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" placeholder="Label (e.g. Practices, One Roof)" />
                </div>
                <button onClick={() => setAboutStats(aboutStats.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 self-center"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => setAboutStats([...aboutStats, { icon: 'Users', value: '', label: '' }])} className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80"><Plus size={16} /> Add Stat</button>
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
