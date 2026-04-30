# Cha-Cha — History

## Project Context
- **Project:** Scrunch — curly hair care product discovery app
- **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Supabase, React Query (TanStack), React Router 7, Vitest 4
- **Deployment:** GitHub Pages (gh-pages)
- **User:** Shari Paltrowitz
- **Data:** 280 products in seedProducts.ts (static seed data), will migrate to Supabase

## Learnings
<!-- Append new learnings below this line -->

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
