import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminDb } from '../../lib/adminDb';
import { sanitizeHTML } from '../../lib/sanitize';
import type { BlogPost } from '../../lib/types';
import { BlogFormSection } from './sections/BlogFormSection';
import { BlogFiltersSection } from './sections/BlogFiltersSection';
import { BlogListSection } from './sections/BlogListSection';

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    meta_title: '',
    meta_description: '',
    status: 'draft',
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (showForm && formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await adminDb
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setPosts(data);
    } else if (error) {
      toast.error('Failed to load blog posts');
    }
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const postData = {
        ...formData,
        content: sanitizeHTML(formData.content),
        published_at:
          formData.status === 'published'
            ? editingPost?.published_at || new Date().toISOString()
            : null,
      };

      if (editingPost) {
        const { error } = await adminDb
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (!error) {
          toast.success('Post updated successfully');
          fetchPosts();
          resetForm();
        } else {
          toast.error('Failed to update post');
        }
      } else {
        const { error } = await adminDb.from('blog_posts').insert([postData]);

        if (!error) {
          toast.success('Post created successfully');
          fetchPosts();
          resetForm();
        } else {
          toast.error('Failed to create post');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setSlugManuallyEdited(true);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      status: post.status as 'draft' | 'published' | 'archived',
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await adminDb.from('blog_posts').delete().eq('id', deleteId);
    if (!error) {
      toast.success('Post deleted');
      fetchPosts();
    } else {
      toast.error('Failed to delete post');
    }
    setDeleteId(null);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const { error } = await adminDb
      .from('blog_posts')
      .update({
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (!error) {
      toast.success(newStatus === 'published' ? 'Post published' : 'Post unpublished');
      fetchPosts();
    } else {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setSlugManuallyEdited(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      meta_title: '',
      meta_description: '',
      status: 'draft',
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getFilteredPosts = () =>
    posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const toggleSelectAll = () => {
    const filtered = getFilteredPosts();
    const allSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const bulkSetStatus = async (newStatus: 'published' | 'draft') => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const results = await Promise.all(
      ids.map((id) =>
        adminDb
          .from('blog_posts')
          .update({
            status: newStatus,
            published_at: newStatus === 'published' ? new Date().toISOString() : null,
          })
          .eq('id', id)
      )
    );
    const successCount = results.filter((r) => !r.error).length;
    toast.success(`${successCount} post(s) set to ${newStatus}`);
    setSelectedIds(new Set());
    fetchPosts();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const results = await Promise.all(
      ids.map((id) => adminDb.from('blog_posts').delete().eq('id', id))
    );
    const successCount = results.filter((r) => !r.error).length;
    toast.success(`${successCount} post(s) deleted`);
    setSelectedIds(new Set());
    setBulkDeleteConfirm(false);
    fetchPosts();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-oxblood-primary text-[#0f2333] px-4 py-2 rounded-md font-medium hover:bg-oxblood-hover/80 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Post
        </button>
      </div>

      {showForm && (
        <BlogFormSection
          formRef={formRef}
          formData={formData}
          setFormData={setFormData}
          editingPost={editingPost}
          slugManuallyEdited={slugManuallyEdited}
          setSlugManuallyEdited={setSlugManuallyEdited}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <BlogFiltersSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onPageReset={() => setPage(1)}
      />

      <BlogListSection
        posts={posts}
        loading={loading}
        page={page}
        setPage={setPage}
        itemsPerPage={ITEMS_PER_PAGE}
        selectedIds={selectedIds}
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        bulkDeleteConfirm={bulkDeleteConfirm}
        setBulkDeleteConfirm={setBulkDeleteConfirm}
        getFilteredPosts={getFilteredPosts}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        onEdit={handleEdit}
        onToggleStatus={toggleStatus}
        onConfirmDelete={confirmDelete}
        onBulkDelete={bulkDelete}
        onBulkSetStatus={bulkSetStatus}
        onDeselectAll={() => setSelectedIds(new Set())}
        formatDate={formatDate}
      />
    </div>
  );
}
