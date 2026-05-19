import { Save } from 'lucide-react';

interface CareersSaveFooterProps {
  saving: boolean;
  activeTab: string;
  onSave: () => void;
}

export function CareersSaveFooter({ saving, activeTab, onSave }: CareersSaveFooterProps) {
  if (activeTab === 'positions') return null;
  return (
    <div className="flex justify-end pb-8">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400"
      >
        <Save size={18} />
        {saving ? 'Saving...' : 'Save Page Content'}
      </button>
    </div>
  );
}
