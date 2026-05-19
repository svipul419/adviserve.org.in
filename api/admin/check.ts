/**
 * GET /api/admin/check — Check if current user is admin
 * Returns { isAdmin: true/false } based on server-side email allowlist
 */
import { json, handleCors } from '../_db';
import { verifyAdmin } from '../_auth';

// Node runtime — @supabase/supabase-js depends on Node built-ins
// (stream, crypto, etc.) that the Edge runtime does not expose. Keeping
// admin routes on the default Node runtime so JWT verification works.

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const admin = await verifyAdmin(request);
  return json({ isAdmin: !!admin }, 200, request);
}
