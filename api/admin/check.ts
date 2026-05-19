/**
 * GET /api/admin/check — Check if current user is admin
 * Returns { isAdmin: true/false } based on server-side email allowlist
 */
import { json, handleCors } from '../_db';
import { verifyAdmin } from '../_auth';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const admin = await verifyAdmin(request);
  return json({ isAdmin: !!admin }, 200, request);
}
