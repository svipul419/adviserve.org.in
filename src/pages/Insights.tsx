/**
 * Insights — §INSIGHTS. Replaces /blog and /newsletters as top-level destination.
 * Uses existing blog card pattern. Filter bar per spec.
 * /blog/:slug remains live for SEO continuity.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { FadeUp } from '../components/animations';
import { publicApi } from '../lib/api';
import { DEFAULT_BLOG_POSTS } from '../lib/defaults';
import type { BlogPost } from '../lib/types';
import EngineeringHero from '../components/sections/EngineeringHero';

const CATEGORY_FILTERS = ['All', 'DPDP Watch', 'Cybersecurity', 'Talent', 'Technology', 'Briefings'];

export default function Insights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type');
  // Legacy type=article/newsletter routes from old redirects land in "All".
  const initial = initialType && CATEGORY_FILTERS.includes(initialType) ? initialType : 'All';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(initial);

  useEffect(() => {
    let cancelled = false;
    publicApi.getBlogPosts()
      .then((data: any) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) setPosts(data as BlogPost[]);
        else setPosts(DEFAULT_BLOG_POSTS);
      })
      .catch(() => { if (!cancelled) setPosts(DEFAULT_BLOG_POSTS); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (category === 'All') searchParams.delete('type');
    else searchParams.set('type', category);
    setSearchParams(searchParams, { replace: true });
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => posts.filter((p) => {
    if (category !== 'All') {
      const cat = (p.category || '').toLowerCase();
      if (!cat.includes(category.toLowerCase().split(' ')[0])) return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q);
  }), [posts, category, query]);

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title="Insights · Working notes from the practice | Adviserve" description="Articles, briefings, and assessments from the practice. Written for executives who need the answer in three paragraphs, not three pages." canonical="https://adviserve.in/insights" />

      {/* Hero */}
      <EngineeringHero
        eyebrow="For executives between meetings"
        title="The answer in three paragraphs."
        gradientPhrase="three paragraphs."
        subtitle="Briefings on DPDP, hiring, security and IT — written so you can read one between two meetings and act on it before the third. No marketing fluff, no fifteen-page whitepapers, no asks at the bottom."
        sheet="INS"
        total="07"
        label="INSIGHTS · BRIEFINGS"
        mark="INS"
      />

      {/* Filter bar */}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 w-full -mt-7 relative z-20">
        <div className="bg-ink-raised rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="search-insights" className="sr-only">Search insights</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/75" />
            <input
              id="search-insights"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights..."
              className="w-full pl-11 pr-4 py-3 min-h-[44px] bg-ink-base rounded-lg text-white text-[14px] placeholder:text-white/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2 font-mono text-[11px] tracking-[0.14em] rounded-lg border transition-colors min-h-[44px] ${
 category === c
 ? 'bg-accent-blue text-white border-accent-blue'
 : 'bg-white text-white/75 border-white/10 hover:border-accent-blueHover/40'
 }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card grid */}
      <section className="py-16 lg:py-24 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/75 text-[15px]">No results. Try a different filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <FadeUp key={p.id} delay={Math.min(0.05 * i, 0.2)}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="group flex flex-col gap-4 p-6 rounded-xl border border-white/10 bg-ink-raised hover: transition-all duration-200 h-full"
                  >
                    {p.category && (
                      <span className="inline-block self-start font-mono text-[10px] tracking-[0.14em] px-2.5 py-0.5 rounded-full border text-accent-blue border-accent-blue/30 bg-accent-blue/[0.06]">
                        {p.category}
                      </span>
                    )}
                    <h3 className="font-display text-[18px] leading-[1.3] text-white group-hover:text-accent-blueHover transition-colors">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-[13px] leading-[1.7] text-white/75 flex-1">{p.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 mt-2">
                      Read
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
