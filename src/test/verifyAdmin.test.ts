import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We mock @supabase/supabase-js so the verifyAdmin module never makes a
// real network call. Each test installs the desired getUser response.
const mockGetUser = vi.fn();
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth: { getUser: mockGetUser } }),
}));

describe('verifyAdmin', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    mockGetUser.mockReset();
    process.env = {
      ...originalEnv,
      SUPABASE_URL: 'https://supabase.example',
      SUPABASE_ANON_KEY: 'anon-key',
      ADMIN_EMAILS: 'allow@adviserve.in,boss@adviserve.in',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function buildRequest(authHeader?: string): Request {
    return new Request('http://localhost/api/admin/anything', {
      headers: authHeader ? { Authorization: authHeader } : {},
    });
  }

  it('returns null when the Authorization header is missing', async () => {
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest())).toBeNull();
  });

  it('returns null when the Authorization header is not a Bearer token', async () => {
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest('Basic abc'))).toBeNull();
  });

  it('returns null when supabase fails to verify the token', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'bad token' } });
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest('Bearer bad'))).toBeNull();
  });

  it('returns null when the user is not in the admin allowlist and lacks an admin role', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'u1', email: 'random@example.com', app_metadata: {} } },
      error: null,
    });
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest('Bearer ok'))).toBeNull();
  });

  it('allows users in the ADMIN_EMAILS allowlist (case-insensitive)', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'u2', email: 'Allow@Adviserve.IN', app_metadata: {} } },
      error: null,
    });
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest('Bearer ok'))).toEqual({
      userId: 'u2',
      email: 'Allow@Adviserve.IN',
    });
  });

  it('allows users whose app_metadata.role is "admin" even if email is not listed', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'u3', email: 'role-admin@example.com', app_metadata: { role: 'admin' } } },
      error: null,
    });
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest('Bearer ok'))).toEqual({
      userId: 'u3',
      email: 'role-admin@example.com',
    });
  });

  it('returns null when Supabase env vars are not configured', async () => {
    process.env.SUPABASE_URL = '';
    process.env.SUPABASE_ANON_KEY = '';
    process.env.VITE_SUPABASE_URL = '';
    process.env.VITE_SUPABASE_ANON_KEY = '';
    const { verifyAdmin } = await import('../../api/_auth');
    expect(await verifyAdmin(buildRequest('Bearer ok'))).toBeNull();
  });
});
