import { Eye, EyeOff } from 'lucide-react';

interface CtaFieldVisibility { badge: boolean; heading: boolean; description: boolean; primary_cta: boolean; secondary_cta: boolean; reassurance: boolean; }

type Props = {
  inp: string;
  ctaVisible: boolean; setCtaVisible: (v: boolean) => void;
  ctaFieldVis: CtaFieldVisibility; toggleCtaField: (key: keyof CtaFieldVisibility) => void;
  ctaTitle: string; setCtaTitle: (v: string) => void;
  ctaDescription: string; setCtaDescription: (v: string) => void;
  ctaButtonText: string; setCtaButtonText: (v: string) => void;
  ctaButtonLink: string; setCtaButtonLink: (v: string) => void;
  setDirty: (v: boolean) => void;
};

export function HomeCTASection({
  inp,
  ctaVisible, setCtaVisible,
  ctaFieldVis, toggleCtaField,
  ctaTitle, setCtaTitle,
  ctaDescription, setCtaDescription,
  ctaButtonText, setCtaButtonText,
  ctaButtonLink, setCtaButtonLink,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ FINAL CTA ═══ */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Final CTA Section</h2>
          <button onClick={() => { setCtaVisible(!ctaVisible); setDirty(true); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${ctaVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {ctaVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {ctaVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <div className="space-y-4">
          {/* Badge row (hardcoded "LET'S TALK" on live site) */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-700">Badge ("LET'S TALK")</span>
            <button type="button" onClick={() => toggleCtaField('badge')} title={ctaFieldVis.badge ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${ctaFieldVis.badge ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
              {ctaFieldVis.badge ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            {!ctaFieldVis.badge && <span className="text-xs text-gray-400 italic">Hidden</span>}
          </div>
          {/* Heading */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <button type="button" onClick={() => toggleCtaField('heading')} title={ctaFieldVis.heading ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${ctaFieldVis.heading ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {ctaFieldVis.heading ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!ctaFieldVis.heading && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={ctaFieldVis.heading ? '' : 'opacity-40 pointer-events-none'}>
              <input type="text" value={ctaTitle} onChange={e => { setCtaTitle(e.target.value); setDirty(true); }} className={inp} />
            </div>
          </div>
          {/* Description */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <button type="button" onClick={() => toggleCtaField('description')} title={ctaFieldVis.description ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${ctaFieldVis.description ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {ctaFieldVis.description ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!ctaFieldVis.description && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={ctaFieldVis.description ? '' : 'opacity-40 pointer-events-none'}>
              <textarea value={ctaDescription} onChange={e => { setCtaDescription(e.target.value); setDirty(true); }} rows={2} className={inp} />
            </div>
          </div>
          {/* Primary CTA */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Primary CTA</label>
              <button type="button" onClick={() => toggleCtaField('primary_cta')} title={ctaFieldVis.primary_cta ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${ctaFieldVis.primary_cta ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {ctaFieldVis.primary_cta ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!ctaFieldVis.primary_cta && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${ctaFieldVis.primary_cta ? '' : 'opacity-40 pointer-events-none'}`}>
              <div><label className="block text-xs text-gray-500 mb-1">Button Text</label><input type="text" value={ctaButtonText} onChange={e => { setCtaButtonText(e.target.value); setDirty(true); }} className={inp} /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Button Link</label><input type="text" value={ctaButtonLink} onChange={e => { setCtaButtonLink(e.target.value); setDirty(true); }} className={inp} /></div>
            </div>
          </div>
          {/* Secondary CTA + Reassurance (hardcoded on live) */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-700">Secondary CTA ("Email us")</span>
              <button type="button" onClick={() => toggleCtaField('secondary_cta')} className={`p-0.5 rounded transition-colors ${ctaFieldVis.secondary_cta ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {ctaFieldVis.secondary_cta ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!ctaFieldVis.secondary_cta && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-700">Reassurance line</span>
              <button type="button" onClick={() => toggleCtaField('reassurance')} className={`p-0.5 rounded transition-colors ${ctaFieldVis.reassurance ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {ctaFieldVis.reassurance ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!ctaFieldVis.reassurance && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
