# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings
- Project is pre-development (no src/ directory yet). Only squad setup and IMAGE_SOURCING_STRATEGY.md exist.
- Product database has 108+ products planned, sourced from brands popular in r/curlyhair community.
- Core value proposition: CG-approved product database for curly hair community.
- Key brands: SheaMoisture, DevaCurl, Mielle, Pattern, Cantu, Jessicurl, Ouidad, Giovanni, Kinky-Curly, Innersense.
- Image sourcing strategy covers Shopify stores, Open Beauty Facts (CC-BY-4.0), brand CDNs, and direct outreach.
- Community roots: r/curlyhair subreddit, CGM (Curly Girl Method) practitioners.
- User persona workshop initiated 2026-04-30; awaiting Shari's input on primary use case (CHECK vs DISCOVER).
- 2025-07-24: Shari confirmed Scrunch is "discovery-first with checking built in." Users come to FIND products, compliance verification is secondary.
- 2025-07-24: Refined to 5 personas: The Newbie (CGM beginner), The Ingredient Detective (informed switcher), The Budget Builder (cost-conscious), The Routine Refiner (experienced), The Store Scanner (in-aisle checker).
- P0 personas: Newbie + Store Scanner. P1: Budget Builder + Ingredient Detective. P2: Routine Refiner.
- UX implication: Homepage should lead with browsing/categories, not a search bar. Filters are the killer feature.
- 2025-07-24: Shari confirmed Ingredient Detective and Routine Refiner overlap significantly — merged into "The Optimizer" (P1). Final persona count: 4.
- The Optimizer combines: granular ingredient filtering (from Detective) + ongoing experimentation and tracking (from Refiner). Unified by the behavior of an experienced user who actively tweaks.
- Age demographic question still open — critical for visual tone, copy voice, and platform assumptions.
- 2025-07-24: Onboarding goal capture spec written. Key insight: the real value is identifying Newbies — they're most vulnerable to overwhelm. The "I don't know" case maps to a playful "explore" mode that's actually a great default experience.
- Onboarding should be a soft interstitial (not a gate), work for anonymous users, and persist to Supabase on account creation. P1 priority — not blocking MVP.
- Three options is the sweet spot: new to curly care / want new products / just browsing. Avoids quiz fatigue while capturing the one signal that matters (new vs. not-new).
- Implicit graduation > explicit re-selection. Track filter behavior to naturally evolve users from Newbie → Discover without making them re-answer.
- 2025-07-24: REVISED onboarding approach — "invisible onboarding." Previous interstitial spec killed. New principle: no gates before value. Three strategies replace the interstitial: (1) INFER persona from browse behavior silently, (2) DEFER any explicit question until after 3 product detail views, (3) EMBED personalization as subtle sort/filter/badge changes within the existing browse UX.
- Key learning: behavior signals are more honest than self-reporting. A Newbie often can't self-identify, but their click patterns (browsing categories, tapping "What is CGM?") reveal them clearly.
- Inference-only may be sufficient — recommendation is to ship without explicit question first, add it only if data shows too many users stuck in generic bucket after 2+ sessions.
- The app must work great with ZERO personalization. Personalization is enhancement, not dependency. This aligns with "validate core loop before adding features" principle.
- 2025-07-24: Acquisition channel analysis complete. Key finding: 3/4 personas (Newbie, Budget, Optimizer) overlap on Reddit r/curlyhair + TikTok. The Store Scanner is the outlier — they arrive via Google SEO ("is [product] CG approved?"), not social browsing.
- 2025-07-24: V1 scope definition written (3 tiers: ALPHA → BETA → LAUNCH). Key learnings from scoping exercise:
  - ALPHA can ship with static JSON and zero backend — 108 products in a filterable grid is enough for friend feedback.
  - The Reddit post (BETA) is the real forcing function. It requires: shareable URLs with OG previews, search, and a product request form. These are the credibility minimums for a community that scrutinizes tools.
  - Image gap is the #1 risk: 36% coverage today, need 80%+ for LAUNCH. Image sourcing must run in parallel with dev from day 1.
  - CG classification accuracy is the #2 risk: one wrong call on Reddit destroys trust. Ingredient-level justification (not just pass/fail) is a LAUNCH requirement.
  - Service worker for offline use (Store Scanner in-aisle) is aspirational for LAUNCH — may defer post-launch depending on timeline pressure.
  - Estimated ~6 weeks from first commit to public launch. ALPHA could ship in 2-3 days if someone starts coding now.
- Marketing implication: ONE core strategy (Reddit + TikTok community presence) plus ONE supplement (SEO product pages) covers all 4 personas. No need for 4 separate channel strategies.
- Store Scanner = SEO persona. They Google mid-shopping-trip. Every product in our DB should have a rankable landing page for "[product name] curly girl approved."
- Reddit r/curlyhair is the single highest-overlap channel. All 4 personas visit it, though for different reasons (Newbies ask questions, Optimizers debate ingredients, Budget asks for dupes, Scanners ask "is X approved?").
- TikTok skews younger/newer — strong for Newbies and Budget Builders, weak for Optimizers who prefer long-form content (YouTube, forums).
- Product Hunt and Naturally Curly forums are niche channels primarily relevant to the Optimizer persona.
- NOT worth early investment: Instagram (low intent), Pinterest (slow burn), Facebook groups (hard to market in), paid ads (premature).
- **2026-05-01: Beta Sprint Prioritization Complete**
  - **Open PRs status**: 3 PRs ready (PR #15 custom brand finder, PR #12 dry shampoo, PR #9 B&B curl); no blockers found. Sandy approved Alpha PR (#13) with 6 minor non-blocking code notes.
  - **Core decision**: Merge all 3 PRs immediately. High-effort items (Apple Sign-In, SEO landing pages, invisible onboarding, community integration) are Tier 2 (next 1–2 weeks), not blockers. Defer Google Sign-In, route prefetching, AuthProvider optimization to post-launch.
  - **Beta launch strategy**: Lean ship (280 products, existing auth, invisible onboarding, SEO pages for top 20 products). Toast feedback + Apple Sign-In earn user trust in first week. Do not add complexity before launch.
  - **Success hinges on**: (1) Image coverage ≥80% (currently met), (2) SEO landing pages for Store Scanner persona (Google searchers), (3) Invisible onboarding removing friction for Newbies, (4) Reddit community outreach in week of launch.
  - **Risk mitigations**: Sandy spot-checks PR #15 ingredient matching logic. Parallel async product sourcing (image coverage). Monitor Google Search Console for organic traffic post-launch.
  - **Key insight**: Store Scanner persona is ONLY persona arriving via Google SEO. All other 3 personas (Newbie, Budget, Optimizer) arrive via Reddit/TikTok/social. Prioritize SEO pages for differentiation, but community outreach is still table-stakes.
  - **Parallel workstreams recommended**: Sandy (auth + PRs), Frenchy (invisible onboarding + Recommendations decomposition), Cha-Cha (bundle monitoring), Shari (community outreach + image sourcing).
  - **Post-Beta roadmap**: Personalized category ordering, advanced community features (Discord, Reddit auto-posts), route prefetching, technical debt cleanup.

### 2026-05-01: Homepage CTA Priority Decision — Kenickie

**Context:** Shari flagged too many CTAs on homepage with 3 overlaps:
- Hero "Explore Products" + Products Teaser "See All Products" → same destination
- Ingredient Checker appears twice (Feature box + bottom section)
- Recommendations positioned equal to discovery but gated behind hair profile form

**Problem:** First-time visitor from Reddit/TikTok doesn't know what to do first.

**Analysis:**
- Fastest aha moment = **Ingredient Checker** (15 sec: paste label → instant pass/fail) vs. Product Discovery (need filters + context)
- Zero friction = **Ingredient Checker** (no account, no onboarding) vs. Recommendations (3–5 min form required)
- Aligns with invisible onboarding: "No gates before value"
- Newbie personas (P0) are most vulnerable to overwhelm

**Decision: Ingredient Checker = PRIMARY CTA**
- **Hero button:** "Explore Products" → "Check Ingredients Now" (unmissable, builds trust on first impression)
- **Feature grid (2 boxes):** Products + Community (removes Ingredient Checker duplicate + Recommendations)
- **Products teaser:** Remove "See All Products" CTA (consolidates with hero)
- **NEW section below #HairTok:** "Ready to get personalized?" → Recommendations repositioned as future value unlock

**Rationale:** Visitor flow: Test (Ingredient Checker) → Trust → Explore (Products) → Community → Personalize (Recommendations later). Removes decision paralysis. Unique differentiator (Ingredient Checker) moves from buried feature to hero.

**Spec:** Full CTA audit + implementation instructions → `.squad/decisions/inbox/kenickie-homepage-cta-priority.md` (6.2KB doc for Frenchy)

**Key insight:** Ingredient Checker is what only Scrunch does (Reddit can't do this). It should be unmissable, not a feature in a grid.

**Metrics to track:** Hero CTA click rate vs. old baseline; new → account conversion; repositioned Recommendations engagement.
