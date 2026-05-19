// src/pages/admin/sections/BlogFiltersSection.tsx
import { Search } from 'lucide-react';

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: 'all' | 'published' | 'draft' | 'archived';
  setStatusFilter: (v: 'all' | 'published' | 'draft' | 'archived') => void;
  onPageReset: () => void;
};

export function BlogFiltersSection({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onPageReset,
}: Props) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onPageReset();
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood-primary/30 focus-visible:border-oxblood-primary"
        />
      </div>
      <div className="flex gap-1">
        {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              onPageReset();
            }}
            className={`px-3 py-2 text-sm font-medium rounded-lg capitalize ${
 statusFilter === status
 ? 'bg-oxblood-primary text-white'
 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
 }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
