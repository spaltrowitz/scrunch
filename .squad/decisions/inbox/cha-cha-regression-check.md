# Cha-Cha Regression Check — 2025-07-26

Post-fix audit verifying 22 fixes haven't introduced new regressions.

## React Query Migration

- ✅ **Zero raw useEffect data fetches remaining.** Grep for `useEffect.*fetch|supabase|load` across all `.tsx/.ts` files returns zero hits. All data fetching uses shared hooks (`useProducts`, `useProduct`, `useUserReviews`, `useUserProfile`, `useUserReviewCount`).
- ✅ **Query keys consistent.** Canonical keys: `['products']`, `['product', id]`, `['reviews', userId]`, `['review-count', userId]`, `['profile', userId]`. All in `src/hooks/useProducts.ts`.
- ✅ **QueryClient properly configured.** `staleTime: 5min`, `gcTime: 10min` in `App.tsx:27-28`.
- ✅ **All dependency-based queries have `enabled` guards.** `useProduct(id)` → `enabled: !!id`, `useUserReviews(userId)` → `enabled: !!userId`, `useUserProfile(userId)` → `enabled: !!userId`, `useUserReviewCount(userId)` → `enabled: !!userId`, collab recs → `enabled: shouldLoadCollab`.
- ✅ **No memory leaks from migration.** React Query manages cleanup internally. No manual subscriptions or event listeners introduced.

## select('*') Regression

- 🔴 **FIXED: Two `select('*')` regressions found and resolved.**
  - `useUserReviews` had `.select('*, products(*)')` — narrowed to 8 review cols + 4 product join cols.
  - `useUserProfile` had `.select('*')` — narrowed to 18 named profile cols (dropped id, avatar_url, country, zip_code, wash_frequency, created_at, updated_at).
  - **Root cause:** When Quick Win #1 (React Query migration) consolidated per-page queries into shared hooks, the column lists from individual pages weren't carried over. The shared hooks defaulted to `select('*')`.
- ✅ **All other Supabase queries use named columns.** ProductDetail reviews (11 cols + profile join), Recommendations collab check (1 col), collab ratings (2 cols), collab products (8 cols). Zero `select('*')` remaining.

## Bundle Regression

- ✅ **seedProducts.ts dynamically imported.** Only reference is `await import('../data/seedProducts')` inside `useProducts` hook (line 50). Type-only import at line 4. Build confirms separate chunk: `seedProducts-BH7hgrMU.js` (69KB).
- ✅ **All 14 route components lazy loaded.** `App.tsx:9-22` uses `lazy(() => import(...))` for every page. No static page imports.
- ✅ **No new large static imports introduced.** Build output shows proper code-splitting across 23 chunks.

## Render Regression

- ✅ **ProductCard is memo-wrapped.** `React.memo(function ProductCard({...})` at `src/components/products/ProductCard.tsx:31`.
- ⚠️ **SearchBar and FilterPanel are NOT memo-wrapped.** They receive callbacks as props (e.g., `onSearchChange`, `onToggleCategory`) which could cause unnecessary re-renders. Not a regression (they were extracted this way), but a future optimization opportunity.
- ✅ **Pagination limits renders.** `Products.tsx` uses `visibleCount` state with `filteredProducts.slice(0, visibleCount)` via `useMemo` — only visible products are rendered, not all-then-hidden.
- ✅ **SearchBar useEffect is legitimate.** It's a click-outside handler for autocomplete dropdown dismissal, not data fetching.
- ✅ **OnboardingWizard useEffect is legitimate.** It syncs existing profile data into form state when editing — not data fetching.

## Structural Integrity

- ✅ **No circular dependencies.** Component imports flow one-way: pages → components → hooks/utils/lib. No back-references.
- ✅ **Event handlers intact.** Mutations in Products.tsx (delete, upsert review, upsert note), ProductDetail.tsx (submit rating), Recommendations.tsx (rate, dismiss) all use `useMutation` with proper `queryClient.invalidateQueries`.

## Summary

| Category | Status |
|----------|--------|
| React Query migration | ✅ Clean |
| select('*') elimination | 🔴→✅ Fixed 2 regressions in shared hooks |
| Bundle splitting | ✅ Clean |
| Render optimization | ✅ Clean (⚠️ memo opportunity on SearchBar/FilterPanel) |
| No new regressions | ✅ Confirmed |

**Commit:** `e797818` — narrowed `select('*')` in `useUserReviews` and `useUserProfile` to named columns.
