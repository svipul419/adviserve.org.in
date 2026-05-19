// src/pages/admin/sections/SiteSettingsBookingSection.tsx

interface Settings {
  company_email: string;
  company_phone: string;
  company_address: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
  website_url: string;
  booking_available_days: string;
  booking_time_start: string;
  booking_time_end: string;
  booking_slot_duration: string;
}

type Props = {
  settings: Settings;
  setSettings: (v: Settings) => void;
};

const cardCls = 'bg-white border border-gray-200 rounded-xl p-6';
const headingCls = 'text-base font-semibold text-gray-900 mb-4';
const inputCls = 'w-full px-4 py-2.5 min-h-[44px] text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

export function SiteSettingsBookingSection({ settings, setSettings }: Props) {
  return (
    <div className={cardCls}>
      <h2 className={headingCls}>Booking Configuration</h2>
      <p className="text-sm text-gray-500 mb-4">
        Configure available days and time slots for the consultation booking form.
      </p>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Available Days</label>
          <input
            type="text"
            value={settings.booking_available_days}
            onChange={(e) => setSettings({ ...settings, booking_available_days: e.target.value })}
            className={inputCls}
            placeholder="Mon,Tue,Wed,Thu,Fri"
          />
          <p className="text-xs text-gray-400 mt-1">Comma-separated: Mon,Tue,Wed,Thu,Fri,Sat,Sun</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Start Time</label>
            <input
              type="time"
              value={settings.booking_time_start}
              onChange={(e) => setSettings({ ...settings, booking_time_start: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>End Time</label>
            <input
              type="time"
              value={settings.booking_time_end}
              onChange={(e) => setSettings({ ...settings, booking_time_end: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Slot Duration (minutes)</label>
          <input
            type="number"
            min="15"
            max="120"
            step="15"
            value={settings.booking_slot_duration}
            onChange={(e) => setSettings({ ...settings, booking_slot_duration: e.target.value })}
            className={inputCls}
            placeholder="30"
          />
        </div>
      </div>
    </div>
  );
}
