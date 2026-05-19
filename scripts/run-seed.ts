/**
 * scripts/run-seed.ts
 *
 * Build-time CMS seed — runs automatically on every Vercel deploy
 * (and locally via `npm run build`).
 *
 * Behaviour:
 *   - INSERT new rows with seed defaults; on conflict updates only structural metadata
 *     (section_label, content_type, display_order) — NEVER overwrites content_value or
 *     is_visible so admin edits are always preserved across deploys.
 *   - Skips cleanly if DATABASE_URL is not set (local dev without DB, CI, etc.).
 *   - Catches DB errors and warns but does NOT fail the build — the static site
 *     can still deploy with existing DB data.
 *   - Set SKIP_SEED=true to bypass entirely (e.g. preview branches).
 */

import { neon } from '@neondatabase/serverless';
import { PAGES, createProductsTable, createCaseStudiesTable, createJobPositionsTable, createJobApplicationsTable, createDPDPAssessmentsTable, seedProducts, createNavigationTables, seedNavigation } from './seed-data';

async function main() {
  if (process.env.SKIP_SEED === 'true') {
    console.log('[seed-cms] SKIP_SEED=true — skipping');
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('[seed-cms] ⚠️  DATABASE_URL not set — skipping seed (build continues)');
    return;
  }

  console.log('[seed-cms] Seeding CMS tables...');
  const sql = neon(databaseUrl);
  let totalKeys = 0;

  // ── Table migrations (each isolated — one failure won't block the rest) ──
  try {
    await createProductsTable(sql);
    console.log('[seed-cms]   ✓ products table ensured');
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  products table skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    await createCaseStudiesTable(sql);
    console.log('[seed-cms]   ✓ case_studies table ensured');
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  case_studies table skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    await createJobPositionsTable(sql);
    console.log('[seed-cms]   ✓ job_positions table ensured');
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  job_positions table skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    await createJobApplicationsTable(sql);
    console.log('[seed-cms]   ✓ job_applications table ensured');
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  job_applications table skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    await createDPDPAssessmentsTable(sql);
    console.log('[seed-cms]   ✓ dpdp_assessments table ensured');
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  dpdp_assessments table skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    const count = await seedProducts(sql);
    console.log(`[seed-cms]   ✓ products seeded (${count} slugs checked)`);
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  products seed skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    await createNavigationTables(sql);
    console.log('[seed-cms]   ✓ navigation tables ensured');
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  navigation tables skipped:', err instanceof Error ? err.message : String(err));
  }

  try {
    const count = await seedNavigation(sql);
    console.log(`[seed-cms]   ✓ navigation seeded (${count} items added)`);
  } catch (err) {
    console.warn('[seed-cms]   ⚠️  navigation seed skipped:', err instanceof Error ? err.message : String(err));
  }

  // ── Content seed (each page isolated — one bad page won't kill others) ──
  for (const page of PAGES) {
    try {
      const pageRows = await sql.query(
        `INSERT INTO website_pages (slug, title, is_visible)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
         RETURNING id`,
        [page.slug, page.title, true],
      ) as Array<{ id: string }>;

      if (!pageRows[0]?.id) {
        console.warn(`[seed-cms]   ⚠️  ${page.slug} upsert returned no id, skipping content seed`);
        continue;
      }
      const pageId = pageRows[0].id;

      for (const row of page.rows) {
        await sql.query(
          `INSERT INTO website_content
             (page_id, section_key, section_label, content_type, content_value, is_visible, display_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (page_id, section_key) DO UPDATE SET
             section_label  = EXCLUDED.section_label,
             content_type   = EXCLUDED.content_type,
             display_order  = EXCLUDED.display_order`,
          [pageId, row.section_key, row.section_label, row.content_type, row.content_value, row.is_visible, row.display_order],
        );
        totalKeys++;
      }

      console.log(`[seed-cms]   ✓ ${page.slug} (${page.rows.length} keys)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[seed-cms]   ⚠️  ${page.slug} failed (skipping): ${msg}`);
    }
  }

  console.log(`[seed-cms] ✅ Done — ${totalKeys} keys across ${PAGES.length} pages`);
}

main().catch((err) => {
  console.warn('[seed-cms] ⚠️  Unexpected error (build continues):', err);
});
