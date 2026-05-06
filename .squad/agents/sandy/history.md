# Sandy — History

## Key Patterns & Corrections

### Ship-Readiness Assessment
- **App state:** 14 pages, 280 products, auth (email+Google), recommendations engine, ingredient checker, onboarding wizard, product request workflow. Deployed to GitHub Pages via CI/CD.
- **Key gap:** Homepage was ingredient-checker-forward but team decided discovery-first. 109/280 products missing images (at time of audit).
- **Architecture:** HashRouter for GH Pages SPA. Supabase anon key hardcoded as fallback (acceptable for public read-only). Product data in seedProducts.ts (fallback) + Supabase products table. localStorage for guest state.
- **Not built:** Routine Builder, Education Hub, AI ingestion pipeline, admin tooling, Apple Sign-In, environmental stressor dashboard.

### TypeScript 6 + Supabase
- Supabase-js v2.104+ with TS6: `select('*')` returns `never` unless Database type includes Views, Functions, Relationships fields.
- Pragmatic fix: `(data as unknown as Product[])` — pattern already used in Recommendations.tsx.
- `noUnusedLocals: true` catches dead code. Prefix `_` does NOT suppress in TypeScript.
- Vitest in vite.config.ts requires `/// <reference types="vitest/config" />`.

### PR Reviews & Merges
- **PR #13:** Full review (65 files, 16,671 insertions). 13 `as unknown as` casts acceptable (Supabase+TS6). Zero `select('*')`, zero raw useEffect data fetching. APPROVED.
- **PR merge batch (#9, #12, #15):** When PRs conflict with architectural migrations (React Query), adapt incoming code to new architecture. Drop features that can't be cleanly adapted — flag for re-implementation.
- **Toast convention established:** All mutations need success/error toast feedback. Frenchy wired all 7.

### TikTok/HairTok Legal Framework
- ✅ **Safe:** Product names (factual data), paraphrased routine descriptions, influencer attribution + links.
- ❌ **High risk:** Video/image reproduction, implied endorsement ("She recommends Scrunch"), copy-pasted captions, combining routines without attribution.
- **Approach:** "Trending on TikTok" collection with routine descriptions + product links + creator attribution links. Zero media reproduction. "As featured in" positioning.
- **Attribution checklist:** Creator name + username visible, link to original TikTok, paraphrased steps, no media, accurate product links.

### Performance Audit
- **Build:** 816KB total, 27 chunks (healthy splitting). Main: 210KB (65KB gzip), supabase-js: 228KB (63KB gzip), seedProducts: 74KB (15KB gzip).
- **Critical finding:** Static `import { SEED_PRODUCTS }` used for placeholderData at module scope defeats lazy-load optimization. The dynamic `import()` only used as queryFn fallback.
- **Auth loading gate:** `if (loading) return null` in App.tsx = blank screen during Supabase `getSession()` (1-3s on free tier).
- **Confidence: 7/10.** Fast for return visitors. First-visit/cold-start has 2-3 real issues.

### Supabase vs Self-Hosted Analysis
- **Recommendation:** Phase 1 offline-first (seed data, client-side, $0) → Phase 2 Supabase Pro ($25/mo) when validated. Cold-start only affects first load after inactivity. Seed data renders instantly under the blank screen.

## Cross-Project Lead Knowledge (injected 2026-05-02)

### From EatDiscounted (Keaton)
- **Rate limiting critical** for public endpoints with quota-limited APIs. Response caching multiplies capacity 10-50x.
- **Accessibility from day one.** Retrofitting harder than building in.
- **VPS simpler than Vercel** for SSE/streaming side projects.

### From MyDailyWin (Revali, alumni)
- **Code duplication kills maintenance:** 65+ functions across 3 files. Consolidation eliminated ~4,400 lines.
- **Firestore security trap:** `request.auth != null` = any authenticated user modifies any data.
- **innerHTML security:** Sanitization must be shared, not per-file.
- **Service worker:** Static CACHE_NAME = stale forever.

### From Slotted (Toph, alumni)
- **Backend monolith:** 8,371 lines / 87+ endpoints = biggest velocity bottleneck. Split before scaling.
- **Security (5 critical):** Plaintext tokens, data leaking between users, hardcoded PII, RCE vuln, RLS without policies.
- **RLS without policies = false security.** Token encryption: Supabase Vault. Race conditions: AFTER UPDATE trigger + FOR UPDATE lock.
- **Product design:** Privacy-first, soft social language, AI invisible, reduce friction at happy moments.

### From HealthStitch (Mal)
- **Cross-platform:** Web + native iOS sharing same backend — decisions must serve both.

### Inherited from Kenickie (Strategist)
- **4 personas:** Newbie, Store Scanner, Budget Builder, Optimizer.
- **Discovery-first confirmed:** Users come to FIND products. Ingredient Checker = PRIMARY CTA (15 sec to aha). Visitor flow: Test → Trust → Explore → Personalize.
- **Store Scanner is ONLY persona via Google SEO** — product pages need SEO landing pages.
- **Principles:** Scope discipline, "default is NO", complexity-is-cost, fastest aha moment = primary CTA.

### Homepage Enrichment Strategy (2026-05-06)
- **Mandate:** Close adoption gap ("What is this?" problem, lack of differentiation signal, unclear visitor flow)
- **Approach:** 6-section homepage enrichment strategy with education-first positioning
- **Key recommendations:** Enhanced hero sub-heading (answers value prop + positions differentiation), "How It Works" 3-step explainer, "Why Scrunch?" differentiation cards, HairTok repositioning, optional "Getting Started" section, "About Our Data" transparency section
- **Rationale:** Visitor flow sequential messaging (What → Why → How). Hero sub-heading positions: personalization + ad-free + science-backed vs. TikTok/Reddit/CurlScan
- **Implementation:** Frenchy (Frontend) implemented sections 1-4 directly in Home.tsx. TypeScript clean, build validated.
- **Status:** Decision written to decisions.md, orchestration log created

## Session Archive Summary

Sandy completed 9+ sessions: ship-readiness audit (14-page assessment), PR #13 full code review (65 files, APPROVED), PR merge batch (#9/#12/#15 with conflict resolution), TikTok legal analysis (safe practices defined, 3-phase roadmap), performance audit (static import optimization, auth loading gate), Supabase vs self-hosted analysis (phased recommendation), toast convention establishment, product strategy integration from Kenickie, and homepage enrichment strategy (adoption-gap closure). Key role: architectural gatekeeper and strategic lead ensuring React Query migration consistency and product clarity across all PRs.

## 2026-05-06: Homepage UX Analysis (3 Personas)

- Analyzed Reddit r/curlyhair lurker, TikTok scroller, and frustrated beginner personas against current homepage
- Identified 3 conversion blockers: (1) Hero copy lacks trust signals, (2) Ingredient checker hidden, (3) No beginner guidance
- Recommended prioritized changes: hero reframe (copy), beginner collection (high-value, low-effort), ingredient teaser (deferred to sprint 2)
- Key insight: Homepage answers "what is Scrunch?" but not "why should I use it right now?"
