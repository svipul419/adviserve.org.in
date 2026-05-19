// src/pages/admin/sections/SiteSettingsTemplateSection.tsx
import { Palette, Monitor, Sun } from 'lucide-react';

type Props = {
  theme: string;
  handleThemeChange: (t: 'dark' | 'light') => void;
};

const cardCls = 'bg-white border border-gray-200 rounded-xl p-6';
const headingCls = 'text-base font-semibold text-gray-900 mb-4';

export function SiteSettingsTemplateSection({ theme, handleThemeChange }: Props) {
  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-4">
        <Palette size={18} className="text-oxblood-primary" />
        <h2 className={headingCls}>Website Template</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Choose the visual design template for your public website. Changes apply immediately.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl">
        {/* Dark Editorial */}
        <button
          onClick={() => handleThemeChange('dark')}
          className={`text-left p-5 border rounded-lg transition-all duration-300 ${
 theme === 'dark'
 ? 'border-oxblood-primary bg-oxblood-primary/[0.06]'
 : 'border-gray-200 hover:border-gray-300'
 }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-900 border border-gray-300 rounded-lg flex items-center justify-center">
              <Monitor size={18} className="text-black" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Dark Editorial</div>
              <div className="text-xs text-gray-500">Current default</div>
            </div>
            {theme === 'dark' && (
              <span className="ml-auto px-2.5 py-1 bg-oxblood-primary text-black text-xs font-semibold rounded">
                Active
              </span>
            )}
          </div>
          <div className="flex gap-1 mb-3">
            <div className="w-8 h-8 bg-[#0f2333] border border-gray-200 rounded" title="#0f2333" />
            <div className="w-8 h-8 bg-[#132a3d] border border-gray-200 rounded" title="#132a3d" />
            <div className="w-8 h-8 bg-[#e8d5c4] border border-gray-200 rounded" title="#e8d5c4" />
            <div className="w-8 h-8 bg-oxblood-primary border border-gray-200 rounded" title="teal" />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Bold, dark theme with Bebas Neue display font, Space Mono labels, grain textures, and teal accents.
          </p>
        </button>

        {/* Light Clean */}
        <button
          onClick={() => handleThemeChange('light')}
          className={`text-left p-5 border rounded-lg transition-all duration-300 ${
 theme === 'light'
 ? 'border-oxblood-primary bg-oxblood-primary/[0.06]'
 : 'border-gray-200 hover:border-gray-300'
 }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white border border-[#e8e6e1] flex items-center justify-center rounded-lg">
              <Sun size={18} className="text-[#0A0E1A]" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Light Clean</div>
              <div className="text-xs text-gray-500">Formix-inspired</div>
            </div>
            {theme === 'light' && (
              <span className="ml-auto px-2.5 py-1 bg-oxblood-primary text-black text-xs font-semibold rounded">
                Active
              </span>
            )}
          </div>
          <div className="flex gap-1 mb-3">
            <div className="w-8 h-8 bg-white border border-gray-200 rounded" title="white" />
            <div className="w-8 h-8 bg-[#f5f4f0] border border-gray-200 rounded" title="#f5f4f0" />
            <div className="w-8 h-8 bg-white border border-gray-200 rounded" title="#0A0E1A" />
            <div className="w-8 h-8 bg-oxblood-primary border border-gray-200 rounded" title="teal" />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Clean, light theme with DM Serif Display headings, rounded corners, pill buttons, and warm grays.
          </p>
        </button>
      </div>
    </div>
  );
}
