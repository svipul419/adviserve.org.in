/**
 * POST /api/upload
 *
 * Small-file server-side upload (resumes, images, documents).
 * Receives multipart/form-data with a single `file` field,
 * validates type + size, stores via @vercel/blob, returns { url }.
 *
 * For large files (hero video etc.) use /api/blob-token instead —
 * that endpoint issues a client-side upload token which bypasses the
 * 4.5 MB serverless body limit.
 *
 * Accepted types: PDF, DOC, DOCX, JPG, PNG, WEBP
 * Max size: 5 MB
 * Rate limit: 10 uploads / IP / minute
 */

import { put } from '@vercel/blob';
import { errorResponse, handleCors, json, rateLimit } from '../_db';

// SVG explicitly excluded — image/svg+xml can carry inline <script> or onload
// handlers that execute in the browser when the blob URL is opened. Allow
// raster formats only. If brand vector assets are needed later, sanitize
// SVGs server-side with DOMPurify before allowing the type.
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    'unknown';
  if (!rateLimit(`upload:${ip}`, 10, 60_000)) {
    return errorResponse('Rate limit exceeded', 429, request);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse('Invalid multipart form data', 400, request);
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return errorResponse('No file provided', 400, request);
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return errorResponse(
      'File type not allowed. Accepted: PDF, DOC, DOCX, JPG, PNG, WEBP. For video uploads use /api/blob-token.',
      400,
      request,
    );
  }

  if (file.size > MAX_BYTES) {
    return errorResponse('File too large. Maximum 5 MB. For video uploads use /api/blob-token.', 400, request);
  }

  try {
    const blob = await put(`resumes/${Date.now()}-${file.name}`, file, {
      access: 'public',
      contentType: file.type,
    });
    return json({ url: blob.url }, 200, request);
  } catch (err) {
    console.error('[upload] Blob error:', err);
    return errorResponse('Upload failed. Please try again.', 500, request);
  }
}
