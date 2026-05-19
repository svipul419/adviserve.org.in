// src/pages/admin/sections/WebsiteContentSection.tsx
import { Plus, Pencil as Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import ConfirmDialog from '../../../components/ui/confirm-dialog';

interface Page {
  id: string;
  slug: string;
  title: string;
  is_visible: boolean;
  meta_description: string | null;
}

interface Content {
  id: string;
  page_id: string;
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string | null;
  display_order: number;
  is_visible: boolean;
}

interface NewContent {
  section_key: string;
  section_label: string;
  content_type: string;
  content_value: string;
  display_order: number;
  is_visible: boolean;
}

type Props = {
  selectedPage: Page | null;
  contents: Content[];
  editingContent: Content | null;
  setEditingContent: (v: Content | null) => void;
  isAddingContent: boolean;
  setIsAddingContent: (v: boolean) => void;
  newContent: NewContent;
  setNewContent: (v: NewContent) => void;
  pendingDeleteId: string | null;
  setPendingDeleteId: (v: string | null) => void;
  saveContent: (content: Content) => void;
  addContent: () => void;
  deleteContent: (id: string) => void;
  toggleContentVisibility: (content: Content) => void;
};

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';

export function WebsiteContentSection({
  selectedPage, contents, editingContent, setEditingContent,
  isAddingContent, setIsAddingContent, newContent, setNewContent,
  pendingDeleteId, setPendingDeleteId, saveContent, addContent, deleteContent,
  toggleContentVisibility,
}: Props) {
  if (!selectedPage) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Select a page to manage its content
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedPage.title}</h2>
              <p className="text-sm text-gray-500">Manage content for this page</p>
            </div>
            <button
              onClick={() => setIsAddingContent(true)}
              className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
            >
              <Plus size={20} />
              Add Content Block
            </button>
          </div>
        </div>

        {isAddingContent && (
          <div className="p-6 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Content Block</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Key (unique identifier)
                </label>
                <input
                  type="text"
                  value={newContent.section_key}
                  onChange={(e) => setNewContent({ ...newContent, section_key: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., hero_title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Label (display name)
                </label>
                <input
                  type="text"
                  value={newContent.section_label}
                  onChange={(e) => setNewContent({ ...newContent, section_label: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Hero Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select
                  value={newContent.content_type}
                  onChange={(e) => setNewContent({ ...newContent, content_type: e.target.value })}
                  className={inputClass}
                >
                  <option value="text">Text</option>
                  <option value="html">HTML</option>
                  <option value="image_url">Image URL</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Value</label>
                <textarea
                  value={newContent.content_value}
                  onChange={(e) => setNewContent({ ...newContent, content_value: e.target.value })}
                  className={inputClass}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={newContent.display_order}
                  onChange={(e) => setNewContent({ ...newContent, display_order: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="new_visible"
                  checked={newContent.is_visible}
                  onChange={(e) => setNewContent({ ...newContent, is_visible: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="new_visible" className="text-sm text-gray-700">Visible on website</label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addContent}
                  className="px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
                >
                  Add Content
                </button>
                <button
                  onClick={() => setIsAddingContent(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {contents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No content blocks yet. Add your first one!</p>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => (
                <div key={content.id} className="border rounded-lg p-4">
                  {editingContent?.id === content.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Key</label>
                        <input
                          type="text"
                          value={editingContent.section_key}
                          onChange={(e) => setEditingContent({ ...editingContent, section_key: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Label</label>
                        <input
                          type="text"
                          value={editingContent.section_label}
                          onChange={(e) => setEditingContent({ ...editingContent, section_label: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                        <select
                          value={editingContent.content_type}
                          onChange={(e) => setEditingContent({ ...editingContent, content_type: e.target.value })}
                          className={inputClass}
                        >
                          <option value="text">Text</option>
                          <option value="html">HTML</option>
                          <option value="image_url">Image URL</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Value</label>
                        <textarea
                          value={editingContent.content_value || ''}
                          onChange={(e) => setEditingContent({ ...editingContent, content_value: e.target.value })}
                          className={inputClass}
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                        <input
                          type="number"
                          value={editingContent.display_order}
                          onChange={(e) => setEditingContent({ ...editingContent, display_order: parseInt(e.target.value) || 0 })}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveContent(editingContent)}
                          className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingContent(null)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{content.section_label}</h3>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {content.content_type}
                            </span>
                            {!content.is_visible && (
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Hidden</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">Key: {content.section_key}</p>
                          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {content.content_value || '(empty)'}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => toggleContentVisibility(content)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label={content.is_visible ? `Hide ${content.section_label}` : `Show ${content.section_label}`}
                          >
                            {content.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => setEditingContent(content)}
                            className="text-oxblood-primary hover:text-oxblood-hover/80"
                            aria-label={`Edit ${content.section_label}`}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(content.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label={`Delete ${content.section_label}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete Content Block?"
        description="This content block will be permanently removed."
        onConfirm={() => {
          if (pendingDeleteId) deleteContent(pendingDeleteId);
          setPendingDeleteId(null);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
