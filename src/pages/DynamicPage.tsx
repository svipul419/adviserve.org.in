import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../lib/api';
import { sanitizeHTML } from '../lib/sanitize';
import SEOHead from '../components/SEOHead';
import EngineeringHero from '../components/sections/EngineeringHero';
import NotFound from './NotFound';

interface PageContent {
  content: Record<string, string>;
  items: any[];
  pageId: string | null;
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    publicApi.getContent(slug)
      .then((data) => {
        if (!data.pageId) {
          setNotFound(true);
        } else {
          setPage(data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F6] pt-[120px]">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <div className="shimmer h-10 w-2/3 rounded mb-4" />
          <div className="shimmer h-5 w-1/2 rounded mb-8" />
          <div className="shimmer h-4 w-full rounded mb-3" />
          <div className="shimmer h-4 w-full rounded mb-3" />
          <div className="shimmer h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !page) return <NotFound />;

  const title = String(page.content.page_title || page.content.title || slug || 'Page');
  const description = page.content.page_description || page.content.subtitle || '';
  const bodyContent = page.content.body || page.content.content || '';

  return (
    <div className="flex flex-col" style={{ background: '#FBFDFF' }}>
      <SEOHead title={title} description={description} />

      <EngineeringHero
        eyebrow="Page"
        title={title}
        subtitle={description}
        sheet="PG"
        total="07"
        label="DYNAMIC PAGE"
        mark="PG"
      />

      {/* Content */}
      {bodyContent && (
        <section className="py-16 lg:py-24 bg-[#F9F9F6]">
          <div className="max-w-4xl mx-auto px-6 sm:px-12">
            <div className="bg-ink-raised rounded-2xl border border-[#e5e5dd] p-8 md:p-12">
              <div
                className="service-prose max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(bodyContent) }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Render other content blocks */}
      {page.items.filter(item => item.is_visible && item.section_key !== 'page_title' && item.section_key !== 'page_description' && item.section_key !== 'body' && item.section_key !== 'title' && item.section_key !== 'subtitle' && item.section_key !== 'content').map((item: any) => (
        <section key={item.id} className="py-12 bg-[#F9F9F6]">
          <div className="max-w-4xl mx-auto px-6 sm:px-12">
            {item.section_label && (
              <h2 className="font-heading text-2xl text-[#1a1a2e] mb-4">{item.section_label}</h2>
            )}
            <div
              className="service-prose"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.content_value || '') }}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
