import { Plus, ArrowLeft } from 'lucide-react';

interface ProductsPageHeaderProps {
  showForm: boolean;
  onToggleForm: () => void;
}

export function ProductsPageHeader({ showForm, onToggleForm }: ProductsPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
      <button
        onClick={onToggleForm}
        className="bg-oxblood-primary text-black px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80 flex items-center gap-2"
      >
        {showForm ? <ArrowLeft size={20} /> : <Plus size={20} />}
        {showForm ? 'Back to List' : 'Add Product'}
      </button>
    </div>
  );
}
