// src/pages/admin/sections/CareersCultureSection.tsx
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

interface CultureItem {
  title: string;
  description: string;
}

type Props = {
  culture: CultureItem[];
  cultureVisible: boolean;
  setCultureVisible: (v: boolean) => void;
  updateCulture: (index: number, field: keyof CultureItem, value: string) => void;
  addCulture: () => void;
  removeCulture: (index: number) => void;
  moveCulture: (index: number, direction: 'up' | 'down') => void;
  setDirty: (v: boolean) => void;
};

export function CareersCultureSection({
  culture, cultureVisible, setCultureVisible,
  updateCulture, addCulture, removeCulture, moveCulture, setDirty,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Culture Highlights</h2>
        <button
          onClick={() => { setCultureVisible(!cultureVisible); setDirty(true); }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${cultureVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {cultureVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          {cultureVisible ? 'Visible' : 'Hidden'}
        </button>
      </div>
      <div className="space-y-4">
        {culture.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Highlight #{index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveCulture(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveCulture(index, 'down')}
                  disabled={index === culture.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => removeCulture(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove highlight"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateCulture(index, 'title', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateCulture(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCulture}
          className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80 font-medium"
        >
          <Plus size={16} /> Add Culture Highlight
        </button>
      </div>
    </div>
  );
}
