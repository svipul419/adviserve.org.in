// src/pages/admin/sections/SiteSettingsContactSection.tsx
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Globe } from 'lucide-react';

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

const SOCIAL_FIELDS = [
  { key: 'facebook_url', icon: <Facebook size={16} className="text-blue-400" />, label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
  { key: 'twitter_url', icon: <Twitter size={16} className="text-sky-400" />, label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle' },
  { key: 'linkedin_url', icon: <Linkedin size={16} className="text-blue-500" />, label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
  { key: 'instagram_url', icon: <Instagram size={16} className="text-pink-400" />, label: 'Instagram', placeholder: 'https://instagram.com/yourprofile' },
  { key: 'youtube_url', icon: <Youtube size={16} className="text-red-400" />, label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'website_url', icon: <Globe size={16} className="text-gray-500" />, label: 'Website URL', placeholder: 'https://yourwebsite.com' },
] as const;

export function SiteSettingsContactSection({ settings, setSettings }: Props) {
  return (
    <>
      {/* Contact Information */}
      <div className={cardCls}>
        <h2 className={headingCls}>Contact Information</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              value={settings.company_email}
              onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
              className={inputCls}
              placeholder="info@adviserve.org.in"
            />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              type="tel"
              value={settings.company_phone}
              onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
              className={inputCls}
              placeholder="+91-XXX-XXX-XXXX"
            />
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <textarea
              value={settings.company_address}
              onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
              className={inputCls}
              rows={3}
              placeholder="Enter your complete address"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className={cardCls}>
        <h2 className={headingCls}>Social Media Links</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your social media profile URLs. Leave blank if you don't use a platform.
        </p>
        <div className="space-y-4">
          {SOCIAL_FIELDS.map(({ key, icon, label, placeholder }) => (
            <div key={key}>
              <label className={`flex items-center gap-2 ${labelCls}`}>
                {icon}
                {label}
              </label>
              <input
                type="url"
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className={inputCls}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
