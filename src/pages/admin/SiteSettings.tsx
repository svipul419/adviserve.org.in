import { useEffect, useState, useRef } from 'react';
import { Save } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';
import { SiteSettingsTemplateSection } from './sections/SiteSettingsTemplateSection';
import { SiteSettingsLogoSection } from './sections/SiteSettingsLogoSection';
import { SiteSettingsContactSection } from './sections/SiteSettingsContactSection';
import { SiteSettingsBookingSection } from './sections/SiteSettingsBookingSection';

interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
}

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

export default function SiteSettings() {
  const theme: string = 'light';
  const setTheme = (_t: 'dark' | 'light') => {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    company_email: '',
    company_phone: '',
    company_address: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
    youtube_url: '',
    website_url: '',
    booking_available_days: 'Mon,Tue,Wed,Thu,Fri',
    booking_time_start: '09:00',
    booking_time_end: '18:00',
    booking_slot_duration: '30',
  });

  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  const handleSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchSiteAssets();
  }, []);

  const fetchSiteAssets = async () => {
    const { data } = await adminDb.from('site_assets').select('*').limit(1).maybeSingle();
    if (data) {
      setLogoUrl(data.logo_url || '');
      setFaviconUrl(data.favicon_url || '');
    }
  };

  const handleLogoUpload = async (file: File, type: 'logo' | 'favicon') => {
    setLogoUploading(true);
    setError(null);

    if (file.size > 2 * 1024 * 1024) {
      setError('File too large. Please use an image under 2MB.');
      setLogoUploading(false);
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp', 'image/x-icon'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.svg') && !file.name.endsWith('.ico')) {
      setError('Invalid file type. Please use PNG, JPG, SVG, WebP, or ICO.');
      setLogoUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await saveSiteAsset(type, dataUrl);
      setLogoUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      setLogoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveSiteAsset = async (type: 'logo' | 'favicon', url: string) => {
    const column = type === 'logo' ? 'logo_url' : 'favicon_url';

    const { data: existing } = await adminDb.from('site_assets').select('id').limit(1).maybeSingle();
    if (existing) {
      await adminDb.from('site_assets').update({ [column]: url, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await adminDb.from('site_assets').insert([{ [column]: url }]);
    }

    try {
      await adminDb.from('site_settings').upsert(
        { key: column, value: url, category: 'general' },
        { onConflict: 'key' }
      );
    } catch {
      await adminDb.from('site_settings').delete().eq('key', column);
      await adminDb.from('site_settings').insert({ key: column, value: url, category: 'general' });
    }

    if (type === 'logo') setLogoUrl(url);
    else setFaviconUrl(url);
    setSuccess(`${type === 'logo' ? 'Logo' : 'Favicon'} updated! Refresh to see changes.`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleLogoUrlSave = async (type: 'logo' | 'favicon', url: string) => {
    if (!url.trim()) { setError('Please enter a URL or upload a file.'); return; }
    if (url.includes('C:\\') || url.includes('C:/') || url.startsWith('file:') || url.includes('\\Users\\')) {
      setError('Local file paths are not supported. Please upload the file using the Upload button, or enter a web URL (starting with / or https://).');
      return;
    }
    await saveSiteAsset(type, url);
  };

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error: fetchError } = await adminDb.from('site_settings').select('*');

    if (fetchError) {
      console.error('Error fetching settings:', fetchError);
      setError('Failed to load settings');
      setLoading(false);
      return;
    }

    const settingsMap: Settings = {
      company_email: '',
      company_phone: '',
      company_address: '',
      facebook_url: '',
      twitter_url: '',
      linkedin_url: '',
      instagram_url: '',
      youtube_url: '',
      website_url: '',
      booking_available_days: 'Mon,Tue,Wed,Thu,Fri',
      booking_time_start: '09:00',
      booking_time_end: '18:00',
      booking_slot_duration: '30',
    };

    data?.forEach((setting: Setting) => {
      if (Object.prototype.hasOwnProperty.call(settingsMap, setting.key)) {
        (settingsMap as unknown as Record<string, string>)[setting.key] = setting.value;
      }
    });

    setSettings(settingsMap);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const settingsToSave: Record<string, string> = { ...Object.fromEntries(Object.entries(settings)) };

    try {
      const results = await Promise.all(
        Object.entries(settingsToSave).map(([key, value]) =>
          adminDb.from('site_settings').upsert(
            { key, value: String(value), category: getSettingCategory(key) },
            { onConflict: 'key' }
          )
        )
      );

      const failed = results.filter(r => r.error);
      if (failed.length > 0) {
        console.error('Failed settings:', failed.map(f => f.error));
        setError(`Failed to save ${failed.length} setting(s). Check console for details.`);
        setSaving(false);
        return;
      }

      setDirty(false);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save settings. Please try again.');
    }

    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const getSettingCategory = (key: string): string => {
    if (key.startsWith('booking_')) return 'booking';
    if (key.includes('url')) return 'social';
    if (key.startsWith('company_')) {
      if (['company_email', 'company_phone', 'company_address'].includes(key)) return 'contact';
      return 'general';
    }
    return 'general';
  };

  const handleThemeChange = async (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    setSuccess(`Template switched to "${newTheme === 'dark' ? 'Dark Editorial' : 'Light Clean'}"!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto" onChangeCapture={() => setDirty(true)}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your website's general information, social media links, and template
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <SiteSettingsTemplateSection theme={theme} handleThemeChange={handleThemeChange} />

          <SiteSettingsLogoSection
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            faviconUrl={faviconUrl}
            setFaviconUrl={setFaviconUrl}
            logoUploading={logoUploading}
            logoInputRef={logoInputRef}
            faviconInputRef={faviconInputRef}
            handleLogoUpload={handleLogoUpload}
            handleLogoUrlSave={handleLogoUrlSave}
            saveSiteAsset={saveSiteAsset}
          />

          <SiteSettingsContactSection settings={settings} setSettings={setSettings} />

          <SiteSettingsBookingSection settings={settings} setSettings={setSettings} />

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 text-sm bg-oxblood-primary text-black px-5 py-2.5 rounded-lg hover:bg-oxblood-hover/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
