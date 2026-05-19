import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Briefcase, HelpCircle, ArrowRight } from 'lucide-react';

interface SearchResult {
  blogs: Array<{ id: number; title: string; slug: string; excerpt: string }>;
  services: Array<{ id: number; title: string; slug: string; description: string }>;
  faqs: Array<{ id: number; question: string; answer: string }>;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ blogs: [], services: [], faqs: [] });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build flat list of navigable results for keyboard navigation
  const flatResults = useMemo(() => {
    const items: Array<{ type: string; label: string; sub: string; url: string }> = [];
    for (const blog of results.blogs) {
      items.push({ type: 'Blog', label: blog.title, sub: blog.excerpt || '', url: `/blog/${blog.slug}` });
    }
    for (const svc of results.services) {
      items.push({ type: 'Service', label: svc.title, sub: svc.description || '', url: `/services/${svc.slug}` });
    }
    for (const faq of results.faqs) {
      items.push({ type: 'FAQ', label: faq.question, sub: '', url: '/contact' });
    }
    return items;
  }, [results]);

  const hasResults = flatResults.length > 0;
  const hasQuery = query.trim().length >= 2;

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults({ blogs: [], services: [], faqs: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ blogs: [], services: [], faqs: [] });
      setActiveIndex(-1);
      // Small delay to ensure modal is rendered before focus
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape to close, arrow keys to navigate
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && activeIndex >= 0 && activeIndex < flatResults.length) {
        e.preventDefault();
        navigateToResult(flatResults[activeIndex].url);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, flatResults, activeIndex, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navigateToResult = (url: string) => {
    onClose();
    navigate(url);
  };

  if (!isOpen) return null;

  const iconForType = (type: string) => {
    switch (type) {
      case 'Blog': return <FileText size={16} className="text-accent-blue flex-shrink-0" />;
      case 'Service': return <Briefcase size={16} className="text-accent-blue flex-shrink-0" />;
      case 'FAQ': return <HelpCircle size={16} className="text-accent-blue flex-shrink-0" />;
      default: return null;
    }
  };

  // Pre-compute group start indices to avoid mutation during render
  const blogStartIdx = 0;
  const serviceStartIdx = results.blogs.length;
  const faqStartIdx = results.blogs.length + results.services.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-ink-raised rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <Search size={20} className="text-white/55 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
            placeholder="Search blog posts, services, FAQs..."
            className="flex-1 text-base text-white placeholder:text-[#c0c0c0] bg-transparent outline-none"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/55 hover:text-white hover:bg-[#f0efeb] transition-colors"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-6 py-8 text-center">
              <div className="inline-block w-5 h-5 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
            </div>
          )}

          {!loading && hasQuery && !hasResults && (
            <div className="px-6 py-12 text-center">
              <p className="text-white/55 text-sm">No results found for "{query}"</p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="py-2">
              {/* Blogs */}
              {results.blogs.length > 0 && (
                <div>
                  <p className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest text-white/55">Blog Posts</p>
                  {results.blogs.map((blog, i) => {
                    const idx = blogStartIdx + i;
                    return (
                      <button
                        key={`blog-${blog.id}`}
                        onClick={() => navigateToResult(`/blog/${blog.slug}`)}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
 activeIndex === idx ? 'bg-accent-blue/5' : 'hover:bg-ink-base'
 }`}
                      >
                        {iconForType('Blog')}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{blog.title}</p>
                          {blog.excerpt && <p className="text-xs text-white/55 truncate">{blog.excerpt}</p>}
                        </div>
                        <ArrowRight size={14} className="text-[#c0c0c0] flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Services */}
              {results.services.length > 0 && (
                <div>
                  <p className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest text-white/55">Services</p>
                  {results.services.map((svc, i) => {
                    const idx = serviceStartIdx + i;
                    return (
                      <button
                        key={`svc-${svc.id}`}
                        onClick={() => navigateToResult(`/services/${svc.slug}`)}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
 activeIndex === idx ? 'bg-accent-blue/5' : 'hover:bg-ink-base'
 }`}
                      >
                        {iconForType('Service')}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{svc.title}</p>
                          {svc.description && <p className="text-xs text-white/55 truncate">{svc.description}</p>}
                        </div>
                        <ArrowRight size={14} className="text-[#c0c0c0] flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* FAQs */}
              {results.faqs.length > 0 && (
                <div>
                  <p className="px-6 py-2 text-[10px] font-mono uppercase tracking-widest text-white/55">FAQs</p>
                  {results.faqs.map((faq, i) => {
                    const idx = faqStartIdx + i;
                    return (
                      <button
                        key={`faq-${faq.id}`}
                        onClick={() => navigateToResult('/contact')}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
 activeIndex === idx ? 'bg-accent-blue/5' : 'hover:bg-ink-base'
 }`}
                      >
                        {iconForType('FAQ')}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{faq.question}</p>
                        </div>
                        <ArrowRight size={14} className="text-[#c0c0c0] flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!loading && !hasQuery && (
            <div className="px-6 py-10 text-center">
              <p className="text-white/55 text-sm">Start typing to search across blog posts, services, and FAQs.</p>
              <p className="text-[#c0c0c0] text-xs mt-2">Press <kbd className="px-1.5 py-0.5 bg-[#f0efeb] rounded text-white/75 text-[10px] font-mono">Esc</kbd> to close</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
