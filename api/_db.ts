/**
 * Neon database connection — SERVER-SIDE ONLY
 * The DATABASE_URL environment variable is set in Vercel dashboard.
 */
import { neon } from '@neondatabase/serverless';

// S9 fix: Cache connection for warm invocations
let _sql: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(databaseUrl);
  }
  return _sql;
}

// Slug allowlist — every public-read endpoint that looks up content by slug
// runs the param through this gate before interpolating into a query. Even
// though Neon's tagged-template literals parametrise the value (so SQL
// injection is already impossible), an attacker can still probe for content
// with unusual slug shapes; rejecting anything outside the URL-safe charset
// keeps the database query surface tight and bounds the response.
export function isValidSlug(value: string | null): value is string {
  return typeof value === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/i.test(value);
}

// S2 fix: Restrict CORS to our domain only.
// Defaults cover production + preview deploys + local dev. Override via
// EXTRA_ALLOWED_ORIGINS (comma-separated) on environments that need
// additional hosts (e.g. PR preview subdomains).
const DEFAULT_ALLOWED_ORIGINS = [
  'https://adviserve.org.in',
  'https://www.adviserve.org.in',
  'https://adviserve.in',
  'https://www.adviserve.in',
  'https://adviserve-website.vercel.app',
  'https://www.adviserve.com',
  'http://localhost:5173', // local dev
  'http://localhost:4173', // local preview
  'http://localhost:5175', // alternate dev when 5173/5174 are taken
];
const ALLOWED_ORIGINS = [
  ...DEFAULT_ALLOWED_ORIGINS,
  ...(process.env.EXTRA_ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
];

function getCorsOrigin(request?: Request): string {
  if (!request) return ALLOWED_ORIGINS[0];
  const origin = request.headers.get('Origin') || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function corsHeaders(request?: Request) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(request),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

// API version — included in every response
const API_VERSION = '1.0.0';

// Helper to send JSON response
export function json(data: unknown, status = 200, request?: Request, cache?: number) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-API-Version': API_VERSION, ...corsHeaders(request) };
  if (cache && cache > 0) {
    headers['Cache-Control'] = `public, s-maxage=${cache}, stale-while-revalidate=${cache * 2}`;
  }
  return new Response(JSON.stringify(data), { status, headers });
}

// Helper for error responses
export function errorResponse(message: string, status = 500, request?: Request) {
  return json({ error: message }, status, request);
}

// Helper for CORS preflight
export function handleCors(request?: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

// ─── Rate Limiter (in-memory, resets on cold start) ───
// TODO: Migrate to persistent rate limiting (Vercel KV or Upstash Redis) for production scale
// NOTE: This in-memory store resets on every serverless cold start, so limits are
// effectively per-instance and per-lifecycle. The wider windows (120s for contact/booking)
// partially compensate by increasing the chance a warm instance catches repeat abuse.
const _rateLimitStore = new Map<string, { count: number; resetAt: number }>();

let _lastCleanup = Date.now();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Simple sliding-window rate limiter.
 * @param key   Unique key (e.g. IP, email)
 * @param limit Max requests allowed in the window
 * @param windowMs Window size in milliseconds
 * @returns true if request is allowed, false if rate-limited
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const result = rateLimitWithInfo(key, limit, windowMs);
  return result.allowed;
}

/**
 * Rate limiter that returns remaining quota and reset time for response headers.
 */
export function rateLimitWithInfo(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Lazy cleanup every 5 minutes to prevent memory leak
  if (now - _lastCleanup > 5 * 60 * 1000) {
    for (const [k, entry] of _rateLimitStore) {
      if (now > entry.resetAt) _rateLimitStore.delete(k);
    }
    _lastCleanup = now;
  }

  const entry = _rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    _rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count < limit) {
    entry.count++;
    return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
  }

  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

/** Helper to set rate-limit headers on a Response. */
export function setRateLimitHeaders(res: Response, info: RateLimitResult): Response {
  res.headers.set('X-RateLimit-Remaining', String(info.remaining));
  res.headers.set('X-RateLimit-Reset', String(Math.ceil(info.resetAt / 1000)));
  return res;
}

// ─── Submission dedup (in-memory, resets on cold start) ────────────────────
// Lightweight protection against replay-style spam: the same identifier
// (typically `${formType}:${email}`) submitting within `windowMs` is flagged
// as a duplicate so the caller can short-circuit. Same caveats as the rate
// limiter — resets per serverless instance, so abuse during a cold-start
// window can slip through; pair with the rate limiter for the real defence.
const _submissionStore = new Map<string, number>();
let _lastSubmissionCleanup = Date.now();

export function isDuplicateSubmission(key: string, windowMs: number): boolean {
  const now = Date.now();

  // Lazy cleanup every 5 minutes to bound memory.
  if (now - _lastSubmissionCleanup > 5 * 60 * 1000) {
    for (const [k, t] of _submissionStore) {
      if (now - t > windowMs * 4) _submissionStore.delete(k);
    }
    _lastSubmissionCleanup = now;
  }

  const previous = _submissionStore.get(key);
  if (previous && now - previous < windowMs) return true;
  _submissionStore.set(key, now);
  return false;
}

// S8 fix: Validate Origin for POST requests (CSRF protection)
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin') || '';
  const referer = request.headers.get('Referer') || '';
  // Allow if origin matches, or if referer starts with allowed origin, or if no origin (same-origin request)
  // Require Origin header for fetch() POST requests — blocks curl/scripts without Origin
  if (!origin && !referer) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (ALLOWED_ORIGINS.some(o => referer.startsWith(o))) return true;
  return false;
}
