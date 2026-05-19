/**
 * POST /api/analytics — Track page view
 * S7 fix: Log errors server-side (still return 200 to not break UX)
 * S8 fix: Origin validation
 */
import { getDb, json, handleCors, validateOrigin, rateLimit } from './_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return json({ success: false }, 405, request);
  if (!validateOrigin(request)) return json({ success: false }, 403, request);

  // Rate limiting — 60 page views per IP per minute (generous for SPA navigation)
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`analytics:${ip}`, 60, 60_000)) {
    return json({ success: true }, 200, request); // Silently drop, don't break UX
  }

  try {
    const body = await request.json();
    const { page_path, page_title, referrer, user_agent, screen_width, session_id } = body;

    if (!page_path) return json({ success: false }, 400, request);

    const sql = getDb();
    await sql`
      INSERT INTO page_analytics (page_path, page_title, referrer, user_agent, screen_width, session_id)
      VALUES (${page_path}, ${page_title || null}, ${referrer || null}, ${user_agent || null}, ${screen_width || null}, ${session_id || null})
    `;

    return json({ success: true }, 200, request);
  } catch (err) {
    // S7: Log error but still return 200 (analytics should never break UX)
    console.error('Analytics tracking error:', err);
    return json({ success: true }, 200, request);
  }
}
