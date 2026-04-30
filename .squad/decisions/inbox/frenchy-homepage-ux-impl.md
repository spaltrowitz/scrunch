# Homepage UX Implementation Decisions

**Author:** Frenchy (Frontend Dev)  
**Date:** 2026-05-01  
**Scope:** Jan's homepage UX recommendations implementation

---

## Decisions Made

### 1. CG jargon replacement strategy
**Decision:** Replaced all "CG" terminology with "Curl Safe" throughout the homepage.
- "CG ✓" → "Curl Safe ✓"
- "Not CG" → "Not Curl Safe"  
- "All CG Status" filter → "Curl Safety"
- "CG Approved" → "Safe for Curls"

**Why:** "CG" (Curly Girl) is insider jargon. Newbies — our P0 persona — won't understand it. "Curl Safe" communicates the same concept in plain language.

**Note:** This change is only in Home.tsx's local CG_BADGE constant. The Products page and other pages still use the original labels from constants.ts. If we want consistency app-wide, CG_STATUS_CONFIG in constants.ts should be updated too.

### 2. useProducts return shape change
**Decision:** Changed `useProducts()` from returning `Product[]` to `{ products: Product[]; isFallback: boolean }`.

**Why:** Jan's recommendation to make seed-data fallback visible requires the hook to communicate whether it fell back. All three consumers (Home, Products, Recommendations) were updated.

**Impact:** Any new consumer of `useProducts()` must destructure `data.products` instead of using `data` directly.

### 3. Price context approach
**Decision:** Added a "💡 Prices vary by retailer" tooltip in the filter bar rather than fake price data or external links.

**Why:** The product model has a `price_range` field but it's null for all products. Rather than showing empty price data or linking to external retailers (which could break), we set honest expectations. This satisfies Budget Builder persona needs without promising what we can't deliver.

### 4. Persona entry points — pills not gates
**Decision:** Added 3 quick-start pills above the category grid, not a modal or questionnaire.

**Why:** Follows the invisible onboarding philosophy. Each pill is a parallel path, not a sequential gate. Users who know what they want skip them; newbies get guidance.

---

*Implemented by: Frenchy (Frontend Dev)*
