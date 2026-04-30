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
