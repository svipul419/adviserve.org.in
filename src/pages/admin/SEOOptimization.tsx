import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { SEOGlobalSection } from './sections/SEOGlobalSection';
import { SEOAeoSection } from './sections/SEOAeoSection';
import { SEOGeoSection } from './sections/SEOGeoSection';
import { SEOLocalSection } from './sections/SEOLocalSection';
import { SEOPageHeader } from './sections/SEOPageHeader';
import { type TabKey, type FAQItem, type OpeningHour, DEFAULT_OPENING_HOURS } from './sections/seoTypes';

// ── Component ──────────────────────────────────────────────────────────

export default function SEOOptimization() {
  const [activeTab, setActiveTab] = useState<TabKey>('seo_global');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SEO Global state
  const [seoGlobal, setSeoGlobal] = useState({
    site_title: '',
    site_description: '',
    og_image_url: '',
    google_analytics_id: '',
    search_console_verification: '',
    bing_verification: '',
    robots_txt: 'User-agent: *\nAllow: /',
  });

  // AEO state
  const [aeoSettings, setAeoSettings] = useState({
    faq_schema_enabled: 'false',
    howto_schema_enabled: 'false',
    speakable_enabled: 'false',
    entity_summary: '',
  });
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  // GEO state
  const [geoSettings, setGeoSettings] = useState({
    entity_description: '',
    key_facts_json: '[]',
    authoritative_sources: '[]',
    ai_optimization_enabled: 'false',
  });

  // Local SEO state
  const [localSeoSettings, setLocalSeoSettings] = useState({
    business_name: '',
    business_type: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    google_business_url: '',
    opening_hours: JSON.stringify(DEFAULT_OPENING_HOURS),
    service_areas: '[]',
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        switch (activeTab) {
          case 'seo_global': handleSaveSeoGlobal(); break;
          case 'aeo': handleSaveAeo(); break;
          case 'geo': handleSaveGeo(); break;
          case 'local_seo': handleSaveLocalSeo(); break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab]);

  // ── Data fetching ────────────────────────────────────────────────────

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await adminDb
        .from('seo_settings')
        .select('*');

      if (fetchError) throw fetchError;

      const byCat: Record<string, Record<string, string>> = {};
      (data || []).forEach((row: { category: string; key: string; value: string }) => {
        if (!byCat[row.category]) byCat[row.category] = {};
        byCat[row.category][row.key] = row.value;
      });

      // Map into state objects
      if (byCat['seo_global']) {
        setSeoGlobal((prev) => ({ ...prev, ...byCat['seo_global'] }));
      }
      if (byCat['aeo']) {
        setAeoSettings((prev) => ({ ...prev, ...byCat['aeo'] }));
      }
      if (byCat['geo']) {
        setGeoSettings((prev) => ({ ...prev, ...byCat['geo'] }));
      }
      if (byCat['local_seo']) {
        setLocalSeoSettings((prev) => ({ ...prev, ...byCat['local_seo'] }));
      }

      // Fetch FAQ items
      const { data: faqs, error: faqError } = await adminDb
        .from('faq_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (faqError) throw faqError;
      setFaqItems(faqs || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      console.error('Error fetching SEO settings:', err);
      setError('Failed to load SEO settings. ' + msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ── Save helpers ─────────────────────────────────────────────────────

  const showToast = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(msg);
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(msg);
      setSuccess(null);
    }
  };

  const saveSettingsForCategory = async (category: string, data: Record<string, string>) => {
    const entries = Object.entries(data);
    for (const [key, value] of entries) {
      const { error: upsertError } = await adminDb
        .from('seo_settings')
        .upsert(
          { category, key, value, updated_at: new Date().toISOString() },
          { onConflict: 'category,key' }
        );
      if (upsertError) throw upsertError;
    }
  };

  const handleSaveSeoGlobal = async () => {
    setSaving(true);
    try {
      await saveSettingsForCategory('seo_global', seoGlobal);
      showToast('SEO settings saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      showToast('Failed to save SEO settings. ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAeo = async () => {
    setSaving(true);
    try {
      await saveSettingsForCategory('aeo', aeoSettings);
      showToast('AEO settings saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      showToast('Failed to save AEO settings. ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeo = async () => {
    setSaving(true);
    try {
      // Validate JSON fields
      try { JSON.parse(geoSettings.key_facts_json); } catch { throw new Error('Key Facts JSON is invalid'); }
      try { JSON.parse(geoSettings.authoritative_sources); } catch { throw new Error('Authoritative Sources JSON is invalid'); }

      await saveSettingsForCategory('geo', geoSettings);
      showToast('GEO settings saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save GEO settings.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocalSeo = async () => {
    setSaving(true);
    try {
      await saveSettingsForCategory('local_seo', localSeoSettings);
      showToast('Local SEO settings saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      showToast('Failed to save Local SEO settings. ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── FAQ CRUD ─────────────────────────────────────────────────────────

  const addFaqItem = () => {
    setFaqItems((prev) => [
      ...prev,
      {
        page_type: 'global',
        page_ref_id: null,
        question: '',
        answer: '',
        sort_order: prev.length,
        is_visible: true,
      },
    ]);
  };

  const updateFaqItem = (index: number, field: keyof FAQItem, value: string | boolean | null) => {
    setFaqItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeFaqItem = async (index: number) => {
    const item = faqItems[index];
    if (item.id) {
      const { error: delError } = await adminDb.from('faq_items').delete().eq('id', item.id);
      if (delError) {
        showToast('Failed to delete FAQ item.', 'error');
        return;
      }
    }
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
    showToast('FAQ item removed.', 'success');
  };

  const moveFaqItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqItems.length) return;
    const updated = [...faqItems];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((item, i) => (item.sort_order = i));
    setFaqItems(updated);
  };

  const saveFaqItems = async () => {
    setSaving(true);
    try {
      for (const item of faqItems) {
        if (!item.question.trim() || !item.answer.trim()) continue;

        const payload = {
          page_type: item.page_type,
          page_ref_id: item.page_ref_id,
          question: item.question,
          answer: item.answer,
          sort_order: item.sort_order,
          is_visible: item.is_visible,
          updated_at: new Date().toISOString(),
        };

        if (item.id) {
          const { error: updateError } = await adminDb
            .from('faq_items')
            .update(payload)
            .eq('id', item.id);
          if (updateError) throw updateError;
        } else {
          const { data: inserted, error: insertError } = await adminDb
            .from('faq_items')
            .insert([payload])
            .select()
            .single();
          if (insertError) throw insertError;
          item.id = inserted.id;
        }
      }
      showToast('FAQ items saved successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      showToast('Failed to save FAQ items. ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Opening hours helper ─────────────────────────────────────────────

  const getOpeningHours = (): OpeningHour[] => {
    try {
      return JSON.parse(localSeoSettings.opening_hours);
    } catch {
      return DEFAULT_OPENING_HOURS;
    }
  };

  const updateOpeningHour = (dayIndex: number, field: 'open' | 'close', value: string) => {
    const hours = getOpeningHours();
    hours[dayIndex] = { ...hours[dayIndex], [field]: value };
    setLocalSeoSettings((prev) => ({ ...prev, opening_hours: JSON.stringify(hours) }));
  };

  // ── Service areas helper ─────────────────────────────────────────────

  const getServiceAreas = (): string[] => {
    try {
      return JSON.parse(localSeoSettings.service_areas);
    } catch {
      return [];
    }
  };

  const addServiceArea = () => {
    const areas = getServiceAreas();
    areas.push('');
    setLocalSeoSettings((prev) => ({ ...prev, service_areas: JSON.stringify(areas) }));
  };

  const updateServiceArea = (index: number, value: string) => {
    const areas = getServiceAreas();
    areas[index] = value;
    setLocalSeoSettings((prev) => ({ ...prev, service_areas: JSON.stringify(areas) }));
  };

  const removeServiceArea = (index: number) => {
    const areas = getServiceAreas().filter((_, i) => i !== index);
    setLocalSeoSettings((prev) => ({ ...prev, service_areas: JSON.stringify(areas) }));
  };

  // ── Main render ──────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl">
      <SEOPageHeader
        activeTab={activeTab}
        loading={loading}
        error={error}
        success={success}
        onTabChange={setActiveTab}
        onRefresh={fetchSettings}
      />

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw size={24} className="animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Loading SEO settings...</p>
        </div>
      ) : (
        <>
          {activeTab === 'seo_global' && (
            <SEOGlobalSection
              seoGlobal={seoGlobal}
              setSeoGlobal={setSeoGlobal}
              saving={saving}
              handleSaveSeoGlobal={handleSaveSeoGlobal}
            />
          )}
          {activeTab === 'aeo' && (
            <SEOAeoSection
              aeoSettings={aeoSettings}
              setAeoSettings={setAeoSettings}
              faqItems={faqItems}
              saving={saving}
              handleSaveAeo={handleSaveAeo}
              addFaqItem={addFaqItem}
              updateFaqItem={updateFaqItem}
              removeFaqItem={removeFaqItem}
              moveFaqItem={moveFaqItem}
              saveFaqItems={saveFaqItems}
            />
          )}
          {activeTab === 'geo' && (
            <SEOGeoSection
              geoSettings={geoSettings}
              setGeoSettings={setGeoSettings}
              saving={saving}
              handleSaveGeo={handleSaveGeo}
            />
          )}
          {activeTab === 'local_seo' && (
            <SEOLocalSection
              localSeoSettings={localSeoSettings}
              setLocalSeoSettings={setLocalSeoSettings}
              saving={saving}
              handleSaveLocalSeo={handleSaveLocalSeo}
              getOpeningHours={getOpeningHours}
              updateOpeningHour={updateOpeningHour}
              getServiceAreas={getServiceAreas}
              addServiceArea={addServiceArea}
              updateServiceArea={updateServiceArea}
              removeServiceArea={removeServiceArea}
            />
          )}
        </>
      )}
    </div>
  );
}
