/**
 * POST /api/unsubscribe — Unsubscribe email from newsletter
 * B1 fix: Always returns success (prevents email enumeration)
 */
import { getDb, json, errorResponse, handleCors, validateOrigin, rateLimit } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);
  if (!validateOrigin(request)) return errorResponse('Forbidden', 403, request);

  // Rate limiting — 10 unsubscribes per IP per minute
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`unsub:${ip}`, 10, 60_000)) {
    return json({ success: true }, 200, request); // Still return success (anti-enumeration)
  }

  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === 'string' ? body.email : '';

    // Strip CR/LF + other control chars before the value reaches the DB or any
    // downstream email envelope. Belt-and-braces — the value is parametrised
    // already, but stripping here protects any future code path that might
    // interpolate `email` into a header or log line.
    const sanitized = rawEmail
      .replace(/[\r\n\t\x00-\x1F\x7F]+/g, '')
      .trim()
      .toLowerCase()
      .slice(0, 254); // RFC 5321 max length

    if (!sanitized || !sanitized.includes('@') || !sanitized.includes('.')) {
      return errorResponse('Email is required', 400, request);
    }

    const sql = getDb();
    await sql`UPDATE email_subscribers SET status = 'unsubscribed' WHERE email = ${sanitized}`;

    // B1 fix: Always return success regardless of whether email was found
    return json({ success: true }, 200, request);
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return json({ success: true }, 200, request); // Don't leak errors either
  }
}
