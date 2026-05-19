import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockQuery = vi.fn();

vi.mock('../../api/_db', () => ({
  getDb: () => ({ query: mockQuery }),
  json: (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  errorResponse: (msg: string, status = 500, _req?: unknown) =>
    new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  handleCors: () => new Response(null, { status: 204 }),
  rateLimit: () => true,
}));

const mockVerifyAdmin = vi.fn();
vi.mock('../../api/_auth', () => ({
  verifyAdmin: (...args: unknown[]) => mockVerifyAdmin(...args),
}));

import handler from '../../api/admin/crud';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/admin/crud', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    body: JSON.stringify(body),
  });
}

describe('api/admin/crud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyAdmin.mockResolvedValue({ userId: 'user-1' });
  });

  it('select without filters returns rows', async () => {
    const rows = [{ id: 1, title: 'Post A' }];
    mockQuery.mockResolvedValue(rows);
    const res = await handler(makeRequest({ action: 'select', table: 'blog_posts' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(rows);
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'), []);
  });

  it('select with eq filter, orderBy DESC, limit passes correct params', async () => {
    const rows = [{ id: 5 }];
    mockQuery.mockResolvedValue(rows);
    const res = await handler(makeRequest({
      action: 'select', table: 'blog_posts',
      filters: { status: 'published' },
      options: { orderBy: 'created_at', ascending: false, limit: 10 },
    }));
    expect(res.status).toBe(200);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('WHERE status = $1');
    expect(sql).toContain('ORDER BY created_at DESC');
    expect(sql).toContain('LIMIT');
    expect(params[0]).toBe('published');
    expect(params).toContain(10);
  });

  it('insert happy path returns inserted row', async () => {
    const inserted = { id: 99, title: 'New Post' };
    mockQuery.mockResolvedValueOnce([inserted]).mockResolvedValue([]);
    const res = await handler(makeRequest({
      action: 'insert', table: 'blog_posts', data: { title: 'New Post' },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(inserted);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO blog_posts'), ['New Post'],
    );
  });

  it('update happy path returns updated rows', async () => {
    const updated = [{ id: 1, title: 'Updated' }];
    mockQuery.mockResolvedValueOnce(updated).mockResolvedValue([]);
    const res = await handler(makeRequest({
      action: 'update', table: 'blog_posts',
      data: { title: 'Updated' }, filters: { id: 1 },
    }));
    expect(res.status).toBe(200);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('UPDATE blog_posts SET');
    expect(sql).toContain('WHERE id =');
    expect(params).toContain('Updated');
    expect(params).toContain(1);
  });

  it('update with empty filters returns 400', async () => {
    const res = await handler(makeRequest({
      action: 'update', table: 'blog_posts', data: { title: 'Oops' }, filters: {},
    }));
    expect(res.status).toBe(400);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('delete happy path returns { deleted: N }', async () => {
    mockQuery.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]).mockResolvedValue([]);
    const res = await handler(makeRequest({
      action: 'delete', table: 'blog_posts', filters: { status: 'draft' },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ deleted: 2 });
  });

  it('delete with empty filters returns 400', async () => {
    const res = await handler(makeRequest({
      action: 'delete', table: 'blog_posts', filters: {},
    }));
    expect(res.status).toBe(400);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('upsert with onConflict returns upserted row', async () => {
    const upserted = { id: 7, key: 'hero', value: '{}' };
    mockQuery.mockResolvedValue([upserted]);
    const res = await handler(makeRequest({
      action: 'upsert', table: 'site_settings',
      data: { key: 'hero', value: '{}' }, options: { onConflict: 'key' },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(upserted);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('ON CONFLICT (key)'), ['hero', '{}'],
    );
  });

  it('returns 401 when verifyAdmin returns null', async () => {
    mockVerifyAdmin.mockResolvedValue(null);
    const res = await handler(makeRequest({ action: 'select', table: 'blog_posts' }));
    expect(res.status).toBe(401);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('returns 403 for table not in allowlist', async () => {
    const res = await handler(makeRequest({ action: 'select', table: 'users' }));
    expect(res.status).toBe(403);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('returns 403 for DELETE on sensitive table', async () => {
    const res = await handler(makeRequest({
      action: 'delete', table: 'activity_logs', filters: { id: 1 },
    }));
    expect(res.status).toBe(403);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('blocks PROTECTED_FIELDS regardless of letter case on sensitive table', async () => {
    // Bug fix #1: PROTECTED_FIELDS check must be case-insensitive so an
    // attacker cannot bypass it with `Email` / `STATUS` / `eMaIl`.
    for (const field of ['Email', 'EMAIL', 'eMaIl', 'Status']) {
      mockQuery.mockClear();
      const res = await handler(makeRequest({
        action: 'update',
        table: 'email_subscribers',
        data: { [field]: 'attacker@evil.example' },
        filters: { id: 1 },
      }));
      expect(res.status).toBe(403);
      expect(mockQuery).not.toHaveBeenCalled();
    }
  });

  it('DELETE with null filter value emits IS NULL, not col = null', async () => {
    // Bug fix #2: delete previously emitted `col = $1` with a null value,
    // which never matches anything. Other actions emit `IS NULL`; delete
    // must match.
    mockQuery.mockResolvedValueOnce([]).mockResolvedValue([]);
    const res = await handler(makeRequest({
      action: 'delete',
      table: 'blog_posts',
      filters: { published_at: null },
    }));
    expect(res.status).toBe(200);
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('published_at IS NULL');
    expect(sql).not.toContain('$1');
    expect(params).toEqual([]);
  });

  it('count honours additional filter modifiers (gte, in, neq)', async () => {
    // Bug fix #18: count previously ignored _gteFilter / _inFilter / _neqFilters,
    // so counts diverged from selects built with the same builder chain.
    mockQuery.mockResolvedValue([{ count: '7' }]);
    const res = await handler(makeRequest({
      action: 'count',
      table: 'blog_posts',
      filters: { status: 'published' },
      options: {
        _gteFilter: { column: 'created_at', value: '2024-01-01' },
        _inFilter: { column: 'category', values: ['news', 'guide'] },
        _neqFilters: [{ column: 'author', value: 'system' }],
      },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ count: 7 });
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('SELECT COUNT(*)');
    expect(sql).toContain('status = $1');
    expect(sql).toContain('created_at >= $');
    expect(sql).toContain('category IN ($');
    expect(sql).toContain('author != $');
    // Param order follows the branch order in handler:
    // equality filters → _neqFilters → _gteFilter → _lteFilter → _ltFilter → _inFilter
    expect(params).toEqual(['published', 'system', '2024-01-01', 'news', 'guide']);
  });
});
