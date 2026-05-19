/**
 * Admin Database Client — drop-in replacement for supabase.from() in admin pages.
 *
 * Usage (mirrors Supabase syntax):
 *   const { data, error } = await adminDb.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false });
 *   const { data, error } = await adminDb.from('blog_posts').insert({ title: '...' });
 *   const { data, error } = await adminDb.from('blog_posts').update({ title: '...' }).eq('id', '123');
 *   const { data, error } = await adminDb.from('blog_posts').delete().eq('id', '123');
 *   const { data, error } = await adminDb.from('blog_posts').upsert({ key: 'x', value: 'y' }, { onConflict: 'key' });
 *   const { data, error } = await adminDb.from('blog_posts').select('*').eq('id', '123').maybeSingle();
 *
 * All calls go through /api/admin/crud with the auth token.
 */
import { supabase } from './supabase';

async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  } catch {
    return null;
  }
}

async function callCrud(body: Record<string, unknown>) {
  const token = await getAuthToken();
  if (!token) return { data: null, error: { message: 'Not authenticated' } };

  try {
    const res = await fetch('/api/admin/crud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok) {
      return { data: null, error: { message: result.error || 'Request failed' } };
    }
    return { data: result, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || 'Network error' } };
  }
}

class QueryBuilder {
  private _table: string;
  private _action: 'select' | 'insert' | 'update' | 'delete' | 'upsert' | 'count' = 'select';
  private _columns = '*';
  private _data: any = null;
  private _filters: Record<string, any> = {};
  private _options: Record<string, any> = {};
  private _single = false;
  private _neqFilters: Array<{ key: string; value: any }> = [];

  constructor(table: string) {
    this._table = table;
  }

  select(columns = '*', options?: { count?: string; head?: boolean }) {
    if (options?.count && options?.head) {
      this._action = 'count';
    } else {
      this._action = 'select';
    }
    this._columns = columns;
    return this;
  }

  insert(data: any) {
    this._action = 'insert';
    this._data = Array.isArray(data) ? data[0] : data;
    return this;
  }

  update(data: any) {
    this._action = 'update';
    this._data = data;
    return this;
  }

  delete() {
    this._action = 'delete';
    return this;
  }

  upsert(data: any, options?: { onConflict?: string }) {
    this._action = 'upsert';
    this._data = Array.isArray(data) ? data[0] : data;
    if (options?.onConflict) this._options.onConflict = options.onConflict;
    return this;
  }

  eq(column: string, value: any) {
    this._filters[column] = value;
    return this;
  }

  neq(column: string, value: any) {
    this._neqFilters.push({ key: column, value });
    return this;
  }

  is(column: string, value: null) {
    this._filters[column] = value;
    return this;
  }

  in(column: string, values: any[]) {
    // For `in` queries, we'll pass as a special filter
    this._options._inFilter = { column, values };
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this._options.orderBy = column;
    this._options.ascending = options?.ascending ?? true;
    return this;
  }

  limit(n: number) {
    this._options.limit = n;
    return this;
  }

  range(from: number, to: number) {
    this._options.offset = from;
    const windowSize = to - from + 1;
    // Preserve an earlier .limit(n) by taking the tighter of the two.
    this._options.limit = typeof this._options.limit === 'number'
      ? Math.min(this._options.limit, windowSize)
      : windowSize;
    return this;
  }

  maybeSingle() {
    this._single = true;
    this._options.limit = 1;
    return this.then();
  }

  single() {
    this._single = true;
    this._options.limit = 1;
    return this.then();
  }

  // gte filter for date ranges (used by AnalyticsDashboard)
  gte(column: string, value: any) {
    this._options._gteFilter = { column, value };
    return this;
  }

  lte(column: string, value: any) {
    this._options._lteFilter = { column, value };
    return this;
  }

  lt(column: string, value: any) {
    this._options._ltFilter = { column, value };
    return this;
  }

  async then(resolve?: (val: any) => any, _reject?: (err: any) => any): Promise<any> {
    const body: Record<string, any> = {
      action: this._action,
      table: this._table,
    };

    if (this._data) body.data = this._data;
    if (Object.keys(this._filters).length > 0) body.filters = this._filters;

    const opts: Record<string, any> = { ...this._options };
    if (this._action === 'select') opts.columns = this._columns;
    // Send neq filters to server
    if (this._neqFilters.length > 0) opts._neqFilters = this._neqFilters;
    if (Object.keys(opts).length > 0) body.options = opts;

    const result = await callCrud(body);

    // For count queries, return { count, data: null, error: null }
    if (this._action === 'count') {
      const countVal = result.data?.count ?? (Array.isArray(result.data) ? result.data.length : 0);
      const val = { data: null, error: result.error, count: countVal };
      if (resolve) return resolve(val);
      return val;
    }

    if (this._single) {
      result.data = Array.isArray(result.data) ? (result.data[0] || null) : result.data;
    }

    const val = result;
    if (resolve) return resolve(val);
    return val;
  }
}

export const adminDb = {
  from(table: string) {
    return new QueryBuilder(table);
  },
};
