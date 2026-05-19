// src/pages/admin/sections/ProductsFormSection.tsx
import { Plus, Trash2 } from 'lucide-react';
import type { FeatureItem, PricingTier } from './productsTypes';

interface FormData {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  icon: string;
  image_url: string;
  card_color: string;
  problem_title: string;
  problem_body: string;
  features: FeatureItem[];
  differentiators: FeatureItem[];
  pricing_tiers: PricingTier[];
  cta_title: string;
  cta_description: string;
  seo_title: string;
  seo_description: string;
  is_visible: boolean;
  sort_order: number;
}

type Props = {
  editingItem: { id: string } | null;
  formData: FormData;
  setFormData: (v: FormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  updateFeature: (index: number, field: keyof FeatureItem, value: string) => void;
  addDifferentiator: () => void;
  removeDifferentiator: (index: number) => void;
  updateDifferentiator: (index: number, field: keyof FeatureItem, value: string) => void;
  addPricingTier: () => void;
  removePricingTier: (index: number) => void;
  updatePricingTier: (index: number, field: string, value: string | boolean | string[]) => void;
  addPricingTierFeature: (tierIndex: number) => void;
  removePricingTierFeature: (tierIndex: number, featureIndex: number) => void;
  updatePricingTierFeature: (tierIndex: number, featureIndex: number, value: string) => void;
};

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';
const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

export function ProductsFormSection({
  editingItem, formData, setFormData, handleSubmit, resetForm,
  addFeature, removeFeature, updateFeature,
  addDifferentiator, removeDifferentiator, updateDifferentiator,
  addPricingTier, removePricingTier, updatePricingTier,
  addPricingTierFeature, removePricingTierFeature, updatePricingTierFeature,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {editingItem ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Visible</label>
              <select
                value={formData.is_visible ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({ ...formData, is_visible: e.target.value === 'true' })
                }
                className={inputClass}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Slideshow Visual Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slideshow Image URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Card Colour (rgba)</label>
            <input
              type="text"
              placeholder="rgba(109,212,196,0.95)"
              value={formData.card_color}
              onChange={(e) => setFormData({ ...formData, card_color: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Problem Section */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900">Problem Statement</h3>
          <div>
            <label className={labelClass}>Problem Title</label>
            <input
              type="text"
              value={formData.problem_title}
              onChange={(e) => setFormData({ ...formData, problem_title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Problem Body</label>
            <textarea
              rows={3}
              value={formData.problem_body}
              onChange={(e) => setFormData({ ...formData, problem_body: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Features</h3>
            <button
              type="button"
              onClick={addFeature}
              className="bg-oxblood-primary text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-oxblood-hover/80 flex items-center gap-1"
            >
              <Plus size={16} /> Add Feature
            </button>
          </div>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Feature title"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Feature description"
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-600 hover:text-red-900 mt-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {formData.features.length === 0 && (
            <p className="text-sm text-gray-400">No features added yet.</p>
          )}
        </div>

        {/* Differentiators */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Differentiators</h3>
            <button
              type="button"
              onClick={addDifferentiator}
              className="bg-oxblood-primary text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-oxblood-hover/80 flex items-center gap-1"
            >
              <Plus size={16} /> Add Differentiator
            </button>
          </div>
          {formData.differentiators.map((diff, index) => (
            <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Differentiator title"
                  value={diff.title}
                  onChange={(e) => updateDifferentiator(index, 'title', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Differentiator description"
                  value={diff.description}
                  onChange={(e) => updateDifferentiator(index, 'description', e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeDifferentiator(index)}
                className="text-red-600 hover:text-red-900 mt-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {formData.differentiators.length === 0 && (
            <p className="text-sm text-gray-400">No differentiators added yet.</p>
          )}
        </div>

        {/* Pricing Tiers */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Pricing Tiers</h3>
            <button
              type="button"
              onClick={addPricingTier}
              className="bg-oxblood-primary text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-oxblood-hover/80 flex items-center gap-1"
            >
              <Plus size={16} /> Add Tier
            </button>
          </div>
          {formData.pricing_tiers.map((tier, tierIndex) => (
            <div key={tierIndex} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Tier {tierIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => removePricingTier(tierIndex)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Basic"
                    value={tier.name}
                    onChange={(e) => updatePricingTier(tierIndex, 'name', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Price</label>
                  <input
                    type="text"
                    placeholder="e.g. $99"
                    value={tier.price}
                    onChange={(e) => updatePricingTier(tierIndex, 'price', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <input
                    type="text"
                    placeholder="e.g. /month"
                    value={tier.period}
                    onChange={(e) => updatePricingTier(tierIndex, 'period', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  value={tier.description}
                  onChange={(e) => updatePricingTier(tierIndex, 'description', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tier.highlighted}
                  onChange={(e) => updatePricingTier(tierIndex, 'highlighted', e.target.checked)}
                  className="rounded border-gray-300 text-oxblood-primary focus:ring-oxblood-primary"
                />
                <label className="text-sm text-gray-700">Highlighted (recommended tier)</label>
              </div>
              {/* Tier Features */}
              <div className="pl-2 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-600">Tier Features</label>
                  <button
                    type="button"
                    onClick={() => addPricingTierFeature(tierIndex)}
                    className="text-oxblood-primary hover:text-oxblood-hover/80 text-sm flex items-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                {tier.features.map((feat, featIndex) => (
                  <div key={featIndex} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Feature text"
                      value={feat}
                      onChange={(e) => updatePricingTierFeature(tierIndex, featIndex, e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removePricingTierFeature(tierIndex, featIndex)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {formData.pricing_tiers.length === 0 && (
            <p className="text-sm text-gray-400">No pricing tiers added yet.</p>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900">Call to Action</h3>
          <div>
            <label className={labelClass}>CTA Title</label>
            <input
              type="text"
              value={formData.cta_title}
              onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>CTA Description</label>
            <textarea
              rows={2}
              value={formData.cta_description}
              onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900">SEO Settings</h3>
          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              type="text"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              placeholder="Leave empty to use product title"
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className={labelClass}>SEO Description</label>
            <textarea
              rows={3}
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              placeholder="Brief description for search engines"
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-oxblood-primary text-black px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80"
          >
            {editingItem ? 'Update' : 'Create'} Product
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
