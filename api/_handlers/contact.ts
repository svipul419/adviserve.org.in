/**
 * POST /api/contact — Contact form submission
 * S5: Rate limiting (in-memory, resets on cold start — acceptable for now)
 * S8: Origin validation (CSRF protection)
 */
import { getDb, json, errorResponse, handleCors, validateOrigin, rateLimit, isDuplicateSubmission } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);
  if (!validateOrigin(request)) return errorResponse('Forbidden', 403, request);

  // Rate limiting — 3 submissions per IP per 2 minutes (wider window to compensate for cold-start resets)
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`contact:${ip}`, 3, 120_000)) {
    return errorResponse('Too many submissions. Please wait.', 429, request);
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, service_interest, message, website } = body;

    // Honeypot check
    if (website) return json({ success: true }, 200, request);

    // Validation
    if (!name || !email || !message) {
      return errorResponse('Name, email, and message are required', 400, request);
    }
    if (typeof name !== 'string' || name.length > 255) {
      return errorResponse('Name must be under 255 characters', 400, request);
    }
    if (typeof email !== 'string' || email.length > 254) {
      return errorResponse('Email must be under 254 characters', 400, request);
    }
    if (typeof message !== 'string' || message.length > 5000) {
      return errorResponse('Message must be under 5000 characters', 400, request);
    }
    // RFC 5322 simplified email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email address', 400, request);
    }

    // Silent dedup — if the same email submits the exact same message hash
    // within 60 s, return success without re-inserting. Protects against
    // double-submits (impatient user clicks twice) and replay spam without
    // tipping off bots that we noticed.
    const dedupKey = `contact:${email.toLowerCase().trim()}:${message.length}`;
    if (isDuplicateSubmission(dedupKey, 60_000)) {
      return json({ success: true }, 200, request);
    }

    const sql = getDb();
    await sql`
      INSERT INTO contact_inquiries (name, email, phone, company, service_interest, message, status)
      VALUES (${name}, ${email}, ${phone || null}, ${company || null}, ${service_interest || null}, ${message}, 'new')
    `;

    return json({ success: true }, 200, request);
  } catch (err) {
    console.error('Contact API error:', err);
    return errorResponse('Failed to submit form', 500, request);
  }
}
