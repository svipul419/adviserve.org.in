/**
 * POST /api/dpdp-assessment — DPDP self-assessment lead capture
 */
import { getDb, json, errorResponse, handleCors, validateOrigin, rateLimit } from '../_db';

export const config = { runtime: 'edge' };

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const MAX_JSON_DEPTH = 6;       // questions → categories → answers; 6 leaves headroom
const MAX_JSON_BYTES = 32 * 1024; // 32 KB serialised; comfortably above legitimate forms

/** Recursive depth probe — returns the deepest nesting level in the value. */
function jsonDepth(value: unknown, current = 0): number {
  if (current > MAX_JSON_DEPTH) return current;
  if (Array.isArray(value)) {
    let max = current;
    for (const v of value) max = Math.max(max, jsonDepth(v, current + 1));
    return max;
  }
  if (value && typeof value === 'object') {
    let max = current;
    for (const v of Object.values(value)) max = Math.max(max, jsonDepth(v, current + 1));
    return max;
  }
  return current;
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);
  if (!validateOrigin(request)) return errorResponse('Forbidden', 403, request);

  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`dpdp:${ip}`, 5, 120_000)) {
    return errorResponse('Too many submissions. Please wait a moment.', 429, request);
  }

  try {
    const body = await request.json();
    const { full_name, email, company, company_size, notes, total_score, tier, answers, gaps, honeypot } = body;

    if (honeypot) return json({ success: true }, 200, request);

    if (!full_name || typeof full_name !== 'string' || full_name.length > 255) {
      return errorResponse('Full name is required (max 255 chars)', 400, request);
    }
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
      return errorResponse('A valid work email is required', 400, request);
    }
    if (!company || typeof company !== 'string' || company.length > 255) {
      return errorResponse('Company name is required (max 255 chars)', 400, request);
    }
    if (typeof total_score !== 'number' || total_score < 0 || total_score > 36) {
      return errorResponse('Invalid score', 400, request);
    }
    if (!tier || typeof tier !== 'string') {
      return errorResponse('Invalid tier', 400, request);
    }
    if (!answers || typeof answers !== 'object') {
      return errorResponse('Invalid answers', 400, request);
    }

    // Reject pathological JSON payloads (deeply nested or oversize) before
    // they hit the DB. Defends against storage bloat + JSONB parser DoS.
    const answersJson = JSON.stringify(answers);
    const gapsJson = JSON.stringify(gaps || []);
    if (answersJson.length > MAX_JSON_BYTES || gapsJson.length > MAX_JSON_BYTES) {
      return errorResponse('Submission too large', 413, request);
    }
    if (jsonDepth(answers) > MAX_JSON_DEPTH || jsonDepth(gaps) > MAX_JSON_DEPTH) {
      return errorResponse('Submission structure too deep', 400, request);
    }

    const sql = getDb();
    await sql`
      INSERT INTO dpdp_assessments
        (full_name, email, company, company_size, notes, total_score, tier, answers, gaps)
      VALUES (
        ${full_name},
        ${email},
        ${company},
        ${company_size || null},
        ${notes || null},
        ${total_score},
        ${tier},
        ${answersJson},
        ${gapsJson}
      )
    `;

    return json({ success: true }, 200, request);
  } catch (err) {
    console.error('DPDP assessment API error:', err);
    return errorResponse('Failed to save assessment', 500, request);
  }
}
