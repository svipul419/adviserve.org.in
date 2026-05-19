// src/pages/admin/sections/ProductsListSection.tsx
import { Pencil as Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { ConfirmDialog } from '../../../components/admin';
import type { Product } from './productsTypes';

type Props = {
  items: Product[];
  loading: boolean;
  deleteId: string | null;
  setDeleteId: (v: string | null) => void;
  handleEdit: (item: Product) => void;
  confirmDelete: () => void;
  toggleVisibility: (id: string, currentVisibility: boolean) => void;
};

export function ProductsListSection({
  items, loading, deleteId, setDeleteId, handleEdit, confirmDelete, toggleVisibility,
}: Props) {
  return (
    <>
      <div className="bg-white rounded-xl shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxblood-primary mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No products yet. Click &quot;Add Product&quot; to create your first one.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.slug}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {item.sort_order}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
 item.is_visible
 ? 'bg-green-100 text-green-800'
 : 'bg-gray-100 text-gray-800'
 }`}
                        >
                          {item.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleVisibility(item.id, item.is_visible ?? false)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label={item.is_visible ? 'Hide product' : 'Show product'}
                          >
                            {item.is_visible ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-oxblood-primary hover:text-oxblood-hover/80"
                            aria-label="Edit product"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Delete product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
