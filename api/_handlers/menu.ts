/**
 * GET /api/menu — Get active main navigation menu items
 */
import { getDb, json, errorResponse, handleCors } from '../_db';

export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return handleCors(request);

  try {
    const sql = getDb();

    // Get main navigation menu
    const menus = await sql`
      SELECT id FROM navigation_menus WHERE name = 'main_navigation' AND is_active = true LIMIT 1
    `;
    if (menus.length === 0) return json([], 200, request);

    const menuId = menus[0].id;
    const items = await sql`
      SELECT * FROM menu_items WHERE menu_id = ${menuId} AND is_visible = true ORDER BY sort_order
    `;

    // Organize into parent/children hierarchy
    const topLevel = items.filter((item: any) => !item.parent_id);
    const organized = topLevel.map((parent: any) => ({
      ...parent,
      children: items.filter((item: any) => item.parent_id === parent.id),
    }));

    return json(organized, 200, request, 120);
  } catch (err) {
    console.error('Menu API error:', err);
    return errorResponse('Failed to fetch menu', 500, request);
  }
}
