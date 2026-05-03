# Decisions Archive

> Archived decisions from decisions.md.

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

---

### 2026-05-01T16:25:00Z: Toast Notification System — Convention
**By:** Frenchy (Frontend Dev)
**What:** Lightweight toast notification system implemented with React context (no external libraries) to provide user-facing feedback for all mutation operations.

**Implementation:**
- `src/hooks/useToast.tsx` — ToastProvider context + useToast() hook
- `src/components/ui/ToastContainer.tsx` — visual toast component with 3 types (success/error/info), auto-dismiss at 4s, responsive positioning

**Files wired:**
- ProductDetail.tsx: review submit
- Products.tsx: review delete, rating save, note save
- Recommendations.tsx: rate product, dismiss product
- OnboardingWizard.tsx: profile save

**Convention for future mutations:**
All new `useMutation` calls must include toast feedback in both `onSuccess` and `onError` handlers:
```tsx
onSuccess: () => addToast('Saved!', 'success')
onError: () => addToast('Failed to save. Please try again.', 'error')
```

**Why:** Sandy's PR #13 review note #2 — mutation errors were console-only with no user-facing feedback. This addresses the blocker and establishes pattern for all future mutations.

---

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
