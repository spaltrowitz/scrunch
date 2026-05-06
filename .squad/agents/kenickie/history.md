# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Core Context

**Product Strategy & Persona Work (completed):**
- Final 4 personas: Newbie (P0), Store Scanner (P0), Budget Builder (P1), Optimizer (P1)
- Homepage CTA consolidation: Ingredient Checker = primary action (fastest aha moment, zero friction)
- Invisible onboarding philosophy: No gates before value; infer persona from behavior or defer profiling until after 3 product views
- Acquisition channels: Reddit/TikTok for Newbie/Budget/Optimizer; Google SEO for Store Scanner
- MVP scope: ALPHA (static JSON) → BETA (Reddit post, SEO pages) → LAUNCH (80% image coverage, ingredient justification)
- Beta sprint: Merge 3 PRs immediately; defer Apple Sign-In, route prefetching to post-launch
- Success metrics: Image ≥80%, SEO landing pages for top 20 products, invisible onboarding adoption rate

**Key Decisions:**
- Ingredient Checker = PRIMARY CTA; Products + Community = Secondary; Recommendations = Tertiary (lower friction)
- Store Scanner persona requires SEO landing pages for "[product name] curly girl approved" discovery
- Lean ship philosophy: 280 products + existing auth + invisible onboarding sufficient for Beta
- Community validation (Reddit r/curlyhair outreach) is table-stakes for credibility

**Owner Preferences (learned):**
- Single primary CTA beats dual CTAs for new visitor conversion (decision paralysis prevention)
- Zero-friction value (Ingredient Checker) > gated features (Recommendations form) on first impression
- Community-first growth strategy aligns with persona overlap and team resources

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

**Key insight:** Ingredient Checker is what only Scrunch does (Reddit can't do this). It should be unmissable, not a feature in a grid.

**Metrics to track:** Hero CTA click rate vs. old baseline; new → account conversion; repositioned Recommendations engagement.

### 2026-05-06: Adoption Analysis & Mission Clarity — Kenickie

**Session:** 2026-05-06T19-24

**What:** Analyzed Scrunch adoption barriers and messaging gaps. Ranked three critical concerns:
1. **"What is this?" (CRITICAL)** — Homepage doesn't explain differentiator vs. Reddit/CurlScan/IsItCG. New users bounce without understanding value.
2. **Undifferentiated value prop (HIGH)** — Unique strengths (personalization, all-in-one, ad-free, built by curly-haired founder) invisible on landing page.
3. **Unclear first-visit flow (HIGH)** — New visitor sees 400+ products or trending #HairTok; no clear next action or signal that signup = personalized value.

**Key Recommendations:**
- **Mission:** "Give curly and wavy hair people the personalized product guidance and community wisdom they need to find products that actually work for *their* hair."
- **Tagline:** "Get personalized product recommendations based on your hair, not just trends."
- **3 Quick Wins:** (1) Add hero sub-heading (1h, high impact), (2) Reword CTA to "Create Your Hair Profile" (5m, high impact), (3) Add "How It Works" section (2h, high impact).

**Competitive Analysis:**  
Documented how Scrunch differs from CurlScan (ingredient checker), IsItCG (quick CG scoring), r/curlyhair (community recommendations), Yuka (health scoring). Scrunch's all-in-one + personalization is undermarketed.

**Outcomes:**  
Comprehensive adoption analysis with implementation roadmap (P0/P1/P2 priority matrix, effort estimates). Flagged three questions for owner: target persona (beginner vs. expert), primary differentiator priority, signup friction strategy.

**Status:** Recommendation. Awaiting Shari review & clarification questions.
