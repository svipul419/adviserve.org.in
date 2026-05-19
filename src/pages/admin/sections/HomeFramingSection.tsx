import { Eye, EyeOff, Trash2, Plus } from 'lucide-react';

interface FramingFieldVisibility { badge: boolean; heading: boolean; body1: boolean; body2: boolean; cta: boolean; }
interface FrameworkCardEdit { label: string; heading: string; body: string; backHeading: string; backBody: string; }

type Props = {
  inp: string; inpSm: string;
  framingVisible: boolean; setFramingVisible: (v: boolean) => void;
  framingFieldVis: FramingFieldVisibility; toggleFramingField: (key: keyof FramingFieldVisibility) => void;
  advantageBadge: string; setAdvantageBadge: (v: string) => void;
  framingHeading: string; setFramingHeading: (v: string) => void;
  framingBody1: string; setFramingBody1: (v: string) => void;
  framingBody2: string; setFramingBody2: (v: string) => void;
  frameworkVisible: boolean; setFrameworkVisible: (v: boolean) => void;
  frameworkCards: FrameworkCardEdit[]; setFrameworkCards: (v: FrameworkCardEdit[]) => void;
  setDirty: (v: boolean) => void;
};

export function HomeFramingSection({
  inp, inpSm,
  framingVisible, setFramingVisible,
  framingFieldVis, toggleFramingField,
  advantageBadge, setAdvantageBadge,
  framingHeading, setFramingHeading,
  framingBody1, setFramingBody1,
  framingBody2, setFramingBody2,
  frameworkVisible, setFrameworkVisible,
  frameworkCards, setFrameworkCards,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ FRAMING SECTION (00.02°) ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-gray-900">Framing Section (00.02°)</h2>
          <button onClick={() => { setFramingVisible(!framingVisible); setDirty(true); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${framingVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {framingVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {framingVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-4">Heading supports two lines separated by \n — line 2 renders in gradient style.</p>
        <div className="space-y-4">
          {/* Badge */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Badge</label>
              <button type="button" onClick={() => toggleFramingField('badge')} title={framingFieldVis.badge ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${framingFieldVis.badge ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {framingFieldVis.badge ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!framingFieldVis.badge && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={framingFieldVis.badge ? '' : 'opacity-40 pointer-events-none'}>
              <input type="text" value={advantageBadge} onChange={e => { setAdvantageBadge(e.target.value); setDirty(true); }} placeholder="// 00.02° — One Firm, Six Practices" className={inp} />
            </div>
          </div>
          {/* Heading */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Heading (use \n to split lines)</label>
              <button type="button" onClick={() => toggleFramingField('heading')} title={framingFieldVis.heading ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${framingFieldVis.heading ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {framingFieldVis.heading ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!framingFieldVis.heading && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={framingFieldVis.heading ? '' : 'opacity-40 pointer-events-none'}>
              <textarea rows={2} value={framingHeading} onChange={e => { setFramingHeading(e.target.value); setDirty(true); }} className={inp} placeholder="Six practices. One team.\nOne throat to choke." />
            </div>
          </div>
          {/* Body 1 */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Body Paragraph 1</label>
              <button type="button" onClick={() => toggleFramingField('body1')} title={framingFieldVis.body1 ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${framingFieldVis.body1 ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {framingFieldVis.body1 ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!framingFieldVis.body1 && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={framingFieldVis.body1 ? '' : 'opacity-40 pointer-events-none'}>
              <textarea rows={2} value={framingBody1} onChange={e => { setFramingBody1(e.target.value); setDirty(true); }} className={inp} />
            </div>
          </div>
          {/* Body 2 */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Body Paragraph 2</label>
              <button type="button" onClick={() => toggleFramingField('body2')} title={framingFieldVis.body2 ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${framingFieldVis.body2 ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {framingFieldVis.body2 ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!framingFieldVis.body2 && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={framingFieldVis.body2 ? '' : 'opacity-40 pointer-events-none'}>
              <textarea rows={3} value={framingBody2} onChange={e => { setFramingBody2(e.target.value); setDirty(true); }} className={inp} />
            </div>
          </div>
          {/* CTA link */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-700">CTA Link ("See how we work →")</span>
            <button type="button" onClick={() => toggleFramingField('cta')} title={framingFieldVis.cta ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${framingFieldVis.cta ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
              {framingFieldVis.cta ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            {!framingFieldVis.cta && <span className="text-xs text-gray-400 italic">Hidden</span>}
          </div>
        </div>
      </div>

      {/* ═══ FRAMEWORK CARDS (00.02.A°) ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-gray-900">Framework Cards (00.02.A°)</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => { setFrameworkVisible(!frameworkVisible); setDirty(true); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${frameworkVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {frameworkVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {frameworkVisible ? 'Visible' : 'Hidden'}
            </button>
            <button type="button" onClick={() => { setFrameworkCards([...frameworkCards, { label: '', heading: '', body: '', backHeading: '', backBody: '' }]); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add Card</button>
          </div>
        </div>
        <p className="text-xs text-amber-600 font-medium mb-1">⟶ Renders on the About page (/about)</p>
        <p className="text-xs text-gray-400 mb-4">3-column flipping cards. Each card has a front face (label + heading + body) and a back face (backHeading + backBody).</p>
        {frameworkCards.map((card, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Card {i + 1}</span>
              <button type="button" onClick={() => { setFrameworkCards(frameworkCards.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Label (mono tag e.g. "01 — THE PROBLEM")</label>
              <input type="text" value={card.label} onChange={e => { const u = [...frameworkCards]; u[i] = { ...u[i], label: e.target.value }; setFrameworkCards(u); setDirty(true); }} className={inpSm} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Front — Heading</label>
                <input type="text" value={card.heading} onChange={e => { const u = [...frameworkCards]; u[i] = { ...u[i], heading: e.target.value }; setFrameworkCards(u); setDirty(true); }} className={inpSm} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Back — Heading</label>
                <input type="text" value={card.backHeading} onChange={e => { const u = [...frameworkCards]; u[i] = { ...u[i], backHeading: e.target.value }; setFrameworkCards(u); setDirty(true); }} className={inpSm} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Front — Body</label>
              <textarea rows={2} value={card.body} onChange={e => { const u = [...frameworkCards]; u[i] = { ...u[i], body: e.target.value }; setFrameworkCards(u); setDirty(true); }} className={inpSm} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Back — Body</label>
              <textarea rows={2} value={card.backBody} onChange={e => { const u = [...frameworkCards]; u[i] = { ...u[i], backBody: e.target.value }; setFrameworkCards(u); setDirty(true); }} className={inpSm} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
