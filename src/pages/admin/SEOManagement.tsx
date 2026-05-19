import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Pencil as Edit } from 'lucide-react';
import { adminDb } from '../../lib/adminDb';

interface SEOItem {
  id: string;
  type: 'page' | 'service' | 'blog';
  title: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  editUrl: string;
}

export default function SEOManagement() {
  const [items, setItems] = useState<SEOItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SEOItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'page' | 'service' | 'blog'>('all');

  useEffect(() => {
    fetchAllSEOData();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, filterType]);

  const fetchAllSEOData = async () => {
    setLoading(true);
    const allItems: SEOItem[] = [];

    const { data: pages } = await adminDb
      .from('website_pages')
      .select('id, slug, title, meta_description')
      .eq('is_visible', true);

    if (pages) {
      pages.forEach((page: any) => {
        allItems.push({
          id: page.id,
          type: 'page',
          title: page.title,
          slug: page.slug,
          meta_title: page.title,
          meta_description: page.meta_description,
          editUrl: '/admin/pages',
        });
      });
    }

    const { data: services } = await adminDb
      .from('services')
      .select('id, slug, title, meta_title, meta_description')
      .eq('is_visible', true);

    if (services) {
      services.forEach((service: any) => {
        allItems.push({
          id: service.id,
          type: 'service',
          title: service.title,
          slug: service.slug,
          meta_title: service.meta_title,
          meta_description: service.meta_description,
          editUrl: '/admin/services',
        });
      });
    }

    const { data: blogs } = await adminDb
      .from('blog_posts')
      .select('id, slug, title, meta_title, meta_description')
      .eq('status', 'published');

    if (blogs) {
      blogs.forEach((blog: any) => {
        allItems.push({
          id: blog.id,
          type: 'blog',
          title: blog.title,
          slug: blog.slug,
          meta_title: blog.meta_title,
          meta_description: blog.meta_description,
          editUrl: '/admin/blog',
        });
      });
    }

    setItems(allItems);
    setLoading(false);
  };

  const getStatusColor = (item: SEOItem) => {
    const hasMetaTitle = item.meta_title && item.meta_title.trim() !== '';
    const hasMetaDesc = item.meta_description && item.meta_description.trim() !== '';

    if (hasMetaTitle && hasMetaDesc) return 'text-green-600';
    if (hasMetaTitle || hasMetaDesc) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (item: SEOItem) => {
    const hasMetaTitle = item.meta_title && item.meta_title.trim() !== '';
    const hasMetaDesc = item.meta_description && item.meta_description.trim() !== '';

    if (hasMetaTitle && hasMetaDesc) return 'Complete';
    if (hasMetaTitle || hasMetaDesc) return 'Partial';
    return 'Missing';
  };

  const getMetaTitleLength = (item: SEOItem) => {
    const title = item.meta_title || item.title;
    return title.length;
  };

  const getMetaDescLength = (item: SEOItem) => {
    return (item.meta_description || '').length;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SEO Management</h1>
        <p className="text-gray-600">
          Overview of all SEO metadata across your website. Click "Edit" to update SEO settings for each item.
        </p>
      </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
                />
              </div>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-oxblood-primary/30"
              >
                <option value="all">All Types</option>
                <option value="page">Pages</option>
                <option value="service">Services</option>
                <option value="blog">Blog Posts</option>
              </select>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredItems.length} of {items.length} items
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title / Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading SEO data...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No items found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">/{item.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.meta_title ? (
                          <>
                            <div className="truncate max-w-xs">{item.meta_title}</div>
                            <div className={`text-xs ${getMetaTitleLength(item) > 60 ? 'text-yellow-600' : 'text-gray-500'}`}>
                              {getMetaTitleLength(item)} chars
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">Using page title</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.meta_description ? (
                          <>
                            <div className="truncate max-w-xs">{item.meta_description}</div>
                            <div className={`text-xs ${
 getMetaDescLength(item) < 120 || getMetaDescLength(item) > 160
 ? 'text-yellow-600'
 : 'text-gray-500'
 }`}>
                              {getMetaDescLength(item)} chars
                            </div>
                          </>
                        ) : (
                          <span className="text-red-400 italic">Not set</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(item)}`}>
                        {getStatusText(item)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={item.editUrl}
                        className="inline-flex items-center gap-1 text-oxblood-primary hover:text-oxblood-hover/80 text-sm font-medium"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-oxblood-primary/10 border border-oxblood-primary/20 rounded-lg p-4">
          <h3 className="font-medium text-oxblood-primary mb-2">SEO Best Practices</h3>
          <ul className="text-sm text-oxblood-primary/90 space-y-1">
            <li>Meta Title: 50-60 characters (Google typically displays up to 60)</li>
            <li>Meta Description: 150-160 characters (optimal for search results)</li>
            <li>Include target keywords naturally in both title and description</li>
            <li>Make descriptions compelling to improve click-through rates</li>
            <li>Ensure each page has unique meta tags</li>
          </ul>
        </div>
    </div>
  );
}
