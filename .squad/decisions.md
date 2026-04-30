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
