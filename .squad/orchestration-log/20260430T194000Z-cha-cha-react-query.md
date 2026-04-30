# Orchestration: Cha-Cha — React Query Migration (Full Standardization)

**Timestamp:** 2026-04-30T19:40:00Z  
**Agent:** Cha-Cha (⚡ Performance Optimizer)  
**Branch:** spaltrowitz/add-product-request-validation  
**Status:** ✅ Complete and Committed

---

## Directive

Execute Quick Win #1 from the performance audit (2026-04-30):
- Migrate all Supabase fetches from raw `useEffect` + `useState` to React Query
- Create shared query hooks with canonical query keys
- Convert write paths to `useMutation` with invalidation
- Centralize product fallback to dynamically-imported `seedProducts`

Establishes React Query as the canonical data fetching layer across all pages.

---

## Scope

**Pages migrated (8 total):**
1. `src/pages/Home.tsx` — useProducts hook
2. `src/pages/Products.tsx` — useProducts + useUserReviews
3. `src/pages/Recommendations.tsx` — useProducts + useUserReviews + useUserProfile
4. `src/pages/ProductDetail.tsx` — useProduct (single) + useUserReviews
5. `src/pages/Profile.tsx` — useUserProfile
6. `src/pages/MyProducts.tsx` — useUserReviews (nested with products join)
7. `src/pages/Dashboard.tsx` — useUserReviews (count query)
8. `src/pages/OnboardingWizard.tsx` — useProducts + useUserReviews

**New shared hooks (src/hooks/):**
- `useProducts()` — canonical products query with fallback to seedProducts
- `useProduct(id)` — single product by ID
- `useUserReviews(userId)` — user's reviews with optional product join
- `useUserProfile(userId)` — user profile data

**Query keys (canonical):**
- `['products']` — all products
- `['product', id]` — single product
- `['reviews', userId]` — user reviews
- `['profile', userId]` — user profile

---

## Implementation Details

✅ **Shared hooks created** with consistent patterns:
- `useQuery` for reads
- `useMutation` for writes (rate, dismiss, save profile, etc.)
- Query invalidation on mutation success
- Fallback to seedProducts on error (products query only)

✅ **QueryClient defaults configured:**
- `staleTime: 5 * 60 * 1000` (5 minutes)
- `gcTime: 10 * 60 * 1000` (10 minutes)

✅ **Writes converted to mutations:**
- Product ratings → `useMutation` + invalidate `['reviews', userId]`
- Product dismissals → `useMutation` + invalidate
- Product notes → `useMutation` + invalidate
- Profile save → `useMutation` + invalidate `['profile', userId]`

✅ **Centralized fallback:**
- seedProducts fallback logic moved into `useProducts` hook
- Error boundary: if Supabase fails, returns seeds as `Product` type
- Prevents fetch duplication and bundle inclusion

✅ **Build & tests passing**
- `npm run build` — no errors
- `npm run test` — all tests pass, no regression

✅ **Committed**
- Branch: spaltrowitz/add-product-request-validation

---

## Standards Applied

Per Decisions entry 2026-04-30T19:34:00-04:00:
- ✅ Standard #1: Always use React Query for Supabase fetches
- ✅ Standard #4: No static imports for fallback/seed data

---

## Benefits Realized

- **Caching:** Repeated navigations no longer trigger duplicate fetches
- **Deduplication:** Same query key + staleTime prevents N+1 requests
- **Stale-while-revalidate:** Background refetch while showing cached data
- **13KB code weight:** React Query now actually used (was dead weight before)
- **Query invalidation:** Write → auto-refresh dependent reads

---

## Next Steps

- Ready for PR review and merge
- Remaining Quick Wins queued: route code splitting, component decomposition, image lazy loading
