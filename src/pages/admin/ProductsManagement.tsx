import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import { ProductsFormSection } from './sections/ProductsFormSection';
import { ProductsHeroSection } from './sections/ProductsHeroSection';
import { ProductsListSection } from './sections/ProductsListSection';
import { ProductsPageHeader } from './sections/ProductsPageHeader';
import { type FeatureItem, type Product, emptyFormData } from './sections/productsTypes';

export default function ProductsManagement() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyFormData });

  useEffect(() => {
    fetchItems();
  }, []);

  // Auto-slug from title
  useEffect(() => {
    if (!editingItem) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, editingItem]);

  async function fetchItems() {
    const { data, error } = await adminDb
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (data && !error) {
      setItems(data);
    } else if (error) {
      toast.error('Failed to load products');
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const { error } = await adminDb
        .from('products')
        .update(formData)
        .eq('id', editingItem.id);

      if (!error) {
        toast.success('Product updated successfully');
        fetchItems();
        resetForm();
      } else {
        toast.error('Failed to update product');
      }
    } else {
      const { error } = await adminDb.from('products').insert([formData]);

      if (!error) {
        toast.success('Product created successfully');
        fetchItems();
        resetForm();
      } else {
        toast.error('Failed to create product');
      }
    }
  };

  const handleEdit = (item: Product) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      slug: item.slug || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      icon: item.icon || 'users',
      image_url: item.image_url || '',
      card_color: item.card_color || 'rgba(109,212,196,0.95)',
      problem_title: item.problem_title || '',
      problem_body: item.problem_body || '',
      features: item.features || [],
      differentiators: item.differentiators || [],
      pricing_tiers: item.pricing_tiers || [],
      cta_title: item.cta_title || '',
      cta_description: item.cta_description || '',
      seo_title: item.seo_title || '',
      seo_description: item.seo_description || '',
      is_visible: item.is_visible ?? true,
      sort_order: item.sort_order || 0,
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb.from('products').delete().eq('id', deleteId);
    if (!error) {
      toast.success('Product deleted');
      fetchItems();
    } else {
      toast.error('Failed to delete product');
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await adminDb
      .from('products')
      .update({ is_visible: !currentVisibility })
      .eq('id', id);

    if (!error) {
      toast.success(currentVisibility ? 'Product hidden' : 'Product visible');
      fetchItems();
    } else {
      toast.error('Failed to update visibility');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ ...emptyFormData, features: [], differentiators: [], pricing_tiers: [] });
  };

  // --- Products page CMS hero ---
  const [heroPageId, setHeroPageId] = useState<string | null>(null);
  const [productsHeroTitle, setProductsHeroTitle] = useState('Software built from real advisory experience.');
  const [productsHeroSubtitle, setProductsHeroSubtitle] = useState('Three products. All built from thousands of hours of doing the actual work — not from a product manager’s imagination. And all connect directly to Adviserve’s advisory team when you need more than software.');
  const [heroSaving, setHeroSaving] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    const { data: pageData } = await adminDb.from('website_pages').select('id').eq('slug', 'products').maybeSingle();
    if (!pageData) return;
    setHeroPageId(pageData.id);
    const { data: contents } = await adminDb.from('website_content').select('section_key, content_value').eq('page_id', pageData.id);
    if (contents) {
      contents.forEach((c: { section_key: string; content_value: string }) => {
        if (c.section_key === 'products_hero_title') setProductsHeroTitle(c.content_value || '');
        if (c.section_key === 'products_hero_subtitle') setProductsHeroSubtitle(c.content_value || '');
      });
    }
  };

  const saveHeroContent = async () => {
    if (!heroPageId) return;
    setHeroSaving(true);
    const upsert = async (key: string, label: string, value: string, order: number) => {
      const { data: existing } = await adminDb.from('website_content').select('id').eq('page_id', heroPageId).eq('section_key', key).maybeSingle();
      if (existing) {
        await adminDb.from('website_content').update({ content_value: value, updated_at: new Date().toISOString() }).eq('id', existing.id);
      } else {
        await adminDb.from('website_content').insert({ page_id: heroPageId, section_key: key, section_label: label, content_type: 'text', content_value: value, is_visible: true, display_order: order });
      }
    };
    try {
      await Promise.all([
        upsert('products_hero_title', 'Products Hero Title', productsHeroTitle, 1),
        upsert('products_hero_subtitle', 'Products Hero Subtitle', productsHeroSubtitle, 2),
      ]);
      toast.success('Hero content saved');
    } catch {
      toast.error('Failed to save hero content');
    }
    setHeroSaving(false);
  };

  // --- Array helpers ---

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, { title: '', description: '' }] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const updated = [...formData.features];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, features: updated });
  };

  const addDifferentiator = () => {
    setFormData({ ...formData, differentiators: [...formData.differentiators, { title: '', description: '' }] });
  };

  const removeDifferentiator = (index: number) => {
    setFormData({ ...formData, differentiators: formData.differentiators.filter((_, i) => i !== index) });
  };

  const updateDifferentiator = (index: number, field: keyof FeatureItem, value: string) => {
    const updated = [...formData.differentiators];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, differentiators: updated });
  };

  const addPricingTier = () => {
    setFormData({
      ...formData,
      pricing_tiers: [
        ...formData.pricing_tiers,
        { name: '', price: '', period: '', description: '', features: [], highlighted: false },
      ],
    });
  };

  const removePricingTier = (index: number) => {
    setFormData({ ...formData, pricing_tiers: formData.pricing_tiers.filter((_, i) => i !== index) });
  };

  const updatePricingTier = (index: number, field: string, value: string | boolean | string[]) => {
    const updated = [...formData.pricing_tiers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, pricing_tiers: updated });
  };

  const addPricingTierFeature = (tierIndex: number) => {
    const updated = [...formData.pricing_tiers];
    updated[tierIndex] = { ...updated[tierIndex], features: [...updated[tierIndex].features, ''] };
    setFormData({ ...formData, pricing_tiers: updated });
  };

  const removePricingTierFeature = (tierIndex: number, featureIndex: number) => {
    const updated = [...formData.pricing_tiers];
    updated[tierIndex] = {
      ...updated[tierIndex],
      features: updated[tierIndex].features.filter((_, i) => i !== featureIndex),
    };
    setFormData({ ...formData, pricing_tiers: updated });
  };

  const updatePricingTierFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const updated = [...formData.pricing_tiers];
    const features = [...updated[tierIndex].features];
    features[featureIndex] = value;
    updated[tierIndex] = { ...updated[tierIndex], features };
    setFormData({ ...formData, pricing_tiers: updated });
  };

  return (
    <div>
      <ProductsPageHeader showForm={showForm} onToggleForm={() => setShowForm(!showForm)} />

      {showForm && (
        <ProductsFormSection
          editingItem={editingItem}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          addFeature={addFeature}
          removeFeature={removeFeature}
          updateFeature={updateFeature}
          addDifferentiator={addDifferentiator}
          removeDifferentiator={removeDifferentiator}
          updateDifferentiator={updateDifferentiator}
          addPricingTier={addPricingTier}
          removePricingTier={removePricingTier}
          updatePricingTier={updatePricingTier}
          addPricingTierFeature={addPricingTierFeature}
          removePricingTierFeature={removePricingTierFeature}
          updatePricingTierFeature={updatePricingTierFeature}
        />
      )}

      {!showForm && (
        <ProductsHeroSection
          productsHeroTitle={productsHeroTitle}
          setProductsHeroTitle={setProductsHeroTitle}
          productsHeroSubtitle={productsHeroSubtitle}
          setProductsHeroSubtitle={setProductsHeroSubtitle}
          heroSaving={heroSaving}
          saveHeroContent={saveHeroContent}
        />
      )}

      {!showForm && (
        <ProductsListSection
          items={items}
          loading={loading}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          handleEdit={handleEdit}
          confirmDelete={confirmDelete}
          toggleVisibility={toggleVisibility}
        />
      )}
    </div>
  );
}
