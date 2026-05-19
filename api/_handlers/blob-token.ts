/**
 * POST /api/blob-token
 *
 * Issues a client-side upload token for @vercel/blob/client `upload()` so the
 * browser can stream large files (hero videos, etc.) directly to Vercel Blob,
 * bypassing the 4.5 MB serverless body limit.
 *
 * The Vercel Blob client SDK posts a `body` here and expects `handleUpload`
 * to validate the request, optionally restrict path/size/content-type, and
 * return a signed token. This route requires admin auth.
 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { verifyAdmin } from '../_auth';
import { handleCors, errorResponse } from '../_db';

export const config = { runtime: 'edge' };

// SVG explicitly excluded — image/svg+xml can carry inline <script> or
// onload handlers that execute when the blob URL is opened. Raster + video
// formats only. Add sanitized SVG support later if brand vector assets are
// genuinely required.
const ALLOWED_CONTENT_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_BYTES = 250 * 1024 * 1024; // 250 MB

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return handleCors(request);
  if (request.method !== 'POST') return errorResponse('Method not allowed', 405, request);

  const admin = await verifyAdmin(request);
  if (!admin) return errorResponse('Unauthorized', 401, request);

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return errorResponse('Invalid JSON body', 400, request);
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname) => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ adminId: admin.userId }),
      }),
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('[blob-token] upload completed', { url: blob.url, tokenPayload });
      },
    });
    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[blob-token] handleUpload error:', err);
    return errorResponse('Blob token issuance failed', 500, request);
  }
}
