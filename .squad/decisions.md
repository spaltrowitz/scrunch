# Decisions

> Older decisions archived to decisions-archive.md on 2026-05-03

> Team decisions log. Append-only.

---

---

### 2026-05-01T16:25:00Z: PR Merge Batch — Conflict Resolution Policy
**By:** Sandy (Lead Engineer)
**What:** Merged PRs #9, #12, #15 to main. All three had merge conflicts due to the React Query migration (PR #13) that landed after they were branched. Resolution policy applied:

1. **Architecture wins over feature code.** When incoming PRs use old patterns (useState/useEffect for data fetching), resolve conflicts by adapting to the current architecture (React Query hooks + useMemo), not by reverting the migration.
2. **Drop features that can't cleanly adapt.** PR #9's `requestedProducts` matching in Recommendations.tsx used the old useCallback/useState loading pattern. Rather than create a hybrid, the feature was dropped from the merge and should be re-implemented as a `useProductRequests()` React Query hook.
3. **Image sourcing policy preserved.** PR #9's seed data used Target/Ulta image URLs. These were kept for now but conflict with HEAD's image sourcing policy (brand sites + Open Beauty Facts only). These should be migrated in a follow-up.

**Follow-up items:**
- Re-implement requestedProducts matching using React Query hook pattern
- Audit merged seed product image URLs against image sourcing policy
- PR #15's custom brand fields (`custom_brand`, `custom_hero_ingredients`) need corresponding Supabase migration

**Why:** Establishes precedent for how to handle PR conflicts when architectural migrations land between branch creation and merge.

---

---

### 2026-05-01T16:25:00Z: Recommendations.tsx Decomposition
**By:** Cha-Cha (⚡ Performance Optimizer)
**What:** Decomposed `Recommendations.tsx` from 1173 lines into 7 files following the same pattern as the Products.tsx decomposition (PR #13).

**Structure:**
```
src/components/recommendations/
├── recommendationEngine.ts    — Pure scoring functions (buildTier1-3, ingredientTier, tierHeader)
├── RecommendedCard.tsx        — Product card + dismiss form (React.memo)
├── RatingGroup.tsx            — Rating group + row (React.memo)
├── SavedProducts.tsx          — Bookmarked products section (React.memo)
├── RatePromptSection.tsx      — Quick-rate prompt (React.memo)
└── IngredientRecsSection.tsx  — Ingredient-based recs section (React.memo)
```

**Orchestrator at 399 lines (exceeds 300-line cap but justified):** Manages 5 queries, 3 mutations, collaborative filtering, and tier selection. No clean split without over-abstracting Supabase access.

**Key Decisions:**
1. All extracted components use React.memo() — prevents re-renders when dismiss/rating popup state changes on sibling cards.
2. Scoring engine is pure TypeScript — no React, no Supabase imports. Makes it independently testable and tree-shakeable.
3. Collaborative filtering stays in orchestrator — it's tightly coupled to Supabase and React Query. Extracting it would require passing the Supabase client or creating a custom hook for a single query — not worth the complexity.

**Verification:**
- `npm run build` ✅
- `npx tsc --noEmit` ✅ (zero type errors)
- `npm test` ✅ (26 tests, 3 suites)

**Why:** Standard performance pattern from team audit. Monolithic components defeat React optimization and reduce code clarity.

---

---

---

### 2026-05-01T18:21:41Z: Homepage progressive disclosure
**By:** Frenchy (Frontend Dev)
**What:** Homepage now uses progressive disclosure: top 6 categories shown by default (expandable to 14), 12 products shown initially (scroll for more, was 40 always-visible), persona pills moved below categories as secondary navigation.
**Why:** Shari flagged homepage as overwhelming. Hick's Law — too many choices paralyzes users on first load. Progressive disclosure lets users see most-popular content immediately and drill deeper if interested. No functionality removed — all categories and products remain accessible.
**Impact:** Home.tsx only. No API changes, no schema changes.

---

---

### 2026-05-01T18:21:41Z: About page consolidation
**By:** Frenchy (Frontend Dev)
**What:** About.tsx refactored from 219 lines to 121 lines (45% reduction). Merged redundant sections, removed roadmap (out of scope), made credits collapsible accordion.
**Why:** Focus and clarity — page was repetitive. Roadmap content belonged in a product roadmap doc, not a shipped app. Collapsible credits preserve transparency without page bloat.
**Impact:** About.tsx only.

---

---

### 2026-05-01T18:21:41Z: Remove phantom status_conflict column
**By:** Danny (Backend Dev)
**What:** Removed `status_conflict` from Product TypeScript interface, all Supabase queries, and seed mapper. Column was defined in types but never created in database, causing PostgREST errors on product fetches → silent fallback on GitHub Pages.
**Why:** Type/schema misalignment. The `as unknown as` cast in useProducts hid this TypeScript error. PostgREST returned a hard error when selecting non-existent columns.
**Impact:** Fixes production fallback banner on spaltrowitz.github.io/scrunch/. Prevention: run `supabase gen types` periodically.

---

---

### 2026-05-01T18:21:41Z: Add r/wavyhair community
**By:** Danny (Backend Dev)
**What:** Added r/wavyhair subreddit to Community.tsx (subreddits array, search links, badge text) and to Credits.tsx.
**Why:** Community expansion — wavy hair users now included in community resources.
**Impact:** Community.tsx, Credits.tsx. No schema/API changes.

---

### 2026-04-30T12:59:00-04:00: User directive
**By:** Shari Paltrowitz (via Copilot)
**What:** Use premium models for squad agents: Claude Opus 4.6 as the default preference, or GPT-5.5 when it's better suited for the specific skill/persona. Choose whichever premium model is strongest for the task at hand.
**Why:** User request — applies to all spaltrowitz squads, not just this repo

---

---

### 2026-04-30T13:41:00-04:00: User persona finalization
**By:** Shari Paltrowitz + Kenickie (PM)
**What:** Final 4 user personas for Scrunch: (1) The Newbie (P0) — CGM beginner, needs safe products with clear badges; (2) The Store Scanner (P0) — in-aisle checker, instant pass/fail + alternatives; (3) The Budget Builder (P1) — cost-conscious, drugstore-first, price filters; (4) The Optimizer (P1) — experienced, filters by ingredients, experiments with new products (merged from Ingredient Detective + Routine Refiner).
**Key decisions:** Scrunch is discovery-first with checking built in. Homepage leads with browsing/categories, not a search bar. Filters are the killer feature. Age is NOT a differentiating axis — it correlates with persona (younger → Newbie/Budget) but doesn't change app behavior or UX.
**Why:** Product strategy — these personas drive feature prioritization and UX decisions

---

---

### 2026-04-30T13:44:00-04:00: Onboarding philosophy — invisible onboarding
**By:** Shari Paltrowitz (via Copilot)
**What:** Onboarding should be invisible per these reference articles:
1. "Your Onboarding Should Become Invisible" (Growthmates) — don't gate value behind questions. Let users act immediately. Collect profiling data WHILE they're getting value, not before. Best AI products start working with you immediately.
2. "AI Product Development" (Atomic Object) — validate core loop first, scope small, product thinking > speed. Don't add features just because you can.

Applied to Scrunch: Do NOT put a journey question before the product browse. Either defer it (ask after they've explored), infer it (watch behavior), or embed it inline. The homepage should show products immediately — zero friction before first value.
**Why:** User research — Shari's product direction based on industry best practices

---

---

### 2026-04-30T16:17:00Z: User directive — Hosting migration plan
**By:** Shari Paltrowitz (via Copilot)
**What:** GitHub Pages is fine while Scrunch is static. When auth becomes a requirement, migrate to Firebase (like My Daily Win) — Firebase Auth + Firestore on the free tier. Deploy to scrunch.web.app or custom domain. The move is straightforward — redeploy and update portfolio link.
**Why:** User request — captured for team memory. Auth requires server-side session handling which static hosting can't provide.

---

---

### 2026-04-30T16:21:00Z: User directive — Hosting + Auth clarification (supersedes earlier directive)
**By:** Shari Paltrowitz (via Copilot)
**What:** Scrunch CAN stay on GitHub Pages even with auth. Client-side auth (Firebase Auth) runs entirely in the browser — GitHub Pages just serves the static files. No migration needed. Pattern: GitHub Pages serves HTML/JS/CSS, Firebase Auth handles login, Firestore stores user data if needed. The hosting and auth are separate services.
**Why:** Corrects earlier directive that said auth requires leaving GitHub Pages. That was too simplistic — client-side auth works fine with static hosting.

---

---

### 2026-04-30T16:24:00Z: User directive — Hosting & scaling limits reference
**By:** Shari Paltrowitz (via Copilot)
**What:** GitHub Pages limits: 100GB bandwidth/month (~200K page loads), 1GB repo, 10 builds/hr — more than enough even for hundreds of users. The real bottleneck is Firebase free tier: 50K Firestore reads/day, 20K writes/day, 10K auth verifications/month. Free tier covers up to ~100 active users. Past that, move to Firebase Blaze plan ($0.06/100K reads). Recommendation: keep GitHub Pages for hosting indefinitely, watch Firebase usage past 100 active users.
**Why:** User request — captured for team memory. Important scaling reference for Alpha → Beta → Launch progression.

---

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

---

### 2026-04-30T20:00:00-04:00: Component decomposition — Products.tsx structure
**By:** Frenchy (Frontend Dev)
**What:** Products.tsx decomposed into reusable sub-components with memo boundaries and smart pagination:
- `src/components/products/SearchBar.tsx` — search input with autocomplete dropdown
- `src/components/products/FilterPanel.tsx` — category chips, brand/region selects, toggle filters
- `src/components/products/ProductCard.tsx` — individual product card (wrapped in React.memo)
- Products.tsx orchestrates state and renders at 280 lines (down from 661)

**Pagination Pattern:** Show More (20 items per load) instead of rendering 200+ products immediately. State reset on filter change.

**Key Benefits:** Memo boundaries eliminate sibling re-renders on state changes. Decomposed structure improves testability and maintainability.

**Why:** Performance Round 2 deliverable. Monolithic components defeat React optimization and reduce code clarity.

---

---

### 2026-04-30T20:00:00-04:00: Query optimization patterns — count, dedup, parallelization
**By:** Danny (Backend Dev)
**What:** Three core patterns for efficient backend operations:

1. **Count-Only Queries:** Use `select('id', { count: 'exact', head: true })` instead of fetching rows and calling `.length`. Transfers zero rows — count lives in metadata.

2. **Deduplication:** Replace O(n²) `filter + findIndex` with Map-based O(n):
   ```ts
   const seen = new Map()
   return products.filter(p => !seen.has(key) && seen.set(key, true))
   ```

3. **Parallel Independent Fetches:** Use `Promise.all([fetchA(), fetchB()])` for independent API calls instead of sequential awaits.

**Why:** Performance Round 2 audit found these patterns drive measurable speedup on counting, dedup, and API parallelization operations.

**Enforcement:** Code review checklist for any count operation, array dedup, or parallel fetch decision.

---
### 2026-05-01T22:27: User directive
**By:** Shari Paltrowitz (via Copilot)
**What:** New visitors to curly hair don't want to check ingredients first — they want to learn basics about maintaining their hair and understand how this website will help them. The ingredient checker is a power-user feature, not a first-visit hook. The homepage should lead with education/discovery, not tools.
**Why:** User request — captured for team memory. Critical for homepage CTA prioritization.

---

### 2026-05-01T22:30: User directive
**By:** Shari Paltrowitz (via Copilot)
**What:** Community Q&A is NOT a primary product feature — it's currently the weakest part of the app. The Reddit search engine needs significant optimization before it should be prominently featured. Demote it on the homepage; don't lead with it as a main selling point.
**Why:** User assessment of current feature quality. The search results are not good enough to be a top-level CTA. Product catalog browsing and personalized recommendations are stronger value props right now.

---

### 2026-05-01: Mobile-First Design Standards
**By:** Jan (Product Designer)
**What:** Established mobile-first design standards for the team:
1. **Touch Target Minimum:** All interactive elements must have 44×44px minimum (use `min-h-[44px]`, `py-3` for inputs)
2. **Explicit Grid Columns:** Always specify mobile-first grid columns explicitly (`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`)
3. **Text Wrapping:** Use `break-words` for long content, `truncate` for known-short, `line-clamp-N` for multi-line
4. **Mobile Padding:** Use `px-4` for horizontal padding on page containers
5. **Responsive Typography:** H1 `text-xl md:text-2xl lg:text-3xl`, H2 `text-lg md:text-xl lg:text-2xl`, H3 `text-base md:text-lg`, Body `text-sm md:text-base`
6. **Form Input Height:** 44px minimum for all inputs and buttons

**Implementation Priority:**
- High: ProductDetail ingredient wrapping, auth form input heights, Community button touch targets
- Medium: Audit all buttons, add explicit grid-cols-1, update ProductDetail rating layout
- Low: Component library docs, automated touch target testing

**Why:** Mobile responsiveness audit findings. Touch accuracy and readability on small screens are critical.

---

### 2026-05-01: Homepage CTA Priority & Structure
**By:** Kenickie (Product Manager), approved per Shari Paltrowitz
**What:** Restructured homepage to prioritize the Ingredient Checker as primary CTA and remove overlapping calls-to-action. 

**Changes:**
1. **Hero CTA:** "Check Ingredients Now →" (was "Explore Products") with subheading: "Paste any ingredient list — Scrunch tells you if it's curl-safe in seconds"
2. **Feature Grid (2 boxes):** Browse Products + Community Q&A (removed Ingredient Checker duplicate and Recommendations)
3. **Products Teaser:** Keep grid, remove "See All Products" CTA, add inline text: "Click any product to check ingredients or read reviews"
4. **New section after #HairTok:** "Ready to get personalized?" with "Create Profile & Get Recommendations" link (outline style, lower priority)
5. **Delete:** "New to curly hair?" section (duplicate Ingredient Checker messaging)

**Priority Hierarchy:**
- **PRIMARY:** Check Ingredients (fastest aha moment, zero friction, proves value)
- **Secondary:** Browse Products (discovery next step)
- **Tertiary:** Get Recommendations (future engagement, lower friction)
- **Support:** Community Q&A (social proof)

**Why:** Resolves Shari's concern about overwhelming first-time visitors. Ingredient Checker is the unique value prop (what only Scrunch does) and requires zero friction/account. Aligns with invisible onboarding philosophy.

---

### 2026-05-01: Supabase vs Self-Hosted Database — Phased Approach Decision
**By:** Sandy (Lead Engineer), approved by Shari Paltrowitz
**What:** Recommends phased approach: Phase 1 (static MVP with offline-first) → Phase 2 (Supabase backend if validation positive). Current architecture uses Supabase free tier (cold starts 1-3s on first request after inactivity).

**Options Evaluated & Verdict:**
- A: **Stay on Supabase (Free)** ✅ Default choice — zero code changes, managed auth, RLS, sustainable for MVP
- B: **Self-hosted Postgres** ❌ Too complex for MVP — requires 2-3 days, custom auth backend, ISP reliability risk
- C: **Supabase self-hosted (Docker)** 🤔 Good fallback later — solves cold starts but adds ops overhead
- D: **Railway/Render + Node Backend** ⚠️ Viable but costly ($12-15/mo) and complex
- E: **Static MVP (seed-only, offline-first)** 🎯 Recommended Phase 1

**Phased Roadmap:**
- **Phase 1:** Keep seed products as primary data source, remove auth requirement from browsing, localStorage for guest ratings, measure retention/pain points
- **Phase 2 (if validation positive):** Upgrade to Supabase Pro ($25/mo) or Railway ($12-15/mo), add persistent auth flow

**Key Finding:** App already has workarounds (placeholderData from seed products, Supabase fallback, RLS). Scaling: free tier covers ~100 active users.

**Why:** Lowest risk, validates market before infrastructure investment, avoids premature optimization.

---

### 2026-05-01: Performance Audit Decision Record
**By:** Sandy (Lead Engineer)
**Status:** Confidence 7/10 — performance is good, 3 issues worth fixing

**Current State (Good):**
- All 14 routes lazy-loaded, 27 chunks, 298ms build time
- Instant render from seed data via placeholderData
- Lightweight query variants (7-9 cols vs 22) reduce payload
- Image lazy-loading via IntersectionObserver + localStorage
- staleTime 5min + gcTime 10min = minimal refetches
- CSS purged (49KB raw, 9KB gzip)
- Bundle: 816KB raw, ~143KB gzip — reasonable

**Issues & Fixes:**
1. **Static SEED_PRODUCTS import (HIGH impact, MEDIUM fix):** Defeats lazy loading but enables instant render. **Decision: keep as intentional trade-off** — document that 15KB gzip cost buys instant paint on every product page.
2. **Auth blank screen on cold start (MEDIUM impact, EASY fix):** Supabase free-tier `getSession()` takes 1-3s, user sees blank white screen. **Fix:** Show app shell (Header + Footer + skeleton) during loading instead of `return null`.
3. **ProductDetail has no PlaceholderData (LOW-MEDIUM impact, EASY fix):** Pages show "Loading..." even though product might be in `['products']` cache. **Fix:** Use `queryClient.getQueryData(['products'])` to populate placeholderData.

**Decision:** Fix #2 (auth blank screen) — most user-visible and easiest. Fix #3 if time allows. Not worth fixing: Supabase-js SDK size, OpenBeautyFacts caching, component memoization, offline support (PWA).

**Why:** Determines performance optimization priorities without over-engineering diminishing returns.

---
