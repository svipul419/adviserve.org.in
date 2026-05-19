// src/pages/admin/sections/MenuItemFormSection.tsx
import type { MenuItem, NewMenuItem as NewItem } from './menuTypes';

type Props = {
  newItem: NewItem;
  setNewItem: (v: NewItem) => void;
  parentOptions: MenuItem[];
  onAdd: () => void;
  onCancel: () => void;
};

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

export function MenuItemFormSection({ newItem, setNewItem, parentOptions, onAdd, onCancel }: Props) {
  return (
    <div className="p-6 border-b bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-4">Add New Menu Item</h3>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Label *</label>
          <input
            type="text"
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            className={inputCls}
            placeholder="e.g., Home"
          />
        </div>
        <div>
          <label className={labelCls}>URL *</label>
          <input
            type="text"
            value={newItem.url}
            onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
            className={inputCls}
            placeholder="e.g., /"
          />
        </div>
        <div>
          <label className={labelCls}>Parent Item (optional)</label>
          <select
            value={newItem.parent_id || ''}
            onChange={(e) => setNewItem({ ...newItem, parent_id: e.target.value || null })}
            className={inputCls}
          >
            <option value="">None (Top Level)</option>
            {parentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Target</label>
          <select
            value={newItem.target}
            onChange={(e) => setNewItem({ ...newItem, target: e.target.value })}
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
            value={newItem.sort_order}
            onChange={(e) => setNewItem({ ...newItem, sort_order: parseInt(e.target.value) || 0 })}
            className={inputCls}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="new_visible"
            checked={newItem.is_visible}
            onChange={(e) => setNewItem({ ...newItem, is_visible: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="new_visible" className="text-sm text-gray-700">
            Visible in menu
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-oxblood-primary text-black rounded-lg hover:bg-oxblood-hover/80"
          >
            Add Item
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
