import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client.
 *
 * If env vars are missing or placeholder, we log a warning and return a stub
 * that resolves auth calls to a "no session" state instead of throwing at
 * import time. This keeps the public site renderable without supabase
 * (e.g. local dev with `.env.example` defaults) — admin routes still gate
 * via AuthContext, which will surface unauthenticated state.
 */
function isConfigured(url: unknown, key: unknown): url is string {
  return (
    typeof url === 'string' &&
    typeof key === 'string' &&
    url.length > 0 &&
    key.length > 0 &&
    !url.includes('your-project') &&
    !key.includes('your-anon-key')
  );
}

function createStubClient(): SupabaseClient {
  const noSession = { data: { session: null }, error: null };
  const noUser = { data: { user: null }, error: null };
  const stub = {
    auth: {
      getSession: async () => noSession,
      getUser: async () => noUser,
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { name: 'AuthApiError', message: 'Supabase is not configured', status: 503 } as any,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (_cb: unknown) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => {
      throw new Error('Supabase is not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    },
  } as unknown as SupabaseClient;
  return stub;
}

let client: SupabaseClient;
if (isConfigured(supabaseUrl, supabaseAnonKey)) {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '[supabase] Missing or placeholder VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — using stub client. Admin routes will show "not authenticated".',
  );
  client = createStubClient();
}

export const supabase = client;
