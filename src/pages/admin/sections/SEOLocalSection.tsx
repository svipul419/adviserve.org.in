// src/pages/admin/sections/SEOLocalSection.tsx
import { Save, Plus, Trash2 } from 'lucide-react';

interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

type LocalSeoSettings = {
  business_name: string;
  business_type: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  website: string;
  google_business_url: string;
  opening_hours: string;
  service_areas: string;
};

type Props = {
  localSeoSettings: LocalSeoSettings;
  setLocalSeoSettings: (v: LocalSeoSettings) => void;
  saving: boolean;
  handleSaveLocalSeo: () => void;
  getOpeningHours: () => OpeningHour[];
  updateOpeningHour: (dayIndex: number, field: 'open' | 'close', value: string) => void;
  getServiceAreas: () => string[];
  addServiceArea: () => void;
  updateServiceArea: (index: number, value: string) => void;
  removeServiceArea: (index: number) => void;
};

export function SEOLocalSection({
  localSeoSettings, setLocalSeoSettings, saving, handleSaveLocalSeo,
  getOpeningHours, updateOpeningHour, getServiceAreas, addServiceArea, updateServiceArea, removeServiceArea,
}: Props) {
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const openingHours = getOpeningHours();
  const serviceAreas = getServiceAreas();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Information</h3>
        <p className="text-sm text-gray-500 mb-4">Core business details used for LocalBusiness schema markup.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Business Name</label>
            <input
              type="text"
              value={localSeoSettings.business_name}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, business_name: e.target.value })}
              className={inputClass}
              placeholder="Adviserve Talent & Consulting"
            />
          </div>
          <div>
            <label className={labelClass}>Business Type</label>
            <select
              value={localSeoSettings.business_type}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, business_type: e.target.value })}
              className={inputClass}
            >
              <option value="">Select type...</option>
              <option value="ProfessionalService">Professional Service</option>
              <option value="ConsultingAgency">Consulting Agency</option>
              <option value="EmploymentAgency">Employment Agency</option>
              <option value="Corporation">Corporation</option>
              <option value="LocalBusiness">Local Business</option>
              <option value="Organization">Organization</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
        <p className="text-sm text-gray-500 mb-4">Full business address for local search visibility.</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              value={localSeoSettings.street_address}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, street_address: e.target.value })}
              className={inputClass}
              placeholder="123 Business Park, Suite 100"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={localSeoSettings.city}
                onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, city: e.target.value })}
                className={inputClass}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className={labelClass}>State / Province</label>
              <input
                type="text"
                value={localSeoSettings.state}
                onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, state: e.target.value })}
                className={inputClass}
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                type="text"
                value={localSeoSettings.postal_code}
                onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, postal_code: e.target.value })}
                className={inputClass}
                placeholder="400001"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                value={localSeoSettings.country}
                onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, country: e.target.value })}
                className={inputClass}
                placeholder="India"
              />
            </div>
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="text"
                value={localSeoSettings.latitude}
                onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, latitude: e.target.value })}
                className={inputClass}
                placeholder="19.0760"
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="text"
                value={localSeoSettings.longitude}
                onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, longitude: e.target.value })}
                className={inputClass}
                placeholder="72.8777"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Details</h3>
        <p className="text-sm text-gray-500 mb-4">Contact information for local search and schema markup.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={localSeoSettings.phone}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, phone: e.target.value })}
              className={inputClass}
              placeholder="+91-XXX-XXX-XXXX"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={localSeoSettings.email}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, email: e.target.value })}
              className={inputClass}
              placeholder="info@adviserve.org.in"
            />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input
              type="url"
              value={localSeoSettings.website}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, website: e.target.value })}
              className={inputClass}
              placeholder="https://adviserve.org.in"
            />
          </div>
          <div>
            <label className={labelClass}>Google Business Profile URL</label>
            <input
              type="url"
              value={localSeoSettings.google_business_url}
              onChange={(e) => setLocalSeoSettings({ ...localSeoSettings, google_business_url: e.target.value })}
              className={inputClass}
              placeholder="https://g.page/your-business"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Opening Hours</h3>
        <p className="text-sm text-gray-500 mb-4">Set business hours for each day of the week.</p>
        <div className="space-y-3">
          {openingHours.map((hour, index) => (
            <div key={hour.day} className="grid grid-cols-3 gap-3 items-center">
              <span className="text-sm font-medium text-gray-700">{hour.day}</span>
              <div>
                <input
                  type="time"
                  value={hour.open}
                  onChange={(e) => updateOpeningHour(index, 'open', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <input
                  type="time"
                  value={hour.close}
                  onChange={(e) => updateOpeningHour(index, 'close', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Leave both fields at 00:00 for closed days.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Service Areas</h3>
            <p className="text-sm text-gray-500">Regions or cities your business serves.</p>
          </div>
          <button onClick={addServiceArea} className="flex items-center gap-1 bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
            <Plus size={16} />
            Add Area
          </button>
        </div>
        {serviceAreas.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-sm">No service areas defined yet.</div>
        ) : (
          <div className="space-y-2">
            {serviceAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => updateServiceArea(index, e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Mumbai Metropolitan Region"
                />
                <button onClick={() => removeServiceArea(index)} className="p-2 text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveLocalSeo} disabled={saving} className="flex items-center gap-2 bg-oxblood-primary text-black px-6 py-2 rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 disabled:cursor-not-allowed">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Local SEO Settings'}
        </button>
      </div>
    </div>
  );
}
