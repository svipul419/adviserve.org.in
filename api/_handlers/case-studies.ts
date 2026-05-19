/**
 * GET /api/case-studies — List visible case studies
 * GET /api/case-studies?slug=xxx — Get single case study by slug
 */
import { getDb, json, errorResponse, handleCors, isValidSlug } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (slug !== null && !isValidSlug(slug)) return errorResponse('Invalid slug', 400, request);

  try {
    const sql = getDb();

    if (slug) {
      const studies = await sql`SELECT id, slug, title, industry, timeline, client_name, client_description, practices, challenge, work_sections, results, integration_quote, seo_title, seo_description, sort_order, is_visible, created_at, updated_at FROM case_studies WHERE slug = ${slug} AND is_visible = true LIMIT 1` as Record<string, unknown>[];
      return json(studies.length ? studies[0] : null, 200, request, 120);
    }

    const studies = await sql`
      SELECT id, slug, title, industry, timeline, client_name, client_description, practices, challenge, work_sections, results, integration_quote, seo_title, seo_description, sort_order, is_visible, created_at, updated_at FROM case_studies WHERE is_visible = true ORDER BY sort_order
    `;
    return json(studies, 200, request, 120);
  } catch (err) {
    console.error('Case Studies API error:', err);
    return errorResponse('Failed to fetch case studies', 500, request);
  }
}
