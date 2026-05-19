// src/pages/admin/sections/WebsiteAssetsSection.tsx
import { Save, X, Pencil as Edit2 } from 'lucide-react';

interface SiteAssets {
  id: string;
  logo_url: string;
  favicon_url: string;
}

type Props = {
  siteAssets: SiteAssets | null;
  setSiteAssets: (v: SiteAssets) => void;
  isEditingAssets: boolean;
  setIsEditingAssets: (v: boolean) => void;
  saveSiteAssets: () => void;
  fetchSiteAssets: () => void;
};

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';

export function WebsiteAssetsSection({
  siteAssets, setSiteAssets, isEditingAssets, setIsEditingAssets, saveSiteAssets, fetchSiteAssets,
}: Props) {
  if (!siteAssets) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Logo & Favicon</h2>
      <div className="space-y-4">
        {isEditingAssets ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="text"
                value={siteAssets.logo_url}
                onChange={(e) => setSiteAssets({ ...siteAssets, logo_url: e.target.value })}
                className={inputClass}
                placeholder="/path/to/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a path relative to public folder (e.g., /logo.png) or full URL
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
              <input
                type="text"
                value={siteAssets.favicon_url}
                onChange={(e) => setSiteAssets({ ...siteAssets, favicon_url: e.target.value })}
                className={inputClass}
                placeholder="/path/to/favicon.ico"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a path relative to public folder (e.g., /favicon.ico) or full URL
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveSiteAssets}
                className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={() => { setIsEditingAssets(false); fetchSiteAssets(); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                {siteAssets.logo_url && (
                  <img src={siteAssets.logo_url} alt="Site Logo" className="h-20 w-auto mb-2 border rounded p-2" />
                )}
                <p className="text-sm text-gray-600">{siteAssets.logo_url}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                {siteAssets.favicon_url && (
                  <img src={siteAssets.favicon_url} alt="Favicon" className="h-8 w-auto mb-2 border rounded p-2" />
                )}
                <p className="text-sm text-gray-600">{siteAssets.favicon_url}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingAssets(true)}
              className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
            >
              <Edit2 size={18} />
              Edit Logo & Favicon
            </button>
          </>
        )}
      </div>
    </div>
  );
}
