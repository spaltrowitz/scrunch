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

### 2026-04-30T16:17:00Z: User directive — Hosting migration plan
**By:** Shari Paltrowitz (via Copilot)
**What:** GitHub Pages is fine while Scrunch is static. When auth becomes a requirement, migrate to Firebase (like My Daily Win) — Firebase Auth + Firestore on the free tier. Deploy to scrunch.web.app or custom domain. The move is straightforward — redeploy and update portfolio link.
**Why:** User request — captured for team memory. Auth requires server-side session handling which static hosting can't provide.

---

### 2026-04-30T16:21:00Z: User directive — Hosting + Auth clarification (supersedes earlier directive)
**By:** Shari Paltrowitz (via Copilot)
**What:** Scrunch CAN stay on GitHub Pages even with auth. Client-side auth (Firebase Auth) runs entirely in the browser — GitHub Pages just serves the static files. No migration needed. Pattern: GitHub Pages serves HTML/JS/CSS, Firebase Auth handles login, Firestore stores user data if needed. The hosting and auth are separate services.
**Why:** Corrects earlier directive that said auth requires leaving GitHub Pages. That was too simplistic — client-side auth works fine with static hosting.

---

### 2026-04-30T16:24:00Z: User directive — Hosting & scaling limits reference
**By:** Shari Paltrowitz (via Copilot)
**What:** GitHub Pages limits: 100GB bandwidth/month (~200K page loads), 1GB repo, 10 builds/hr — more than enough even for hundreds of users. The real bottleneck is Firebase free tier: 50K Firestore reads/day, 20K writes/day, 10K auth verifications/month. Free tier covers up to ~100 active users. Past that, move to Firebase Blaze plan ($0.06/100K reads). Recommendation: keep GitHub Pages for hosting indefinitely, watch Firebase usage past 100 active users.
**Why:** User request — captured for team memory. Important scaling reference for Alpha → Beta → Launch progression.

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

### 2026-04-30T19:40:00-04:00: Regression Audit — select('*') and bundle fixes
**By:** Cha-Cha (⚡ Performance Optimizer)  
**What:** Post-PR#13 regression check verified 22 fixes haven't introduced new issues. Key findings:
- ✅ **React Query migration clean.** All data fetches use shared hooks with consistent query keys.
- 🔴→✅ **Two `select('*')` regressions fixed:** `useUserReviews` narrowed to 8 cols + 4 join cols; `useUserProfile` narrowed to 18 named cols (dropped id, timestamps, etc.)
- ✅ **Bundle splitting confirmed.** seedProducts.ts (69KB) lazy-loaded, all 14 routes use `React.lazy()`. 23 chunks total.
- ✅ **Render optimization intact.** ProductCard memo'd, pagination limits renders, no new circular dependencies.
- ⚠️ **Opportunity:** SearchBar and FilterPanel not memo'd — low-impact optimization for future.

**Commit:** `e797818` — narrowed `select('*')` in shared hooks.
**Why:** Quality assurance — ensure performance standards are enforced post-major refactor.

---

### 2026-04-30T20:15:00-04:00: PR #13 Code Review & Approval
**By:** Sandy (Lead Engineer)
**What:** PR #13 (`spaltrowitz/add-product-request-validation`, 65 changed files, 16,671 insertions) approved for merge. All build/test checks pass:
- ✅ `npm run build` (290ms, proper chunking)
- ✅ `npx tsc --noEmit` (zero type errors)
- ✅ `npm test` (26 tests, 3 suites passed)

**Key wins:** React Query migration solid, column-specific selects everywhere, component decomposition clean (Products 661→442 lines), lazy routes + dynamic seed import, count-only queries, Map-based dedup, Show More pagination, ProductPlaceholder UX, seed fallback is graceful.

**Non-blocking issues (tech debt):**
1. 13 `as unknown as` casts (known Supabase+TS6 type parser issue) — acceptable for now.
2. 5 `as never` on upserts — create typed helper for future cleanup.
3. Mutation errors console-only — add toast/banner for user feedback.
4. Silent catch blocks in localStorage — add console.warn for debugging.
5. Dashboard hardcoded product count (285+) — use query length instead.
6. SearchBar/FilterPanel not memoized — wrap in React.memo for consistency.

**No blockers. Ship it.**

**Why:** Code review gate for production quality and maintainability standards.

---

### 2026-04-30T20:30:00-04:00: Homepage UX Recommendations
**By:** Jan (Product Designer)
**What:** Comprehensive UX audit of Home.tsx with 13 prioritized recommendations:

**🔴 Must-haves (Alpha):**
1. **Rewrite hero copy** — Replace "CG status" jargon with "Curl Safe" for Newbies. Current: 0-3sec understanding barrier.
2. **Add "Why no price?" tooltip** — Budget Builders need explanation for missing prices. Add: "💡 Prices vary by retailer" in filter bar.
3. **Make fallback-to-seed visible** — Return `isFallback` flag from `useProducts()` hook. Show banner: "📡 Showing cached products — live database temporarily unavailable"
4. **Add parallel persona entry points** — 3 quick-start pills above categories (not gates): 🌱 New to curls → Ingredient Checker; 🔍 Find CG-safe → Pre-filtered; 📋 Browse all.

**🟡 Nice-to-have (Alpha):**
5. **Reorder categories by popularity** — Sort by product count (future: by click rate).
6. **Add category pill to product cards** — Show category below brand for context during scroll.
7. **Improve "No matches" empty state** — Replace with actionable guidance + "clear filters" button.
8. **Increase touch target on filter selects** — Add `min-h-[44px]` for mobile a11y.
9. **Add shadow to sticky filter bar** — `shadow-sm` for floating effect.
10. **Remove/update "Image coming soon"** — Replace with "No image" if no timeline.

**🟢 Beta polish:**
11. **Add "Popular" badge to top 3 categories** — Social proof signal for Newbies.
12. **Scroll-to-top on filter change** — Auto-scroll to product grid on mobile.
13. **Improve placeholder text readability** — Increase 8-9px font to 9-10px.

**Why:** Persona-driven design — first impressions, discoverability, and trust signals are critical for Newbie and Store Scanner personas.

---

### 2026-04-30T20:35:00-04:00: Homepage UX Implementation
**By:** Frenchy (Frontend Dev)
**What:** Implementation decisions for Jan's UX recommendations:

1. **CG jargon replacement** — "CG" → "Curl Safe" in Home.tsx (local CG_BADGE constant only). Note: Other pages still use original labels from constants.ts. Consistency update required app-wide.
2. **useProducts return shape change** — Changed from `Product[]` to `{ products: Product[]; isFallback: boolean }`. All consumers (Home, Products, Recommendations) updated. Breaking change for any new consumer.
3. **Price context approach** — Added tooltip "💡 Prices vary by retailer" in filter bar instead of fake data or external links.
4. **Persona entry points** — Added 3 quick-start pills above category grid (not modal/questionnaire). Follows invisible onboarding philosophy.

**Why:** Frontend implementation of product design strategy with consistent patterns.

---

### 2026-04-30T21:00:00Z: Beta Sprint Prioritization — Kenickie (PM)
**By:** Kenickie (Product Manager)
**What:** Strategic prioritization for Beta launch across 3 tiers:

**TIER 1: DO NOW (This week)**
- Merge & Review 3 PRs (2–3 hours): #12 (Dry Shampoo) + #9 (B&B Curl) = APPROVE MERGE immediately. #15 (Custom Brand Finder) = spot-check ingredient logic.
- Implement Toast Feedback (Sandy + Frenchy, 4–6 hours): Add notification on review/note save failures.
- Ship Apple Sign-In (Sandy, 8–12 hours): 60% of Newbies + Budget Builders use iOS. Supabase Auth + iOS Deeplink support. Blocker for Beta: No. High-value for Apple-first audiences.

**TIER 2: DO NEXT (1–2 weeks)**
- Build SEO Landing Pages (Sandy + Frenchy, 16–24 hours): Route `/product/:name-:slug`, template with OG metadata. Targets Store Scanner persona (arrives via Google). Measurement: Track `/product` route traffic post-launch.
- Decompose Recommendations.tsx (Frenchy, 4–6 hours): Split 1145-line monolith into RecommendationsList, TierCard, ScoreBreakdown.
- Implement Invisible Onboarding (Frenchy + Cha-Cha, 12–16 hours): Track category clicks, product views, filter usage. Tag users silently (Newbie → 3+ clicks + no filters). Defer explicit question until 3+ sessions.
- Add Community Integration Start (Frenchy, 8–12 hours): Footer link to r/curlyhair + embedded widget. Full API integration (auto-post) → post-Beta.
- Product Content Depth (Shari/Community, ongoing): Target 80%+ image coverage (currently 80%). Parallel async sourcing + community request form.

**TIER 3: DEFER (Post-Beta)**
- Google Sign-In, Route Prefetching, AuthProvider optimization, Personalized category ordering, Advanced community features (Discord bot, AI Q&A).

**Success criteria:**
- All 3 PRs merged
- Toast feedback deployed
- SEO landing pages live (top 20 products)
- r/curlyhair footer link
- Apple Sign-In available
- Image coverage ≥80%
- Build ✅, Tests ✅, 0 console errors
- First week: 50+ Reddit upvotes on Beta announcement
- Second week: Organic search traffic trending up

**Why:** Product strategy — Beta launch readiness with clear scope boundaries and persona-specific value delivery.

---
