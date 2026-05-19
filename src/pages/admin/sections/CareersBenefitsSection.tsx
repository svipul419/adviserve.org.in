// src/pages/admin/sections/CareersBenefitsSection.tsx
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

const ICON_OPTIONS = [
  { value: 'globe', label: 'Globe' },
  { value: 'book-open', label: 'Book Open' },
  { value: 'layers', label: 'Layers' },
  { value: 'zap', label: 'Zap' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'heart', label: 'Heart' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'users', label: 'Users' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'star', label: 'Star' },
  { value: 'award', label: 'Award' },
  { value: 'target', label: 'Target' },
];

type Props = {
  benefits: BenefitItem[];
  benefitsVisible: boolean;
  setBenefitsVisible: (v: boolean) => void;
  updateBenefit: (index: number, field: keyof BenefitItem, value: string) => void;
  addBenefit: () => void;
  removeBenefit: (index: number) => void;
  moveBenefit: (index: number, direction: 'up' | 'down') => void;
  setDirty: (v: boolean) => void;
};

export function CareersBenefitsSection({
  benefits, benefitsVisible, setBenefitsVisible,
  updateBenefit, addBenefit, removeBenefit, moveBenefit, setDirty,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Benefits</h2>
        <button
          onClick={() => { setBenefitsVisible(!benefitsVisible); setDirty(true); }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${benefitsVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {benefitsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          {benefitsVisible ? 'Visible' : 'Hidden'}
        </button>
      </div>
      <div className="space-y-4">
        {benefits.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">Benefit #{index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveBenefit(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveBenefit(index, 'down')}
                  disabled={index === benefits.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => removeBenefit(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove benefit"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={item.icon}
                    onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addBenefit}
          className="flex items-center gap-2 text-sm text-oxblood-primary hover:text-oxblood-hover/80 font-medium"
        >
          <Plus size={16} /> Add Benefit
        </button>
      </div>
    </div>
  );
}
