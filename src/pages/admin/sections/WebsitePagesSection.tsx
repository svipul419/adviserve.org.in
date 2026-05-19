// src/pages/admin/sections/WebsitePagesSection.tsx
import { Eye, EyeOff } from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title: string;
  is_visible: boolean;
  meta_description: string | null;
}

type Props = {
  pages: Page[];
  selectedPage: Page | null;
  setSelectedPage: (page: Page) => void;
  togglePageVisibility: (page: Page) => void;
};

export function WebsitePagesSection({ pages, selectedPage, setSelectedPage, togglePageVisibility }: Props) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">Pages</h2>
      </div>
      <div className="divide-y">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${
 selectedPage?.id === page.id ? 'bg-oxblood-primary/10' : ''
 }`}
            onClick={() => setSelectedPage(page)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{page.title}</h3>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); togglePageVisibility(page); }}
                className="text-gray-400 hover:text-gray-600"
                aria-label={page.is_visible ? `Hide ${page.title} page` : `Show ${page.title} page`}
              >
                {page.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
