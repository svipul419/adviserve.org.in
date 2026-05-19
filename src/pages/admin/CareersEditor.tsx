import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';
import { useUnsavedChanges } from '../../components/admin';
import toast from 'react-hot-toast';
import { CareersHeroSection } from './sections/CareersHeroSection';
import { CareersBenefitsSection } from './sections/CareersBenefitsSection';
import { CareersCultureSection } from './sections/CareersCultureSection';
import { CareersPositionsSection } from './sections/CareersPositionsSection';
import { CareersPageHeader } from './sections/CareersPageHeader';
import { CareersSaveFooter } from './sections/CareersSaveFooter';
import {
  type ContentBlock,
  type BenefitItem,
  type CultureItem,
  type JobPosition,
  DEFAULT_BENEFITS,
  DEFAULT_CULTURE,
} from './sections/careersTypes';

export default function CareersEditor() {
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'benefits' | 'culture' | 'positions'>('hero');

  // Hero & CTA content
  const [heroTitle, setHeroTitle] = useState('Build something that matters.');
  const [heroSubtitle, setHeroSubtitle] = useState('We are recruiters, HR strategists, business consultants, lawyers, and technologists who solve complex problems for ambitious companies.');
  const [ctaTitle, setCtaTitle] = useState('Do not see your role?');
  const [ctaDescription, setCtaDescription] = useState('We are always looking for exceptional people. Send a speculative application.');

  // Apply modal CMS
  const [applyModalHeader, setApplyModalHeader] = useState('Apply Now');
  const [applyModalLabels, setApplyModalLabels] = useState({ name: 'Full Name', email: 'Email', phone: 'Phone', linkedin: 'LinkedIn URL', resume: 'Resume', cover: 'Cover Message' });
  const [applyModalCoverPlaceholder, setApplyModalCoverPlaceholder] = useState("Tell us why you're a great fit…");
  const [applyModalBtnSubmit, setApplyModalBtnSubmit] = useState('Submit Application');
  const [applyModalReceivedTitle, setApplyModalReceivedTitle] = useState('Application Received');
  const [applyModalReceivedText, setApplyModalReceivedText] = useState("We'll review your application and get back to you within 5 business days.");

  // Visibility toggles
  const [heroVisible, setHeroVisible] = useState(true);
  const [benefitsVisible, setBenefitsVisible] = useState(true);
  const [cultureVisible, setCultureVisible] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(true);

  // JSON array sections
  const [benefits, setBenefits] = useState<BenefitItem[]>(DEFAULT_BENEFITS);
  const [culture, setCulture] = useState<CultureItem[]>(DEFAULT_CULTURE);

  // Job Positions CRUD
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null);
  const [deletePositionId, setDeletePositionId] = useState<string | null>(null);
  const [positionForm, setPositionForm] = useState<JobPosition>({
    title: '',
    location: '',
    type: 'Full-time',
    department: '',
    description: '',
    is_visible: true,
    sort_order: 0,
  });

  const [heroFv, setHeroFv] = useState<Record<string, boolean>>({});
  const [ctaFv, setCtaFv] = useState<Record<string, boolean>>({});
  const [modalFv, setModalFv] = useState<Record<string, boolean>>({});

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  const handleSaveRef = useRef<() => void>(() => {});

  // Ctrl+S shortcut
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
    fetchContent();
    fetchPositions();
  }, []);

  // ---- Website Content (page content pattern) ----

  const fetchContent = async () => {
    setLoading(true);

    const { data: pageData } = await adminDb
      .from('website_pages')
      .select('id')
      .eq('slug', 'careers')
      .maybeSingle();

    let currentPageId: string;

    if (!pageData) {
      const { data: newPage } = await adminDb
        .from('website_pages')
        .insert({ slug: 'careers', title: 'Careers', is_visible: true })
        .select('id')
        .single();
      if (newPage) {
        currentPageId = newPage.id;
        setPageId(newPage.id);
      } else {
        setLoading(false);
        return;
      }
    } else {
      currentPageId = pageData.id;
      setPageId(pageData.id);
    }

    const { data: contents } = await adminDb
      .from('website_content')
      .select('*')
      .eq('page_id', currentPageId)
      .order('display_order');

    if (contents) {
      contents.forEach((c: ContentBlock) => {
        switch (c.section_key) {
          case 'hero_title': setHeroTitle(c.content_value || ''); break;
          case 'hero_subtitle': setHeroSubtitle(c.content_value || ''); break;
          case 'benefits':
            try { setBenefits(JSON.parse(c.content_value || '[]')); } catch { /* ignore */ }
            setBenefitsVisible(c.is_visible);
            break;
          case 'culture':
            try { setCulture(JSON.parse(c.content_value || '[]')); } catch { /* ignore */ }
            setCultureVisible(c.is_visible);
            break;
          case 'cta_title': setCtaTitle(c.content_value || ''); break;
          case 'cta_description': setCtaDescription(c.content_value || ''); break;
          case 'hero_visible': setHeroVisible(c.content_value !== 'false'); break;
          case 'cta_visible': setCtaVisible(c.content_value !== 'false'); break;
          case 'apply_modal_header': setApplyModalHeader(c.content_value || ''); break;
          case 'apply_modal_labels':
            try { setApplyModalLabels(JSON.parse(c.content_value || '{}')); } catch { /* ignore */ }
            break;
          case 'apply_modal_placeholder_cover': setApplyModalCoverPlaceholder(c.content_value || ''); break;
          case 'apply_modal_btn_submit': setApplyModalBtnSubmit(c.content_value || ''); break;
          case 'apply_modal_received_title': setApplyModalReceivedTitle(c.content_value || ''); break;
          case 'apply_modal_received_text': setApplyModalReceivedText(c.content_value || ''); break;
          case 'careers_hero_field_visibility': try { setHeroFv(JSON.parse(c.content_value || '{}')); } catch { /* ignore */ } break;
          case 'careers_cta_field_visibility': try { setCtaFv(JSON.parse(c.content_value || '{}')); } catch { /* ignore */ } break;
          case 'careers_modal_field_visibility': try { setModalFv(JSON.parse(c.content_value || '{}')); } catch { /* ignore */ } break;
        }
      });
    }

    setLoading(false);
  };

  const upsertContent = async (sectionKey: string, sectionLabel: string, contentType: string, contentValue: string, isVisible: boolean, displayOrder: number) => {
    if (!pageId) return;

    const { data: existing, error: selectError } = await adminDb
      .from('website_content')
      .select('id')
      .eq('page_id', pageId)
      .eq('section_key', sectionKey)
      .maybeSingle();

    if (selectError) { console.error('Fetch error:', selectError); throw selectError; }

    if (existing) {
      const { error: writeError } = await adminDb
        .from('website_content')
        .update({
          section_label: sectionLabel,
          content_type: contentType,
          content_value: contentValue,
          is_visible: isVisible,
          display_order: displayOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    } else {
      const { error: writeError } = await adminDb
        .from('website_content')
        .insert({
          page_id: pageId,
          section_key: sectionKey,
          section_label: sectionLabel,
          content_type: contentType,
          content_value: contentValue,
          is_visible: isVisible,
          display_order: displayOrder,
        });
      if (writeError) { console.error('Write error:', writeError); throw writeError; }
    }
  };

  // ---- Job Positions (CRUD pattern) ----

  const fetchPositions = async () => {
    setPositionsLoading(true);
    const { data, error } = await adminDb
      .from('job_positions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data && !error) {
      setPositions(data);
    }
    setPositionsLoading(false);
  };

  const handlePositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPosition?.id) {
      const { error } = await adminDb
        .from('job_positions')
        .update({
          title: positionForm.title,
          location: positionForm.location,
          type: positionForm.type,
          department: positionForm.department,
          description: positionForm.description,
          is_visible: positionForm.is_visible,
          sort_order: positionForm.sort_order,
        })
        .eq('id', editingPosition.id);

      if (!error) {
        toast.success('Position updated successfully');
        fetchPositions();
        resetPositionForm();
      } else {
        toast.error('Failed to update position');
      }
    } else {
      const { error } = await adminDb
        .from('job_positions')
        .insert({
          title: positionForm.title,
          location: positionForm.location,
          type: positionForm.type,
          department: positionForm.department,
          description: positionForm.description,
          is_visible: positionForm.is_visible,
          sort_order: positionForm.sort_order,
        });

      if (!error) {
        toast.success('Position created successfully');
        fetchPositions();
        resetPositionForm();
      } else {
        toast.error('Failed to create position');
      }
    }
  };

  const handleEditPosition = (pos: JobPosition) => {
    setEditingPosition(pos);
    setPositionForm({
      title: pos.title,
      location: pos.location,
      type: pos.type,
      department: pos.department,
      description: pos.description,
      is_visible: pos.is_visible ?? true,
      sort_order: pos.sort_order || 0,
    });
    setShowPositionForm(true);
  };

  const confirmDeletePosition = async () => {
    if (!deletePositionId) return;
    const { error } = await adminDb.from('job_positions').delete().eq('id', deletePositionId);
    if (!error) {
      toast.success('Position deleted');
      fetchPositions();
    } else {
      toast.error('Failed to delete position');
    }
    setDeletePositionId(null);
  };

  const togglePositionVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await adminDb
      .from('job_positions')
      .update({ is_visible: !currentVisibility })
      .eq('id', id);

    if (!error) {
      toast.success(currentVisibility ? 'Position hidden' : 'Position visible');
      fetchPositions();
    } else {
      toast.error('Failed to update visibility');
    }
  };

  const resetPositionForm = () => {
    setShowPositionForm(false);
    setEditingPosition(null);
    setPositionForm({
      title: '',
      location: '',
      type: 'Full-time',
      department: '',
      description: '',
      is_visible: true,
      sort_order: 0,
    });
  };

  // ---- Save All (website_content only; positions are saved individually) ----

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);

    // Filter out empty benefits before saving
    const cleanedBenefits = benefits.filter(b => b.title.trim() || b.description.trim());
    setBenefits(cleanedBenefits);

    try {
      await Promise.all([
        upsertContent('hero_title', 'Hero Title', 'text', heroTitle, heroVisible, 1),
        upsertContent('hero_subtitle', 'Hero Subtitle', 'text', heroSubtitle, heroVisible, 2),
        upsertContent('hero_visible', 'Hero Visible', 'toggle', String(heroVisible), true, 3),
        upsertContent('benefits', 'Benefits', 'json', JSON.stringify(cleanedBenefits), benefitsVisible, 10),
        upsertContent('culture', 'Culture Highlights', 'json', JSON.stringify(culture), cultureVisible, 20),
        upsertContent('cta_title', 'CTA Title', 'text', ctaTitle, ctaVisible, 30),
        upsertContent('cta_description', 'CTA Description', 'text', ctaDescription, ctaVisible, 31),
        upsertContent('cta_visible', 'CTA Visible', 'toggle', String(ctaVisible), true, 32),
        upsertContent('apply_modal_header', 'Apply Modal Header', 'text', applyModalHeader, true, 33),
        upsertContent('apply_modal_labels', 'Apply Modal Labels', 'json', JSON.stringify(applyModalLabels), true, 34),
        upsertContent('apply_modal_placeholder_cover', 'Apply Cover Placeholder', 'text', applyModalCoverPlaceholder, true, 35),
        upsertContent('apply_modal_btn_submit', 'Apply Submit Button', 'text', applyModalBtnSubmit, true, 36),
        upsertContent('apply_modal_received_title', 'Application Received Title', 'text', applyModalReceivedTitle, true, 37),
        upsertContent('apply_modal_received_text', 'Application Received Text', 'text', applyModalReceivedText, true, 38),
        upsertContent('careers_hero_field_visibility', 'Hero Field Visibility', 'json', JSON.stringify(heroFv), true, 5),
        upsertContent('careers_cta_field_visibility', 'CTA Field Visibility', 'json', JSON.stringify(ctaFv), true, 39),
        upsertContent('careers_modal_field_visibility', 'Modal Field Visibility', 'json', JSON.stringify(modalFv), true, 40),
      ]);

      setDirty(false);
      toast.success('Careers page content saved successfully!');
    } catch {
      toast.error('Failed to save content. Please try again.');
    }

    setSaving(false);
  };
  handleSaveRef.current = handleSave;

  const toggleHeroFv = (key: string) => { setHeroFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleCtaFv = (key: string) => { setCtaFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const toggleModalFv = (key: string) => { setModalFv(prev => ({ ...prev, [key]: prev[key] === false ? true : false })); setDirty(true); };
  const fvIcon = (fv: Record<string, boolean>, key: string) => fv[key] === false ? <EyeOff size={14}/> : <Eye size={14}/>;

  // ---- Benefits helpers ----

  const updateBenefit = (index: number, field: keyof BenefitItem, value: string) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    setBenefits(updated);
    setDirty(true);
  };

  const addBenefit = () => {
    setBenefits([...benefits, { title: 'New Benefit', description: 'Description here', icon: 'star' }]);
    setDirty(true);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
    setDirty(true);
  };

  // ---- Culture helpers ----

  const updateCulture = (index: number, field: keyof CultureItem, value: string) => {
    const updated = [...culture];
    updated[index] = { ...updated[index], [field]: value };
    setCulture(updated);
    setDirty(true);
  };

  const addCulture = () => {
    setCulture([...culture, { title: 'New Highlight', description: 'Description here' }]);
    setDirty(true);
  };

  const removeCulture = (index: number) => {
    setCulture(culture.filter((_, i) => i !== index));
    setDirty(true);
  };

  // ---- Reorder helpers ----

  const moveBenefit = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= benefits.length) return;
    const updated = [...benefits];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBenefits(updated);
    setDirty(true);
  };

  const moveCulture = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= culture.length) return;
    const updated = [...culture];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCulture(updated);
    setDirty(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading careers page content...</p>
      </div>
    );
  }

  const tabs = [
    { key: 'hero' as const, label: 'Hero & CTA' },
    { key: 'benefits' as const, label: 'Benefits' },
    { key: 'culture' as const, label: 'Culture Highlights' },
    { key: 'positions' as const, label: 'Job Positions' },
  ];

  return (
    <div className="max-w-4xl">
      <CareersPageHeader
        saving={saving}
        activeTab={activeTab}
        tabs={tabs}
        onSave={handleSave}
        onTabChange={setActiveTab}
      />

      <div className="space-y-6" onChangeCapture={() => setDirty(true)}>
        {activeTab === 'hero' && (
          <CareersHeroSection
            heroTitle={heroTitle} setHeroTitle={setHeroTitle}
            heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
            heroVisible={heroVisible} setHeroVisible={setHeroVisible}
            ctaTitle={ctaTitle} setCtaTitle={setCtaTitle}
            ctaDescription={ctaDescription} setCtaDescription={setCtaDescription}
            ctaVisible={ctaVisible} setCtaVisible={setCtaVisible}
            applyModalHeader={applyModalHeader} setApplyModalHeader={setApplyModalHeader}
            applyModalLabels={applyModalLabels} setApplyModalLabels={setApplyModalLabels}
            applyModalCoverPlaceholder={applyModalCoverPlaceholder} setApplyModalCoverPlaceholder={setApplyModalCoverPlaceholder}
            applyModalBtnSubmit={applyModalBtnSubmit} setApplyModalBtnSubmit={setApplyModalBtnSubmit}
            applyModalReceivedTitle={applyModalReceivedTitle} setApplyModalReceivedTitle={setApplyModalReceivedTitle}
            applyModalReceivedText={applyModalReceivedText} setApplyModalReceivedText={setApplyModalReceivedText}
            heroFv={heroFv} ctaFv={ctaFv} modalFv={modalFv}
            toggleHeroFv={toggleHeroFv} toggleCtaFv={toggleCtaFv} toggleModalFv={toggleModalFv}
            fvIcon={fvIcon}
            setDirty={setDirty}
          />
        )}

        {activeTab === 'benefits' && (
          <CareersBenefitsSection
            benefits={benefits}
            benefitsVisible={benefitsVisible}
            setBenefitsVisible={setBenefitsVisible}
            updateBenefit={updateBenefit}
            addBenefit={addBenefit}
            removeBenefit={removeBenefit}
            moveBenefit={moveBenefit}
            setDirty={setDirty}
          />
        )}

        {activeTab === 'culture' && (
          <CareersCultureSection
            culture={culture}
            cultureVisible={cultureVisible}
            setCultureVisible={setCultureVisible}
            updateCulture={updateCulture}
            addCulture={addCulture}
            removeCulture={removeCulture}
            moveCulture={moveCulture}
            setDirty={setDirty}
          />
        )}

        {activeTab === 'positions' && (
          <CareersPositionsSection
            positions={positions}
            positionsLoading={positionsLoading}
            showPositionForm={showPositionForm}
            setShowPositionForm={setShowPositionForm}
            editingPosition={editingPosition}
            deletePositionId={deletePositionId ?? null}
            setDeletePositionId={setDeletePositionId}
            positionForm={positionForm}
            setPositionForm={setPositionForm}
            handlePositionSubmit={handlePositionSubmit}
            handleEditPosition={handleEditPosition}
            confirmDeletePosition={confirmDeletePosition}
            togglePositionVisibility={togglePositionVisibility}
            resetPositionForm={resetPositionForm}
          />
        )}

        <CareersSaveFooter saving={saving} activeTab={activeTab} onSave={handleSave} />
      </div>
    </div>
  );
}
