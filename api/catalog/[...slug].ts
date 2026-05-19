/**
 * /api/catalog/[...slug] — consolidated content-catalog endpoints.
 *
 * Replaces five standalone routes (services, products, case-studies, blog,
 * careers) as a single Vercel function. Flat URLs (`/api/blog`, etc.) keep
 * working via the rewrites in `vercel.json`.
 */
import { handleCors, errorResponse } from '../_db';

import servicesHandler from '../_handlers/services';
import productsHandler from '../_handlers/products';
import caseStudiesHandler from '../_handlers/case-studies';
import blogHandler from '../_handlers/blog';
import careersHandler from '../_handlers/careers';

export const config = { runtime: 'edge' };

function extractSlug(request: Request): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const idx = parts.indexOf('catalog');
  return idx >= 0 && idx < parts.length - 1 ? parts[idx + 1] : null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return handleCors(request);

  const slug = extractSlug(request);
  switch (slug) {
    case 'services':     return servicesHandler(request);
    case 'products':     return productsHandler(request);
    case 'case-studies': return caseStudiesHandler(request);
    case 'blog':         return blogHandler(request);
    case 'careers':      return careersHandler(request);
    default:             return errorResponse(`Catalog route not found: ${slug ?? '(none)'}`, 404, request);
  }
}
