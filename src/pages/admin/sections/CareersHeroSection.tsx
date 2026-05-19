// src/pages/admin/sections/CareersHeroSection.tsx
import { Eye, EyeOff } from 'lucide-react';

type Props = {
  heroTitle: string;
  setHeroTitle: (v: string) => void;
  heroSubtitle: string;
  setHeroSubtitle: (v: string) => void;
  heroVisible: boolean;
  setHeroVisible: (v: boolean) => void;
  ctaTitle: string;
  setCtaTitle: (v: string) => void;
  ctaDescription: string;
  setCtaDescription: (v: string) => void;
  ctaVisible: boolean;
  setCtaVisible: (v: boolean) => void;
  applyModalHeader: string;
  setApplyModalHeader: (v: string) => void;
  applyModalLabels: { name: string; email: string; phone: string; linkedin: string; resume: string; cover: string };
  setApplyModalLabels: (v: Props['applyModalLabels']) => void;
  applyModalCoverPlaceholder: string;
  setApplyModalCoverPlaceholder: (v: string) => void;
  applyModalBtnSubmit: string;
  setApplyModalBtnSubmit: (v: string) => void;
  applyModalReceivedTitle: string;
  setApplyModalReceivedTitle: (v: string) => void;
  applyModalReceivedText: string;
  setApplyModalReceivedText: (v: string) => void;
  heroFv: Record<string, boolean>;
  ctaFv: Record<string, boolean>;
  modalFv: Record<string, boolean>;
  toggleHeroFv: (key: string) => void;
  toggleCtaFv: (key: string) => void;
  toggleModalFv: (key: string) => void;
  fvIcon: (fv: Record<string, boolean>, key: string) => React.ReactNode;
  setDirty: (v: boolean) => void;
};

export function CareersHeroSection({
  heroTitle, setHeroTitle, heroSubtitle, setHeroSubtitle, heroVisible, setHeroVisible,
  ctaTitle, setCtaTitle, ctaDescription, setCtaDescription, ctaVisible, setCtaVisible,
  applyModalHeader, setApplyModalHeader, applyModalLabels, setApplyModalLabels,
  applyModalCoverPlaceholder, setApplyModalCoverPlaceholder,
  applyModalBtnSubmit, setApplyModalBtnSubmit,
  applyModalReceivedTitle, setApplyModalReceivedTitle,
  applyModalReceivedText, setApplyModalReceivedText,
  heroFv, ctaFv, modalFv, toggleHeroFv, toggleCtaFv, toggleModalFv, fvIcon, setDirty,
}: Props) {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Hero Section</h2>
          <button
            onClick={() => { setHeroVisible(!heroVisible); setDirty(true); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${heroVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
          >
            {heroVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {heroVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Hero Title</label>
              <button type="button" onClick={() => toggleHeroFv('title')} className="text-slate-400 hover:text-slate-600">{fvIcon(heroFv, 'title')}</button>
            </div>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Hero Subtitle</label>
              <button type="button" onClick={() => toggleHeroFv('subtitle')} className="text-slate-400 hover:text-slate-600">{fvIcon(heroFv, 'subtitle')}</button>
            </div>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">CTA Section</h2>
          <button
            onClick={() => { setCtaVisible(!ctaVisible); setDirty(true); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${ctaVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
          >
            {ctaVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            {ctaVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">CTA Title</label>
              <button type="button" onClick={() => toggleCtaFv('title')} className="text-slate-400 hover:text-slate-600">{fvIcon(ctaFv, 'title')}</button>
            </div>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">CTA Description</label>
              <button type="button" onClick={() => toggleCtaFv('description')} className="text-slate-400 hover:text-slate-600">{fvIcon(ctaFv, 'description')}</button>
            </div>
            <textarea
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply Modal</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Modal header text</label>
              <button type="button" onClick={() => toggleModalFv('header')} className="text-slate-400 hover:text-slate-600">{fvIcon(modalFv, 'header')}</button>
            </div>
            <input type="text" value={applyModalHeader} onChange={(e) => setApplyModalHeader(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Field labels</p>
              <button type="button" onClick={() => toggleModalFv('labels')} className="text-slate-400 hover:text-slate-600">{fvIcon(modalFv, 'labels')}</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['name', 'email', 'phone', 'linkedin', 'resume', 'cover'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field}</label>
                  <input type="text" value={applyModalLabels[field]} onChange={(e) => setApplyModalLabels({ ...applyModalLabels, [field]: e.target.value })} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Cover message placeholder</label>
              <button type="button" onClick={() => toggleModalFv('cover_placeholder')} className="text-slate-400 hover:text-slate-600">{fvIcon(modalFv, 'cover_placeholder')}</button>
            </div>
            <input type="text" value={applyModalCoverPlaceholder} onChange={(e) => setApplyModalCoverPlaceholder(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Submit button text</label>
              <button type="button" onClick={() => toggleModalFv('submit_btn')} className="text-slate-400 hover:text-slate-600">{fvIcon(modalFv, 'submit_btn')}</button>
            </div>
            <input type="text" value={applyModalBtnSubmit} onChange={(e) => setApplyModalBtnSubmit(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Received confirmation</label>
              <button type="button" onClick={() => toggleModalFv('received')} className="text-slate-400 hover:text-slate-600">{fvIcon(modalFv, 'received')}</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={applyModalReceivedTitle} onChange={(e) => setApplyModalReceivedTitle(e.target.value)} placeholder="Title" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
              <input type="text" value={applyModalReceivedText} onChange={(e) => setApplyModalReceivedText(e.target.value)} placeholder="Message" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
