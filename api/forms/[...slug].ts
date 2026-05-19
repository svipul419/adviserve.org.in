/**
 * /api/forms/[...slug] — consolidated form-intake endpoints.
 *
 * Replaces seven standalone routes (contact, subscribe, unsubscribe, booking,
 * apply, dpdp-assessment, newsletter-archive) as a single Vercel function.
 * Each underlying handler keeps its own rate-limit, origin check, validation
 * and email logic; the router only dispatches by trailing slug.
 */
import { handleCors, errorResponse } from '../_db';

import contactHandler from '../_handlers/contact';
import subscribeHandler from '../_handlers/subscribe';
import unsubscribeHandler from '../_handlers/unsubscribe';
import bookingHandler from '../_handlers/booking';
import applyHandler from '../_handlers/apply';
import dpdpHandler from '../_handlers/dpdp-assessment';
import newsletterArchiveHandler from '../_handlers/newsletter-archive';

export const config = { runtime: 'edge' };

function extractSlug(request: Request): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const idx = parts.indexOf('forms');
  return idx >= 0 && idx < parts.length - 1 ? parts[idx + 1] : null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return handleCors(request);

  const slug = extractSlug(request);
  switch (slug) {
    case 'contact':             return contactHandler(request);
    case 'subscribe':           return subscribeHandler(request);
    case 'unsubscribe':         return unsubscribeHandler(request);
    case 'booking':             return bookingHandler(request);
    case 'apply':               return applyHandler(request);
    case 'dpdp-assessment':     return dpdpHandler(request);
    case 'newsletter-archive':  return newsletterArchiveHandler(request);
    default:                    return errorResponse(`Form route not found: ${slug ?? '(none)'}`, 404, request);
  }
}
