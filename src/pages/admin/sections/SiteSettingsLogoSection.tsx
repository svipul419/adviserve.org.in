// src/pages/admin/sections/SiteSettingsLogoSection.tsx
import { RefObject } from 'react';
import { Image, Upload, X } from 'lucide-react';

type Props = {
  logoUrl: string;
  setLogoUrl: (v: string) => void;
  faviconUrl: string;
  setFaviconUrl: (v: string) => void;
  logoUploading: boolean;
  logoInputRef: RefObject<HTMLInputElement>;
  faviconInputRef: RefObject<HTMLInputElement>;
  handleLogoUpload: (file: File, type: 'logo' | 'favicon') => void;
  handleLogoUrlSave: (type: 'logo' | 'favicon', url: string) => void;
  saveSiteAsset: (type: 'logo' | 'favicon', url: string) => void;
};

const cardCls = 'bg-white border border-gray-200 rounded-xl p-6';
const headingCls = 'text-base font-semibold text-gray-900 mb-4';
const inputCls = 'w-full px-4 py-2.5 min-h-[44px] text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

export function SiteSettingsLogoSection({
  logoUrl, setLogoUrl, faviconUrl, setFaviconUrl,
  logoUploading, logoInputRef, faviconInputRef,
  handleLogoUpload, handleLogoUrlSave, saveSiteAsset,
}: Props) {
  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-4">
        <Image size={18} className="text-oxblood-primary" />
        <h2 className={headingCls}>Logo & Favicon</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Logo */}
        <div>
          <label className={labelCls}>Site Logo</label>
          {logoUrl && !logoUrl.includes('C:\\') && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Current logo"
                className="h-12 w-auto max-w-[160px] object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                onClick={() => { setLogoUrl(''); saveSiteAsset('logo', ''); }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
                title="Remove logo"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div
            className="border-2 border-dashed border-gray-300 hover:border-oxblood-hover/40 rounded-lg p-6 text-center cursor-pointer transition-colors mb-3"
            onClick={() => logoInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-oxblood-primary/60', 'bg-oxblood-primary/[0.04]'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('border-oxblood-primary/60', 'bg-oxblood-primary/[0.04]'); }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-oxblood-primary/60', 'bg-oxblood-primary/[0.04]');
              const file = e.dataTransfer.files[0];
              if (file) handleLogoUpload(file, 'logo');
            }}
          >
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file, 'logo');
                e.target.value = '';
              }}
            />
            <Upload size={20} className="mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 mb-1">
              {logoUploading ? 'Uploading...' : 'Click or drag & drop to upload'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, SVG, WebP — max 2MB</p>
          </div>
          <div>
            <label className={labelCls}>Or paste a URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className={inputCls}
                placeholder="https://example.com/logo.png or /logo.svg"
              />
              <button
                onClick={() => handleLogoUrlSave('logo', logoUrl)}
                className="text-sm bg-oxblood-primary text-black px-3 py-2 rounded-lg hover:bg-oxblood-hover/80 transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div>
          <label className={labelCls}>Favicon</label>
          {faviconUrl && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3 flex items-center gap-3">
              <img
                src={faviconUrl}
                alt="Current favicon"
                className="h-8 w-8 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                onClick={() => { setFaviconUrl(''); saveSiteAsset('favicon', ''); }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-auto"
                title="Remove favicon"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div
            className="border-2 border-dashed border-gray-300 hover:border-oxblood-hover/40 rounded-lg p-6 text-center cursor-pointer transition-colors mb-3"
            onClick={() => faviconInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-oxblood-primary/60'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('border-oxblood-primary/60'); }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-oxblood-primary/60');
              const file = e.dataTransfer.files[0];
              if (file) handleLogoUpload(file, 'favicon');
            }}
          >
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*,.svg,.ico"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleLogoUpload(file, 'favicon');
              }}
            />
            <Upload size={20} className="mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 mb-1">
              {logoUploading ? 'Uploading...' : 'Click or drag & drop'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, SVG, ICO</p>
          </div>
          <div>
            <label className={labelCls}>Or paste a URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                className={inputCls}
                placeholder="/favicon.ico"
              />
              <button
                onClick={() => handleLogoUrlSave('favicon', faviconUrl)}
                className="text-sm bg-oxblood-primary text-black px-3 py-2 rounded-lg hover:bg-oxblood-hover/80 transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      {logoUrl && !logoUrl.includes('C:\\') && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <p className={`${labelCls} mb-3`}>Live Preview — Header</p>
          <div className="bg-[#0f2333] border border-gray-200 rounded-lg px-6 py-3 flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Logo preview"
              className="h-7 w-auto object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = '/adviserve-logo.png'; }}
            />
            <span className="font-display text-lg tracking-wider text-[#e8d5c4]">ADVISERVE</span>
            <div className="ml-auto flex gap-6">
              {['Home', 'Services', 'About'].map(item => (
                <span key={item} className="text-xs text-[#e8d5c4]/55">{item}</span>
              ))}
            </div>
            <span className="text-xs bg-[#e8d5c4] text-[#0f2333] px-4 py-1.5 ml-4 rounded">Contact</span>
          </div>
          <p className={`${labelCls} mt-4 mb-3`}>Live Preview — Dark Background</p>
          <div className="bg-[#0a1a28] p-6 flex items-center justify-center rounded-lg">
            <img src={logoUrl} alt="Logo on dark" className="h-16 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/adviserve-logo.png'; }} />
          </div>
          <p className={`${labelCls} mt-4 mb-3`}>Live Preview — Light Background</p>
          <div className="bg-white border border-gray-200 p-6 flex items-center justify-center rounded-lg">
            <img src={logoUrl} alt="Logo on light" className="h-16 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/adviserve-logo.png'; }} />
          </div>
        </div>
      )}
    </div>
  );
}
