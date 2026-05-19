/**
 * GET /api/search?q=keyword — Site-wide search
 * Searches blog_posts, services, faq_items using ILIKE
 * Returns grouped results, max 5 per category
 */
import { getDb, json, errorResponse, handleCors, rateLimit } from './_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405, request);

  // Rate limiting — 30 searches per IP per minute
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`search:${ip}`, 30, 60_000)) {
    return errorResponse('Too many search requests. Please wait.', 429, request);
  }

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return json({ blogs: [], services: [], faqs: [] }, 200, request);
    }

    const searchTerm = `%${q}%`;
    const sql = getDb();
    let failures = 0;

    // Search blog posts
    let blogs: any[] = [];
    try {
      blogs = await sql`
        SELECT id, title, slug, excerpt
        FROM blog_posts
        WHERE status = 'published'
          AND (title ILIKE ${searchTerm} OR excerpt ILIKE ${searchTerm})
        ORDER BY created_at DESC
        LIMIT 5
      `;
    } catch (err) {
      console.error('[search] blog_posts query failed:', err);
      failures++;
    }

    // Search services
    let services: any[] = [];
    try {
      services = await sql`
        SELECT id, title, slug, description
        FROM services
        WHERE (title ILIKE ${searchTerm} OR description ILIKE ${searchTerm})
        ORDER BY sort_order ASC
        LIMIT 5
      `;
    } catch (err) {
      console.error('[search] services query failed:', err);
      failures++;
    }

    // Search FAQ items
    let faqs: any[] = [];
    try {
      faqs = await sql`
        SELECT id, question, answer
        FROM faq_items
        WHERE (question ILIKE ${searchTerm} OR answer ILIKE ${searchTerm})
        LIMIT 5
      `;
    } catch (err) {
      console.error('[search] faq_items query failed:', err);
      failures++;
    }

    // If every backend query failed, this is an outage, not "no results".
    if (failures === 3) {
      return errorResponse('Search temporarily unavailable', 503, request);
    }

    return json({ blogs, services, faqs }, 200, request);
  } catch (err) {
    console.error('Search API error:', err);
    return errorResponse('Search failed', 500, request);
  }
}
