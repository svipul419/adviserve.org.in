// src/pages/admin/sections/BlogListSection.tsx
import { Pencil as Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';
import ConfirmDialog from '../../../components/ui/confirm-dialog';
import type { BlogPost } from '../../../lib/types';

type Props = {
  posts: BlogPost[];
  loading: boolean;
  page: number;
  setPage: (v: number | ((p: number) => number)) => void;
  itemsPerPage: number;
  selectedIds: Set<string>;
  deleteId: string | null;
  setDeleteId: (v: string | null) => void;
  bulkDeleteConfirm: boolean;
  setBulkDeleteConfirm: (v: boolean) => void;
  getFilteredPosts: () => BlogPost[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  onEdit: (post: BlogPost) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onConfirmDelete: () => void;
  onBulkDelete: () => void;
  onBulkSetStatus: (status: 'published' | 'draft') => void;
  onDeselectAll: () => void;
  formatDate: (dateString: string | null) => string;
};

export function BlogListSection({
  posts,
  loading,
  page,
  setPage,
  itemsPerPage,
  selectedIds,
  deleteId,
  setDeleteId,
  bulkDeleteConfirm,
  setBulkDeleteConfirm,
  getFilteredPosts,
  toggleSelect,
  toggleSelectAll,
  onEdit,
  onToggleStatus,
  onConfirmDelete,
  onBulkDelete,
  onBulkSetStatus,
  onDeselectAll,
  formatDate,
}: Props) {
  const filteredPosts = getFilteredPosts();
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );
  const allFilteredSelected =
    filteredPosts.length > 0 && filteredPosts.every((p) => selectedIds.has(p.id));

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
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-oxblood-primary focus:ring-oxblood-primary/30"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      {posts.length === 0
                        ? 'No blog posts yet. Create your first post!'
                        : 'No posts match your search or filter.'}
                    </td>
                  </tr>
                ) : (
                  paginatedPosts.map((post) => (
                    <tr
                      key={post.id}
                      className={`hover:bg-gray-50/50 ${selectedIds.has(post.id) ? 'bg-oxblood-primary/5' : ''}`}
                    >
                      <td className="px-4 py-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(post.id)}
                          onChange={() => toggleSelect(post.id)}
                          className="h-4 w-4 rounded border-gray-300 text-oxblood-primary focus:ring-oxblood-primary/30"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.slug}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
 post.status === 'published'
 ? 'bg-green-100 text-green-800'
 : post.status === 'draft'
 ? 'bg-yellow-100 text-yellow-800'
 : 'bg-gray-100 text-gray-800'
 }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {formatDate(post.published_at)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onToggleStatus(post.id, post.status)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label={
                              post.status === 'published' ? 'Unpublish post' : 'Publish post'
                            }
                          >
                            {post.status === 'published' ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => onEdit(post)}
                            className="text-oxblood-primary hover:text-oxblood-hover/80"
                            aria-label="Edit post"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(post.id)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Delete post"
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <span className="text-sm text-gray-700">
              Showing {(safePage - 1) * itemsPerPage + 1}–
              {Math.min(safePage * itemsPerPage, filteredPosts.length)} of {filteredPosts.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="px-3 py-1 text-sm rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Blog Post?"
        description="This post will be permanently removed."
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmDialog
        open={bulkDeleteConfirm}
        title="Delete Selected Posts?"
        description={`${selectedIds.size} posts will be permanently removed.`}
        onConfirm={onBulkDelete}
        onCancel={() => setBulkDeleteConfirm(false)}
      />

      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
            <span className="text-sm font-medium text-gray-700">{selectedIds.size} selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onBulkSetStatus('published')}
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-black hover:bg-green-700"
              >
                Publish
              </button>
              <button
                onClick={() => onBulkSetStatus('draft')}
                className="rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-yellow-600"
              >
                Draft
              </button>
              <button
                onClick={() => setBulkDeleteConfirm(true)}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-black hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={onDeselectAll}
                className="ml-2 flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                <X size={14} />
                Deselect All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
