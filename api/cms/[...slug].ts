/**
 * /api/cms/[...slug] — consolidated CMS read endpoints.
 *
 * Replaces six standalone routes (content, settings, menu, logo, legal,
 * sitemap) as a single Vercel function to fit the Hobby-plan 12-function
 * cap. The flat URLs (`/api/menu`, `/api/settings`, etc.) keep working
 * because of the rewrites in `vercel.json` that translate them to
 * `/api/cms/<name>` paths matched by this catch-all.
 *
 * Each handler module in `api/_handlers/` is a vanilla Web `Request →
 * Response` function — identical to its pre-consolidation shape — so the
 * router simply dispatches by the trailing slug.
 */
import { handleCors, errorResponse } from '../_db';

import contentHandler from '../_handlers/content';
import settingsHandler from '../_handlers/settings';
import menuHandler from '../_handlers/menu';
import logoHandler from '../_handlers/logo';
import legalHandler from '../_handlers/legal';
import sitemapHandler from '../_handlers/sitemap';

export const config = { runtime: 'edge' };

function extractSlug(request: Request): string | null {
  // After Vercel rewrite, request.url ends in /api/cms/<slug>?…
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  // Expect [api, cms, <slug>, …]
  const cmsIdx = parts.indexOf('cms');
  return cmsIdx >= 0 && cmsIdx < parts.length - 1 ? parts[cmsIdx + 1] : null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return handleCors(request);

  const slug = extractSlug(request);
  switch (slug) {
    case 'content':  return contentHandler(request);
    case 'settings': return settingsHandler(request);
    case 'menu':     return menuHandler(request);
    case 'logo':     return logoHandler(request);
    case 'legal':    return legalHandler(request);
    case 'sitemap':  return sitemapHandler(request);
    default:         return errorResponse(`CMS route not found: ${slug ?? '(none)'}`, 404, request);
  }
}
