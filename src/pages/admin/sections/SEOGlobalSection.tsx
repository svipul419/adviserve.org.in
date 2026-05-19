// src/pages/admin/sections/SEOGlobalSection.tsx
import { Save } from 'lucide-react';

type Props = {
  seoGlobal: {
    site_title: string;
    site_description: string;
    og_image_url: string;
    google_analytics_id: string;
    search_console_verification: string;
    bing_verification: string;
    robots_txt: string;
  };
  setSeoGlobal: (v: Props['seoGlobal']) => void;
  saving: boolean;
  handleSaveSeoGlobal: () => void;
};

function SerpPreview({ seoGlobal }: { seoGlobal: Props['seoGlobal'] }) {
  const title = seoGlobal.site_title || 'Your Site Title';
  const desc = seoGlobal.site_description || 'Your site description will appear here. Add a meta description to control what search engines display.';
  const url = 'https://adviserve.org.in';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">SERP Preview</h3>
      <p className="text-xs text-gray-500 mb-4">This is how your site may appear in Google search results.</p>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-w-2xl">
        <div className="text-sm text-green-700 truncate">{url}</div>
        <div className="text-xl text-blue-700 hover:underline cursor-pointer truncate mt-0.5">
          {title.length > 60 ? title.substring(0, 60) + '...' : title}
        </div>
        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
          {desc.length > 160 ? desc.substring(0, 160) + '...' : desc}
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>Title: <span className={seoGlobal.site_title.length > 60 ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>{seoGlobal.site_title.length}/60</span></span>
        <span>Description: <span className={seoGlobal.site_description.length < 120 || seoGlobal.site_description.length > 160 ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>{seoGlobal.site_description.length}/160</span></span>
      </div>
    </div>
  );
}

export function SEOGlobalSection({ seoGlobal, setSeoGlobal, saving, handleSaveSeoGlobal }: Props) {
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <SerpPreview seoGlobal={seoGlobal} />

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Meta & Open Graph</h3>
        <p className="text-sm text-gray-500 mb-4">Configure the default meta tags for your website.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Site Title</label>
            <input
              type="text"
              value={seoGlobal.site_title}
              onChange={(e) => setSeoGlobal({ ...seoGlobal, site_title: e.target.value })}
              className={inputClass}
              placeholder="Adviserve Talent & Consulting | End-to-End Business Solutions"
            />
          </div>
          <div>
            <label className={labelClass}>Site Description</label>
            <textarea
              value={seoGlobal.site_description}
              onChange={(e) => setSeoGlobal({ ...seoGlobal, site_description: e.target.value })}
              className={inputClass}
              rows={3}
              placeholder="Professional consulting services for talent acquisition, business development, and digital transformation."
            />
          </div>
          <div>
            <label className={labelClass}>Default OG Image URL</label>
            <input
              type="url"
              value={seoGlobal.og_image_url}
              onChange={(e) => setSeoGlobal({ ...seoGlobal, og_image_url: e.target.value })}
              className={inputClass}
              placeholder="https://adviserve.org.in/og-image.jpg"
            />
            <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630 pixels</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Search Engine Verification</h3>
        <p className="text-sm text-gray-500 mb-4">Add verification codes for search engine webmaster tools.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Google Analytics ID</label>
            <input
              type="text"
              value={seoGlobal.google_analytics_id}
              onChange={(e) => setSeoGlobal({ ...seoGlobal, google_analytics_id: e.target.value })}
              className={inputClass}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className={labelClass}>Google Search Console Verification</label>
            <input
              type="text"
              value={seoGlobal.search_console_verification}
              onChange={(e) => setSeoGlobal({ ...seoGlobal, search_console_verification: e.target.value })}
              className={inputClass}
              placeholder="Meta tag content value"
            />
          </div>
          <div>
            <label className={labelClass}>Bing Webmaster Verification</label>
            <input
              type="text"
              value={seoGlobal.bing_verification}
              onChange={(e) => setSeoGlobal({ ...seoGlobal, bing_verification: e.target.value })}
              className={inputClass}
              placeholder="Meta tag content value"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">robots.txt</h3>
        <p className="text-sm text-gray-500 mb-4">Control how search engines crawl your site.</p>
        <textarea
          value={seoGlobal.robots_txt}
          onChange={(e) => setSeoGlobal({ ...seoGlobal, robots_txt: e.target.value })}
          className={`${inputClass} font-mono text-sm`}
          rows={6}
          placeholder="User-agent: *&#10;Allow: /"
        />
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveSeoGlobal} disabled={saving} className="flex items-center gap-2 bg-oxblood-primary text-black px-6 py-2 rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>
    </div>
  );
}
