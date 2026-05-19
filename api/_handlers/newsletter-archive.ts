/**
 * GET /api/newsletter-archive
 * Returns sent email campaigns with their template HTML content.
 */
import { getDb, json, errorResponse, handleCors, rateLimit } from '../_db';

export const config = { runtime: 'edge' };

// Edge runtime has no DOMPurify, but we can still strip the obvious script
// vectors before the HTML reaches the browser. Anything an admin paste into
// `email_templates.html_content` that runs JS in the user's browser is a
// stored-XSS bug; this defensive pass blocks <script>, <iframe>, on* handlers
// and javascript: URIs. The frontend must still render the result with the
// same caution it would any user-generated HTML.
function sanitizeNewsletterHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data:text\/html/gi, '');
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405, request);

  // Rate limit — newsletter HTML payloads are large; cap to 20 req / IP / min.
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`newsletter:${ip}`, 20, 60_000)) {
    return errorResponse('Too many requests. Please wait.', 429, request);
  }

  try {
    const sql = getDb();

    const campaigns = await sql`
      SELECT
        c.id,
        c.name,
        c.subject,
        c.sent_at,
        t.html_content,
        c.preview_text
      FROM email_campaigns c
      LEFT JOIN email_templates t ON c.template_id = t.id
      WHERE c.status = 'sent'
        AND c.sent_at IS NOT NULL
      ORDER BY c.sent_at DESC
      LIMIT 50
    ` as Array<Record<string, unknown>>;

    const sanitized = campaigns.map((c) => ({
      ...c,
      html_content: sanitizeNewsletterHtml(c.html_content as string | null | undefined),
    }));

    return json(sanitized, 200, request, 120);
  } catch (err: any) {
    console.error('Newsletter archive error:', err);
    return errorResponse('Failed to fetch newsletter archive', 500, request);
  }
}
