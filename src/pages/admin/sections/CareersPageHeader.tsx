import { Save } from 'lucide-react';

interface Tab {
  key: 'hero' | 'benefits' | 'culture' | 'positions';
  label: string;
}

interface CareersPageHeaderProps {
  saving: boolean;
  activeTab: Tab['key'];
  tabs: Tab[];
  onSave: () => void;
  onTabChange: (key: Tab['key']) => void;
}

export function CareersPageHeader({ saving, activeTab, tabs, onSave, onTabChange }: CareersPageHeaderProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Careers Editor</h1>
          <p className="mt-1 text-gray-600">Manage the careers page content and job positions</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Page Content'}
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
 activeTab === tab.key
 ? 'bg-white text-gray-900 shadow-sm'
 : 'text-gray-600 hover:text-gray-900'
 }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
