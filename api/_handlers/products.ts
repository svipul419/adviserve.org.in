/**
 * GET /api/products — List visible products
 * GET /api/products?slug=xxx — Get single product by slug
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
      const products = await sql`SELECT id, title, slug, subtitle, description, icon, image_url, card_color, problem_title, problem_body, features, differentiators, pricing_tiers, cta_title, cta_description, seo_title, seo_description, sort_order, is_visible, created_at, updated_at FROM products WHERE slug = ${slug} AND is_visible = true LIMIT 1`;
      return json(products.length ? products[0] : null, 200, request, 120);
    }

    const products = await sql`
      SELECT id, title, slug, subtitle, description, icon, image_url, card_color, problem_title, problem_body, features, differentiators, pricing_tiers, cta_title, cta_description, seo_title, seo_description, sort_order, is_visible, created_at, updated_at FROM products WHERE is_visible = true ORDER BY sort_order
    `;
    return json(products, 200, request, 120);
  } catch (err) {
    console.error('Products API error:', err);
    return errorResponse('Failed to fetch products', 500, request);
  }
}
