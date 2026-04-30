# Ship-Readiness Audit — Scrunch

**Date:** 2026-04-30
**By:** Sandy (Lead)
**Requested by:** Shari Paltrowitz

---

## Executive Summary

**Overall verdict: 🟡 CLOSE but NOT shippable today.**

The app has strong bones — 14 pages, auth, product browsing, recommendations, onboarding, ingredient checker — but TypeScript errors block the build on the PR branch, ~109 of 280 products lack images, and the homepage still leads with ingredient checking rather than the decided "discovery-first" browse experience. Fixing the TS errors + merging PR #13 + image sourcing gets you to a soft launch.

---

## Feature Scorecard

| Feature | Status | Notes |
|---------|--------|-------|
| **F1: User Profiles & Hair Quiz** | 🟡 Partial | 571-line OnboardingWizard exists with curl pattern, porosity, density, goals. Missing: environmental dashboard (zip code → stressor scores), ~20 of 30 planned quiz questions, visual aids per question. Good enough for V1. |
| **F2: Product Database** | 🟡 Partial | 280 products seeded. Supabase table live with RLS. Missing: 109 products have `null` images. Categories, CG status, and region filters work. |
| **F3: Product Logging & Reviews** | ✅ Done | Users can rate (loved/liked/ok/disliked), bookmark, add notes. Persists to Supabase `product_reviews` for logged-in users, localStorage for guests. |
| **F3.5: Request a Missing Product** | ✅ Done | `RequestProductForm` component + GitHub Actions workflow + spam validation (PR #13). |
| **F3.6: AI Product Ingestion Pipeline** | ❌ Missing | REQUIREMENTS describe Copilot-powered auto-research on product requests. Not built yet. |
| **F3.7: Product Removal & Data Quality** | ❌ Missing | No admin tooling for removing/editing products. |
| **F4: Personalized Recommendations** | ✅ Done | 4-tier engine: curl-match → porosity/texture priority → ingredient affinity → community popular. QuickRateCard for cold-start. |
| **F5: Community Q&A** | 🟡 Partial | Reddit search integration exists. Supabase schema has `questions` + `answers` tables. But no community posting UI — it's read-only from Reddit. |
| **F6: Ingredient Checker** | ✅ Done | Paste-and-check with silicone/sulfate/drying alcohol detection. Works without auth. Hero feature on homepage. |
| **F7: Routine Builder** | ❌ Missing | Schema exists (`routines` table) but no UI. |
| **F8: Education Hub** | ❌ Missing | No content pages beyond About/Terms. |
| **Auth (Email + Google)** | ✅ Done | Email/password + Google OAuth via Supabase. Apple Sign-In NOT implemented. |
| **Deployment (GitHub Pages)** | ✅ Done | CI/CD workflow deploys on push to main. Last deploy succeeded. Live at spaltrowitz.github.io/scrunch. |
| **Product Detail Page** | ✅ Done | Individual product pages with ingredient lists, CG status badge, related products. |
| **My Products (Saved/Rated)** | ✅ Done | Authenticated users see their rated and saved products. |

---

## Code Quality

| Check | Result | Details |
|-------|--------|---------|
| **Build (`tsc`)** | ❌ FAILS | 16 TypeScript errors on PR branch (Products.tsx, Profile.tsx, Recommendations.tsx, vite.config.ts). Main branch deploys fine (CI passes). |
| **Tests (`vitest`)** | ✅ PASS | 26 tests across 3 files, all green. |
| **Lint (`eslint`)** | ❌ 17 errors | setState-in-effect (5), fast-refresh violations (2), unused vars (2), JSX-in-try/catch (3), undeclared variable access (4), prefer-const (1). |
| **Deployed main** | ✅ Works | CI/CD succeeds; gh-pages branch has latest build artifacts. |

**Key TS errors (PR branch only):**
- `Products.tsx`: Supabase query result typed as `never` — likely a `database.types.ts` mismatch
- `Recommendations.tsx`: unused var + wrong arg count in function call + missing `_score` property
- `vite.config.ts`: `test` property not recognized (needs `/// <reference types="vitest" />`)

---

## Infrastructure

| Area | Status | Notes |
|------|--------|-------|
| **Supabase** | ✅ Configured | Real project URL + anon key hardcoded (not ideal but functional). RLS policies correct. |
| **GitHub Pages** | ✅ Working | HashRouter for SPA compatibility. Base path `/scrunch/` set correctly. |
| **Environment Variables** | 🟡 Hardcoded | Supabase URL + anon key are in source code as fallback defaults. Should use env vars in CI but won't break. |
| **Product Request Workflow** | ✅ Built (PR #13) | GitHub Actions validates + labels spam, Copilot instructions for research. Not yet merged. |
| **Image Strategy** | 🟡 In Progress | OpenBeautyFacts fallback + brand-owned URLs. 109/280 products still have no image. CDN compliance audit done (retailer URLs removed). |

---

## Blockers for V1 Launch

### Must-fix (P0 — can't ship without these)

1. **Merge PR #13** — product request validation is ready, `mergeable_state: clean`. Just needs merge.
2. **Fix TypeScript errors** — 16 errors prevent build on the PR branch. The deployed main works, but any new merge will break CI.
3. **Product images** — 109 of 280 products show no image. Users will see a placeholder grid. Minimum: top 50 products should have images.

### Should-fix (P1 — ship with caveats)

4. **Homepage doesn't match "discovery-first" decision** — Current homepage is ingredient-checker-forward. Decision says: "Homepage should show products immediately — zero friction before first value." Need to redesign hero to lead with browse/categories.
5. **Lint errors** — 17 lint errors include actual bugs (setState-in-effect can cause render loops). Fix at least the functional ones.
6. **Hardcoded Supabase credentials** — anon key in source is acceptable for public-facing apps, but URL should be env-var-only for flexibility.

### Nice-to-have (P2 — ship without)

7. **Apple Sign-In** — Not built. Google + email is sufficient for V1.
8. **Routine Builder (F7)** — Schema ready, no UI.
9. **Education Hub (F8)** — Not started.
10. **Environmental stressor dashboard** — Cool feature from REQUIREMENTS but complex (needs API keys). Defer.
11. **Full 30-question onboarding** — Current wizard covers essentials. The full Prose-level quiz is P2.
12. **Community posting UI (F5)** — Reddit search works. Full Q&A board is P2.

---

## Ship-Readiness Score

| Category | Score | Pass? |
|----------|-------|-------|
| Core features working | 7/10 | ✅ |
| Build passing | 0/1 | ❌ |
| Tests passing | 1/1 | ✅ |
| Lint clean | 0/1 | ❌ |
| Product data complete | 6/10 | 🟡 |
| Infrastructure | 9/10 | ✅ |
| UX matches decisions | 5/10 | 🟡 |

**Total: 28/43 — NOT SHIP-READY**

---

## Recommended Path to Ship

1. **Fix TS errors on PR branch** (~1 hour) → merge PR #13
2. **Fix lint errors** (~30 min) — especially setState-in-effect bugs
3. **Source images for top 50 products** (~Danny's task, in progress)
4. **Redesign homepage** to lead with category browsing per decision (half day)
5. **Soft launch** to beta testers (r/curlyhair priority list from outreach PR #5)

**Estimated time to shippable: 1–2 days of focused work.**
