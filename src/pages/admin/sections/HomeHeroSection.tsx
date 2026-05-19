// src/pages/admin/sections/HomeHeroSection.tsx
import React from 'react';
import { Eye, EyeOff, Upload, Trash2, Plus } from 'lucide-react';

type HeroFieldVisibility = {
  badge: boolean; h1_line1: boolean; h1_line2: boolean;
  credibility_line: boolean; primary_cta: boolean; secondary_cta: boolean;
  video: boolean; trust_strip: boolean;
};

type Props = {
  inp: string; inpSm: string;
  heroBadgeText: string; setHeroBadgeText: (v: string) => void;
  heroTitle: string; setHeroTitle: (v: string) => void;
  heroH1Prefix: string; setHeroH1Prefix: (v: string) => void;
  heroSubtitle: string; setHeroSubtitle: (v: string) => void;
  heroCtaText: string; setHeroCtaText: (v: string) => void;
  heroCtaLink: string; setHeroCtaLink: (v: string) => void;
  heroSecondaryText: string; setHeroSecondaryText: (v: string) => void;
  heroSecondaryLink: string; setHeroSecondaryLink: (v: string) => void;
  heroVisible: boolean; setHeroVisible: (v: boolean) => void;
  heroFieldVis: HeroFieldVisibility;
  toggleHeroField: (key: keyof HeroFieldVisibility) => void;
  heroVideoUrl: string; setHeroVideoUrl: (v: string) => void;
  heroVideoUploading: boolean; heroVideoProgress: number;
  videoInputRef: React.RefObject<HTMLInputElement>;
  handleVideoUpload: (f: File) => void;
  scramblePhrases: string[]; setScramblePhrases: (v: string[]) => void;
  heroTrustItems: string[]; setHeroTrustItems: (v: string[]) => void;
  setDirty: (v: boolean) => void;
};

export function HomeHeroSection({ inp, inpSm, heroBadgeText, setHeroBadgeText, heroTitle, setHeroTitle, heroH1Prefix, setHeroH1Prefix, heroSubtitle, setHeroSubtitle, heroCtaText, setHeroCtaText, heroCtaLink, setHeroCtaLink, heroSecondaryText, setHeroSecondaryText, heroSecondaryLink, setHeroSecondaryLink, heroVisible, setHeroVisible, heroFieldVis, toggleHeroField, heroVideoUrl, setHeroVideoUrl, heroVideoUploading, heroVideoProgress, videoInputRef, handleVideoUpload, scramblePhrases, setScramblePhrases, heroTrustItems, setHeroTrustItems, setDirty }: Props) {
  return (
    <>
        {/* ═══ HERO ═══ */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
            <button onClick={() => setHeroVisible(!heroVisible)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${heroVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {heroVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              {heroVisible ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <div className="space-y-4">
            {/* Badge */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium text-gray-700">Badge Text</label>
                <button type="button" onClick={() => toggleHeroField('badge')} title={heroFieldVis.badge ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${heroFieldVis.badge ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                  {heroFieldVis.badge ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {!heroFieldVis.badge && <span className="text-xs text-gray-400 italic">Hidden</span>}
              </div>
              <div className={heroFieldVis.badge ? '' : 'opacity-40 pointer-events-none'}>
                <input type="text" value={heroBadgeText} onChange={e => setHeroBadgeText(e.target.value)} className={inp} />
              </div>
            </div>
            {/* H1 Line 1 */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium text-gray-700">H1 Line 1 (main headline)</label>
                <button type="button" onClick={() => toggleHeroField('h1_line1')} title={heroFieldVis.h1_line1 ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${heroFieldVis.h1_line1 ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                  {heroFieldVis.h1_line1 ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {!heroFieldVis.h1_line1 && <span className="text-xs text-gray-400 italic">Hidden</span>}
              </div>
              <div className={heroFieldVis.h1_line1 ? '' : 'opacity-40 pointer-events-none'}>
                <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="e.g. You build what you do best." className={inp} />
              </div>
            </div>
            {/* H1 Line 2 */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium text-gray-700">H1 Line 2 Prefix + Rotating Words</label>
                <button type="button" onClick={() => toggleHeroField('h1_line2')} title={heroFieldVis.h1_line2 ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${heroFieldVis.h1_line2 ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                  {heroFieldVis.h1_line2 ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {!heroFieldVis.h1_line2 && <span className="text-xs text-gray-400 italic">Hidden</span>}
              </div>
              {!heroFieldVis.h1_line1 && !heroFieldVis.h1_line2 && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-1">Both H1 lines hidden — heading invisible on live site.</p>
              )}
              <div className={heroFieldVis.h1_line2 ? '' : 'opacity-40 pointer-events-none'}>
                <input type="text" value={heroH1Prefix} onChange={e => setHeroH1Prefix(e.target.value)} placeholder="e.g. We own the" className={inp} />
                <p className="mt-1 text-xs text-gray-400">The rotating word (e.g. "Hiring.") appends automatically after this prefix. Rotating words card below shares this toggle.</p>
              </div>
            </div>
            {/* Credibility Line */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium text-gray-700">Credibility Line (mono font below headline)</label>
                <button type="button" onClick={() => toggleHeroField('credibility_line')} title={heroFieldVis.credibility_line ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${heroFieldVis.credibility_line ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                  {heroFieldVis.credibility_line ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {!heroFieldVis.credibility_line && <span className="text-xs text-gray-400 italic">Hidden</span>}
              </div>
              <div className={heroFieldVis.credibility_line ? '' : 'opacity-40 pointer-events-none'}>
                <input type="text" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="Use · as separator" className={inp} />
              </div>
            </div>
            {/* Primary CTA */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium text-gray-700">Primary CTA</label>
                <button type="button" onClick={() => toggleHeroField('primary_cta')} title={heroFieldVis.primary_cta ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${heroFieldVis.primary_cta ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                  {heroFieldVis.primary_cta ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {!heroFieldVis.primary_cta && <span className="text-xs text-gray-400 italic">Hidden</span>}
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${heroFieldVis.primary_cta ? '' : 'opacity-40 pointer-events-none'}`}>
                <div><label className="block text-xs text-gray-500 mb-1">Button Text</label><input type="text" value={heroCtaText} onChange={e => setHeroCtaText(e.target.value)} className={inp} /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Button Link</label><input type="text" value={heroCtaLink} onChange={e => setHeroCtaLink(e.target.value)} className={inp} /></div>
              </div>
            </div>
            {/* Secondary CTA */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium text-gray-700">Secondary CTA</label>
                <button type="button" onClick={() => toggleHeroField('secondary_cta')} title={heroFieldVis.secondary_cta ? 'Hide on live site' : 'Show on live site'} className={`p-0.5 rounded transition-colors ${heroFieldVis.secondary_cta ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'}`}>
                  {heroFieldVis.secondary_cta ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {!heroFieldVis.secondary_cta && <span className="text-xs text-gray-400 italic">Hidden</span>}
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${heroFieldVis.secondary_cta ? '' : 'opacity-40 pointer-events-none'}`}>
                <div><label className="block text-xs text-gray-500 mb-1">Button Text</label><input type="text" value={heroSecondaryText} onChange={e => setHeroSecondaryText(e.target.value)} className={inp} /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Button Link</label><input type="text" value={heroSecondaryLink} onChange={e => setHeroSecondaryLink(e.target.value)} className={inp} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ HERO VIDEO ═══ */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-gray-900">Hero Background Video</h2>
            <button type="button" onClick={() => toggleHeroField('video')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${heroFieldVis.video ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {heroFieldVis.video ? <Eye size={13} /> : <EyeOff size={13} />}
              {heroFieldVis.video ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">Paste a URL or upload a video file (MP4, WebM, MOV — max 100 MB). Hit "Save All Changes" after uploading.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="text"
                value={heroVideoUrl}
                onChange={e => { setHeroVideoUrl(e.target.value); setDirty(true); }}
                placeholder="/Hero-BG.mp4 or https://..."
                className={inp}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); e.target.value = ''; }}
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={heroVideoUploading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <Upload size={15} />
                  {heroVideoUploading ? `Uploading… ${heroVideoProgress}%` : 'Upload Video File'}
                </button>
                <span className="text-xs text-gray-400">MP4, WebM, MOV, MKV — max 500 MB</span>
              </div>
              {heroVideoUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-oxblood-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${heroVideoProgress}%` }}
                  />
                </div>
              )}
            </div>
            {heroVideoUrl && heroVideoUrl.startsWith('http') && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview</p>
                <video key={heroVideoUrl} src={heroVideoUrl} controls width={320} className="rounded-lg border border-gray-200" />
              </div>
            )}
          </div>
        </div>

        {/* ═══ ROTATING WORDS ═══ */}
        <div className={`bg-white rounded-xl shadow p-6 transition-opacity ${heroFieldVis.h1_line2 ? '' : 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Hero Rotating Words</h2>
            <span className="text-xs text-gray-400 italic">Visibility tied to H1 Line 2 toggle</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">One word per line — appended after the H1 Line 2 Prefix (e.g. "We own the Hiring.")</p>
          {scramblePhrases.map((phrase, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" value={phrase} onChange={e => { const u = [...scramblePhrases]; u[i] = e.target.value; setScramblePhrases(u); setDirty(true); }} className={`flex-1 ${inpSm}`} placeholder="e.g. Hiring." />
              <button type="button" onClick={() => { setScramblePhrases(scramblePhrases.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => { setScramblePhrases([...scramblePhrases, '']); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1 mt-2"><Plus size={14} /> Add Word</button>
        </div>

        {/* ═══ TRUST ITEMS ═══ */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Hero Trust Items</h2>
            <button type="button" onClick={() => toggleHeroField('trust_strip')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${heroFieldVis.trust_strip ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
              {heroFieldVis.trust_strip ? <Eye size={13} /> : <EyeOff size={13} />}
              {heroFieldVis.trust_strip ? 'Visible' : 'Hidden'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">Small credibility signals shown below the CTA buttons</p>
          {heroTrustItems.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" value={item} onChange={e => { const u = [...heroTrustItems]; u[i] = e.target.value; setHeroTrustItems(u); setDirty(true); }} className={`flex-1 ${inpSm}`} placeholder="e.g. 3,000+ placements" />
              <button type="button" onClick={() => { setHeroTrustItems(heroTrustItems.filter((_, idx) => idx !== i)); setDirty(true); }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => { setHeroTrustItems([...heroTrustItems, '']); setDirty(true); }} className="text-sm text-oxblood-primary hover:underline flex items-center gap-1 mt-2"><Plus size={14} /> Add Item</button>
        </div>
    </>
  );
}
