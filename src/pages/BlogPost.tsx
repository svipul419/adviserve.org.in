import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook, BookOpen, ArrowUp } from 'lucide-react';
import { sanitizeHTML } from '../lib/sanitize';
import { publicApi } from '../lib/api';
import type { BlogPost as BlogPostType } from '../lib/types';
import SEOHead from '../components/SEOHead';
import EngineeringHero from '../components/sections/EngineeringHero';
import { generateBlogPostSchema } from '../lib/structuredData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const floatingShape1Ref = useRef<HTMLDivElement>(null);
  const floatingShape2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await publicApi.getBlogPost(slug!);
        if (data) setPost(data);
      } catch {
        // Failed to fetch post
      }
      setLoading(false);
    }
    if (slug) fetchPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero title entrance
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroContentRef.current || !post) return;

    const title = heroContentRef.current.querySelector('h1');
    const metaItems = heroContentRef.current.querySelectorAll('.meta-item');
    const category = heroContentRef.current.querySelector('.hero-category');
    const backLink = heroContentRef.current.querySelector('.back-link');

    if (backLink) {
      gsap.fromTo(backLink, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 });
    }
    if (category) {
      gsap.fromTo(category, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 });
    }
    if (title) {
      gsap.fromTo(title, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 });
    }
    if (metaItems.length) {
      gsap.fromTo(
        metaItems,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.6 }
      );
    }
  }, { dependencies: [post], revertOnUpdate: true });

  // Floating shapes parallax
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const shapes = [floatingShape1Ref.current, floatingShape2Ref.current].filter(Boolean);
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: -30 - i * 20,
        rotation: 10 + i * 15,
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

  // Article content fade in
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!articleRef.current || !post) return;

    gsap.fromTo(
      articleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: articleRef.current,
          start: 'top 88%',
        },
      }
    );
  }, { dependencies: [post], revertOnUpdate: true });

  // Share buttons stagger
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!shareRef.current || !post) return;

    const buttons = shareRef.current.querySelectorAll('.share-btn');
    if (buttons.length) {
      gsap.fromTo(
        buttons,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: shareRef.current,
            start: 'top 90%',
          },
        }
      );
    }
  }, { dependencies: [post], revertOnUpdate: true });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getReadingTime = (content: string) => {
    const words = (content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-ink-base">
        <div className="bg-ink-base pt-[120px] pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="shimmer h-4 w-32 rounded mb-8" />
            <div className="shimmer h-10 w-3/4 rounded mb-4" />
            <div className="shimmer h-5 w-1/3 rounded" />
          </div>
        </div>
        <div className="py-16 bg-ink-base">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-ink-raised rounded-3xl border border-white/10 p-8 md:p-14 space-y-4">
              <div className="shimmer h-64 rounded-2xl" />
              <div className="shimmer h-5 w-full rounded" />
              <div className="shimmer h-5 w-full rounded" />
              <div className="shimmer h-5 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-ink-base">
        <div className="w-16 h-16 bg-ink-raised rounded-2xl flex items-center justify-center mb-4 border border-white/10">
          <BookOpen className="w-7 h-7 text-accent-blue/40" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-white/75 text-sm mb-6">This article may have been moved or is no longer published.</p>
        <Link to="/blog" className="text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors">
          Browse all articles
        </Link>
      </div>
    );
  }

  const readingTime = getReadingTime(post.content || '');

  return (
    <div className="flex flex-col bg-ink-base">
      <SEOHead
        title={post.title}
        description={post.excerpt || `Read ${post.title} on the Adviserve blog.`}
        canonical={`https://adviserve.in/blog/${post.slug}`}
        ogImage={post.image_url || undefined}
        ogType="article"
        structuredData={generateBlogPostSchema(post, 'https://adviserve.in')}
      />
      <EngineeringHero
        eyebrow={post.category || 'Article'}
        title={post.title}
        subtitle={post.excerpt || undefined}
        sheet="ART"
        total="07"
        label={`ARTICLE · ${post.category || 'INSIGHT'}`}
        mark="ART"
      >
        <div className="flex flex-wrap items-center gap-4 text-[rgba(11,20,38,0.62)] text-sm">
          <Link to="/blog" className="inline-flex items-center text-[#1e9df1] hover:text-[#1a82d4] transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2" size={15} />
            Back to Blog
          </Link>
          {post.published_at && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} className="text-[#1e9df1]" />
              {formatDate(post.published_at)}
            </span>
          )}
          {post.author && (
            <span className="inline-flex items-center gap-1.5">
              <User size={14} className="text-[#1e9df1]" />
              {post.author}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-[#1e9df1]" />
            {readingTime} min read
          </span>
        </div>
      </EngineeringHero>

      {/* Content */}
      <section className="py-12 lg:py-16 bg-ink-base">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={articleRef}>
            <div className="bg-ink-raised rounded-3xl border border-white/10 p-8 md:p-12 lg:p-14">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-auto rounded-2xl mb-10"
                />
              )}
              <div
                className="prose prose-lg prose-slate max-w-none text-white/75 leading-relaxed prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-accent-blue/30 prose-blockquote:text-white/75"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content || '') }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-accent-blue/[0.08] text-accent-blue px-4 py-1.5 rounded-full text-sm font-medium hover:bg-accent-blueHover/[0.15] transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div ref={shareRef} className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/75">
                    <Share2 size={15} />
                    <span className="font-medium">Share this article</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn w-11 h-11 rounded-xl bg-[#f0efeb] hover:bg-accent-blueHover/20 flex items-center justify-center transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter size={15} className="text-white/75" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn w-11 h-11 rounded-xl bg-[#f0efeb] hover:bg-accent-blueHover/20 flex items-center justify-center transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin size={15} className="text-white/75" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn w-11 h-11 rounded-xl bg-[#f0efeb] hover:bg-accent-blueHover/20 flex items-center justify-center transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook size={15} className="text-white/75" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to blog */}
          <div className="mt-8 text-center">
            <Link to="/blog" className="inline-flex items-center gap-2 text-accent-blue hover:text-accent-blueHover/80 font-semibold text-sm transition-colors">
              <ArrowLeft size={15} />
              Back to all articles
            </Link>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 w-11 h-11 rounded-full bg-text-primary text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-accent-blueHover z-40 ${
 showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
 }`}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
