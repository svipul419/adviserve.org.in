/**
 * GET /api/blog — List published blog posts
 * GET /api/blog?slug=xxx — Get single blog post by slug
 */
import { getDb, json, errorResponse, handleCors, rateLimit, isValidSlug } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  // Rate limiting — 60 requests per IP per minute
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`blog:${ip}`, 60, 60_000)) {
    return errorResponse('Too many requests. Please wait.', 429, request);
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (slug !== null && !isValidSlug(slug)) {
    return errorResponse('Invalid slug', 400, request);
  }

  try {
    const sql = getDb();

    if (slug) {
      const posts = await sql`
        SELECT id, title, slug, excerpt, content, image_url, category, author, published_at, status, tags, meta_title, meta_description, created_at FROM blog_posts WHERE slug = ${slug} AND status = 'published' LIMIT 1
      ` as Record<string, unknown>[];
      if (posts.length === 0) return json(null, 200, request);
      return json(posts[0], 200, request, 300);
    }

    const posts = await sql`
      SELECT id, title, slug, excerpt, image_url, category, author, published_at, status, tags, meta_title, meta_description, created_at FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 50
    ` as Record<string, unknown>[];
    return json(posts, 200, request, 60);
  } catch (err) {
    console.error('Blog API error:', err);
    return errorResponse('Failed to fetch blog posts', 500, request);
  }
}
