/**
 * Generic admin CRUD API — handles ALL admin database operations
 *
 * POST /api/admin/crud
 * Body: { action: 'select'|'insert'|'update'|'delete'|'upsert', table: string, data?: any, filters?: any, options?: any }
 *
 * All requests require valid admin auth token.
 * This single endpoint replaces ALL supabase.from() calls in admin pages.
 */
import { getDb, json, errorResponse, handleCors, rateLimit } from '../_db';
import { verifyAdmin } from '../_auth';

// Node runtime — see api/admin/check.ts for rationale. Supabase JS SDK
// pulls Node-only built-ins that fail the Edge bundler.

// Tables that admin can access
const ALLOWED_TABLES = [
  'blog_posts', 'services', 'contact_inquiries', 'email_subscribers',
  'email_lists', 'email_list_subscribers', 'email_templates',
  'email_campaigns', 'email_campaign_recipients', 'legal_documents',
  'site_settings', 'seo_settings', 'faq_items', 'navigation_menus',
  'menu_items', 'website_pages', 'website_content', 'site_assets',
  'page_analytics', 'bookings', 'activity_logs',
  'products', 'case_studies', 'job_positions', 'job_applications',
  'dpdp_assessments',
];

// Tables where destructive operations are restricted to protect audit trails and PII
const SENSITIVE_TABLES = ['activity_logs', 'email_subscribers', 'contact_inquiries'];

// Fields that cannot be modified via UPDATE on sensitive tables
const PROTECTED_FIELDS = ['email', 'status'];

// Sanitize identifier to prevent SQL injection
function sanitizeIdentifier(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405);

  // Verify admin auth
  const admin = await verifyAdmin(request);
  if (!admin) return errorResponse('Unauthorized', 401);

  // Rate limiting — 120 admin operations per minute per user
  if (!rateLimit(`admin:${admin.userId}`, 120, 60_000)) {
    return errorResponse('Too many requests. Please slow down.', 429, request);
  }

  try {
    const body = await request.json();
    const { action, table, data, filters, options } = body;

    if (!action || !table) return errorResponse('Missing action or table', 400);

    const safeTable = sanitizeIdentifier(table);
    if (!ALLOWED_TABLES.includes(safeTable)) {
      return errorResponse(`Table '${safeTable}' is not allowed`, 403);
    }

    const sql = getDb();

    // H4 fix: Block dangerous operations on sensitive tables
    if (SENSITIVE_TABLES.includes(safeTable)) {
      if (action === 'delete') {
        return errorResponse(`DELETE is not allowed on '${safeTable}' — records must be preserved for audit compliance`, 403);
      }
      if (action === 'update' && data) {
        const attemptedFields = Object.keys(data).map(k => sanitizeIdentifier(k).toLowerCase());
        const blocked = attemptedFields.filter(f => PROTECTED_FIELDS.includes(f));
        if (blocked.length > 0) {
          return errorResponse(`Cannot modify protected field(s) [${blocked.join(', ')}] on '${safeTable}'`, 403);
        }
      }
    }

    switch (action) {
      case 'select': {
        // S1 fix: Sanitize columns to prevent SQL injection
        const rawColumns = options?.columns || '*';
        const safeColumns = rawColumns === '*' ? '*' : rawColumns.split(',').map((c: string) => sanitizeIdentifier(c.trim())).join(', ');
        let query = `SELECT ${safeColumns} FROM ${safeTable}`;
        const params: any[] = [];
        let paramIdx = 1;

        // Build WHERE conditions from all filter types
        const conditions: string[] = [];

        // Equality filters
        if (filters && Object.keys(filters).length > 0) {
          for (const [key, val] of Object.entries(filters)) {
            const safeKey = sanitizeIdentifier(key);
            if (val === null) {
              conditions.push(`${safeKey} IS NULL`);
            } else {
              conditions.push(`${safeKey} = $${paramIdx}`);
              params.push(val);
              paramIdx++;
            }
          }
        }

        // neq filters: { column, value }[]
        if (options?._neqFilters && Array.isArray(options._neqFilters)) {
          for (const f of options._neqFilters) {
            const safeKey = sanitizeIdentifier(f.key || f.column);
            conditions.push(`${safeKey} != $${paramIdx}`);
            params.push(f.value);
            paramIdx++;
          }
        }

        // gte filter: { column, value }
        if (options?._gteFilter) {
          const safeKey = sanitizeIdentifier(options._gteFilter.column);
          conditions.push(`${safeKey} >= $${paramIdx}`);
          params.push(options._gteFilter.value);
          paramIdx++;
        }

        // lte filter: { column, value }
        if (options?._lteFilter) {
          const safeKey = sanitizeIdentifier(options._lteFilter.column);
          conditions.push(`${safeKey} <= $${paramIdx}`);
          params.push(options._lteFilter.value);
          paramIdx++;
        }

        // lt filter: { column, value }
        if (options?._ltFilter) {
          const safeKey = sanitizeIdentifier(options._ltFilter.column);
          conditions.push(`${safeKey} < $${paramIdx}`);
          params.push(options._ltFilter.value);
          paramIdx++;
        }

        // in filter: { column, values[] }
        if (options?._inFilter) {
          const safeKey = sanitizeIdentifier(options._inFilter.column);
          const vals = options._inFilter.values;
          if (Array.isArray(vals) && vals.length > 0) {
            const placeholders = vals.map((_: any) => `$${paramIdx++}`);
            conditions.push(`${safeKey} IN (${placeholders.join(', ')})`);
            params.push(...vals);
          }
        }

        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // ORDER BY
        if (options?.orderBy) {
          const safeCol = sanitizeIdentifier(options.orderBy);
          const dir = options.ascending === false ? 'DESC' : 'ASC';
          query += ` ORDER BY ${safeCol} ${dir}`;
        }

        // LIMIT
        if (options?.limit) {
          query += ` LIMIT $${paramIdx}`;
          params.push(options.limit);
          paramIdx++;
        }

        // RANGE (offset)
        if (options?.offset) {
          query += ` OFFSET $${paramIdx}`;
          params.push(options.offset);
          paramIdx++;
        }

        const result = await sql.query(query, params);
        return json(result);
      }

      case 'count': {
        let query = `SELECT COUNT(*) as count FROM ${safeTable}`;
        const params: any[] = [];
        let paramIdx = 1;
        const conditions: string[] = [];

        if (filters && Object.keys(filters).length > 0) {
          for (const [key, val] of Object.entries(filters)) {
            const safeKey = sanitizeIdentifier(key);
            if (val === null) {
              conditions.push(`${safeKey} IS NULL`);
            } else {
              conditions.push(`${safeKey} = $${paramIdx}`);
              params.push(val);
              paramIdx++;
            }
          }
        }

        if (options?._neqFilters && Array.isArray(options._neqFilters)) {
          for (const f of options._neqFilters) {
            const safeKey = sanitizeIdentifier(f.key || f.column);
            conditions.push(`${safeKey} != $${paramIdx}`);
            params.push(f.value);
            paramIdx++;
          }
        }

        if (options?._gteFilter) {
          const safeKey = sanitizeIdentifier(options._gteFilter.column);
          conditions.push(`${safeKey} >= $${paramIdx}`);
          params.push(options._gteFilter.value);
          paramIdx++;
        }

        if (options?._lteFilter) {
          const safeKey = sanitizeIdentifier(options._lteFilter.column);
          conditions.push(`${safeKey} <= $${paramIdx}`);
          params.push(options._lteFilter.value);
          paramIdx++;
        }

        if (options?._ltFilter) {
          const safeKey = sanitizeIdentifier(options._ltFilter.column);
          conditions.push(`${safeKey} < $${paramIdx}`);
          params.push(options._ltFilter.value);
          paramIdx++;
        }

        if (options?._inFilter) {
          const safeKey = sanitizeIdentifier(options._inFilter.column);
          const vals = options._inFilter.values;
          if (Array.isArray(vals) && vals.length > 0) {
            const placeholders = vals.map((_: any) => `$${paramIdx++}`);
            conditions.push(`${safeKey} IN (${placeholders.join(', ')})`);
            params.push(...vals);
          }
        }

        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await sql.query(query, params) as any[];
        return json({ count: parseInt(result[0]?.count || '0') });
      }

      case 'insert': {
        if (!data) return errorResponse('Missing data for insert', 400);
        const keys = Object.keys(data).map(sanitizeIdentifier);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`);

        const query = `INSERT INTO ${safeTable} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
        const result = await sql.query(query, values) as any[];
        const inserted = result[0] || null;
        // Auto-log to activity_logs (non-blocking)
        if (safeTable !== 'activity_logs' && inserted) {
          sql.query(
            `INSERT INTO activity_logs (action, table_name, record_id, user_id, details) VALUES ($1, $2, $3, $4, $5)`,
            ['create', safeTable, inserted.id ?? null, admin.userId, JSON.stringify({ fields: Object.keys(data) })]
          ).catch(() => {});
        }
        return json(inserted);
      }

      case 'update': {
        if (!data || !filters) return errorResponse('Missing data or filters for update', 400);
        // D2 fix: Require at least one non-empty filter to prevent mass update
        if (Object.keys(filters).length === 0) return errorResponse('At least one filter required for update', 400);
        const setClauses: string[] = [];
        const params: any[] = [];
        let paramIdx = 1;

        for (const [key, val] of Object.entries(data)) {
          setClauses.push(`${sanitizeIdentifier(key)} = $${paramIdx}`);
          params.push(val);
          paramIdx++;
        }

        const conditions: string[] = [];
        for (const [key, val] of Object.entries(filters)) {
          if (val === null) {
            conditions.push(`${sanitizeIdentifier(key)} IS NULL`);
          } else {
            conditions.push(`${sanitizeIdentifier(key)} = $${paramIdx}`);
            params.push(val);
            paramIdx++;
          }
        }

        const query = `UPDATE ${safeTable} SET ${setClauses.join(', ')} WHERE ${conditions.join(' AND ')} RETURNING *`;
        const result = await sql.query(query, params);
        // Auto-log to activity_logs (non-blocking)
        if (safeTable !== 'activity_logs') {
          const updated = Array.isArray(result) ? result : [];
          const firstRow = updated[0] as Record<string, unknown> | undefined;
          const recordId = firstRow?.id ?? (filters as Record<string, unknown>)?.id ?? null;
          sql.query(
            `INSERT INTO activity_logs (action, table_name, record_id, user_id, details) VALUES ($1, $2, $3, $4, $5)`,
            ['update', safeTable, recordId, admin.userId, JSON.stringify({ fields: Object.keys(data) })]
          ).catch(() => {});
        }
        return json(result);
      }

      case 'upsert': {
        if (!data || !options?.onConflict) return errorResponse('Missing data or onConflict for upsert', 400);
        const keys = Object.keys(data).map(sanitizeIdentifier);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`);
        const conflictCol = sanitizeIdentifier(options.onConflict);

        const updateClauses = keys.map((k) => `${k} = EXCLUDED.${k}`);

        const query = `INSERT INTO ${safeTable} (${keys.join(', ')}) VALUES (${placeholders.join(', ')})
          ON CONFLICT (${conflictCol}) DO UPDATE SET ${updateClauses.join(', ')} RETURNING *`;
        const result = await sql.query(query, values) as any[];
        return json(result[0] || null);
      }

      case 'delete': {
        if (!filters) return errorResponse('Missing filters for delete', 400);
        // D1 fix: Require at least one filter to prevent mass deletion
        if (Object.keys(filters).length === 0) return errorResponse('At least one filter required for delete', 400);
        const conditions: string[] = [];
        const params: any[] = [];
        let paramIdx = 1;

        for (const [key, val] of Object.entries(filters)) {
          const safeKey = sanitizeIdentifier(key);
          if (val === null) {
            conditions.push(`${safeKey} IS NULL`);
          } else {
            conditions.push(`${safeKey} = $${paramIdx}`);
            params.push(val);
            paramIdx++;
          }
        }

        const query = `DELETE FROM ${safeTable} WHERE ${conditions.join(' AND ')} RETURNING id`;
        const result = await sql.query(query, params) as any[];
        // Auto-log to activity_logs (non-blocking)
        if (safeTable !== 'activity_logs') {
          const deletedIds = result.map((r: any) => r.id);
          sql.query(
            `INSERT INTO activity_logs (action, table_name, record_id, user_id, details) VALUES ($1, $2, $3, $4, $5)`,
            ['delete', safeTable, deletedIds[0] ?? null, admin.userId, JSON.stringify({ deleted_ids: deletedIds })]
          ).catch(() => {});
        }
        return json({ deleted: result.length });
      }

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }
  } catch (err: any) {
    console.error('Admin CRUD error:', err);
    // S10 fix: Never expose internal DB errors to client
    return errorResponse('Database operation failed');
  }
}
