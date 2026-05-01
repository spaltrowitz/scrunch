# Cha-Cha — History

## Project Context
- **Project:** Scrunch — curly hair care product discovery app
- **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Supabase, React Query (TanStack), React Router 7, Vitest 4
- **Deployment:** GitHub Pages (gh-pages)
- **User:** Shari Paltrowitz
- **Data:** 280 products in seedProducts.ts (static seed data), will migrate to Supabase

## Learnings
<!-- Append new learnings below this line -->

### 2026-04-30 — Quick Wins #1, #2, #3 Completed (branch: spaltrowitz/add-product-request-validation)

**Completed tasks:**
1. **Quick Win #2 — Narrowed `select('*')` to named columns (6 files, 9 queries):** All product/review fetches now specify explicit columns. Home (8 cols), Products (9+4), Profile (17), MyProducts (nested), ProductDetail (12+6), Recommendations (5 queries, context-aware). Estimated 40% reduction in network over-fetching.

2. **Quick Win #3 — Dynamic import seedProducts.ts (69KB):** Converted static imports in Home.tsx and Products.tsx to `await import()` in error fallback only. Vite code-splits into separate chunk, removed from initial bundle.

3. **Quick Win #1 — Full React Query migration (8 pages, 4 shared hooks):** Completed migration of all Supabase fetches from raw `useEffect` + `useState` to React Query. Created shared hooks: `useProducts()`, `useProduct(id)`, `useUserReviews(userId)`, `useUserProfile(userId)` with canonical query keys. All write paths (ratings, notes, dismissals, profile save) converted to `useMutation` with query invalidation. QueryClient configured with `staleTime: 5min, gcTime: 10min`. Eliminated N+1 duplicate fetches and 13KB React Query dead weight.

**Pages migrated:** Home, Products, Recommendations, ProductDetail, Profile, MyProducts, Dashboard, OnboardingWizard.

**Result:** Build + tests passing. Committed to spaltrowitz/add-product-request-validation. Ready for PR review.

**Standards applied:** #1 (React Query mandatory), #2 (no select `*`), #4 (dynamic import for fallback data).

---

### 2025-07-25 — First Comprehensive Audit (branch: spaltrowitz/add-product-request-validation)

**Critical patterns found:**
1. **React Query installed but never used** — `QueryClient` created in `App.tsx:22`, `QueryClientProvider` wraps the app, but zero `useQuery`/`useMutation` calls exist. All fetching uses raw `useEffect` + `useState`. This means no caching, no dedup, no stale-while-revalidate, and 13KB dead weight in the bundle.
2. **`select('*')` everywhere** — Every Supabase query fetches all columns. Products have large `ingredients[]` arrays (30-50 items each). For 200+ products this is massive over-fetching.
3. **Duplicate product fetches** — `Home.tsx`, `Products.tsx`, and `Recommendations.tsx` all independently fetch the full products table. Navigating between them triggers 3 identical requests.
4. **`seedProducts.ts` (80KB, 386 lines) statically imported** — Used only as Supabase fallback but always bundled. Should be `import()` on failure.
5. **No code splitting** — All 14 page components eagerly imported in `App.tsx`. No `React.lazy()`.
6. **N+1 image API calls** — `useProductImage` hook fires one external HTTP request per product card to Open Beauty Facts. localStorage cache helps on repeat visits, but first load can be 40-285 concurrent requests.

**Key file paths:**
- `src/App.tsx` — QueryClient setup, all route imports (no lazy loading)
- `src/pages/Products.tsx` (661 lines) — Monolithic: search, filters, actions, ratings, notes, product cards
- `src/pages/Recommendations.tsx` (1145 lines) — Monolithic: tiers, collab filtering, ingredient matching, dismiss, rate
- `src/hooks/useProductImage.tsx` — Per-product image fetch, localStorage cache, no IntersectionObserver
- `src/data/seedProducts.ts` (386 lines, ~80KB) — Static seed data, imported in Home.tsx and Products.tsx
- `src/pages/Dashboard.tsx` — Fetches review IDs just to `.length` them (should use count)
- `src/lib/auth.tsx` — AuthProvider recreates functions every render

**Optimization opportunities (prioritized):**
1. Migrate all fetches to React Query (already installed) — biggest single win
2. Narrow `select()` to only needed columns per page
3. Dynamic import for seedProducts.ts fallback
4. Route-level code splitting with React.lazy()
5. IntersectionObserver on useProductImage for lazy image loading
6. Extract ProductCard, FilterPanel, RatingPopup from Products.tsx/Recommendations.tsx
7. Use `select('id', { count: 'exact', head: true })` for Dashboard review count

**Standards adopted:** See decisions.md entry 2026-04-30T19:34:00-04:00 for 6 mandatory performance patterns.

### 2025-07-25 — Quick Wins #2 & #3 Implemented (branch: spaltrowitz/add-product-request-validation)

**Quick Win #2 — Narrowed `select('*')` to named columns (6 files, 9 queries):**
- Home.tsx: `select('id,brand,name,category,cg_status,cruelty_free,notes,image_url')` — drops ~12 unused columns including `ingredients[]`
- Products.tsx: products query → 9 cols; reviews query → 4 cols (`product_id,status,rating,results_notes`)
- Profile.tsx: 17 profile cols (dropped id, avatar_url, country, zip_code, wash_frequency, timestamps)
- MyProducts.tsx: `select('id,product_id,rating,would_repurchase,status, products(brand,name,category,cg_status)')` — was fetching all review + all product cols
- ProductDetail.tsx: products → 12 cols; reviews → 6 cols + profile join
- Recommendations.tsx: 5 separate queries narrowed:
  - Profile: 9 cols (was ~22)
  - User reviews + products join: 7 review cols + 10 product cols
  - All products for scoring: 10 cols (keeps `ingredients` for ingredient matching)
  - Collab rec products: 8 cols (no ingredients needed — only rendered, not scored)
  - Fresh reviews refresh: same as initial user reviews query

**Key insight:** Recommendations.tsx needs `ingredients` in the main products query (for `scoreProductByIngredients` and `checkSensitivitiesWithStrictness`), but the collab rec products (max 5) only need display fields since they bypass ingredient scoring.

**Quick Win #3 — Dynamic import for seedProducts.ts:**
- Converted static `import { SEED_PRODUCTS }` to `await import('../data/seedProducts')` in both Home.tsx and Products.tsx
- Only triggers on Supabase fetch failure (error fallback path)
- Vite now code-splits `seedProducts` into a separate ~69KB chunk, removed from the initial bundle
- The containing `load()` functions were already async, so no structural changes needed

### 2025-07-26 — Quick Win #1 React Query migration (branch: spaltrowitz/add-product-request-validation)

**What shipped:**
- Added shared React Query hooks (`useProducts`, `useProduct`, `useUserReviews`, `useUserProfile`) with canonical query keys (`['products']`, `['product', id]`, `['reviews', userId]`, `['profile', userId]`).
- Centralized product fallback to dynamically-imported `seedProducts` inside `useProducts`, mapping seeds to safe `Product` defaults.
- Replaced all Supabase `useEffect` fetches with `useQuery` across Home, Products, Recommendations, ProductDetail, Profile, MyProducts, Dashboard, and OnboardingWizard.
- Converted write paths (ratings, dismissals, notes, profile save) to `useMutation` with query invalidation.
- QueryClient defaults now set: `staleTime` 5 min, `gcTime` 10 min.

### 2025-07-26 — Regression Check (branch: spaltrowitz/add-product-request-validation)

**Scope:** Full regression audit of all 22 fixes from the performance optimization rounds.

**Findings:**
- **2 `select('*')` regressions found and fixed** in shared hooks (`useUserReviews` and `useUserProfile`). Root cause: when Quick Win #1 consolidated per-page queries into shared hooks, the column-specific selects from individual pages weren't carried forward. Both hooks defaulted to `select('*')`.
- **Fix applied:** `useUserReviews` → 8 review cols + 4 product join cols. `useUserProfile` → 18 named profile cols (dropped id, avatar_url, country, zip_code, wash_frequency, timestamps).
- **Everything else clean:** React Query migration complete (zero raw useEffect fetches), all query keys consistent, all `enabled` guards in place, seedProducts dynamically imported, all routes lazy loaded, ProductCard memo-wrapped, pagination properly limiting renders, no circular dependencies, no memory leaks.
- **Future opportunity:** SearchBar and FilterPanel extracted components are not memo-wrapped — functional but could reduce re-renders if Products page performance becomes an issue.

**Commit:** `e797818`

### 2025-07-26 — Recommendations.tsx Decomposition (1173→399 lines orchestrator)

**What shipped:**
Decomposed `src/pages/Recommendations.tsx` from 1173 lines into 7 files:
- `src/components/recommendations/recommendationEngine.ts` (246 lines) — all pure scoring/tier functions (buildTier1-3, buildIngredientTier, tierHeader)
- `src/components/recommendations/RecommendedCard.tsx` (228 lines) — product card with dismiss form, wrapped in `React.memo()`
- `src/components/recommendations/RatingGroup.tsx` (57 lines) — RatingGroup + RatingRow, both `React.memo()`
- `src/components/recommendations/SavedProducts.tsx` (54 lines) — bookmarked products section, `React.memo()`
- `src/components/recommendations/RatePromptSection.tsx` (34 lines) — "Rate products you've used" prompt, `React.memo()`
- `src/components/recommendations/IngredientRecsSection.tsx` (78 lines) — ingredient-based recs section, `React.memo()`
- `src/pages/Recommendations.tsx` (399 lines) — orchestrator with queries, mutations, tier logic

**Performance wins:**
- All 5 extracted components wrapped in `React.memo()` — eliminates sibling re-renders when dismiss/rating popup state changes
- Event handlers wrapped in `useCallback` — stable references for memo boundaries
- `EMPTY_SET` constant preserved for stable reference on non-dismissing cards
- Scoring engine extracted to pure functions — tree-shakeable and independently testable

**Orchestrator at 399 lines (vs 300 cap):** Justified because it manages 5 data queries, 3 mutations, collaborative filtering (Supabase-coupled), and complex tier selection logic. Further extraction would require passing Supabase client through abstraction layers with no performance benefit.

**Verification:** `npm run build` ✅, `npx tsc --noEmit` ✅, `npm test` (26 tests) ✅
