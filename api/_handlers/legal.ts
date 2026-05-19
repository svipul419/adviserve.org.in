/**
 * GET /api/legal?slug=privacy — Get published legal document by slug
 */
import { getDb, json, errorResponse, handleCors, isValidSlug } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  if (!slug) return errorResponse('Missing slug parameter', 400, request);
  if (!isValidSlug(slug)) return errorResponse('Invalid slug', 400, request);

  try {
    const sql = getDb();
    const docs = await sql`
      SELECT id, slug, title, content, status, updated_at, created_at FROM legal_documents WHERE slug = ${slug} AND status = 'published' LIMIT 1
    ` as Record<string, unknown>[];
    return json(docs.length > 0 ? docs[0] : null, 200, request, 300);
  } catch (err) {
    console.error('Legal API error:', err);
    return errorResponse('Failed to fetch legal document', 500, request);
  }
}
