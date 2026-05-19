import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, BookOpen, X, Clock } from 'lucide-react';

function getReadTime(content: string | null): number {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>/g, '');
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}
import { publicApi } from '../lib/api';
import { useSiteContent, parseJsonContent } from '../hooks/useSiteContent';
import { DEFAULT_BLOG_POSTS } from '../lib/defaults';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import EngineeringHero from '../components/sections/EngineeringHero';
import { useMouseTracking } from '../hooks/useMouseTracking';
import type { BlogPost } from '../lib/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { content } = useSiteContent('blog');
  const chromeFv = parseJsonContent<Record<string, boolean>>(content.blog_chrome_field_visibility, {});

  const heroRef = useRef<HTMLDivElement>(null);
  const heroBlob1Ref = useRef<HTMLDivElement>(null);
  const heroBlob2Ref = useRef<HTMLDivElement>(null);
  const heroHeadingRef = useRef<HTMLDivElement>(null);
  const searchFilterRef = useRef<HTMLDivElement>(null);
  const featuredPostRef = useRef<HTMLDivElement>(null);
  const blogGridRef = useRef<HTMLDivElement>(null);
  const floatingShape1Ref = useRef<HTMLDivElement>(null);
  const floatingShape2Ref = useRef<HTMLDivElement>(null);
  const floatingShape3Ref = useRef<HTMLDivElement>(null);

  useMouseTracking(blogGridRef);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await publicApi.getBlogPosts();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          // CMS unreachable or no published posts yet → render bundled
          // editorial defaults so the Insights grid is never blank.
          setPosts(DEFAULT_BLOG_POSTS);
        }
      } catch {
        setPosts(DEFAULT_BLOG_POSTS);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Hero heading dramatic entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroHeadingRef.current) return;

    const heading = heroHeadingRef.current.querySelector('h1');
    const subtitle = heroHeadingRef.current.querySelector('.hero-subtitle');
    const mono = heroHeadingRef.current.querySelector('.hero-mono');

    gsap.fromTo(
      heading,
      { scale: 0.5, y: 80, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(
      mono,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 }
    );
    gsap.fromTo(
      subtitle,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.5 }
    );
  });

  // Hero blob parallax
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const blobs = [heroBlob1Ref.current, heroBlob2Ref.current].filter(Boolean);
    blobs.forEach((blob, i) => {
      gsap.to(blob, {
        y: i === 0 ? -80 : -50,
        ease: 'none',
        scrollTrigger: {
          trigger: blob,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });

  // Floating geometric shapes parallax
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const shapes = [floatingShape1Ref.current, floatingShape2Ref.current, floatingShape3Ref.current].filter(Boolean);
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: -30 - i * 15,
        rotation: 10 + i * 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });

  // Search/filter entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!searchFilterRef.current) return;
    gsap.fromTo(
      searchFilterRef.current,
      { y: -20, scale: 0.95, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: searchFilterRef.current,
          start: 'top 90%',
        },
      }
    );
  });

  // Featured post animation
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!featuredPostRef.current) return;
    gsap.fromTo(
      featuredPostRef.current.querySelector('.featured-post'),
      { scale: 0.9, opacity: 0, y: 40 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuredPostRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { dependencies: [loading, posts], revertOnUpdate: true });

  // Blog cards stagger — dramatic tilt entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!blogGridRef.current) return;
    gsap.fromTo(
      blogGridRef.current.querySelectorAll('.blog-card'),
      { y: 80, scale: 0.9, rotateX: -5, opacity: 0, transformPerspective: 1200 },
      {
        y: 0,
        scale: 1,
        rotateX: 0,
        opacity: 1,
        transformPerspective: 1200,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: blogGridRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { dependencies: [loading, posts], revertOnUpdate: true });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Categories from posts
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c))))];

  // Filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !searchQuery.trim() || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead title="Blog" description={content.blog_seo_description || 'Practical guides on hiring, team building, HR strategy, and workforce trends — written by the people who do this work every day.'} canonical="https://adviserve.in/blog" />
      <EngineeringHero
        eyebrow="Blog"
        title={content.blog_page_title || 'Insights & Resources'}
        gradientPhrase="Resources"
        subtitle={content.blog_page_subtitle || 'Practical guides on hiring, team building, HR strategy, and workforce trends — written by the people who do this work every day.'}
        sheet="BLG"
        total="07"
        label="BLOG · INSIGHTS"
        mark="BLG"
      />

      {/* Search + Filters */}
      {chromeFv['search_placeholder'] !== false && <div ref={searchFilterRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20 w-full">
        <div className="bg-ink-raised rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="search-blog" className="sr-only">Search articles</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/75" />
            <input
              id="search-blog"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content.blog_search_placeholder || 'Search articles...'}
              className="w-full pl-12 pr-10 py-3 min-h-[44px] bg-[#f3f2ee] rounded-xl text-white text-[15px] placeholder:text-[#7a7a8e] focus:outline-none focus:ring-2 focus:ring-accent-blue border border-white/10 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 min-w-[44px] min-h-[44px] rounded-md bg-text-primary/10 flex items-center justify-center">
                <X size={12} className="text-white/75" />
              </button>
            )}
          </div>
          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
 activeCategory === cat
 ? 'bg-accent-blue text-white shadow-sm'
 : 'bg-[#f3f2ee] text-white/75 hover:bg-[#f0efeb] hover:text-white/75 border border-white/10'
 }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>}

      {/* Posts */}
      <section className="flex-1 section-padding bg-ink-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="shimmer h-48 rounded-2xl mb-4" />
                  <div className="shimmer h-5 rounded w-3/4 mb-2" />
                  <div className="shimmer h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <FadeUp>
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-ink-raised rounded-3xl flex items-center justify-center mx-auto mb-5 border border-white/10">
                  <BookOpen className="w-8 h-8 text-white/75" />
                </div>
                {chromeFv['empty_heading'] !== false && <h3 className="text-xl font-bold text-white mb-2">{content.blog_empty_heading || 'No articles found'}</h3>}
                {chromeFv['empty_body'] !== false && <p className="text-white/75 text-sm max-w-sm mx-auto">
                  {searchQuery ? `Nothing matches "${searchQuery}". Try broader terms like "hiring" or "leadership".` : (content.blog_empty_body || 'We\'re working on fresh content. Check back soon for insights on recruitment, HR strategy, and more.')}
                </p>}
              </div>
            </FadeUp>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div ref={featuredPostRef}>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="featured-post group block bg-ink-raised rounded-3xl overflow-hidden border border-white/10 hover:border-accent-blueHover/30 transition-all duration-500 mb-12"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {featuredPost.image_url && (
                        <div className="aspect-[16/10] lg:aspect-auto bg-[#f3f2ee] overflow-hidden">
                          <img src={featuredPost.image_url} alt={featuredPost.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          {featuredPost.category && (
                            <span className="text-xs font-semibold text-accent-blue bg-accent-blue/[0.06] px-3 py-1 rounded-md">{featuredPost.category}</span>
                          )}
                          <span className="text-xs text-white/75 font-medium uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={12} />
                            {formatDate(featuredPost.published_at)}
                          </span>
                          <span className="text-xs text-white/55 flex items-center gap-1">
                            <Clock size={11} />
                            {getReadTime(featuredPost.content)} min read
                          </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3 group-hover:text-accent-blueHover transition-colors leading-tight tracking-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-white/75 mb-6 line-clamp-3 leading-relaxed">{featuredPost.excerpt}</p>
                        {chromeFv['read_more'] !== false && <span className="text-accent-blue font-semibold text-sm inline-flex items-center">
                          {content.blog_card_read_more || 'Read more'}
                          <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={15} />
                        </span>}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid */}
              {remainingPosts.length > 0 && (
                <div ref={blogGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {remainingPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="blog-card card-magnetic card-image-zoom oc-card group block bg-ink-raised rounded-2xl overflow-hidden border border-white/10 hover:border-accent-blueHover/30 hover:-translate-y-2 transition-all duration-500"
                    >
                      {post.image_url && (
                        <div className="aspect-[16/10] bg-[#f3f2ee] overflow-hidden relative">
                          <img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          {post.category && (
                            <span className="absolute top-3 left-3 text-xs font-semibold text-accent-blue bg-ink-base backdrop-blur-sm px-3 py-1 rounded-md">
                              {post.category}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-[11px] text-white/75 mb-3 font-medium uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1 text-white/55">
                            <Clock size={10} />
                            {getReadTime(post.content)} min
                          </span>
                        </div>
                        <h3 className="text-[17px] font-bold text-white mb-2 group-hover:text-accent-blueHover transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-white/75 mb-5 line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                        <span className="text-accent-blue font-semibold text-sm inline-flex items-center">
                          {content.blog_card_read_more || 'Read more'}
                          <ArrowRight className="ml-1.5 group-hover:translate-x-1 transition-transform" size={13} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
