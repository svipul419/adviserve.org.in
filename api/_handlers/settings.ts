/**
 * GET /api/settings — Get all site settings (public)
 * GET /api/settings?keys=key1,key2 — Get specific settings
 */
import { getDb, json, errorResponse, handleCors } from '../_db';

export const config = { runtime: 'edge' };

// M4 fix: Settings key prefixes / patterns that must never be returned to public callers
const SENSITIVE_KEY_PATTERNS = [
  'api_key', 'api_secret', 'secret', 'token', 'password', 'private',
  'smtp_', 'sendgrid_', 'mailgun_', 'aws_', 'stripe_',
  'admin_', 'internal_', 'webhook_secret',
];

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_PATTERNS.some(p => lower.includes(p));
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const url = new URL(request.url);
  const keys = url.searchParams.get('keys');

  try {
    const sql = getDb();

    let settings;
    if (keys) {
      const keyList = keys.split(',').map(k => k.trim()).filter(k => !isSensitiveKey(k));
      if (keyList.length === 0) return json([], 200, request, 60);
      settings = await sql`
        SELECT DISTINCT ON (key) key, value FROM site_settings
        WHERE key = ANY(${keyList})
        ORDER BY key, id DESC
      `;
    } else {
      settings = await sql`
        SELECT DISTINCT ON (key) key, value, category FROM site_settings
        ORDER BY key, id DESC
      `;
    }

    // Filter out any sensitive settings from the response
    settings = (settings as any[]).filter((s: any) => !isSensitiveKey(s.key));

    return json(settings, 200, request, 60);
  } catch (err) {
    console.error('Settings API error:', err);
    return errorResponse('Failed to fetch settings', 500, request);
  }
}
