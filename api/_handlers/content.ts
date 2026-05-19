/**
 * GET /api/content?page=home
 * Returns website content for a given page slug (public, no auth needed)
 */
import { getDb, json, errorResponse, handleCors, isValidSlug } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const url = new URL(request.url);
  const pageSlug = url.searchParams.get('page');

  if (!pageSlug) return errorResponse('Missing page parameter', 400, request);
  if (!isValidSlug(pageSlug)) return errorResponse('Invalid page slug', 400, request);

  try {
    const sql = getDb();

    // Get page ID
    const pages = await sql`SELECT id FROM website_pages WHERE slug = ${pageSlug} LIMIT 1`;
    if (pages.length === 0) return json({ content: {}, items: [], pageId: null }, 200, request);

    const pageId = pages[0].id;

    // Get content for this page (only visible items — filter at SQL level)
    const items = await sql`
      SELECT id, page_id, section_key, section_label, content_type, content_value, display_order
      FROM website_content
      WHERE page_id = ${pageId} AND is_visible = true
      ORDER BY display_order
    `;

    const contentMap: Record<string, string> = {};
    items.forEach((item: any) => {
      if (item.content_value) {
        contentMap[item.section_key] = item.content_value;
      }
    });

    return json({ content: contentMap, items, pageId }, 200, request, 5);
  } catch (err) {
    console.error('Content API error:', err);
    return errorResponse('Failed to fetch content', 500, request);
  }
}
