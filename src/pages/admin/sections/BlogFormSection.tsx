// src/pages/admin/sections/BlogFormSection.tsx
import { RefObject } from 'react';
import RichTextEditor from '../../../components/RichTextEditor';
import { generateSlug } from '../../../lib/slugify';
import type { BlogPost } from '../../../lib/types';

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
}

type Props = {
  formRef: RefObject<HTMLFormElement>;
  formData: FormData;
  setFormData: (v: FormData) => void;
  editingPost: BlogPost | null;
  slugManuallyEdited: boolean;
  setSlugManuallyEdited: (v: boolean) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-2';

export function BlogFormSection({
  formRef,
  formData,
  setFormData,
  editingPost,
  slugManuallyEdited,
  setSlugManuallyEdited,
  saving,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {editingPost ? 'Edit Post' : 'Create New Post'}
      </h2>
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setFormData({
                  ...formData,
                  title: newTitle,
                  slug: slugManuallyEdited ? formData.slug : generateSlug(newTitle),
                });
              }}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setFormData({ ...formData, slug: e.target.value });
              }}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Featured Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className={inputCls}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className={labelCls}>Excerpt *</label>
          <textarea
            required
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Content *</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-900">SEO Settings</h3>
          <div>
            <label className={labelCls}>Meta Title</label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Leave empty to use post title"
              className={inputCls}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea
              rows={3}
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Brief description for search engines"
              className={inputCls}
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'draft' | 'published' | 'archived',
              })
            }
            className={inputCls}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : `${editingPost ? 'Update' : 'Create'} Post`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
