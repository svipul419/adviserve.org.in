# Codebase Fix — Design Spec
**Date:** 2026-05-09
**Status:** Approved
**Toolchain:** code-review-graph + graphify + caveman (used after every phase)

---

## Problem Summary

The codebase has four structural problems identified by code-review-graph and graphify analysis:

1. **Dead code** — `api/admin/log.ts` has 0 callers; `api/admin/seed-cms.ts` likely same
2. **Monolithic admin pages** — 10 files each 600–1,319 lines, single functions doing everything
3. **Zero test coverage** — the 20 most-connected nodes have no tests; `crud.ts` is the most critical untested path
4. **Coupling** — 146 edges between `ui-handle` and `admin-handle` communities (no abstraction boundary)

---

## Approach: Option A (Conservative Section Extraction)

Decompose giant page components by extracting JSX sections into separate files in a `sections/` subfolder. The page component remains the coordinator — it keeps all state and passes props down. No logic moves, no new hooks, no new folder conventions. Stays consistent with the existing flat-file pattern.

---

## Phase 1 — Dead Code Cleanup

**Goal:** Remove confirmed-dead endpoints.

**Actions:**
1. Check `api/admin/seed-cms.ts` for callers
2. Delete `api/admin/log.ts` (0 callers confirmed this session)
3. Delete `api/admin/seed-cms.ts` if also 0 callers
4. Run graphify `--update api`, run code-review-graph incremental build
5. Caveman commit: `chore: remove dead admin API endpoints`

**Risk:** Zero. Both endpoints have no callers anywhere in the codebase.

---

## Phase 2 — Decompose Admin Pages

**Goal:** No admin page component exceeds 300 lines.

**Pattern:**
```
src/pages/admin/
  HomePageEditor.tsx              ← shrinks to ~150 lines (state + save + layout shell)
  sections/
    HomeHeroSection.tsx           ← receives hero state + handlers as props
    HomeServicesSection.tsx
    HomeWhySection.tsx
    HomeFAQSection.tsx
    HomeFramingSection.tsx
    HomeAdvantageTabsSection.tsx
    HomeCTASection.tsx
    HomeKickoffSection.tsx
```

**Rules:**
- Sections receive only the state slices and handlers they need as props
- No logic moves — only JSX blocks relocate into section files
- TypeScript: no `any` introduced; props typed inline in each section file
- After each page: verify `tsc --noEmit` passes, run graphify `--update src`, run code-review-graph incremental, caveman commit

**Pages in order:**

| Page | Current Lines | Target | Sections |
|------|--------------|--------|----------|
| `HomePageEditor.tsx` | 1,319 | ~150 | 8 |
| `SEOOptimization.tsx` | 1,014 | ~150 | 4 (tabs: seo_global, aeo, geo, local_seo) |
| `CareersEditor.tsx` | 984 | ~150 | 4 (tabs: hero, benefits, culture, positions) |
| `ProductsManagement.tsx` | 794 | ~200 | ~4 |
| `AnalyticsDashboard.tsx` | 681 | ~200 | ~4 |
| `WebsiteManagement.tsx` | 681 | ~200 | ~3 |
| `SiteSettings.tsx` | 700 | ~200 | ~3 |
| `MenuManagement.tsx` | 651 | ~200 | ~3 |
| `BlogManagement.tsx` | 640 | ~200 | ~3 |
| `EmailCampaigns.tsx` | 613 | ~200 | ~3 |

**Commit per page:** `refactor: decompose <PageName> into section components`

---

## Phase 3 — Tests for `crud.ts`

**Goal:** Cover every action branch of the single DB gateway with unit tests.

**File:** `src/test/admin-crud.test.ts`

**Strategy:** Mock `getDb()` and `verifyAdmin()` at module level. No real DB or Supabase calls. Vitest (already in the project).

**Test cases (9):**

| # | Case | Expected |
|---|------|----------|
| 1 | `select` without filters | returns rows |
| 2 | `select` with `.eq()` filter + `order` + `limit` | passes correct SQL params |
| 3 | `insert` happy path | returns inserted row |
| 4 | `update` happy path | requires at least 1 filter |
| 5 | `update` with empty filters | 400 error |
| 6 | `delete` happy path | returns `{ deleted: N }` |
| 7 | `delete` with empty filters | 400 error |
| 8 | `upsert` with `onConflict` | returns upserted row |
| 9 | Auth rejection (no token) | 401 |
| 10 | Table not in allowlist | 403 |
| 11 | Sensitive table DELETE | 403 |

**Commit:** `test: add crud handler unit tests`

---

## Toolchain — Every Phase

After each logical chunk of changes:
1. `python -m graphify --update src` (incremental, free — AST only)
2. `mcp__code-review-graph__build_or_update_graph_tool` (incremental)
3. Caveman commit with descriptive message
4. `tsc --noEmit` to verify no TypeScript regressions

---

## Success Criteria

- [ ] `api/admin/log.ts` deleted
- [ ] `api/admin/seed-cms.ts` checked and deleted if dead
- [ ] All 10 admin pages under 300 lines
- [ ] `src/pages/admin/sections/` contains ~40 focused section components
- [ ] `tsc --noEmit` passes throughout
- [ ] 11 tests in `admin-crud.test.ts`, all green
- [ ] graphify graph rebuilt: node count increases (more components visible)
- [ ] code-review-graph: `HomePageEditor` hub degree drops from 324
