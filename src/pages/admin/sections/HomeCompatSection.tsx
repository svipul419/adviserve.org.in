import React from 'react';
import { Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { LogoUploadBtn } from './LogoUploadBtn';

interface LogoCloudLogo { url: string; alt: string; link?: string; }
interface LogoCloudFieldVisibility { heading: boolean; }

type Props = {
  inp: string; inpSm: string;
  advantageBadge: string; setAdvantageBadge: (v: string) => void;
  advantageTitle: string; setAdvantageTitle: (v: string) => void;
  practicesBadge: string; setPracticesBadge: (v: string) => void;
  practicesTitle: string; setPracticesTitle: (v: string) => void;
  processBadge: string; setProcessBadge: (v: string) => void;
  processTitle: string; setProcessTitle: (v: string) => void;
  processSteps: { code: string; name: string; desc: string }[];
  setProcessSteps: (v: { code: string; name: string; desc: string }[]) => void;
  processStepsVisible: boolean; setProcessStepsVisible: (v: boolean) => void;
  processDescription: string; setProcessDescription: (v: string) => void;
  foundingYear: string; setFoundingYear: (v: string) => void;
  copyrightName: string; setCopyrightName: (v: string) => void;
  ctaSubtitleSecondary: string; setCtaSubtitleSecondary: (v: string) => void;
  ctaSecondaryText: string; setCtaSecondaryText: (v: string) => void;
  ctaSecondaryLink: string; setCtaSecondaryLink: (v: string) => void;
  logoCloudHeading: string; setLogoCloudHeading: (v: string) => void;
  logoCloudLogos: LogoCloudLogo[]; setLogoCloudLogos: (v: LogoCloudLogo[]) => void;
  logoCloudVisible: boolean; setLogoCloudVisible: (v: boolean) => void;
  logoCloudFieldVis: LogoCloudFieldVisibility; toggleLogoCloudField: (key: keyof LogoCloudFieldVisibility) => void;
  setDirty: (v: boolean) => void;
};

export function HomeCompatSection({
  inp, inpSm,
  advantageBadge, setAdvantageBadge,
  advantageTitle, setAdvantageTitle,
  practicesBadge, setPracticesBadge,
  practicesTitle, setPracticesTitle,
  processBadge, setProcessBadge,
  processTitle, setProcessTitle,
  processSteps, setProcessSteps,
  processStepsVisible, setProcessStepsVisible,
  processDescription, setProcessDescription,
  foundingYear, setFoundingYear,
  copyrightName, setCopyrightName,
  ctaSubtitleSecondary, setCtaSubtitleSecondary,
  ctaSecondaryText, setCtaSecondaryText,
  ctaSecondaryLink, setCtaSecondaryLink,
  logoCloudHeading, setLogoCloudHeading,
  logoCloudLogos, setLogoCloudLogos,
  logoCloudVisible, setLogoCloudVisible,
  logoCloudFieldVis, toggleLogoCloudField,
  setDirty,
}: Props) {
  return (
    <>
      {/* ═══ SECTION TITLES & BADGES (compat) ═══ */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Section Titles & Badges</h2>
        <p className="text-xs text-gray-400 mb-4">Stored in DB. The live site uses hardcoded section designs — update for future use.</p>
        <div className="space-y-4">
          {([
            ['00.02° Badge', advantageBadge, setAdvantageBadge],
            ['00.02° Title', advantageTitle, setAdvantageTitle],
            ['00.03° Practices Badge', practicesBadge, setPracticesBadge],
            ['00.03° Practices Title', practicesTitle, setPracticesTitle],
            ['00.04° Process Badge', processBadge, setProcessBadge],
            ['00.04° Process Title', processTitle, setProcessTitle],
          ] as [string, string, React.Dispatch<React.SetStateAction<string>>][]).reduce<React.ReactNode[]>((acc, item, i, arr) => {
            if (i % 2 === 0) {
              acc.push(
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{item[0]}</label><input type="text" value={item[1]} onChange={e => { item[2](e.target.value); setDirty(true); }} className={inp} /></div>
                  {arr[i + 1] && <div><label className="block text-sm font-medium text-gray-700 mb-1">{arr[i + 1][0]}</label><input type="text" value={arr[i + 1][1]} onChange={e => { arr[i + 1][2](e.target.value); setDirty(true); }} className={inp} /></div>}
                </div>
              );
            }
            return acc;
          }, [])}
        </div>
      </div>

      {/* ═══ PROCESS STEPS (compat) ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Process Steps</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setProcessStepsVisible(!processStepsVisible); setDirty(true); }}>{processStepsVisible ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}</button>
            <button type="button" onClick={() => { setProcessSteps([...processSteps, { code: String(processSteps.length + 1).padStart(2, '0'), name: '', desc: '' }]); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1"><Plus size={14} /> Add</button>
          </div>
        </div>
        {processSteps.map((step, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 space-y-3">
            <div className="flex justify-between"><span className="text-xs text-gray-500">Step {i + 1}</span><button type="button" onClick={() => { setProcessSteps(processSteps.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs text-gray-500 mb-1">Code</label><input type="text" value={step.code} onChange={e => { const u = [...processSteps]; u[i] = { ...u[i], code: e.target.value }; setProcessSteps(u); setDirty(true); }} className={inpSm} placeholder="01" /></div>
              <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">Name</label><input type="text" value={step.name} onChange={e => { const u = [...processSteps]; u[i] = { ...u[i], name: e.target.value }; setProcessSteps(u); setDirty(true); }} className={inpSm} /></div>
            </div>
            <div><label className="block text-xs text-gray-500 mb-1">Description</label><textarea rows={2} value={step.desc} onChange={e => { const u = [...processSteps]; u[i] = { ...u[i], desc: e.target.value }; setProcessSteps(u); setDirty(true); }} className={inpSm} /></div>
          </div>
        ))}
      </div>

      {/* ═══ FOOTER & BRANDING (compat) ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Footer & Branding</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Process Description</label><textarea value={processDescription} onChange={e => { setProcessDescription(e.target.value); setDirty(true); }} rows={2} className={inp} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Founding Year</label><input type="text" value={foundingYear} onChange={e => { setFoundingYear(e.target.value); setDirty(true); }} placeholder="2017" className={inp} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Copyright Name</label><input type="text" value={copyrightName} onChange={e => { setCopyrightName(e.target.value); setDirty(true); }} placeholder="Adviserve" className={inp} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">CTA Subtitle Secondary</label><input type="text" value={ctaSubtitleSecondary} onChange={e => { setCtaSubtitleSecondary(e.target.value); setDirty(true); }} className={inp} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Secondary Link Text</label><input type="text" value={ctaSecondaryText} onChange={e => { setCtaSecondaryText(e.target.value); setDirty(true); }} className={inp} /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Secondary Link URL</label><input type="text" value={ctaSecondaryLink} onChange={e => { setCtaSecondaryLink(e.target.value); setDirty(true); }} className={inp} /></div>
        </div>
      </div>

      {/* ═══ PARTNER LOGOS (Logo Cloud) ═══ */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Partner Logos</h2>
            <p className="text-xs text-gray-400 mt-0.5">Infinite-scroll logo strip — homepage only, between Final CTA and footer</p>
          </div>
          <button onClick={() => { setLogoCloudVisible(!logoCloudVisible); setDirty(true); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${logoCloudVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {logoCloudVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {logoCloudVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>

        {/* Heading field */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-1">
            <label className="text-sm font-medium text-gray-700">Section Heading</label>
            <button type="button" onClick={() => toggleLogoCloudField('heading')}
              title={logoCloudFieldVis.heading ? 'Hide on live site' : 'Show on live site'}
              className={`p-0.5 rounded transition-colors ${logoCloudFieldVis.heading ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
              {logoCloudFieldVis.heading ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            {!logoCloudFieldVis.heading && <span className="text-xs text-gray-400 italic">Hidden</span>}
          </div>
          <div className={logoCloudFieldVis.heading ? '' : 'opacity-40 pointer-events-none'}>
            <input type="text" value={logoCloudHeading}
              onChange={e => { setLogoCloudHeading(e.target.value); setDirty(true); }}
              placeholder="Trusted by teams across India"
              className={inp} />
          </div>
        </div>

        {/* Logo list */}
        <div className="space-y-3 mb-4">
          {logoCloudLogos.map((logo, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                {/* Preview */}
                {logo.url && (
                  <img src={logo.url} alt={logo.alt || ''}
                    className="h-10 w-auto max-w-[80px] object-contain rounded border border-gray-200 bg-white p-1 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Company Name / Alt Text</label>
                    <input type="text" value={logo.alt}
                      onChange={e => { const u = [...logoCloudLogos]; u[i] = { ...u[i], alt: e.target.value }; setLogoCloudLogos(u); setDirty(true); }}
                      placeholder="Acme Corp" className={inpSm} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                    <input type="text" value={logo.url}
                      onChange={e => { const u = [...logoCloudLogos]; u[i] = { ...u[i], url: e.target.value }; setLogoCloudLogos(u); setDirty(true); }}
                      placeholder="https://..." className={inpSm} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Link (optional)</label>
                    <input type="text" value={logo.link || ''}
                      onChange={e => { const u = [...logoCloudLogos]; u[i] = { ...u[i], link: e.target.value }; setLogoCloudLogos(u); setDirty(true); }}
                      placeholder="https://..." className={inpSm} />
                  </div>
                  <LogoUploadBtn onUploaded={url => { const u = [...logoCloudLogos]; u[i] = { ...u[i], url }; setLogoCloudLogos(u); setDirty(true); }} />
                </div>
                {/* Reorder + delete */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={() => { if (i === 0) return; const u = [...logoCloudLogos]; [u[i-1], u[i]] = [u[i], u[i-1]]; setLogoCloudLogos(u); setDirty(true); }}
                    disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-25 text-xs px-1 py-0.5">↑</button>
                  <button onClick={() => { if (i === logoCloudLogos.length - 1) return; const u = [...logoCloudLogos]; [u[i], u[i+1]] = [u[i+1], u[i]]; setLogoCloudLogos(u); setDirty(true); }}
                    disabled={i === logoCloudLogos.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-25 text-xs px-1 py-0.5">↓</button>
                  <button onClick={() => { setLogoCloudLogos(logoCloudLogos.filter((_, idx) => idx !== i)); setDirty(true); }}
                    className="text-red-500 hover:text-red-700 mt-1"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button"
          onClick={() => { setLogoCloudLogos([...logoCloudLogos, { url: '', alt: '', link: '' }]); setDirty(true); }}
          className="text-sm text-oxblood-primary hover:underline flex items-center gap-1 mt-2">
          <Plus size={14} /> Add Logo
        </button>
      </div>
    </>
  );
}
