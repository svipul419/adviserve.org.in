// src/pages/admin/sections/SEOAeoSection.tsx
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import type { FAQItem } from './seoTypes';
import Toggle from './SettingsToggle';

type Props = {
  aeoSettings: {
    faq_schema_enabled: string;
    howto_schema_enabled: string;
    speakable_enabled: string;
    entity_summary: string;
  };
  setAeoSettings: (v: Props['aeoSettings']) => void;
  faqItems: FAQItem[];
  saving: boolean;
  handleSaveAeo: () => void;
  addFaqItem: () => void;
  updateFaqItem: (index: number, field: keyof FAQItem, value: string | boolean | null) => void;
  removeFaqItem: (index: number) => void;
  moveFaqItem: (index: number, direction: 'up' | 'down') => void;
  saveFaqItems: () => void;
};

export function SEOAeoSection({
  aeoSettings, setAeoSettings, faqItems, saving,
  handleSaveAeo, addFaqItem, updateFaqItem, removeFaqItem, moveFaqItem, saveFaqItems,
}: Props) {
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Structured Data Toggles</h3>
        <p className="text-sm text-gray-500 mb-4">Enable or disable structured data schemas for answer engine visibility.</p>
        <div className="space-y-4">
          <Toggle
            label="FAQ Schema (FAQPage structured data)"
            enabled={aeoSettings.faq_schema_enabled === 'true'}
            onChange={(v) => setAeoSettings({ ...aeoSettings, faq_schema_enabled: String(v) })}
          />
          <Toggle
            label="HowTo Schema (HowTo structured data)"
            enabled={aeoSettings.howto_schema_enabled === 'true'}
            onChange={(v) => setAeoSettings({ ...aeoSettings, howto_schema_enabled: String(v) })}
          />
          <Toggle
            label="Speakable (Voice search optimization)"
            enabled={aeoSettings.speakable_enabled === 'true'}
            onChange={(v) => setAeoSettings({ ...aeoSettings, speakable_enabled: String(v) })}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Entity Summary</h3>
        <p className="text-sm text-gray-500 mb-4">A concise summary that answer engines can reference about your organization.</p>
        <textarea
          value={aeoSettings.entity_summary}
          onChange={(e) => setAeoSettings({ ...aeoSettings, entity_summary: e.target.value })}
          className={inputClass}
          rows={4}
          placeholder="Adviserve Talent & Consulting is a full-service advisory firm specializing in..."
        />
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveAeo} disabled={saving} className="flex items-center gap-2 bg-oxblood-primary text-black px-6 py-2 rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save AEO Settings'}
        </button>
      </div>

      {/* FAQ Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">FAQ Items</h3>
            <p className="text-sm text-gray-500">Manage frequently asked questions for FAQ schema markup.</p>
          </div>
          <button onClick={addFaqItem} className="flex items-center gap-1 bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
            <Plus size={16} />
            Add FAQ
          </button>
        </div>

        {faqItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No FAQ items yet. Click &quot;Add FAQ&quot; to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={item.id || `new-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase">FAQ #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateFaqItem(index, 'is_visible', !item.is_visible)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={item.is_visible ? 'Hide' : 'Show'}
                    >
                      {item.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => moveFaqItem(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => moveFaqItem(index, 'down')} disabled={index === faqItems.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <ChevronDown size={16} />
                    </button>
                    <button onClick={() => removeFaqItem(index)} className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      className={inputClass}
                      placeholder="What services does Adviserve offer?"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Answer</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      className={inputClass}
                      rows={3}
                      placeholder="Adviserve offers end-to-end consulting services including..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Page Type</label>
                      <select
                        value={item.page_type}
                        onChange={(e) => updateFaqItem(index, 'page_type', e.target.value)}
                        className={inputClass}
                      >
                        <option value="global">Global</option>
                        <option value="home">Home</option>
                        <option value="service">Service</option>
                        <option value="about">About</option>
                        <option value="contact">Contact</option>
                        <option value="blog">Blog</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Page Ref ID (optional)</label>
                      <input
                        type="text"
                        value={item.page_ref_id || ''}
                        onChange={(e) => updateFaqItem(index, 'page_ref_id', e.target.value || null)}
                        className={inputClass}
                        placeholder="UUID of specific page/service"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {faqItems.length > 0 && (
          <div className="flex justify-end mt-4">
            <button onClick={saveFaqItems} disabled={saving} className="flex items-center gap-2 bg-oxblood-primary text-black px-6 py-2 rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 disabled:cursor-not-allowed">
              <Save size={18} />
              {saving ? 'Saving...' : 'Save FAQ Items'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
