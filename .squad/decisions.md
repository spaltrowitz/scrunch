# Decisions

> Team decisions log. Append-only.

---

### 2026-04-30T12:59:00-04:00: User directive
**By:** Shari Paltrowitz (via Copilot)
**What:** Use premium models for squad agents: Claude Opus 4.6 as the default preference, or GPT-5.5 when it's better suited for the specific skill/persona. Choose whichever premium model is strongest for the task at hand.
**Why:** User request — applies to all spaltrowitz squads, not just this repo

---

### 2026-04-30T13:41:00-04:00: User persona finalization
**By:** Shari Paltrowitz + Kenickie (PM)
**What:** Final 4 user personas for Scrunch: (1) The Newbie (P0) — CGM beginner, needs safe products with clear badges; (2) The Store Scanner (P0) — in-aisle checker, instant pass/fail + alternatives; (3) The Budget Builder (P1) — cost-conscious, drugstore-first, price filters; (4) The Optimizer (P1) — experienced, filters by ingredients, experiments with new products (merged from Ingredient Detective + Routine Refiner).
**Key decisions:** Scrunch is discovery-first with checking built in. Homepage leads with browsing/categories, not a search bar. Filters are the killer feature. Age is NOT a differentiating axis — it correlates with persona (younger → Newbie/Budget) but doesn't change app behavior or UX.
**Why:** Product strategy — these personas drive feature prioritization and UX decisions

---

### 2026-04-30T13:44:00-04:00: Onboarding philosophy — invisible onboarding
**By:** Shari Paltrowitz (via Copilot)
**What:** Onboarding should be invisible per these reference articles:
1. "Your Onboarding Should Become Invisible" (Growthmates) — don't gate value behind questions. Let users act immediately. Collect profiling data WHILE they're getting value, not before. Best AI products start working with you immediately.
2. "AI Product Development" (Atomic Object) — validate core loop first, scope small, product thinking > speed. Don't add features just because you can.

Applied to Scrunch: Do NOT put a journey question before the product browse. Either defer it (ask after they've explored), infer it (watch behavior), or embed it inline. The homepage should show products immediately — zero friction before first value.
**Why:** User research — Shari's product direction based on industry best practices

---

### 2026-04-30T19:40:00-04:00: Column-specific select() patterns per page
**By:** Cha-Cha (⚡ Performance Optimizer)  
**What:** Every Supabase `.select()` call now lists explicit columns instead of `'*'`. Each page fetches only fields it renders/filters/sorts on.
**Key mappings:**
- Home: id, brand, name, category, cg_status, cruelty_free, notes, image_url
- Products: + country_availability; reviews: product_id, status, rating, results_notes
- ProductDetail: + ingredients, flagged_ingredients, avg_rating, review_count; reviews: id, user_id, rating, created_at
- MyProducts: reviews (5 cols) + products join (4 cols)
- Recommendations: scoring (10 cols with ingredients), collab display (8 cols, no ingredients)
- Profile: display fields minus id, avatar_url, country, zip_code, wash_frequency, timestamps

**Why:** Products have large `ingredients[]` arrays (30-50 items each). With 200+ products, `select('*')` was 60% over-fetching.  
**Scope:** All new Supabase queries must use explicit columns, not `select('*')`.

---

### 2026-04-30T19:40:00-04:00: React Query patterns — products/profile/reviews
**By:** Cha-Cha (⚡ Performance Optimizer)  
**What:** Canonical React Query query key conventions and shared hook patterns for data fetching.
**Query keys:**
- Products list: `['products']`
- Product detail: `['product', id]`
- User reviews: `['reviews', userId]`
- User profile: `['profile', userId]`
- Product reviews (detail): `['product-reviews', id]`
- Collaborative recs: `['collab-recs', userId, curlPattern, porosity, ratedIds, dislikedCategories]`

**Shared hooks:**
- `useProducts()` — owns seed fallback via dynamic import
- `useProduct(id)` — single product detail
- `useUserReviews(userId)` — user reviews with product join
- `useUserProfile(userId)` — user profile data

**Mutations:** All Supabase writes use `useMutation` with query invalidation. Example: rate product → invalidate `['reviews', userId]`.  
**Why:** Centralize caching, deduplication, stale-while-revalidate behavior. Prevent N+1 requests.

---

### 2026-04-30T19:34:00-04:00: Performance Standards — Team Adoption
**By:** Cha-Cha (⚡ Performance Optimizer, via Scribe)
**What:** 6 mandatory performance patterns for all team members:
1. **Always use React Query for Supabase fetches** — Wrap every `supabase.from().select()` call in `useQuery`. No raw `useEffect` + `useState` for data fetching.
2. **Never `select('*')` — always list columns** — Specify only columns each page/component uses to avoid 60% over-fetching (products have large `ingredients[]` arrays).
3. **Route-level code splitting is mandatory** — Use `React.lazy()` + `<Suspense>` for all page components in `App.tsx`. Currently all 14 pages in initial bundle.
4. **No static imports for fallback/seed data** — `seedProducts.ts` (80KB) and large data files must use dynamic `import()`, not static `import`.
5. **Components > 300 lines should be decomposed** — Split monolithic pages (e.g., Products.tsx 661 lines, Recommendations.tsx 1145 lines) into smaller sub-components for maintainability and optimization.
6. **Use count queries for counts, not fetching IDs** — When counting, use `select('id', { count: 'exact', head: true })` instead of fetching all rows and calling `.length`.

**Why:** Performance audit (2026-04-30) found 26 issues: React Query unused (13KB dead weight), N+1 image API calls, monolithic components, duplicate fetches, bundle bloat. Standards prevent recurrence and establish team baseline.
**Scope:** All team members writing Supabase queries, React components, or page logic.
**Enforcement:** Code review checklist during PR review.

---
