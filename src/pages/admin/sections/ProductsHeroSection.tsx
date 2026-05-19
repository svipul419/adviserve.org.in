// src/pages/admin/sections/ProductsHeroSection.tsx

type Props = {
  productsHeroTitle: string;
  setProductsHeroTitle: (v: string) => void;
  productsHeroSubtitle: string;
  setProductsHeroSubtitle: (v: string) => void;
  heroSaving: boolean;
  saveHeroContent: () => void;
};

export function ProductsHeroSection({
  productsHeroTitle, setProductsHeroTitle,
  productsHeroSubtitle, setProductsHeroSubtitle,
  heroSaving, saveHeroContent,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Products Page Hero</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
          <input
            type="text"
            value={productsHeroTitle}
            onChange={e => setProductsHeroTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
          <textarea
            value={productsHeroSubtitle}
            onChange={e => setProductsHeroSubtitle(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30 resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={saveHeroContent}
            disabled={heroSaving}
            className="flex items-center gap-2 px-4 py-2 bg-oxblood-primary text-[#0f2333] rounded-lg hover:bg-oxblood-hover/80 disabled:bg-gray-400 text-sm font-medium"
          >
            {heroSaving ? 'Saving...' : 'Save Hero'}
          </button>
        </div>
      </div>
    </div>
  );
}
