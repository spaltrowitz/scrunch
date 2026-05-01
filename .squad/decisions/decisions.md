# Decisions

## Invisible Onboarding — Revised Spec

**Author:** Kenickie (PM)  
**Secondary Author:** Jan (Product Designer)  
**Date:** 2025-01-30  
**Priority:** P1  
**Status:** Draft — awaiting Shari's review  
**Supersedes:** Previous onboarding goal-capture spec (pre-browse interstitial with 3 cards); Jan's earlier bottom-sheet proposal

### Governing Principle

**No gates before value.** The homepage shows browsable products immediately. Onboarding is not a step — it's the browse experience itself, gradually learning who you are.

Previous spec proposed a "What brings you to Scrunch?" interstitial before browse. That's dead. The new model: show products first, personalize second.

---

### How It Works

#### Phase 0: Immediate Value (no personalization)

The app works great with zero personalization. This is the baseline and it must be excellent on its own.

- Homepage shows curated product grid (editorial picks, community favorites, new arrivals)
- All filters available immediately (category, hair type, price, ingredients, CG-approved)
- Search works immediately
- No sign-up required to browse
- No modals, no interstitials, no "tell us about yourself"

**P0 requirement:** The app is fully functional and delightful at this stage. Everything below is enhancement, not dependency.

##### Zero-State Homepage (First Visit)

The homepage must be useful for ALL personas with zero context about the visitor.

**Layout (top → bottom):**
1. **Header** — App name, search icon, filter icon
2. **Category chips** (horizontal scroll) — "All", "Shampoo", "Conditioner", "Styling", "Deep Treatment", "Accessories"
3. **Hero section** — "Popular This Week" — 6-8 products sorted by community engagement (favorites, reviews). No algorithm needed — raw popularity works for everyone.
4. **"Staff Picks" row** — Curated editorial picks (3-4 products). Rotates weekly. Gives the feed a human, trustworthy feel.
5. **"Curly Girl Approved" section** — Products with CGM-approved badge. Serves Newbies (who need safety) AND Optimizers (who respect the methodology).
6. **"Under $15" row** — Addresses Budget Builders without requiring any profiling.
7. **Browse by brand** — Logo grid. Serves Store Scanners who think in brand terms.

**Design Principles:**
- Every section is useful to at least 2 personas
- No section requires personalization to be valuable
- The page feels full and curated, not empty or generic
- Product cards always show: name, brand, price, CGM badge (if applicable), star rating

---

#### Phase 1: INFERRED Persona Detection (silent)

Watch behavior. Map signals to personas. Never interrupt.

| User Behavior | Inferred Persona | Confidence |
|---|---|---|
| Browses by category (shampoo, conditioner) without filtering | Newbie | Medium |
| Taps "CG-approved" badge explanation or "What is CGM?" | Newbie | High |
| Searches a specific product name | Store Scanner | High |
| Scans/photographs a product (future feature) | Store Scanner | High |
| Uses price filter or sorts by price | Budget Builder | Medium |
| Browses "drugstore" or budget category | Budget Builder | Medium |
| Uses ingredient filter or porosity filter | Optimizer | High |
| Uses multiple advanced filters in combination | Optimizer | High |
| Reads full ingredient lists on product pages | Optimizer | Medium |

**Confidence thresholds:**
- Single medium signal = store but don't act
- Two medium signals or one high signal = begin soft personalization
- Multiple high signals = full personalization active

**Storage:** Local-first (localStorage). Persists to Supabase profile on account creation.

##### Behavioral Personalization (No Questions Needed)

The app learns from actions and subtly adapts. Users never need to answer anything for this to work.

**Signals We Track:**

| Action | What we infer | How the UI shifts |
|--------|--------------|-------------------|
| Taps 3+ CGM-approved products | Cares about ingredient safety | "Curly Girl Approved" section moves up, gets more items |
| Uses price filter repeatedly | Price-sensitive | "Under $X" section appears/moves up; sort defaults to price-low |
| Searches/taps same brand 2+ times | Brand-loyal or in-store | "More from [Brand]" section appears; brand pinned in chip bar |
| Favorites 3+ products in one category | Category preference | That category defaults to first chip; "New in [Category]" section appears |
| Views product details but doesn't favorite | Browsing/comparing | "Compare similar" nudge appears on detail pages |
| Returns 3+ times without any action | Possibly lost/overwhelmed | "New to curly hair?" helper surfaces (see safety net) |

**Adaptation Rules:**
- Changes are **additive** — we add/reorder sections, never remove content
- Changes happen **between sessions**, never mid-browse (no jarring shifts)
- Maximum 2 behavioral sections added per visit (avoid overwhelming)
- All behavioral sections have a subtle "Why am I seeing this?" tooltip → "Based on products you've viewed"

---

#### Phase 2: EMBEDDED Personalization (woven into browse)

Once a persona is inferred, the experience subtly adapts:

| Persona | Sort Order | Featured Products | Filter Defaults | UI Hints |
|---|---|---|---|---|
| Newbie | "Community Favorites" first | Starter kits, highly-rated basics | CG-approved pre-selected | Show "Great for beginners" badges |
| Store Scanner | "Recently checked" + alternatives | Products from their searched brands | None changed | Show "Available at..." info prominently |
| Budget Builder | Price low→high | Drugstore picks, best value | Price range pre-set to budget tier | Show price-per-oz, "budget pick" badges |
| Optimizer | "New arrivals" + ingredient match | Products matching their filter history | Last-used filters remembered | Show ingredient deep-dives, comparison tools |

**Key:** These are nudges, not locks. User can always override. No "you're a Newbie so you can't see advanced filters."

##### Progressive Disclosure — What Reveals Over Time

**Visit 1 (Zero-state):**
- Full curated homepage
- All filters available
- No personalization visible

**Visit 2:**
- If they favorited anything: "Your Favorites" row appears at top
- Behavioral signals begin influencing section order (subtle)

**Visit 3:**
- If behavioral data exists: **"Based on what you've explored"** section appears
  - Shows 4 products algorithmically matched to their browsing pattern
  - Subtle label: "Picked for you · [Why?]"
- Deferred prompt eligible to trigger (if not already shown)

**Visit 5+:**
- Homepage sections reorder based on engagement (most-tapped categories rise)
- **"New for you"** section appears — fresh products in their preferred categories/price range
- If they answered the goal question: dedicated persona section (e.g., "Beginner-Friendly Picks" for 🌱)

**Visit 10+:**
- Full personalized homepage with option to "Reset recommendations" in settings
- "Your routine" section (if they've favorited across categories — shampoo + conditioner + styler)

---

#### Phase 3: DEFERRED Explicit Question (optional)

If we want to accelerate personalization, ask — but only after investment.

**Trigger:** After the user has viewed 3 product detail pages (not just thumbnails — they clicked in).

**Why 3 product views:**
- They've already gotten value (saw products, read details)
- They've demonstrated intent (not just a bounce)
- They're invested enough that a gentle question feels helpful, not intrusive
- 3 is enough to have context but early enough to improve their next 10 views

**Format options** (trigger points — pick ONE to ship first, A/B test later):

| Trigger | Prompt | Why it works |
|---------|--------|--------------|
| **After 3rd product tap** | Inline card in feed: "Enjoying browsing? Tell us your goal and we'll surface more of what you're looking for." | They've proven interest. The card appears IN the content stream, not over it. |
| **After first filter use** | Subtle banner below filters: "Want us to remember this? We can personalize your homepage." | They just told us something — we're offering to act on it. |
| **After first favorite** | Bottom toast: "Nice pick! Want more like this? Quick question →" | Emotional high moment. One tap to answer, feels like a reward. |
| **After first search** | Inline below results: "Looking for something specific? Let us know your hair goals for better recommendations." | They're actively seeking — we're offering to help. |

**Prompt Design Rules:**
- **Dismissible with one tap** (X or "no thanks")
- **Never shows again for 3 sessions** after dismissal
- **Never blocks content** — always inline or toast, never modal/sheet
- **Copy is benefit-first** — "we'll show you better stuff" not "help us help you"
- **If they answer:** one question, one tap (reuse the 5-emoji concept as a single inline selector, not a sheet)

**The Question (if they engage):**
- 🌱 Just starting my curly journey
- 🔍 Checking if products are safe
- 💰 Finding affordable options
- 🧪 Exploring new products to try
- 🤷 Just browsing

Answer maps to a personalization layer (see Phase 2).

---

### "I'm New" Safety Net

For Newbies who ARE lost — always available, never forced.

**Placement:**
- **Footer of homepage** (always visible on scroll-to-bottom): "New to curly hair? Start here →"
- **In search empty state**: "Not sure what to search? Here's a beginner's guide"
- **In filter panel** (collapsed section at bottom): "Not sure what these mean? Quick explainer"

**What it opens:**
A **non-modal page** (not a sheet, not a popup) with:
- "What is Curly Girl Method?" — 2-sentence explainer + CGM badge meaning
- "Ingredients to avoid" — simple list with why
- "Starter routine" — 3 curated products (shampoo, conditioner, styler) at budget-friendly prices
- "Browse by hair type" — links to filtered views (wavy, curly, coily)

**Design Principles:**
- Discoverable but not prominent — it's a safety net, not a gate
- Educational content, not onboarding flow
- User can jump back to browsing at any point
- No tracking/profiling implications — viewing this doesn't lock them into "newbie mode"

---

### Technical Considerations

**Storage:**
- Behavioral signals stored in localStorage (no account required)
- If user creates account later, signals merge into profile
- Expire behavioral data after 30 days of inactivity

**Performance:**
- Zero-state homepage is static/cached (fast first load)
- Behavioral sections load after initial paint (progressive enhancement)
- No server round-trip needed for first meaningful render

**Privacy:**
- All personalization is on-device until account creation
- "Clear my data" option in settings
- No fingerprinting — if localStorage is cleared, we start fresh (that's fine)

---

### What This Replaces

| Previous Spec | This Spec |
|---|---|
| Pre-browse interstitial with 3 cards | No interstitial. Products shown immediately. |
| Asks intent before showing value | Infers intent from behavior |
| "What brings you to Scrunch?" modal | Inline optional question after 3 product views or first engagement trigger |
| Persona assigned at onboarding | Persona evolves continuously from behavior |
| Binary: asked or not asked | Gradient: confidence builds over time |
| Bottom sheet on first visit with 5 emoji goals | Zero-state homepage, immediate value |
| Ask-then-personalize | Observe-then-personalize |
| One-time profiling question | Continuous behavioral learning |
| "Skip" as escape hatch | No gate to escape from |
| Re-ask after 3 sessions | Deferred inline prompt after demonstrated engagement |

---

### Success Metrics

- **Time to first meaningful action** < 5 seconds (tap a product)
- **Time to first product tap** — should decrease (no gate before content)
- **Session 2 return rate** — should increase (value delivered on visit 1)
- **Bounce rate** lower than interstitial version (A/B if we ever test)
- **Inference accuracy** > 70% match to explicit selection (when users do answer)
- **Personalization adoption** — % of users reaching "high confidence" persona within 2 sessions
- **Deferred prompt acceptance rate** — target 30%+ (because we ask at the right moment)
- **Behavioral personalization engagement** — do personalized sections get higher tap rates than generic ones?

---

### Implementation Notes

- P1 priority — ship the app without any personalization first (P0)
- Inference engine is a lightweight state machine, not ML
- All personalization is reversible and overridable
- No personalization data shared or sold — it stays on-device until account creation
- Implicit graduation still applies: Newbies who start using advanced filters naturally evolve to Optimizer without any prompt

---

### Open Questions

1. Should the deferred question trigger on 3 product views or first filter use (whichever comes first)?
2. Do we show a "we noticed you like X" confirmation, or just silently adapt?
3. How do we handle users who exhibit signals from multiple personas? (Likely: weight by recency)
4. Should the deferred prompt trigger differ by persona signal? (e.g., if they're clearly a Store Scanner via search behavior, skip the prompt entirely and just adapt?)
5. How many behavioral sections is too many? Start with max 2, test up to 4?
6. Do we need an explicit "turn off personalization" toggle for privacy-conscious users, or is "Clear my data" sufficient?

---

## Acquisition Channel Map by Persona

**Author:** Kenickie (PM)  
**Date:** 2025-07-24  
**Priority:** P1  
**Status:** Analysis — informs acquisition strategy

### Key Finding

**Mostly yes, but with different entry points.** All four personas overlap heavily on Reddit r/curlyhair and TikTok #curlyhair — but they're doing *different things* there. The Store Scanner is the outlier: they're more likely to find us via Google search mid-shopping trip than from social browsing. This means **one core community presence** (Reddit + TikTok) covers 3/4 personas, but we need a separate **SEO play** to capture Scanners.

### Strategic Recommendation

**Answer: One core + one supplement.**

#### Core Strategy: Reddit + TikTok Community Presence
- Covers: Newbie, Budget Builder, Optimizer (3/4 personas)
- Tactic: Be genuinely helpful in r/curlyhair. Link Scrunch when it answers someone's question. Partner with TikTok creators for "routine builder" content.
- Why it works: These personas are *already in community* looking for product guidance. Scrunch solves a problem they're actively discussing.

#### Supplement: SEO Content Play
- Covers: Store Scanner (+ helps all others)
- Tactic: Create SEO-optimized product pages that rank for "[product name] curly girl approved." Every product in our database should have a landing page.
- Why it works: Scanners Google in the moment. If Scrunch is the top result for "is Garnier Fructis Pure Clean CG approved?" — we've captured them at peak intent.

### Priority Actions for Launch

1. **Create 20 SEO product pages** for the most-Googled "is [X] CG approved" queries → captures Scanners
2. **Engage authentically in r/curlyhair** for 4-6 weeks pre-launch → builds trust with Newbies, Budgets, Optimizers
3. **Partner with 2-3 mid-tier TikTok curly creators** (10K-100K followers) for "routine builder" content → Newbies + Budget
4. **Launch on Product Hunt** → Optimizers + tech-curious crossover audience
5. **Post launch thread in r/curlyhair** (many apps have done this successfully — the sub loves tools)

---

## V1 Ship Definition — Scrunch

**Author:** Kenickie (PM)  
**Date:** 2025-07-24  
**Status:** PROPOSED — awaiting Shari's approval  
**Context:** Pre-development. No src/ exists. 108 products planned (39 images verified, 69 missing). Stack: React 19 + TypeScript + Vite + Tailwind 4 + Supabase. Deploy: GitHub Pages.

### Locked Constraints (non-negotiable)

1. Discovery-first with checking built in
2. 4 personas: Newbie (P0), Store Scanner (P0), Budget Builder (P1), Optimizer (P1)
3. Invisible onboarding — products first, no gates before value
4. No user-uploaded images for v1 (placeholders for missing)
5. No brand outreach for v1
6. Age is not a differentiating axis
7. Two acquisition funnels: community (Reddit/TikTok) + SEO

### V1-ALPHA — Internal / Friends Testing

> *"Can 10 friends open this and tell me if the concept makes sense?"*

#### Features IN scope (must work)

- [ ] Product browse grid — shows all products with images or placeholders
- [ ] Basic filtering: by category (shampoo, conditioner, gel, etc.) and CG status (approved/not/caution)
- [ ] Product detail page — name, brand, category, CG status, key ingredients
- [ ] CG status badges (approved ✓ / not approved ✗ / caution ⚠️)
- [ ] Mobile-responsive layout (friends will open on phones)
- [ ] Deployed to GitHub Pages (shareable URL)

#### Features OUT of scope (deferred)

- Search bar (browse-first philosophy — add when testers ask for it)
- Price data or budget filtering
- Product request flow
- Any personalization / invisible onboarding signals
- Account creation / Supabase auth
- SEO meta tags / individual product URLs for Google
- Ingredient-level filtering (Optimizer persona = P1)

#### Known compromises

- Only ~39 products will have real images; remaining 69 use branded color placeholders
- Product data is static JSON (no API, no Supabase yet) — that's fine for 10 users
- No analytics — feedback is qualitative (text friends, ask what they'd change)
- Filters may feel sparse with only 108 products — acceptable at this scale

#### Ship criteria

1. ✅ URL loads on mobile Safari + Chrome without errors
2. ✅ All 108 products render (images or placeholders)
3. ✅ Filtering by category and CG status works correctly
4. ✅ Product detail page shows accurate CG status + ingredients
5. ✅ A first-time user can find a CG-approved conditioner in <15 seconds
6. ✅ Shari has sent the link to 3+ people and it didn't crash

### V1-BETA — Soft Launch to r/curlyhair

> *"What needs to work for the first Reddit post to not be embarrassing?"*

#### Features IN scope (must work)

Everything from ALPHA, plus:

- [ ] Search bar (users will arrive with a specific product in mind from Reddit)
- [ ] Product detail pages with shareable URLs (`/product/shea-moisture-coconut-hibiscus-curl-milk`)
- [ ] "Is this CG approved?" quick-check flow (Store Scanner persona)
- [ ] Product request form — "don't see your product? request it" (captures demand signal)
- [ ] Ingredient list display with flagged problematic ingredients highlighted
- [ ] Basic SEO: page titles, meta descriptions, Open Graph tags for link previews
- [ ] Loading states and empty states that don't look broken
- [ ] Error boundary — graceful fallback if something crashes
- [ ] "About" or "What is CGM?" link for Newbies landing from Reddit

#### Features OUT of scope (deferred)

- User accounts / saved products / wishlists
- Invisible onboarding behavior tracking
- Price comparison or budget features
- Advanced ingredient filtering (protein-free, silicone-free subcategories)
- Analytics dashboard (but add Plausible or similar lightweight tracker)
- Product comparison view
- Routine builder

#### Known compromises

- Product request form submits to a simple Supabase table or even a Google Form — no admin UI yet
- Still ~69 placeholder images — Reddit users will notice and comment (this is fine — it shows the product DB is real, images are WIP)
- Data is still static or minimal Supabase — no real-time updates
- No moderation on product requests — manually review
- One community member will inevitably find an ingredient we've mis-classified — have a "report issue" escape hatch

#### Ship criteria

1. ✅ All ALPHA criteria still pass
2. ✅ Shareable product URLs render correct Open Graph previews when pasted in Reddit/Discord
3. ✅ Search returns relevant results for partial brand/product name
4. ✅ Product request form submits successfully and data is captured
5. ✅ Page loads in <2s on 4G connection (Lighthouse performance >70)
6. ✅ No console errors visible to a user who opens DevTools
7. ✅ "Is [product] CG approved?" question answerable in <5 seconds
8. ✅ Shari can post to r/curlyhair without cringing

### V1-LAUNCH — Public, GitHub Pages Live

> *"This is a real product people can rely on."*

#### Features IN scope (must work)

Everything from BETA, plus:

- [ ] Full product browse + all filters working (category, CG status, brand, hair type suitability)
- [ ] CG status checking with ingredient-level explanations ("contains dimethicone → not CG approved because...")
- [ ] Product request flow with confirmation email/message and status tracking
- [ ] All 108 product images resolved — real images where found, polished branded placeholders where not
- [ ] Individual SEO-optimized product pages (target: "[product name] curly girl approved" keywords)
- [ ] Lightweight analytics (Plausible/Fathom) — page views, top searches, product request volume
- [ ] "Report incorrect info" flow on every product
- [ ] Mobile-first responsive design polished (not just functional)
- [ ] Accessibility basics: keyboard navigation, alt text, color contrast
- [ ] Performance: Lighthouse >85 across all metrics
- [ ] Proper 404 page for dead links
- [ ] Favicon, Open Graph images, polished meta tags

#### Features OUT of scope (deferred to post-launch)

- User accounts and authentication
- Saved products / wishlists / personal routines
- Invisible onboarding personalization engine
- Price data integration
- Product comparison tool
- Push notifications or email digest
- Admin dashboard for product management
- Community features (reviews, ratings, tips)
- Brand partnerships or affiliate links
- Native mobile app

#### Known compromises

- Static site on GitHub Pages — no server-side rendering, limited dynamic capability
- Product data updates require a code deploy (acceptable at 108 products)
- No admin UI — Shari manually manages product DB in code/Supabase
- Placeholder images for ~20-30% of products (acceptable — branded and intentional-looking)
- Product requests go to a queue with no SLA — "we'll review it" messaging

#### Ship criteria

1. ✅ All BETA criteria still pass
2. ✅ Every product page is indexable by Google (test with Google Search Console)
3. ✅ At least 80% of products have real images (≥86 of 108)
4. ✅ Zero broken images or layout shifts from missing assets
5. ✅ All CG classifications have ingredient-level justification
6. ✅ Product request flow works end-to-end (submit → confirmation → appears in queue)
7. ✅ Lighthouse scores: Performance >85, Accessibility >90, SEO >90
8. ✅ Site works offline-ish (service worker caches product data for Store Scanner in-aisle use)
9. ✅ "Report incorrect info" submissions are captured and retrievable
10. ✅ Shari would put this link in her Twitter/LinkedIn bio

### Timeline Estimate (Kenickie's read)

| Tier | Effort | Realistic Timeline |
|------|--------|-------------------|
| ALPHA | ~2-3 days of focused dev | Week 1 |
| BETA | ~1-2 weeks additional | Weeks 2-3 |
| LAUNCH | ~2-3 weeks additional | Weeks 4-6 |

**Total to public launch: ~6 weeks** from first commit, assuming:
- 1 developer (Shari + Copilot squad)
- Product data already exists (108 products seeded)
- Image sourcing runs in parallel with dev

### Key Risks

1. **Image coverage** — Currently at 36%. Need 80%+ for LAUNCH. Image sourcing must start NOW in parallel with dev.
2. **CG classification accuracy** — One wrong classification on Reddit = credibility hit. Need ingredient-level source of truth, not manual tagging.
3. **Scope creep** — The temptation to add "just one more filter" before shipping ALPHA. Resist. Ship ugly, get feedback.
4. **SEO timeline** — Google indexing takes weeks. Product pages should exist by BETA even if not fully polished, so they start accruing authority.

### Decision Requested

Shari: Does this scope feel right? Specifically:
1. Is ALPHA minimal enough to ship this week?
2. Is there anything in BETA that should move to LAUNCH (or vice versa)?
3. Is the 80% image threshold for LAUNCH correct, or would you ship at 70%?
4. Service worker for offline Store Scanner — LAUNCH or post-launch?

---

## Ship-Readiness Audit — Scrunch

**Date:** 2026-04-30  
**By:** Sandy (Lead)  
**Requested by:** Shari Paltrowitz

### Executive Summary

**Overall verdict: 🟡 CLOSE but NOT shippable today.**

The app has strong bones — 14 pages, auth, product browsing, recommendations, onboarding, ingredient checker — but TypeScript errors block the build on the PR branch, ~109 of 280 products lack images, and the homepage still leads with ingredient checking rather than the decided "discovery-first" browse experience. Fixing the TS errors + merging PR #13 + image sourcing gets you to a soft launch.

### Feature Scorecard

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

### Code Quality

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

### Infrastructure

| Area | Status | Notes |
|------|--------|-------|
| **Supabase** | ✅ Configured | Real project URL + anon key hardcoded (not ideal but functional). RLS policies correct. |
| **GitHub Pages** | ✅ Working | HashRouter for SPA compatibility. Base path `/scrunch/` set correctly. |
| **Environment Variables** | 🟡 Hardcoded | Supabase URL + anon key are in source code as fallback defaults. Should use env vars in CI but won't break. |
| **Product Request Workflow** | ✅ Built (PR #13) | GitHub Actions validates + labels spam, Copilot instructions for research. Not yet merged. |
| **Image Strategy** | 🟡 In Progress | OpenBeautyFacts fallback + brand-owned URLs. 109/280 products still have no image. CDN compliance audit done (retailer URLs removed). |

### Blockers for V1 Launch

#### Must-fix (P0 — can't ship without these)

1. **Merge PR #13** — product request validation is ready, `mergeable_state: clean`. Just needs merge.
2. **Fix TypeScript errors** — 16 errors prevent build on the PR branch. The deployed main works, but any new merge will break CI.
3. **Product images** — 109 of 280 products show no image. Users will see a placeholder grid. Minimum: top 50 products should have images.

#### Should-fix (P1 — ship with caveats)

4. **Homepage doesn't match "discovery-first" decision** — Current homepage is ingredient-checker-forward. Decision says: "Homepage should show products immediately — zero friction before first value." Need to redesign hero to lead with browse/categories.
5. **Lint errors** — 17 lint errors include actual bugs (setState-in-effect can cause render loops). Fix at least the functional ones.
6. **Hardcoded Supabase credentials** — anon key in source is acceptable for public-facing apps, but URL should be env-var-only for flexibility.

#### Nice-to-have (P2 — ship without)

7. **Apple Sign-In** — Not built. Google + email is sufficient for V1.
8. **Routine Builder (F7)** — Schema ready, no UI.
9. **Education Hub (F8)** — Not started.
10. **Environmental stressor dashboard** — Cool feature from REQUIREMENTS but complex (needs API keys). Defer.
11. **Full 30-question onboarding** — Current wizard covers essentials. The full Prose-level quiz is P2.
12. **Community posting UI (F5)** — Reddit search works. Full Q&A board is P2.

### Ship-Readiness Score

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

### Recommended Path to Ship

1. **Fix TS errors on PR branch** (~1 hour) → merge PR #13
2. **Fix lint errors** (~30 min) — especially setState-in-effect bugs
3. **Source images for top 50 products** (~Danny's task, in progress)
4. **Redesign homepage** to lead with category browsing per decision (half day)
5. **Soft launch** to beta testers (r/curlyhair priority list from outreach PR #5)

**Estimated time to shippable: 1–2 days of focused work.**

---

## Image Sourcing Strategy — Audit Results

**Author:** Danny (Backend Dev)  
**Date:** 2025-07-24  
**Context:** Product database: 108 products total. 280 in current codebase (expanded scope).

### Phase 1: Open Beauty Facts + Brand CDNs

**Results:**
- Open Beauty Facts match: 23 products (21%)
- Brand Shopify CDNs: 14 products (13%)
- **Subtotal: 37 products (34%)**

### Phase 2: Deep Scan — Shopify products.json API

**Results:**
- Additional matches from Shopify product data: 22 products
- **Cumulative total: 61 products (56.5%)**
- **Remaining unfindable: 47 products (43.5%)**

### Sourcing Recommendations

For the 47 remaining products, options:

1. **Branded placeholder images** (recommended for V1) — brand color + product name + "image pending" badge
2. **Manual browser lookup** for high-priority products (top 20 by search volume):
   - SheaMoisture product line (popular, many have public product pages)
   - Giovanni lines (Websites often have product imagery)
   - Mizani products (Professional line, better CDN availability)
3. **Community contribution** (V2+) — user-submitted photos with moderation

### Key Findings

- **L'Oréal portfolio products** are hardest to source (proprietary CDN, no public Shopify)
- **Mass-market drugstore brands** often lack official CDN imagery (Sally's, CVS store brands)
- **Professional/salon brands** have better coverage (SheaMoisture, Carol's Daughter, Cantu)
- **DIY/indie brands** (Kinky-Curly, Miss Jessie's) have product imagery available but require manual lookup

### Strategy for Launch

- Use 61 real images (56.5%) for top-priority products
- Fallback to branded placeholders for 47 (43.5%)
- Flag placeholder products in DB for future manual sourcing
- Post-launch: community sourcing + occasional manual updates

---

## User Directives Captured (2026-04-30)

### No Brand Outreach for Images

**By:** Shari Paltrowitz (via Copilot)  
**Date:** 2026-04-30T14:46:00-04:00

**Decision:** DO NOT pursue direct brand outreach for product images. Phase 3 (emailing brands for image permission) is off the table.

**Rationale:** User preference — Shari does not want to pursue proactive brand contact as an image sourcing strategy.

### No User Uploads for V1 — Placeholders + Deferred Moderation

**By:** Shari Paltrowitz (via Copilot)  
**Date:** 2026-04-30T14:47:00-04:00

**Decision:** No user-uploaded images for v1. Use branded placeholders for products without images. Community upload feature is deferred to v2+ when moderation is in place.

**Risk Identified:** Users would screenshot retailer product pages without knowing about ToS/copyright restrictions. Hosting screenshotted retail imagery on our storage is a liability risk (copyrighted content).

**Rationale:** Legal risk mitigation — screenshots of retailer product pages would be copyrighted material hosted on our storage without permission.

---

### 2026-05-01T19:55:00Z: Homepage Design Reference — Prose.com

**By:** Shari Paltrowitz (via Copilot)  
**Date:** 2026-05-01T19:55:00Z

**What:** Use Prose (prose.com) as a design reference for the homepage — make it sleeker, more tied to the mission. Less clutter, more narrative.

**Status:** User directive captured for team memory.

---

### 2026-05-01T20:30:00Z: Community Search Feedback Loop

**By:** Shari Paltrowitz (via Copilot)  
**Date:** 2026-05-01T20:30:00Z

**What:** Community search results should ask 'Did this solve what you were looking for?' If not, prompt the user to post to the Scrunch community. This creates a feedback loop and drives community engagement.

**Status:** User directive captured. Danny implemented in community search beta fix.

---

### 2026-05-01: Homepage Performance — Lightweight Query Hook

**By:** Cha-Cha (Performance Optimizer)  
**Date:** 2026-05-01

**Decision:** Homepage uses separate lightweight `useHomeProducts()` hook instead of `useProducts()`.

**Spec:**
- Fetches only 7 columns (vs 22 full product columns)
- Limits to 20 rows
- Orders by review_count
- Shows bundled seed data instantly via `placeholderData`

**Why:** Full product query took 1.3s+ on Supabase free tier cold starts. Homepage only needs display fields for product cards. Seed data placeholder eliminates blank loading state.

**Trade-off:** Seed data (70KB) now loads with Home route chunk instead of only on error fallback. Accepted: instant perceived load > smaller bundle for landing page.

**Impact:** Products page, ProductDetail, and Recommendations still use `useProducts()` / `useProduct()` with full column set (no change). Query keys are separate: `['products', 'home']` vs `['products']` → independent caches.

---

### 2026-05-02: Community Search — Keyword Extraction + Honest Summaries

**By:** Danny (Backend Dev)  
**Date:** 2026-05-02

**Decision:** Three changes to Community.tsx search:

1. **Keyword Extraction:** Extract 4-6 key terms from user queries before sending to Reddit API (stop word removal, dedup, truncation). Long natural language queries return irrelevant popular posts.
2. **Preserve Relevance:** Removed the `sort by score` that was overriding Reddit's relevance ordering with popularity.
3. **Honest Labeling:** Replaced fake "AI Summary" with honest "Community Results" label and plain-text summary. Added `stripMarkdown()` to clean Reddit selftext before display.

**Why:** User tested with real query and got completely irrelevant results (viral posts about haircuts instead of bang-styling advice). The "AI summary" was misleading — it pretended to analyze but just quoted the first (wrong) result with raw markdown.

**Impact:** Community.tsx search function, summary display, result ordering. No API or schema changes.

**Status:** IMPLEMENTED — deployed to GitHub Pages as part of beta must-fix sprint.

---

### 2026-05-01: #HairTok Product Integration — CGM Compatibility Assessment

**By:** Marty (Domain Expert)  
**Date:** 2026-05-01  
**Request:** Shari Paltrowitz — analyze viral #HairTok routine (Abbey Yung) for product integration into Scrunch catalog

**Decision:** Add 2–3 products, skip 6–7, propose 2 new categories.

**Products to Add:**
1. **Rosemary Oil (generic/plant-based)** — Pure, CG-approved, scalp stimulation + nutrient delivery without buildup. Already fits `oil_serum` category.
2. **K18 Leave-In Conditioner** — Bond-repair treatment, trending on TikTok, silicone-light (verify formula before adding). Appeals to Optimizers. Requires research.
3. **Olaplex Weightless Mask** — Bond-repair mask, community-trusted, water-soluble silicones (verify type). Popular with Optimizers.

**Products to Skip (Anti-CGM):**
- Dove Derma, Tresemmé Keratin Smooth, Redken Acidic Growth, Redken Hair Masks — All contain harsh sulfates + non-water-soluble silicones, marketed for straight/smoothing, zero curly community adoption.
- Pureology Smooth Gloss — Water-soluble silicones but "Smooth" line emphasizes smoothness over curl; defer unless wavy-specific variant exists.

**Category Expansion Recommendations:**
1. **`scalp_care`** (NEW) — Scalp serums, oils, masks. Currently zero products. TikTok + CGM community signal high demand. Start with: Dr. Groot, rosemary oils.
2. **`bond_repair`** (NEW) — Keratin + peptide treatments. Currently zero products. K18 + Olaplex trending. Appeals to Optimizers + color-treated curls common.
3. **`heat_protectant`** (DEFER) — Lower curly demand; wavy use only. Phase 2.

**Strategic Insight:**
- HairTok routine is wavy-forward (2A–2C: light, scalp-focused) vs. Scrunch's curly-forward (3A+). Reveals Scrunch underserves wavies.
- When adding new categories, frame for wavies: "Especially great for wavies (2A–2C)."
- Abbey Yung routine products **don't fit Scrunch** broadly (mainstream anti-CGM), but reveals gaps. Good signal: Scrunch has clear identity; not chasing trends blindly.

**Impact:** 2–3 products added to catalog, 2 category proposals to PM, wavy-hair positioning opportunity identified.

**Status:** DECISION READY — Awaiting PM (Kenickie) approval on new categories + research verification on K18/Olaplex/Dr. Groot before implementation.

---

### 2026-05-01: #HairTok Content Integration — Legal & Attribution Framework

**By:** Sandy (Lead Engineer)  
**Date:** 2026-05-01  
**Request:** Shari Paltrowitz — Assess legal risks for integrating influencer routines, define safe practices

**Decision:** Approved ✅ — Scrunch can build "Trending on TikTok" feature with clear guardrails.

**Safe (Green Light):**
- ✅ Product names/data in catalog — Factual, not copyrightable; descriptive fair use
- ✅ Routine descriptions — Functional instructions (own words), not creative works
- ✅ Influencer attribution — Proper credit + links reduce all risk
- ✅ Links to TikTok — Drives traffic; creator-approved practice

**High Risk (Red Flags):**
- ❌ Video/image reproduction — Copyrighted; requires written permission
- ❌ Implied endorsement ("She recommends Scrunch") — False advertising liability
- ❌ Copy-pasted captions — Derivative work; paraphrase instead
- ❌ Combining routines without attribution — Derivative work infringement

**Attribution Checklist (MVP):**
- Creator name + username visible on every routine
- Link to original TikTok (working, tested)
- Routine steps paraphrased in own words
- No video embeds, screenshots, or images without permission
- "As featured in" positioning (not "endorsed by")
- Product links accurate and verified

**Phased Implementation:**

**Phase 1 (MVP): Week 1 — 1-2 engineer-days**
- Component: TrendingRoutines.tsx
- Mock data: Abbey Yung's 5-step routine (manually transcribed)
- Navigation: Add "Trending on TikTok" section
- Links: Each step links to 2-3 products in existing catalog
- No backend changes

**Phase 2 (Scale): Week 2-3 — 2-3 engineer-days**
- Schema: routines + routine_steps + routine_step_products tables
- Admin UI: CRUD for Shari (add/edit/remove)
- Badge: "As Seen On" on product cards
- Support: 5–10 routines

**Phase 3 (Community): Month 2+ — Optional 3-5 days**
- User submissions + moderation queue
- Contributor attribution

**Impact:** Feature roadmap defined, legal risk cleared, implementation path set (MVP → Scale → Community).

**Status:** APPROVED — Ready for dev assignment. Assign Phase 1 MVP to Frenchy (frontend), Phase 2 to Danny (backend).

---

## HairTok Product Categories

**Date:** 2025-07-25  
**Author:** Danny (Backend Dev)  
**Status:** Implemented

### Context

Shari requested HairTok-sourced products be added to the Scrunch catalog with new product categories.

### Decision

1. Added two new ProductCategory values: `scalp_care` and `bond_repair`.
2. Added `hairtok_trending?: boolean` optional field to the `SeedProduct` interface for filtering.
3. Existing products that were already in the catalog under other categories (protein_treatment, oil_serum, deep_conditioner, curl_cream) were NOT moved — they were tagged with `hairtok_trending: true` and `#HairTok` notes in place.

### Rationale

- Moving existing products to new categories would break any user reviews or saved references tied to those products.
- The `hairtok_trending` field plus notes-based `#HairTok` tagging gives us two ways to filter: structured (boolean) and text-based (notes search).
- `scalp_care` is distinct from existing `scalp_treatment` — scalp_treatment is for medical/therapeutic products, scalp_care is for wellness/maintenance (oils, serums).

### Impact

- Frontend (Frenchy): New categories will need filter UI support in Products page.
- Database: No migration needed — seed data only. If/when we sync to Supabase, the `product_category` enum will need `scalp_care` and `bond_repair` added.
