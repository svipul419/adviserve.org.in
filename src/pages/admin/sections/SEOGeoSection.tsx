// src/pages/admin/sections/SEOGeoSection.tsx
import { Save } from 'lucide-react';
import Toggle from './SettingsToggle';

type Props = {
  geoSettings: {
    entity_description: string;
    key_facts_json: string;
    authoritative_sources: string;
    ai_optimization_enabled: string;
  };
  setGeoSettings: (v: Props['geoSettings']) => void;
  saving: boolean;
  handleSaveGeo: () => void;
};

export function SEOGeoSection({ geoSettings, setGeoSettings, saving, handleSaveGeo }: Props) {
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Entity Description</h3>
        <p className="text-sm text-gray-500 mb-4">A detailed description of your organization for generative AI models to reference.</p>
        <textarea
          value={geoSettings.entity_description}
          onChange={(e) => setGeoSettings({ ...geoSettings, entity_description: e.target.value })}
          className={inputClass}
          rows={5}
          placeholder="Adviserve Talent & Consulting is a premier advisory firm headquartered in India, providing comprehensive business consulting, talent acquisition, digital transformation, and strategic advisory services to enterprises..."
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Key Facts</h3>
        <p className="text-sm text-gray-500 mb-4">Structured key facts in JSON format that AI engines can extract. Example: {`[{"label":"Founded","value":"2020"},{"label":"HQ","value":"India"}]`}</p>
        <textarea
          value={geoSettings.key_facts_json}
          onChange={(e) => setGeoSettings({ ...geoSettings, key_facts_json: e.target.value })}
          className={`${inputClass} font-mono text-sm`}
          rows={8}
          placeholder='[{"label":"Founded","value":"2020"},{"label":"Headquarters","value":"India"}]'
        />
        {(() => {
          try {
            JSON.parse(geoSettings.key_facts_json);
            return <p className="text-xs text-green-600 mt-1">Valid JSON</p>;
          } catch {
            return <p className="text-xs text-red-600 mt-1">Invalid JSON - please fix before saving</p>;
          }
        })()}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Authoritative Sources</h3>
        <p className="text-sm text-gray-500 mb-4">JSON array of authoritative references. Example: {`[{"title":"LinkedIn","url":"https://linkedin.com/company/adviserve"}]`}</p>
        <textarea
          value={geoSettings.authoritative_sources}
          onChange={(e) => setGeoSettings({ ...geoSettings, authoritative_sources: e.target.value })}
          className={`${inputClass} font-mono text-sm`}
          rows={6}
          placeholder='[{"title":"LinkedIn","url":"https://linkedin.com/company/adviserve"}]'
        />
        {(() => {
          try {
            JSON.parse(geoSettings.authoritative_sources);
            return <p className="text-xs text-green-600 mt-1">Valid JSON</p>;
          } catch {
            return <p className="text-xs text-red-600 mt-1">Invalid JSON - please fix before saving</p>;
          }
        })()}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Optimization</h3>
        <p className="text-sm text-gray-500 mb-4">Master toggle for generative engine optimization features.</p>
        <Toggle
          label="Enable AI/GEO Optimization"
          enabled={geoSettings.ai_optimization_enabled === 'true'}
          onChange={(v) => setGeoSettings({ ...geoSettings, ai_optimization_enabled: String(v) })}
        />
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveGeo} disabled={saving} className="flex items-center gap-2 bg-oxblood-primary text-black px-6 py-2 rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save GEO Settings'}
        </button>
      </div>
    </div>
  );
}
