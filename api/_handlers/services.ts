/**
 * GET /api/services — List visible services (parent only)
 * GET /api/services?slug=xxx — Get service + children by slug
 * GET /api/services?parent=xxx — Get sub-services by parent slug
 */
import { getDb, json, errorResponse, handleCors, isValidSlug } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const parentSlug = url.searchParams.get('parent');
  if (slug !== null && !isValidSlug(slug)) return errorResponse('Invalid slug', 400, request);
  if (parentSlug !== null && !isValidSlug(parentSlug)) return errorResponse('Invalid parent slug', 400, request);

  try {
    const sql = getDb();

    if (slug) {
      const services = await sql`SELECT id, title, slug, description, icon, parent_id, sort_order, is_visible, created_at, updated_at FROM services WHERE slug = ${slug} AND is_visible = true LIMIT 1`;
      if (services.length === 0) return json(null, 200, request);

      const service = services[0];
      const children = await sql`
        SELECT id, title, slug, description, icon, parent_id, sort_order, is_visible, created_at, updated_at FROM services WHERE parent_id = ${service.id} AND is_visible = true ORDER BY sort_order
      `;
      return json({ ...service, children }, 200, request, 120);
    }

    if (parentSlug) {
      const parents = await sql`SELECT id FROM services WHERE slug = ${parentSlug} LIMIT 1`;
      if (parents.length === 0) return json([], 200, request);
      const children = await sql`
        SELECT id, title, slug, description, icon, parent_id, sort_order, is_visible, created_at, updated_at FROM services WHERE parent_id = ${parents[0].id} AND is_visible = true ORDER BY sort_order
      `;
      return json(children, 200, request, 120);
    }

    const services = await sql`
      SELECT id, title, slug, description, icon, parent_id, sort_order, is_visible, created_at, updated_at FROM services WHERE is_visible = true AND parent_id IS NULL ORDER BY sort_order
    `;
    return json(services, 200, request, 120);
  } catch (err) {
    console.error('Services API error:', err);
    return errorResponse('Failed to fetch services', 500, request);
  }
}
