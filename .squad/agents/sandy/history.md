# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

### 2026-04-30: Ship-readiness audit
- **App state:** 14 pages, 280 products, auth (email+Google), recommendations engine, ingredient checker, onboarding wizard, product request workflow. Deployed to GitHub Pages via CI/CD.
- **Build status:** Main deploys fine. PR #13 branch has 16 TS errors (database.types.ts mismatch, vite config missing vitest reference, unused vars). Tests pass (26/26). Lint has 17 errors including functional bugs (setState-in-effect).
- **Key gap:** Homepage is ingredient-checker-forward but team decision says discovery-first (browse/categories). 109/280 products missing images.
- **Architecture notes:** HashRouter for GH Pages SPA. Supabase anon key hardcoded as fallback (acceptable for public read-only). Product data lives in both `seedProducts.ts` (fallback) and Supabase `products` table. localStorage used for guest state, Supabase for authenticated users.
- **What's NOT built:** Routine Builder (F7), Education Hub (F8), AI ingestion pipeline (F3.6), admin tooling (F3.7), Apple Sign-In, environmental stressor dashboard, full 30-question quiz.
- **Path to ship:** Fix TS errors → merge PR #13 → top-50 product images → homepage redesign → soft launch. ~1-2 days.


# Sandy — Lead Engineer History

## Learnings

### 2025-07-17: TypeScript 6 + Supabase type resolution

- Supabase-js v2.104+ with TypeScript 6.0 has a query parser that returns `never` for `.select('*')` results unless the `Database` type includes `Views`, `Functions`, and `Relationships` fields.
- The `Database` interface needs: `Views: {}`, `Functions: {}`, and each table needs `Relationships: []` to satisfy `GenericSchema` / `GenericTable` constraints.
- Even with all fields present, TS6's inference can still fail. The pragmatic fix is to cast query results: `(data as unknown as Product[])` — this pattern is already used elsewhere in the codebase (Recommendations.tsx).
- `noUnusedLocals: true` catches dead code like `saveNote` and `ratingCount`. Prefix `_` does NOT suppress this in TypeScript — either remove the code or destructure to `[,]`.
- Vitest config embedded in `vite.config.ts` requires `/// <reference types="vitest/config" />` at the top for type-checking to pass.

### 2026-04-30: PR #13 Full Code Review

- Reviewed full diff (65 source files, 16,671 insertions) covering: image sourcing (52 URLs), React Query migration, query optimization, component decomposition, pagination, bundle optimization, and homepage redesign.
- **Build/types/tests all green:** `npm run build` (290ms), `npx tsc --noEmit` (0 errors), `npm test` (26/26 passed).
- **Verdict: APPROVE.** No blockers found.
- Key findings:
  - 13 `as unknown as` casts remain — known Supabase+TS6 issue, documented and acceptable.
  - 5 `as never` casts on upsert calls — should centralize into a typed helper eventually.
  - Mutation errors are console-only (no user-facing toast) — acceptable for beta, should add before launch.
  - All 6 performance standards from team audit are implemented: React Query, named columns, lazy routes, dynamic seed import, component decomposition, count queries.
  - Zero `select('*')` calls remain. Zero raw useEffect data fetching patterns remain.

### 2026-07-17: PR Merge Batch (#9, #12, #15)

- **PR #12** (dry_shampoo category + Acure Dry Shampoo): Clean, minimal diff. Added category to type, constants, copilot instructions, and one seed product. Merged immediately. Issue #10 auto-closed.
- **PR #15** (custom brand ingredient matching): Substantial feature — hero ingredients, onboarding step 7, custom brand recommendation tier. Had significant conflicts with React Query migration (pre-#13 code). Rebased and reconciled: adapted useState/useEffect patterns to use existing React Query hooks (useProducts, useUserProfile, useUserReviews) and useMemo. Merged. No associated issue.
- **PR #9** (B&B Curl Cream + brand scan pipeline): Larger scope than title suggests — includes brand scan workflow, Supabase edge functions, email notifications, and copilot instructions. Had conflicts in seedProducts.ts, Recommendations.tsx, RequestProductForm.tsx, and copilot-instructions.md. Resolved by keeping HEAD's React Query architecture and image sourcing policy, adding PR's brand scan instructions and new infrastructure. Dropped requestedProducts feature from Recommendations (used old useState pattern — needs re-implementation with React Query hooks). Merged. Issue #8 auto-closed.
- **Key decision:** When PRs conflict with architectural migrations (React Query), resolve by adapting incoming code to the new architecture rather than reverting the migration. Drop features that can't be cleanly adapted and flag them for re-implementation.

### 2026-05-01: Toast System Wired by Frenchy
- Frenchy completed toast notification system addressing Sandy's code review note #2. All 7 mutations wired (ProductDetail, Products, Recommendations, OnboardingWizard). Convention established: all future mutations must include success/error toast feedback. Build/tests clean.

### 2026-05-01: TikTok Hair Routine Integration — Legal Analysis
- **Request:** Shari asked if Scrunch can integrate viral TikTok hair routine content (Abbey Yung / #HairTok) without legal risk.
- **Legal findings:**
  - ✅ **Product names** (K18, Olaplex, Redken) are factual data, not copyrightable. Descriptor use is fair use. Safe to catalog.
  - ✅ **Influencer mentions & routine references** are safe if paraphrased (functional instructions, not creative expression copied).
  - ✅ **Attribution is essential** — transforms relationship from "plagiarism" to "curation." Credit the creator on every view.
  - ❌ **Video/images/media** are copyright-protected. Never embed, screenshot, or host creator media without written permission.
  - ❌ **Implied endorsement** is risky. Never say "Abbey Yung endorses Scrunch" unless explicitly stated. Use "as featured in" instead.
- **Safe approach:** Build "Trending on TikTok" collection with routine descriptions + product links + creator attribution links. Zero media reproduction.
- **MVP roadmap:**
  - Phase 1 (1-2 days): Mock data, Abbey Yung routine, TrendingRoutines.tsx component, sidebar nav
  - Phase 2 (2-3 days): Supabase schema + CRUD, scale to 5-10 routines, admin panel
  - Phase 3 (optional): Community submissions + moderation
- **Prohibited:** Never host creator videos, use their images, copy captions, combine routines without permission, imply endorsement, or scrape #HairTok content.
- **Decision:** APPROVED. Written analysis uploaded to `.squad/decisions/inbox/sandy-hairtok-integration.md` with full legal summary, checklist, and sample routine.
- **Next:** Shari approves, assign Phase 1 to Frenchy (frontend) for MVP launch.

### 2026-05-01: #HairTok Content Integration — Legal Framework & Implementation Roadmap

**Request:** Analyze legal risks for integrating influencer content (routines, product mentions) from #HairTok creators. Define safe practices and phased implementation.

**Legal Analysis:**

✅ **SAFE (Green Light):**
- Product names/data in catalog — Factual, not copyrightable; descriptive fair use
- Routine descriptions — Functional instructions (own words), not creative works
- Influencer attribution — Proper credit + links mitigate all risk
- Links to TikTok videos — Drives traffic; creator-approved practice

❌ **HIGH RISK (Red Flags):**
- Video/image reproduction — Copyrighted; requires written permission
- Implied endorsement ("She recommends Scrunch") — False advertising liability
- Copy-pasted captions — Derivative work; paraphrase instead
- Combining routines without attribution — Derivative work infringement

**Decision: Approved** — Scrunch can build "Trending on TikTok" feature with attribution-first approach.

**Phased Implementation:**

**Phase 1 (MVP): Week 1 — 1-2 engineer-days**
- Component: TrendingRoutines.tsx
- Content: Abbey Yung's 5-step routine (manually transcribed from video)
- Links: Each step links to 2-3 products in existing catalog
- Navigation: "Trending on TikTok" section in sidebar
- No backend changes; mock data

**Phase 2 (Scale): Week 2-3 — 2-3 engineer-days**
- Schema: routines + routine_steps + routine_step_products tables (Supabase)
- Admin UI: CRUD for Shari to add/edit/remove routines
- Badge: "As Seen On" on product cards
- Support: 5–10 routines

**Phase 3 (Community): Month 2+ — Optional 3-5 days**
- User submissions + moderation queue
- Contributor attribution

**Attribution Checklist (MVP):**
- Creator name + username visible on every routine
- Link to original TikTok (working, tested)
- Routine steps paraphrased in own words
- No video embeds, screenshots, or images without permission
- "As featured in" positioning (not "endorsed by")
- Product links accurate and verified

**Outcome:** Legal approval granted. Phase 1 MVP roadmap created. Ready for dev assignment (Frenchy for frontend, Danny for Phase 2 backend).
