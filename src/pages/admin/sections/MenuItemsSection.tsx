// src/pages/admin/sections/MenuItemsSection.tsx
import { Plus, Pencil as Edit2, Trash2, Eye, EyeOff, Save, X, MoveUp, MoveDown } from 'lucide-react';
import { ConfirmDialog } from '../../../components/admin';
import type { MenuItem, Menu } from './menuTypes';

type Props = {
  selectedMenu: Menu | null;
  menuItems: MenuItem[];
  organizedItems: { parent: MenuItem; children: MenuItem[] }[];
  editingItem: MenuItem | null;
  setEditingItem: (item: MenuItem | null) => void;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onAddItemClick: () => void;
  onToggleVisibility: (item: MenuItem) => void;
  onSaveItem: (item: MenuItem) => void;
  onMoveItem: (item: MenuItem, direction: 'up' | 'down') => void;
  onConfirmDelete: () => void;
};

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function MenuItemsSection({
  selectedMenu,
  menuItems,
  organizedItems,
  editingItem,
  setEditingItem,
  deleteId,
  setDeleteId,
  onAddItemClick,
  onToggleVisibility,
  onSaveItem,
  onMoveItem,
  onConfirmDelete,
}: Props) {
  if (!selectedMenu) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        Select a menu to manage its items
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedMenu.name}</h2>
            <p className="text-sm text-gray-500">Manage menu items and hierarchy</p>
          </div>
          <button
            onClick={onAddItemClick}
            className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80"
          >
            <Plus size={20} />
            Add Menu Item
          </button>
        </div>
      </div>

      <div className="p-6">
        {menuItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No menu items yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-6">
            {organizedItems.map(({ parent, children }) => (
              <div key={parent.id}>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {editingItem?.id === parent.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Label</label>
                        <input
                          type="text"
                          value={editingItem.label}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, label: e.target.value })
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>URL</label>
                        <input
                          type="text"
                          value={editingItem.url}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, url: e.target.value })
                          }
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Target</label>
                        <select
                          value={editingItem.target}
                          onChange={(e) =>
                            setEditingItem({ ...editingItem, target: e.target.value })
                          }
                          className={inputCls}
                        >
                          <option value="_self">Same Window</option>
                          <option value="_blank">New Window</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Sort Order</label>
                        <input
                          type="number"
                          value={editingItem.sort_order}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              sort_order: parseInt(e.target.value) || 0,
                            })
                          }
                          className={inputCls}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSaveItem(editingItem)}
                          className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{parent.label}</h3>
                          {!parent.is_visible && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{parent.url}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Target: {parent.target} | Order: {parent.sort_order}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onMoveItem(parent, 'up')}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={menuItems.findIndex((i) => i.id === parent.id) === 0}
                          aria-label="Move item up"
                        >
                          <MoveUp size={18} />
                        </button>
                        <button
                          onClick={() => onMoveItem(parent, 'down')}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={
                            menuItems.findIndex((i) => i.id === parent.id) === menuItems.length - 1
                          }
                          aria-label="Move item down"
                        >
                          <MoveDown size={18} />
                        </button>
                        <button
                          onClick={() => onToggleVisibility(parent)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label={parent.is_visible ? 'Hide menu item' : 'Show menu item'}
                        >
                          {parent.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => setEditingItem(parent)}
                          className="text-oxblood-primary hover:text-oxblood-hover/80"
                          aria-label="Edit menu item"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(parent.id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Delete menu item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {children.length > 0 && (
                  <div className="ml-8 mt-2 space-y-2">
                    {children.map((child) => (
                      <div key={child.id} className="border rounded-lg p-3 bg-white">
                        {editingItem?.id === child.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className={labelCls}>Label</label>
                              <input
                                type="text"
                                value={editingItem.label}
                                onChange={(e) =>
                                  setEditingItem({ ...editingItem, label: e.target.value })
                                }
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>URL</label>
                              <input
                                type="text"
                                value={editingItem.url}
                                onChange={(e) =>
                                  setEditingItem({ ...editingItem, url: e.target.value })
                                }
                                className={inputCls}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => onSaveItem(editingItem)}
                                className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80"
                              >
                                <Save size={18} />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                <X size={18} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900 text-sm">{child.label}</h4>
                                {!child.is_visible && (
                                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                                    Hidden
                                  </span>
                                )}
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  Child
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{child.url}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => onToggleVisibility(child)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label={child.is_visible ? 'Hide menu item' : 'Show menu item'}
                              >
                                {child.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button
                                onClick={() => setEditingItem(child)}
                                className="text-oxblood-primary hover:text-oxblood-hover/80"
                                aria-label="Edit menu item"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteId(child.id)}
                                className="text-red-600 hover:text-red-700"
                                aria-label="Delete menu item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Menu Item"
        message="Are you sure? This will also delete any child items. This action cannot be undone."
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
