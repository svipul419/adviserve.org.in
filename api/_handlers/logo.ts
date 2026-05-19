/**
 * GET /api/logo — Returns logo URL, height, and brand text visibility
 * Reads from BOTH site_assets (legacy) and site_settings (new).
 * site_settings takes priority if both exist.
 */
import { getDb, json, handleCors } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  try {
    const sql = getDb();

    // Read from site_settings (new approach)
    const settings = await sql`
      SELECT DISTINCT ON (key) key, value
      FROM site_settings
      WHERE key IN ('logo_url', 'logo_height', 'show_brand_text')
      ORDER BY key, id DESC
    `;

    let logoUrl = '';
    let logoHeight = 52;
    let showBrandText = true;

    settings.forEach((s: any) => {
      if (s.key === 'logo_url' && s.value) logoUrl = s.value;
      if (s.key === 'logo_height' && s.value) logoHeight = parseInt(s.value, 10) || 52;
      if (s.key === 'show_brand_text') showBrandText = s.value !== 'false';
    });

    // If no logo in site_settings, check site_assets (legacy)
    if (!logoUrl) {
      const assets = await sql`
        SELECT logo_url FROM site_assets ORDER BY id DESC LIMIT 1
      `;
      if (assets.length > 0 && assets[0].logo_url) {
        logoUrl = assets[0].logo_url;
      }
    }

    return json({ logoUrl, logoHeight, showBrandText }, 200, request, 30);
  } catch (err) {
    console.error('Logo API error:', err);
    return json({ logoUrl: '', logoHeight: 52, showBrandText: true }, 200, request);
  }
}
