import { RefreshCw, Search, MessageSquare, Sparkles, MapPin } from 'lucide-react';

type TabKey = 'seo_global' | 'aeo' | 'geo' | 'local_seo';

const TABS: { key: TabKey; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'seo_global', label: 'SEO Overview', icon: <Search size={18} />, description: 'Global SEO settings & meta configuration' },
  { key: 'aeo', label: 'AEO (Answer Engine)', icon: <MessageSquare size={18} />, description: 'FAQ & structured data for answer engines' },
  { key: 'geo', label: 'GEO (Generative Engine)', icon: <Sparkles size={18} />, description: 'AI & generative engine optimization' },
  { key: 'local_seo', label: 'Local SEO', icon: <MapPin size={18} />, description: 'Local business information & schema' },
];

interface SEOPageHeaderProps {
  activeTab: TabKey;
  loading: boolean;
  error: string | null;
  success: string | null;
  onTabChange: (tab: TabKey) => void;
  onRefresh: () => void;
}

export function SEOPageHeader({ activeTab, loading, error, success, onTabChange, onRefresh }: SEOPageHeaderProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO / AEO / GEO Optimization</h1>
          <p className="mt-1 text-gray-600">Manage search engine, answer engine, generative AI, and local SEO settings.</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 text-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
          {success}
        </div>
      )}

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
 activeTab === tab.key
 ? 'border-oxblood-primary text-oxblood-primary'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
 }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {TABS.find((t) => t.key === activeTab)?.description}
      </p>
    </>
  );
}
