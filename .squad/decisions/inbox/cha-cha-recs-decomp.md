# Decision: Recommendations.tsx Decomposition

**By:** Cha-Cha (⚡ Performance Optimizer)
**Date:** 2025-07-26
**Status:** Implemented

## What

Decomposed `Recommendations.tsx` from 1173 lines into 7 files following the same pattern as the Products.tsx decomposition (PR #13).

## Structure

```
src/components/recommendations/
├── recommendationEngine.ts    — Pure scoring functions (buildTier1-3, ingredientTier, tierHeader)
├── RecommendedCard.tsx        — Product card + dismiss form (React.memo)
├── RatingGroup.tsx            — Rating group + row (React.memo)
├── SavedProducts.tsx          — Bookmarked products section (React.memo)
├── RatePromptSection.tsx      — Quick-rate prompt (React.memo)
└── IngredientRecsSection.tsx  — Ingredient-based recs section (React.memo)
```

## Key Decisions

1. **Orchestrator at 399 lines** — exceeds 300-line cap but justified: manages 5 queries, 3 mutations, collab filtering, and tier selection. No clean split without over-abstracting Supabase access.

2. **All extracted components use React.memo()** — prevents re-renders when dismiss/rating popup state changes on sibling cards.

3. **Scoring engine is pure TypeScript** — no React, no Supabase imports. Makes it independently testable and tree-shakeable.

4. **Collaborative filtering stays in orchestrator** — it's tightly coupled to Supabase and React Query. Extracting it would require passing the Supabase client or creating a custom hook for a single query — not worth the complexity.

## Verification

- `npm run build` ✅
- `npx tsc --noEmit` ✅ (zero type errors)
- `npm test` ✅ (26 tests, 3 suites)
