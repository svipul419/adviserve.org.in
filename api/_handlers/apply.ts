/**
 * POST /api/apply
 *
 * Accepts a job application, persists to job_applications, and sends
 * an email notification to connect@adviserve.org.in via Resend.
 *
 * Body (JSON):
 *   job_position_id? — UUID of the position (may be null for speculative)
 *   job_title?       — Human-readable title for email subject
 *   applicant_name   — required
 *   email            — required, validated
 *   phone            — required
 *   linkedin_url?    — optional
 *   resume_url       — required (from /api/upload)
 *   cover_message?   — optional
 *
 * Rate limit: 5 applications / IP / minute
 */

import { getDb, json, errorResponse, handleCors, rateLimit, isDuplicateSubmission } from '../_db';
import { Resend } from 'resend';

export const config = { runtime: 'edge' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Strip CR/LF and other control chars before interpolating into email
// headers (Subject, From, To). Without this, attacker-supplied job_title or
// applicant_name could inject extra headers ("\r\nBcc: victim@…") and turn
// the notification email into an open relay.
function sanitizeHeader(s: string, maxLen = 120): string {
  return s
    .replace(/[\r\n\t\x00-\x1F\x7F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

// Strict URL allowlist for hyperlinks embedded in notification emails.
function safeUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    return u.toString();
  } catch {
    return '';
  }
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    'unknown';
  if (!rateLimit(`apply:${ip}`, 5, 60_000)) {
    return errorResponse('Rate limit exceeded', 429, request);
  }

  let body: Record<string, string | undefined>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON', 400, request);
  }

  const {
    job_position_id,
    job_title,
    applicant_name,
    email,
    phone,
    linkedin_url,
    resume_url,
    cover_message,
  } = body;

  if (!applicant_name?.trim()) return errorResponse('Name is required', 400, request);
  if (!email?.trim() || !EMAIL_RE.test(email.trim()))
    return errorResponse('Valid email is required', 400, request);
  if (!phone?.trim()) return errorResponse('Phone is required', 400, request);
  if (!resume_url?.trim()) return errorResponse('Resume upload is required', 400, request);

  // Silent dedup — same applicant + position within 5 min = treat as
  // double-submit and acknowledge without re-inserting.
  const dedupKey = `apply:${email.trim().toLowerCase()}:${(job_position_id || 'general').trim()}`;
  if (isDuplicateSubmission(dedupKey, 5 * 60_000)) {
    return json({ ok: true, message: 'Application submitted successfully.' }, 200, request);
  }

  // Persist to DB
  try {
    const sql = getDb();
    await sql.query(
      `INSERT INTO job_applications
         (job_position_id, applicant_name, email, phone, linkedin_url, resume_url, cover_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        job_position_id?.trim() || null,
        applicant_name.trim(),
        email.trim(),
        phone.trim(),
        linkedin_url?.trim() || null,
        resume_url.trim(),
        cover_message?.trim() || null,
      ],
    );
  } catch (err) {
    console.error('[apply] DB insert error:', err);
    return errorResponse('Failed to save application. Please try again.', 500, request);
  }

  // Email notification — non-fatal
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const title = job_title?.trim() || 'General / Speculative Application';
      const safeTitle = escapeHtml(title);
      const safeName = escapeHtml(applicant_name.trim());
      const safeEmail = escapeHtml(email.trim());
      const safePhone = escapeHtml(phone.trim());
      const safeLinkedinHref = linkedin_url ? safeUrl(linkedin_url.trim()) : '';
      const safeResumeHref = safeUrl(resume_url.trim());
      const safeCover = cover_message ? escapeHtml(cover_message.trim()) : '';

      // TODO(config): replace `onboarding@resend.dev` with a verified sender
      // domain (e.g. notifications@adviserve.in) once DNS is set up in Resend.
      // The default sandbox sender is rate-limited and blocked for many
      // recipient providers in production.
      const fromAddress = process.env.RESEND_FROM_ADDRESS || 'onboarding@resend.dev';

      await resend.emails.send({
        from: fromAddress,
        to: 'connect@adviserve.org.in',
        subject: `New application: ${sanitizeHeader(title)} — ${sanitizeHeader(applicant_name)}`,
        html: `
          <h2 style="margin-bottom:16px;">New Job Application Received</h2>
          <table style="border-collapse:collapse;width:100%;max-width:560px;">
            <tr><td style="padding:8px 0;color:#666;width:140px;">Position</td><td style="padding:8px 0;font-weight:600;">${safeTitle}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${safePhone}</td></tr>
            ${safeLinkedinHref ? `<tr><td style="padding:8px 0;color:#666;">LinkedIn</td><td style="padding:8px 0;"><a href="${safeLinkedinHref}">${escapeHtml(safeLinkedinHref)}</a></td></tr>` : ''}
            ${safeResumeHref ? `<tr><td style="padding:8px 0;color:#666;">Resume</td><td style="padding:8px 0;"><a href="${safeResumeHref}">Download Resume</a></td></tr>` : ''}
          </table>
          ${safeCover ? `<p style="margin-top:16px;"><strong>Cover Message:</strong></p><p style="white-space:pre-wrap;">${safeCover}</p>` : ''}
          <p style="margin-top:24px;font-size:12px;color:#999;">Manage this application at /admin/applications</p>
        `,
      });
    } catch (emailErr) {
      console.error('[apply] Resend error (non-fatal):', emailErr);
    }
  }

  return json({ ok: true, message: 'Application submitted successfully.' }, 200, request);
}
