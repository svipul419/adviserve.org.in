# Backend Guidelines

## Adviserve Website — API Layer & Database

**Version:** 1.0
**Last Updated:** 2026-04-01

---

## 1. Architecture Principles

1. **Browser never talks to the database.** All DB operations go through `api/*.ts` edge functions.
2. **Supabase is auth-only.** No `supabase.from()` calls — all data lives in Neon PostgreSQL.
3. **One admin endpoint to rule them all.** `POST /api/admin/crud` handles select, insert, update, delete, upsert, count for all 21 tables.
4. **Defense in depth.** Every layer validates independently — CORS, origin check, auth, table allowlist, column sanitization.

---

## 2. API File Structure

```
api/
├── _db.ts              # Neon connection, CORS, rate limiter, helpers
├── _auth.ts            # JWT verification + admin email check
│
├── blog.ts             # GET — public blog posts
├── services.ts         # GET — public services (with children)
├── content.ts          # GET — page content blocks
├── menu.ts             # GET — navigation menu items
├── settings.ts         # GET — site settings key/value
├── legal.ts            # GET — legal documents
├── logo.ts             # GET — logo URL, height, brand text
├── search.ts           # GET — site-wide search
├── newsletter-archive.ts  # GET — sent campaigns
│
├── contact.ts          # POST — contact form submission
├── subscribe.ts        # POST — newsletter subscription
├── booking.ts          # POST — consultation booking
├── analytics.ts        # POST — page view tracking
├── unsubscribe.ts      # POST — newsletter unsubscribe
│
└── admin/
    ├── crud.ts         # POST — generic CRUD (all tables)
    ├── log.ts          # POST — activity log entry
    └── check.ts        # GET — verify admin status
```

---

## 3. Shared Utilities (`_db.ts`)

### Database Connection

```typescript
import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL!);
  }
  return _sql;
}
```

- Connection is cached for warm invocations (module-level singleton)
- `DATABASE_URL` is a Vercel server-side env var (never exposed to browser)

### Response Helpers

```typescript
json(data, status?, request?, cache?)   // JSON response with CORS + API version
errorResponse(message, status?, request?)  // Error JSON response
handleCors(request?)                       // CORS preflight (OPTIONS)
```

All responses include:
- `Access-Control-Allow-Origin` (matched against domain allowlist)
- `X-API-Version: 1.0.0`
- `Cache-Control` (if `cache` parameter provided)
- `Vary: Origin`

### CORS Domain Allowlist

```typescript
const ALLOWED_ORIGINS = [
  'https://adviserve-website.vercel.app',
  'https://www.adviserve.com',
  'http://localhost:5173',
  'http://localhost:4173',
];
```

Only these origins receive valid CORS headers. All other origins get the first entry (requests will be blocked by browser CORS policy).

### Rate Limiter

```typescript
export function rateLimit(key: string, limit: number, windowMs: number): boolean
```

- In-memory sliding window counter
- Keyed by `"endpoint:identifier"` (e.g., `"contact:192.168.1.1"`)
- Lazy cleanup every 5 minutes to prevent memory leaks
- Returns `true` if allowed, `false` if rate-limited
- Resets on cold start (acceptable for edge functions)

### CSRF Protection

```typescript
export function validateOrigin(request: Request): boolean
```

- Checks `Origin` or `Referer` header against `ALLOWED_ORIGINS`
- Same-origin requests (no Origin header) are allowed
- Applied to all POST form submission endpoints

---

## 4. Authentication (`_auth.ts`)

### Admin Verification Flow

```typescript
export async function verifyAdmin(request: Request): Promise<{ userId, email } | null>
```

1. Extract `Bearer` token from `Authorization` header
2. Create temporary Supabase client with the token
3. Call `supabase.auth.getUser(token)` to verify JWT
4. Check if user is admin:
   - `app_metadata.role === 'admin'` (fast, no network)
   - OR `email in ADMIN_EMAILS` env var (server-side allowlist)
5. Return `{ userId, email }` or `null`

### Adding a New Admin

Set `ADMIN_EMAILS` in Vercel dashboard:

```
ADMIN_EMAILS=ritu@adviserve.com,admin2@adviserve.com
```

The user must also have a Supabase Auth account (created via Supabase dashboard or invite).

---

## 5. Writing a New API Endpoint

### Public GET Endpoint

```typescript
import { getDb, json, errorResponse, handleCors, rateLimit } from './_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'GET') return errorResponse('Method not allowed', 405, request);

  // Optional: rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(`endpoint:${ip}`, 30, 60_000)) {
    return errorResponse('Too many requests', 429, request);
  }

  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM table_name WHERE is_visible = true ORDER BY sort_order`;
    return json(result, 200, request, 30); // 30s cache
  } catch (err) {
    console.error('Endpoint error:', err);
    return errorResponse('Failed to fetch data', 500, request);
  }
}
```

### Public POST Endpoint

```typescript
import { getDb, json, errorResponse, handleCors, validateOrigin, rateLimit } from './_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);
  if (!validateOrigin(request)) return errorResponse('Forbidden', 403, request);

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!rateLimit(`endpoint:${ip}`, 5, 60_000)) {
    return errorResponse('Too many requests', 429, request);
  }

  try {
    const body = await request.json();
    const { field1, field2, website } = body;

    // Honeypot check
    if (website) return json({ success: true }, 200, request);

    // Validation
    if (!field1 || !field2) return errorResponse('Required fields missing', 400, request);

    const sql = getDb();
    await sql`INSERT INTO table_name (field1, field2) VALUES (${field1}, ${field2})`;

    return json({ success: true }, 200, request);
  } catch (err) {
    console.error('Endpoint error:', err);
    return errorResponse('Operation failed', 500, request);
  }
}
```

### Admin Endpoint

```typescript
import { getDb, json, errorResponse, handleCors, rateLimit } from '../_db';
import { verifyAdmin } from '../_auth';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  const admin = await verifyAdmin(request);
  if (!admin) return errorResponse('Unauthorized', 401, request);

  if (!rateLimit(`admin:${admin.userId}`, 60, 60_000)) {
    return errorResponse('Too many requests', 429, request);
  }

  // ... your logic
}
```

---

## 6. SQL Guidelines

### Always Use Parameterized Queries

```typescript
// GOOD — tagged template (auto-parameterized)
const sql = getDb();
const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug}`;

// GOOD — .query() with placeholders
const result = await sql.query('SELECT * FROM blog_posts WHERE id = $1', [id]);

// BAD — string interpolation (SQL injection risk)
const result = await sql.query(`SELECT * FROM blog_posts WHERE slug = '${slug}'`);
```

### Dynamic Column/Table Names

Column and table names **cannot** be parameterized. Use `sanitizeIdentifier()`:

```typescript
function sanitizeIdentifier(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

const safeTable = sanitizeIdentifier(table);
const safeColumn = sanitizeIdentifier(column);
```

Combined with the `ALLOWED_TABLES` allowlist in `admin/crud.ts`.

### Table Allowlist

Only these tables are accessible via the admin CRUD endpoint:

```typescript
const ALLOWED_TABLES = [
  'blog_posts', 'services', 'contact_inquiries', 'email_subscribers',
  'email_lists', 'email_list_subscribers', 'email_templates',
  'email_campaigns', 'email_campaign_recipients', 'legal_documents',
  'site_settings', 'seo_settings', 'faq_items', 'navigation_menus',
  'menu_items', 'website_pages', 'website_content', 'site_assets',
  'page_analytics', 'bookings', 'activity_logs',
];
```

---

## 7. Error Handling Rules

| Rule | Implementation |
|------|----------------|
| Never expose internal errors to client | Return generic message: `"Database operation failed"` |
| Always log server-side | `console.error('Context:', err)` — visible in Vercel logs |
| Analytics never breaks UX | `/api/analytics` returns 200 even on error |
| Unsubscribe never leaks info | Always returns `{ success: true }` (prevents email enumeration) |
| Admin errors show specific message | Return `{ error: "descriptive message" }` (user is trusted) |

---

## 8. Security Checklist for New Endpoints

- [ ] `export const config = { runtime: 'edge' };` declared
- [ ] OPTIONS method returns `handleCors(request)`
- [ ] Non-allowed methods return 405
- [ ] POST endpoints validate origin via `validateOrigin(request)`
- [ ] Admin endpoints verify auth via `verifyAdmin(request)`
- [ ] Rate limiting applied via `rateLimit(key, limit, windowMs)`
- [ ] User input validated (required fields, format checks)
- [ ] SQL queries use parameterized values (tagged templates or `$1` placeholders)
- [ ] Dynamic identifiers sanitized via `sanitizeIdentifier()`
- [ ] Error messages don't expose internal details
- [ ] Honeypot field checked on public forms

---

## 9. Database Migrations

Migration files live in `db/`:

```
db/
├── migration.sql        # v1: 19 tables + seed data
└── migration-v2.sql     # v2: bookings + activity_logs
```

### Running Migrations

Connect to Neon dashboard or use `psql`:

```bash
psql $DATABASE_URL -f db/migration.sql
psql $DATABASE_URL -f db/migration-v2.sql
```

### Adding a New Table

1. Create a new migration file: `db/migration-v3.sql`
2. Include `CREATE TABLE IF NOT EXISTS` for idempotency
3. Add indexes for commonly queried columns
4. Add the table name to `ALLOWED_TABLES` in `api/admin/crud.ts`
5. Run the migration against Neon

---

## 10. API Versioning

### Current Setup

- All endpoints live at `/api/*` (canonical)
- `/api/v1/*` rewrites to `/api/*` via `vercel.json`
- Every response includes `X-API-Version: 1.0.0` header

### Adding v2

When breaking changes are needed:

1. Create `api/v2/` directory with new handlers
2. Add rewrite: `{ "source": "/api/v2/:path*", "destination": "/api/v2/:path*" }`
3. Keep v1 working (backwards compatible)
4. Update `API_VERSION` in `_db.ts` for v2 responses

---

## 11. Rate Limiting Reference

| Endpoint | Key Format | Limit | Window |
|----------|-----------|-------|--------|
| `/api/contact` | `contact:{ip}` | 3 | 1 min |
| `/api/subscribe` | `subscribe:{ip}` | 5 | 1 min |
| `/api/booking` | `booking:{ip}` | 3 | 10 min |
| `/api/analytics` | `analytics:{ip}` | 60 | 1 min |
| `/api/search` | `search:{ip}` | 30 | 1 min |
| `/api/unsubscribe` | `unsub:{ip}` | 10 | 1 min |
| `/api/admin/crud` | `admin:{userId}` | 120 | 1 min |
