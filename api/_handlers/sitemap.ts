/**
 * GET /api/sitemap — Dynamic XML sitemap
 * Pulls services, products, blog posts, case studies, legal docs from DB
 */
import { getDb, handleCors } from '../_db';

export const config = { runtime: 'edge' };

// Canonical site URL — keep in sync with src/lib/constants.ts and the
// ALLOWED_ORIGINS list in api/_db.ts. Override via env var on each
// environment (production / preview / staging) so canonicals match the
// host the page is actually served from.
const SITE = process.env.SITE_URL || 'https://adviserve.org.in';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services', priority: '0.9', changefreq: 'weekly' },
  { loc: '/services/cybersecurity', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/compliance-regtech', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/hr-services', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/it-services', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/legal-consulting', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/saas-products', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/corporate-training', priority: '0.8', changefreq: 'monthly' },
  { loc: '/products', priority: '0.8', changefreq: 'weekly' },
  { loc: '/products/dpdp-compliance', priority: '0.7', changefreq: 'monthly' },
  { loc: '/products/ats-system', priority: '0.7', changefreq: 'monthly' },
  { loc: '/products/hris-portal', priority: '0.7', changefreq: 'monthly' },
  { loc: '/insights', priority: '0.8', changefreq: 'daily' },
  { loc: '/case-studies', priority: '0.7', changefreq: 'monthly' },
  { loc: '/trust', priority: '0.7', changefreq: 'monthly' },
  { loc: '/industries', priority: '0.6', changefreq: 'monthly' },
  { loc: '/partnerships', priority: '0.5', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/careers', priority: '0.7', changefreq: 'weekly' },
  { loc: '/team', priority: '0.6', changefreq: 'monthly' },
  { loc: '/faq', priority: '0.6', changefreq: 'monthly' },
  { loc: '/consultation', priority: '0.7', changefreq: 'monthly' },
  { loc: '/dpdp-assessment', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
];

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function urlEntry(loc: string, lastmod?: string, changefreq = 'monthly', priority = '0.5') {
  return `  <url>
    <loc>${escapeXml(SITE + loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod.split('T')[0]}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  try {
    const sql = getDb();

    const [services, products, posts, caseStudies, legalDocs] = await Promise.all([
      sql`SELECT slug, updated_at FROM services WHERE is_visible = true ORDER BY sort_order`,
      sql`SELECT slug, updated_at FROM products WHERE is_visible = true ORDER BY sort_order`,
      sql`SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC`,
      sql`SELECT slug, updated_at FROM case_studies WHERE status = 'published' AND is_visible = true ORDER BY created_at DESC`,
      sql`SELECT slug, updated_at FROM legal_documents WHERE status = 'published'`,
    ]);

    const urls: string[] = [];

    // Static pages
    for (const p of staticPages) {
      urls.push(urlEntry(p.loc, undefined, p.changefreq, p.priority));
    }

    // Services
    for (const s of services) {
      urls.push(urlEntry(`/services/${s.slug}`, s.updated_at, 'weekly', '0.7'));
    }

    // Products
    for (const p of products) {
      urls.push(urlEntry(`/products/${p.slug}`, p.updated_at, 'weekly', '0.7'));
    }

    // Blog posts
    for (const p of posts) {
      urls.push(urlEntry(`/blog/${p.slug}`, p.updated_at, 'weekly', '0.6'));
    }

    // Case studies
    for (const c of caseStudies) {
      urls.push(urlEntry(`/case-studies/${c.slug}`, c.updated_at, 'monthly', '0.6'));
    }

    // Legal docs
    for (const l of legalDocs) {
      urls.push(urlEntry(`/legal/${l.slug}`, l.updated_at, 'yearly', '0.3'));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    // Fallback static sitemap if DB fails
    const urls = staticPages.map(p => urlEntry(p.loc, undefined, p.changefreq, p.priority));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
