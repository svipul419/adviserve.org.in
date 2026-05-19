/**
 * POST /api/subscribe — Newsletter subscription
 * S6 fix: Added rate limiting
 * S8 fix: Origin validation
 */
import { getDb, json, errorResponse, handleCors, validateOrigin, rateLimit } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);
  if (!validateOrigin(request)) return errorResponse('Forbidden', 403, request);

  // Rate limiting — 5 subscribe attempts per IP per minute
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
    return errorResponse('Too many requests. Please wait.', 429, request);
  }

  // Anti-enumeration: start the response clock the same way regardless of
  // whether the email is new or already subscribed. The work below diverges
  // (one DB write vs one DB read+update), so we pad the response to a fixed
  // floor before returning. An attacker timing the endpoint can no longer
  // distinguish "fresh signup" from "already subscribed".
  const startedAt = Date.now();
  const MIN_LATENCY_MS = 220;

  let result: { success: boolean; message?: string };
  try {
    const body = await request.json();
    const { email, first_name, last_name, company, source } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return errorResponse('Valid email is required', 400, request);
    }

    const normalized = email.trim().toLowerCase();
    const sql = getDb();
    const existing = await sql`SELECT id, status FROM email_subscribers WHERE email = ${normalized} LIMIT 1` as Record<string, unknown>[];

    if (existing.length > 0) {
      const row = existing[0];
      if (row.status !== 'active' && row.status !== 'pending') {
        await sql`UPDATE email_subscribers SET status = 'pending', subscribed_at = NOW() WHERE id = ${row.id as string}`;
      }
    } else {
      await sql`
        INSERT INTO email_subscribers (email, first_name, last_name, company, status, source, subscribed_at)
        VALUES (${normalized}, ${first_name || null}, ${last_name || null}, ${company || null}, 'pending', ${source || 'website'}, NOW())
      `;
    }

    // Identical success payload for both new + existing — no "Already subscribed"
    // signal that would let a probe distinguish the two states.
    result = { success: true };
  } catch (err) {
    console.error('Subscribe API error:', err);
    result = { success: false, message: 'Failed to subscribe' };
  }

  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_LATENCY_MS) {
    await new Promise((r) => setTimeout(r, MIN_LATENCY_MS - elapsed));
  }
  return result.success
    ? json(result, 200, request)
    : errorResponse(result.message || 'Failed to subscribe', 500, request);
}
