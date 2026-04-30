# Decision: Product Component Structure

**By:** Frenchy (Frontend Dev)
**Date:** 2026-04-30
**Status:** Implemented

## What

Decomposed `Products.tsx` (661 lines) into:
- `src/components/products/SearchBar.tsx` — search input with autocomplete dropdown
- `src/components/products/FilterPanel.tsx` — category chips, brand/region selects, toggles
- `src/components/products/ProductCard.tsx` — individual product card with actions, rating popup, notes (wrapped in `React.memo`)

Products.tsx now ~280 lines — orchestrates state and delegates rendering to child components.

## Why

1. **Performance:** Monolithic render meant every keystroke/filter change re-created 285 product card inline functions. `React.memo` on ProductCard prevents re-renders when only sibling state (e.g., another card's rating popup) changes.
2. **Maintainability:** 661 lines made it hard to find and modify specific UI sections. Each component is now independently testable.
3. **Consistency with team standards:** Decision log requires components > 300 lines to be decomposed.

## Patterns Established

- Product-related reusable components live in `src/components/products/`
- Card-level components should be `memo`-wrapped when rendered in lists
- "Show More" pagination (not infinite scroll) for product lists — simpler, no scroll listener overhead
- Filter state reset (`visibleCount`) happens on every filter change to avoid showing stale pagination
