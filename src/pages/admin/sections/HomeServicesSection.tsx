import { Eye, EyeOff, Trash2, Plus } from 'lucide-react';

interface ServiceVertical {
  number: string;
  name: string;
  description: string;
  outcomes: [string, string][];
  href: string;
  imageUrl: string;
  reverse: boolean;
}

interface PracticesFieldVisibility { badge: boolean; heading: boolean; }
interface ProductsFieldVisibility { badge: boolean; title: boolean; description: boolean; }

type Props = {
  inp: string; inpSm: string;
  serviceVerticals: ServiceVertical[]; setServiceVerticals: (v: ServiceVertical[]) => void;
  serviceVerticalsVisible: boolean; setServiceVerticalsVisible: (v: boolean) => void;
  practicesFieldVis: PracticesFieldVisibility; togglePracticesField: (key: keyof PracticesFieldVisibility) => void;
  practicesBadge: string; setPracticesBadge: (v: string) => void;
  practicesSectionHeading: string; setPracticesSectionHeading: (v: string) => void;
  productsFieldVis: ProductsFieldVisibility; toggleProductsField: (key: keyof ProductsFieldVisibility) => void;
  productsHeaderBadge: string; setProductsHeaderBadge: (v: string) => void;
  productsHeaderTitle: string; setProductsHeaderTitle: (v: string) => void;
  productsHeaderDescription: string; setProductsHeaderDescription: (v: string) => void;
  setDirty: (v: boolean) => void;
};

export function HomeServicesSection({
  inp, inpSm,
  serviceVerticals, setServiceVerticals,
  serviceVerticalsVisible, setServiceVerticalsVisible,
  practicesFieldVis, togglePracticesField,
  practicesBadge, setPracticesBadge,
  practicesSectionHeading, setPracticesSectionHeading,
  productsFieldVis, toggleProductsField,
  productsHeaderBadge, setProductsHeaderBadge,
  productsHeaderTitle, setProductsHeaderTitle,
  productsHeaderDescription, setProductsHeaderDescription,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ SERVICE VERTICALS ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Service Verticals</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setServiceVerticalsVisible(!serviceVerticalsVisible); setDirty(true); }}>{serviceVerticalsVisible ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}</button>
            <button type="button" onClick={() => { setServiceVerticals([...serviceVerticals, { number: String(serviceVerticals.length + 1).padStart(2, '0'), name: '', description: '', outcomes: [], href: '', imageUrl: '', reverse: serviceVerticals.length % 2 !== 0 }]); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add</button>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          {/* Practices badge */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Practices Badge</label>
              <button type="button" onClick={() => togglePracticesField('badge')} title={practicesFieldVis.badge ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${practicesFieldVis.badge ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {practicesFieldVis.badge ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!practicesFieldVis.badge && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={practicesFieldVis.badge ? '' : 'opacity-40 pointer-events-none'}>
              <input type="text" value={practicesBadge} onChange={e => { setPracticesBadge(e.target.value); setDirty(true); }} placeholder="e.g. // 00.03° — The Practices" className={inp} />
            </div>
          </div>
          {/* Practices heading */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Practices Section Heading</label>
              <button type="button" onClick={() => togglePracticesField('heading')} title={practicesFieldVis.heading ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${practicesFieldVis.heading ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {practicesFieldVis.heading ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!practicesFieldVis.heading && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={practicesFieldVis.heading ? '' : 'opacity-40 pointer-events-none'}>
              <input type="text" value={practicesSectionHeading} onChange={e => { setPracticesSectionHeading(e.target.value); setDirty(true); }} placeholder="e.g. What we actually do." className={inp} />
            </div>
          </div>
        </div>
        {serviceVerticals.map((sv, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">/{sv.number || String(i + 1).padStart(2, '0')} {sv.name}</span>
              <button type="button" onClick={() => { setServiceVerticals(serviceVerticals.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Number</label><input type="text" value={sv.number} onChange={e => { const u = [...serviceVerticals]; u[i] = { ...u[i], number: e.target.value }; setServiceVerticals(u); setDirty(true); }} className={inpSm} placeholder="01" /></div>
              <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Name</label><input type="text" value={sv.name} onChange={e => { const u = [...serviceVerticals]; u[i] = { ...u[i], name: e.target.value }; setServiceVerticals(u); setDirty(true); }} className={inpSm} placeholder="Recruitment" /></div>
            </div>
            <div><label className="block text-xs text-gray-500 mb-1">Description</label><textarea rows={2} value={sv.description} onChange={e => { const u = [...serviceVerticals]; u[i] = { ...u[i], description: e.target.value }; setServiceVerticals(u); setDirty(true); }} className={inpSm} /></div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Outcomes (label · value pairs)</label>
              {sv.outcomes.map(([label, value], oi) => (
                <div key={oi} className="flex gap-2 mb-1">
                  <input type="text" value={label} onChange={e => { const u = [...serviceVerticals]; const o = [...u[i].outcomes] as [string,string][]; o[oi] = [e.target.value, o[oi][1]]; u[i] = { ...u[i], outcomes: o }; setServiceVerticals(u); setDirty(true); }} className={`flex-1 ${inpSm}`} placeholder="Label (e.g. Avg time-to-offer)" />
                  <input type="text" value={value} onChange={e => { const u = [...serviceVerticals]; const o = [...u[i].outcomes] as [string,string][]; o[oi] = [o[oi][0], e.target.value]; u[i] = { ...u[i], outcomes: o }; setServiceVerticals(u); setDirty(true); }} className={`flex-1 ${inpSm}`} placeholder="Value (e.g. 22 days)" />
                  <button type="button" onClick={() => { const u = [...serviceVerticals]; u[i] = { ...u[i], outcomes: u[i].outcomes.filter((_, oidx) => oidx !== oi) }; setServiceVerticals(u); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={12} /></button>
                </div>
              ))}
              <button type="button" onClick={() => { const u = [...serviceVerticals]; u[i] = { ...u[i], outcomes: [...u[i].outcomes, ['', '']] as [string,string][] }; setServiceVerticals(u); setDirty(true); }} className="text-xs text-oxblood-primary hover:underline flex items-center gap-1 mt-1"><Plus size={11} /> Add outcome</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Link (href)</label><input type="text" value={sv.href} onChange={e => { const u = [...serviceVerticals]; u[i] = { ...u[i], href: e.target.value }; setServiceVerticals(u); setDirty(true); }} className={inpSm} placeholder="/services/recruitment" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Image URL</label><input type="text" value={sv.imageUrl} onChange={e => { const u = [...serviceVerticals]; u[i] = { ...u[i], imageUrl: e.target.value }; setServiceVerticals(u); setDirty(true); }} className={inpSm} placeholder="https://images.unsplash.com/..." /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`sv-rev-${i}`} checked={sv.reverse} onChange={e => { const u = [...serviceVerticals]; u[i] = { ...u[i], reverse: e.target.checked }; setServiceVerticals(u); setDirty(true); }} className="rounded" />
              <label htmlFor={`sv-rev-${i}`} className="text-xs text-gray-600">Reverse layout (image on left)</label>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ PRODUCTS SECTION HEADER ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Products Section Header</h2>
        <p className="text-xs text-gray-400 mb-4">Header text above the animated product cards.</p>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Badge</label>
              <button type="button" onClick={() => toggleProductsField('badge')} title={productsFieldVis.badge ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${productsFieldVis.badge ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {productsFieldVis.badge ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!productsFieldVis.badge && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={productsFieldVis.badge ? '' : 'opacity-40 pointer-events-none'}>
              <input type="text" value={productsHeaderBadge} onChange={e => { setProductsHeaderBadge(e.target.value); setDirty(true); }} placeholder="PRODUCTS" className={inp} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Heading</label>
              <button type="button" onClick={() => toggleProductsField('title')} title={productsFieldVis.title ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${productsFieldVis.title ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {productsFieldVis.title ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!productsFieldVis.title && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={productsFieldVis.title ? '' : 'opacity-40 pointer-events-none'}>
              <input type="text" value={productsHeaderTitle} onChange={e => { setProductsHeaderTitle(e.target.value); setDirty(true); }} placeholder="Your organization, managed your way." className={inp} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <button type="button" onClick={() => toggleProductsField('description')} title={productsFieldVis.description ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${productsFieldVis.description ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                {productsFieldVis.description ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              {!productsFieldVis.description && <span className="text-xs text-gray-400 italic">Hidden</span>}
            </div>
            <div className={productsFieldVis.description ? '' : 'opacity-40 pointer-events-none'}>
              <textarea rows={2} value={productsHeaderDescription} onChange={e => { setProductsHeaderDescription(e.target.value); setDirty(true); }} className={inp} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
