/**
 * POST /api/booking — Booking form submission
 * Rate limiting: 3 booking attempts per IP per 10 minutes
 * Origin validation (CSRF protection)
 */
import { getDb, json, errorResponse, handleCors, validateOrigin, rateLimit, isDuplicateSubmission } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);
  if (!validateOrigin(request)) return errorResponse('Forbidden', 403, request);

  // Rate limiting — 3 booking attempts per IP per 10 minutes
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`booking:${ip}`, 3, 10 * 60_000)) {
    return errorResponse('Too many booking attempts. Please try again later.', 429, request);
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, service_interest, notes, date, time, website } = body;

    // Honeypot check
    if (website) return json({ success: true }, 200, request);

    // Validation
    if (!name || !email || !date || !time) {
      return errorResponse('Name, email, date, and time are required', 400, request);
    }
    if (!email.includes('@') || !email.includes('.')) {
      return errorResponse('Invalid email address', 400, request);
    }

    const emailKey = email.toLowerCase().trim();

    // Silent dedup — same booking from the same email for the same slot
    // within 5 min returns success without re-inserting.
    const dedupKey = `booking:${emailKey}:${date}:${time}`;
    if (isDuplicateSubmission(dedupKey, 5 * 60_000)) {
      return json({
        success: true,
        booking: { name, email: emailKey, date, time, service_interest },
      }, 200, request);
    }

    const sql = getDb();

    await sql`
      INSERT INTO bookings (name, email, phone, company, service_interest, notes, booking_date, booking_time, status)
      VALUES (${name}, ${emailKey}, ${phone || null}, ${company || null}, ${service_interest || null}, ${notes || null}, ${date}, ${time}, 'pending')
    `;

    return json({
      success: true,
      booking: { name, email: emailKey, date, time, service_interest },
    }, 200, request);
  } catch (err) {
    console.error('Booking API error:', err);
    return errorResponse('Failed to submit booking', 500, request);
  }
}
