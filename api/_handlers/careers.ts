/**
 * GET /api/careers — List visible job positions
 */
import { getDb, json, errorResponse, handleCors } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  try {
    const sql = getDb();
    const positions = await sql`
      SELECT id, title, slug, department, location, type, experience_level, description, requirements, sort_order, is_visible, created_at, updated_at FROM job_positions WHERE is_visible = true ORDER BY sort_order
    `;
    return json(positions, 200, request, 120);
  } catch (err) {
    console.error('Careers API error:', err);
    return errorResponse('Failed to fetch positions', 500, request);
  }
}
