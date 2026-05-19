/**
 * /api/files/[...slug] — consolidated file-handling endpoints.
 *
 * Replaces two standalone routes (upload, blob-token) as a single Vercel
 * function. The original upload route used the default (Node) runtime
 * because it parses multipart formData; `formData()` is supported in the
 * Edge runtime too, so we run the group as edge to match blob-token's
 * existing setting.
 */
import { handleCors, errorResponse } from '../_db';

import uploadHandler from '../_handlers/upload';
import blobTokenHandler from '../_handlers/blob-token';

export const config = { runtime: 'edge' };

function extractSlug(request: Request): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const idx = parts.indexOf('files');
  return idx >= 0 && idx < parts.length - 1 ? parts[idx + 1] : null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return handleCors(request);

  const slug = extractSlug(request);
  switch (slug) {
    case 'upload':     return uploadHandler(request);
    case 'blob-token': return blobTokenHandler(request);
    default:           return errorResponse(`Files route not found: ${slug ?? '(none)'}`, 404, request);
  }
}
