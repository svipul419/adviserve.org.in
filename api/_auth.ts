/**
 * Auth middleware for admin API routes — SERVER-SIDE ONLY
 * Verifies the Supabase JWT token to ensure the user is an admin.
 * We keep Supabase for authentication only, database goes through Neon.
 */
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

export async function verifyAdmin(request: Request): Promise<{ userId: string; email: string } | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return null;

  // Check admin: role in metadata OR email in allowlist
  const isAdmin = user.app_metadata?.role === 'admin'
    || (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

  if (!isAdmin) return null;

  return { userId: user.id, email: user.email || '' };
}
