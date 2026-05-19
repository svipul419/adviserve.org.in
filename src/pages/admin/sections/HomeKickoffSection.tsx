import { Eye, EyeOff, Trash2, Plus } from 'lucide-react';

interface KickoffNodeEdit { pill: string; heading: string; body: string; }

type Props = {
  inp: string; inpSm: string;
  kickoffVisible: boolean; setKickoffVisible: (v: boolean) => void;
  kickoffHeading: string; setKickoffHeading: (v: string) => void;
  kickoffSubtitle: string; setKickoffSubtitle: (v: string) => void;
  kickoffCtaText: string; setKickoffCtaText: (v: string) => void;
  kickoffCtaHref: string; setKickoffCtaHref: (v: string) => void;
  kickoffNodes: KickoffNodeEdit[]; setKickoffNodes: (v: KickoffNodeEdit[]) => void;
  setDirty: (v: boolean) => void;
};

export function HomeKickoffSection({
  inp, inpSm,
  kickoffVisible, setKickoffVisible,
  kickoffHeading, setKickoffHeading,
  kickoffSubtitle, setKickoffSubtitle,
  kickoffCtaText, setKickoffCtaText,
  kickoffCtaHref, setKickoffCtaHref,
  kickoffNodes, setKickoffNodes,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ KICKOFF SECTION ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold text-gray-900">Kickoff Section</h2>
          <button onClick={() => { setKickoffVisible(!kickoffVisible); setDirty(true); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${kickoffVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {kickoffVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {kickoffVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <p className="text-xs text-amber-600 font-medium mb-1">⟶ Renders on the About page (/about)</p>
        <p className="text-xs text-gray-400 mb-4">Heading supports two lines separated by \n — line 2 renders in accent style.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading (use \n to split lines)</label>
            <textarea rows={2} value={kickoffHeading} onChange={e => { setKickoffHeading(e.target.value); setDirty(true); }} className={inp} placeholder="Day zero is when work starts.\nNot when paperwork ends." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea rows={2} value={kickoffSubtitle} onChange={e => { setKickoffSubtitle(e.target.value); setDirty(true); }} className={inp} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label><input type="text" value={kickoffCtaText} onChange={e => { setKickoffCtaText(e.target.value); setDirty(true); }} className={inp} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Link</label><input type="text" value={kickoffCtaHref} onChange={e => { setKickoffCtaHref(e.target.value); setDirty(true); }} className={inp} /></div>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Kickoff Steps (4 columns)</label>
              <button type="button" onClick={() => { setKickoffNodes([...kickoffNodes, { pill: `/ 0${kickoffNodes.length + 1}`, heading: '', body: '' }]); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add Step</button>
            </div>
            {kickoffNodes.map((node, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Step {i + 1}</span>
                  <button type="button" onClick={() => { setKickoffNodes(kickoffNodes.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-xs text-gray-500 mb-1">Pill (e.g. "/ 01")</label><input type="text" value={node.pill} onChange={e => { const u = [...kickoffNodes]; u[i] = { ...u[i], pill: e.target.value }; setKickoffNodes(u); setDirty(true); }} className={inpSm} /></div>
                  <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Heading</label><input type="text" value={node.heading} onChange={e => { const u = [...kickoffNodes]; u[i] = { ...u[i], heading: e.target.value }; setKickoffNodes(u); setDirty(true); }} className={inpSm} /></div>
                </div>
                <div><label className="block text-xs text-gray-500 mb-1">Body</label><textarea rows={2} value={node.body} onChange={e => { const u = [...kickoffNodes]; u[i] = { ...u[i], body: e.target.value }; setKickoffNodes(u); setDirty(true); }} className={inpSm} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
