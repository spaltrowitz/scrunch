# Invisible Onboarding — Revised Spec

**Author:** Kenickie (PM)
**Priority:** P1
**Status:** Draft — awaiting Shari's review
**Supersedes:** Previous onboarding goal-capture spec (pre-browse interstitial with 3 cards)

---

## Governing Principle

**No gates before value.** The homepage shows browsable products immediately. Onboarding is not a step — it's the browse experience itself, gradually learning who you are.

Previous spec proposed a "What brings you to Scrunch?" interstitial before browse. That's dead. The new model: show products first, personalize second.

---

## How It Works

### Phase 0: Immediate Value (no personalization)

The app works great with zero personalization. This is the baseline and it must be excellent on its own.

- Homepage shows curated product grid (editorial picks, community favorites, new arrivals)
- All filters available immediately (category, hair type, price, ingredients, CG-approved)
- Search works immediately
- No sign-up required to browse
- No modals, no interstitials, no "tell us about yourself"

**P0 requirement:** The app is fully functional and delightful at this stage. Everything below is enhancement, not dependency.

---

### Phase 1: INFERRED Persona Detection (silent)

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

---

### Phase 2: EMBEDDED Personalization (woven into browse)

Once a persona is inferred, the experience subtly adapts:

| Persona | Sort Order | Featured Products | Filter Defaults | UI Hints |
|---|---|---|---|---|
| Newbie | "Community Favorites" first | Starter kits, highly-rated basics | CG-approved pre-selected | Show "Great for beginners" badges |
| Store Scanner | "Recently checked" + alternatives | Products from their searched brands | None changed | Show "Available at..." info prominently |
| Budget Builder | Price low→high | Drugstore picks, best value | Price range pre-set to budget tier | Show price-per-oz, "budget pick" badges |
| Optimizer | "New arrivals" + ingredient match | Products matching their filter history | Last-used filters remembered | Show ingredient deep-dives, comparison tools |

**Key:** These are nudges, not locks. User can always override. No "you're a Newbie so you can't see advanced filters."

---

### Phase 3: DEFERRED Explicit Question (optional)

If we want to accelerate personalization, ask — but only after investment.

**Trigger:** After the user has viewed 3 product detail pages (not just thumbnails — they clicked in).

**Why 3 product views:**
- They've already gotten value (saw products, read details)
- They've demonstrated intent (not just a bounce)
- They're invested enough that a gentle question feels helpful, not intrusive
- 3 is enough to have context but early enough to improve their next 10 views

**Format:** Inline prompt at the top of the browse page (not a modal, not blocking):

> "Want better recommendations? Quick question:"
> **What best describes you?**
> 🌱 New to curly hair care · 🔍 Checking specific products · 💰 Finding affordable options · ⚗️ Experimenting with ingredients
> [Skip — I'm just browsing]

**Behavior:**
- Appears once. If skipped, never returns (rely on inference only)
- If answered, overrides inferred persona with explicit signal
- Dismissible, non-blocking, no overlay
- Positioned between product rows (part of the feed, not above it)

---

## What If We Never Ask?

**Can inference alone be enough? Yes — with caveats.**

**Pros of inference-only:**
- Zero friction, always
- Users who hate questions are never bothered
- Avoids the "I don't know what I am" problem (Newbies often can't self-identify)
- Behavior is more honest than self-reporting

**Cons:**
- Cold start: first 2-3 sessions have no signal → generic experience
- Misclassification risk: a Newbie searching "DevaCurl" (saw it on TikTok) looks like a Store Scanner
- Slower personalization: takes multiple sessions to build confidence

**Recommendation:** Ship inference-only first. Measure whether personalized users have meaningfully better engagement than unpersonalized users. Only add the deferred question if the data shows inference alone leaves too many users in the generic bucket after 2+ sessions.

---

## What This Replaces

| Previous Spec | This Spec |
|---|---|
| Pre-browse interstitial with 3 cards | No interstitial. Products shown immediately. |
| Asks intent before showing value | Infers intent from behavior |
| "What brings you to Scrunch?" modal | Inline optional question after 3 product views |
| Persona assigned at onboarding | Persona evolves continuously from behavior |
| Binary: asked or not asked | Gradient: confidence builds over time |

---

## Success Metrics

- **Time to first meaningful action** < 5 seconds (tap a product)
- **Bounce rate** lower than interstitial version (A/B if we ever test)
- **Inference accuracy** > 70% match to explicit selection (when users do answer)
- **Personalization adoption** — % of users reaching "high confidence" persona within 2 sessions

---

## Implementation Notes

- P1 priority — ship the app without any personalization first (P0)
- Inference engine is a lightweight state machine, not ML
- All personalization is reversible and overridable
- No personalization data shared or sold — it stays on-device until account creation
- Implicit graduation still applies: Newbies who start using advanced filters naturally evolve to Optimizer without any prompt

---

## Open Questions

1. Should the deferred question trigger on 3 product views or first filter use (whichever comes first)?
2. Do we show a "we noticed you like X" confirmation, or just silently adapt?
3. How do we handle users who exhibit signals from multiple personas? (Likely: weight by recency)
