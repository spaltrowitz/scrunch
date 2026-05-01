# Performance Audit Decision Record

**Date:** 2026-07-17
**By:** Sandy (Lead Engineer)
**Type:** Assessment + Recommendations

## Verdict: Performance is Good — 3 Issues Worth Fixing

### Current State: Confidence 7/10

**What's working well:**
- All 14 routes lazy-loaded, 27 chunks, build in 298ms
- placeholderData on all list hooks = instant render from seed data
- Home page: zero loading states, renders immediately from seedPlaceholder
- Lightweight query variants (7-9 cols vs 22) reduce payload
- Image lazy loading via IntersectionObserver + localStorage cache
- staleTime 5min + gcTime 10min = no unnecessary refetches
- CSS properly purged (49KB / 9KB gzip)
- Total bundle: 816KB raw, ~143KB gzip — reasonable for the stack

### Remaining Issues

#### 1. Static SEED_PRODUCTS Import Defeats Lazy Loading
- **Files:** `src/hooks/useProducts.ts:5`, `src/hooks/useHomeProducts.ts:4`
- **Impact:** HIGH — 74KB seedProducts is statically imported for placeholderData, putting it in the critical path. The dynamic `import()` fallback (line 57) is redundant.
- **Fix difficulty:** MEDIUM — Compute placeholderData lazily or accept the static import as intentional (it IS what enables instant render). Trade-off: bundle size vs perceived speed. **Recommendation: keep it.** The 15KB gzip cost buys instant paint on every product page. Document it as intentional.

#### 2. Auth Gate Shows Blank Screen on Cold Start
- **File:** `src/App.tsx:44` — `if (loading) return null`
- **Impact:** MEDIUM — Supabase free tier `getSession()` can take 1-3s after inactivity. User sees completely blank white screen.
- **Fix difficulty:** EASY — Show the app shell (Header + Footer + skeleton/spinner) during auth loading instead of `return null`. Change to render routes with a context where `user` is null/loading.

#### 3. ProductDetail Has No PlaceholderData
- **File:** `src/pages/ProductDetail.tsx:60` — `loading = (productLoading || reviewsLoading) && !(productError || reviewsError)`
- **Impact:** LOW-MEDIUM — Individual product pages show "Loading…" text even though the product data might exist in the `['products']` query cache.
- **Fix difficulty:** EASY — Use `queryClient.getQueryData(['products'])` to find the product in cache and pass as `placeholderData` to `useProduct(id)`.

### Not Worth Fixing (Diminishing Returns)
- Supabase-js at 228KB (63KB gzip) — it's the SDK, can't reduce without switching providers
- OpenBeautyFacts API calls — already lazy + cached, minimal impact
- SearchBar/FilterPanel not memoized — would save microseconds
- No service worker / offline support — nice for PWA but not needed for alpha

### Decision
Fix #2 (auth blank screen) — it's the most user-visible issue and easiest fix. Fix #3 if time allows. Accept #1 as an intentional trade-off. Everything else is diminishing returns.
