# Homepage UX Recommendations

**Author:** Jan (Product Designer)  
**Date:** 2026-04-30  
**Scope:** Home.tsx homepage redesign review  
**Branch:** `spaltrowitz/add-product-request-validation`

---

## Executive Summary

The current homepage successfully implements the "discovery-first" philosophy — products lead, no gates before value. The category grid is intuitive, filtering works well, and the layout is mobile-responsive. However, several UX improvements would strengthen first impressions, persona-specific pathways, and visual hierarchy.

**Biggest wins available:**
1. Strengthen the value proposition for Newbies in the first 3 seconds
2. Add persona-entry points (not gates — parallel paths)
3. Improve product card information density without clutter
4. Handle empty/error states gracefully

---

## 1. First Impression (0-3 seconds)

### Current State
The hero says "Discover products for **your curls**" with subtext "Community-rated, ad-free. Browse by category, filter by CG status, find what works."

### Issues
- **"CG status"** is jargon — Newbies won't know what this means
- No visual element immediately communicates "this is about curly hair products"
- The value prop is functional but not emotional

### 🔴 Recommendation: Rewrite hero copy for instant recognition

**WHAT:** Update hero h1 and subtext in Home.tsx

**WHY:** Newbies need to understand value in 3 seconds. Current copy requires domain knowledge.

**HOW:**
```tsx
// Home.tsx lines 66-72
<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
  Find <span className="text-violet-600">curly hair products</span> that actually work
</h1>
<p className="text-sm text-gray-600 max-w-lg mx-auto">
  Browse 200+ products rated by the curly hair community. No ads, no BS — just real reviews from people with hair like yours.
</p>
```

**Tailwind:** No changes needed.

**Why it works:**
- "curly hair products" — immediate recognition
- "that actually work" — addresses core pain point
- "rated by the curly hair community" — social proof
- "hair like yours" — personalization promise
- Removed "CG status" jargon

---

## 2. Category Browsing

### Current State
14 categories displayed in a grid with emoji icons and counts. Category names use PRODUCT_CATEGORY_LABELS from constants.ts.

### What's Working ✅
- User-friendly labels (not database snake_case)
- Icons add visual differentiation
- Product counts help set expectations
- 5-column grid on desktop, 2-column on mobile

### 🟡 Recommendation: Reorder categories by popularity

**WHAT:** Sort categories by product count (or future: by click rate) rather than alphabetically by enum

**WHY:** Store Scanners and Newbies should see the most popular categories first. Currently: clarifying_shampoo leads (alphabetically), but it's a rarely-needed product.

**HOW:**
```tsx
// Home.tsx, before line 60
const sortedCategories = useMemo(() => {
  return Object.entries(PRODUCT_CATEGORY_LABELS)
    .sort((a, b) => (categoryCounts[b[0] as ProductCategory] || 0) - (categoryCounts[a[0] as ProductCategory] || 0))
}, [categoryCounts]) as [ProductCategory, string][]
```

Then use `sortedCategories` instead of `categories` in the map (line 134).

**Priority:** 🟡 Nice for Alpha — improves discoverability without requiring design changes.

---

### 🟢 Recommendation: Add "Popular" badge to top 3 categories

**WHAT:** Visual badge on highest-traffic categories

**WHY:** Newbies benefit from social proof signals about where to start

**HOW:**
```tsx
{/* Inside the category button, after the product count */}
{sortedCategories.indexOf([key, label]) < 3 && (
  <span className="text-[9px] text-violet-500 font-medium">Popular</span>
)}
```

**Priority:** 🟢 Beta — polish feature.

---

## 3. Product Cards

### Current State
Cards show: ProductImage (w-14 h-14), name (truncated), brand, CG badge, cruelty-free badge. Clicking navigates to ProductDetail.

### Issues
- **No price** — Budget Builders have no signal
- **Category not shown** — users lose context once scrolling
- **Cards are dense but info-sparse** — lots of visual weight for little data

### 🟡 Recommendation: Add category pill to product cards

**WHAT:** Show category below brand in a muted style

**WHY:** When users scroll through filtered results or "all products", they lose context of what category each product belongs to

**HOW:**
```tsx
// Home.tsx, after line 181 (brand display)
<p className="text-[10px] text-violet-400 truncate">
  {PRODUCT_CATEGORY_LABELS[product.category]}
</p>
```

**Tailwind:** text-[10px] to keep it subtle, text-violet-400 for brand alignment.

**Priority:** 🟡 Nice for Alpha.

---

### 🔴 Recommendation: Add "Why no price?" tooltip or section

**WHAT:** Since products don't have prices in the database, acknowledge this proactively

**WHY:** Budget Builders expect prices. Silence feels like missing data.

**HOW:** Add a small info note in the filter bar or product section header:
```tsx
<span className="text-xs text-gray-400" title="Price checking coming soon — compare prices on retailer sites for now">
  💡 Prices vary by retailer
</span>
```

**Alternative:** Link to Amazon/Target search with brand+name as query.

**Priority:** 🔴 Must-have for Alpha — manages expectations for a key persona.

---

## 4. Empty States

### Current State
- **Loading:** "Loading products…" centered text
- **No matches:** "No products match your filters."
- **Supabase error:** Falls back to seed data (via useProducts hook)

### Issues
- Error state is invisible — users can't tell they're seeing fallback data
- "No matches" is unhelpful — doesn't suggest next action

### 🔴 Recommendation: Make fallback-to-seed visible

**WHAT:** When useProducts falls back to seed data, show a subtle banner

**WHY:** Users should know they're seeing cached/limited data if Supabase is down

**HOW:** In useProducts hook, return a `isFallback` flag. In Home.tsx:
```tsx
{isFallback && (
  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-2 rounded-lg mb-4">
    📡 Showing cached products — live database temporarily unavailable
  </div>
)}
```

**Priority:** 🔴 Must-have for Alpha — transparency builds trust.

---

### 🟡 Recommendation: Improve "No matches" empty state

**WHAT:** Replace generic message with actionable guidance

**WHY:** Users hitting empty states should have a clear next step

**HOW:**
```tsx
// Home.tsx lines 161-162
{filteredProducts.length === 0 ? (
  <div className="text-center py-12">
    <div className="text-3xl mb-3">🔍</div>
    <p className="text-gray-700 font-medium mb-1">No products match your filters</p>
    <p className="text-sm text-gray-500 mb-4">
      Try broadening your search or{' '}
      <button onClick={() => {/* clear filters */}} className="text-violet-600 hover:underline cursor-pointer">
        clearing filters
      </button>
    </p>
    <Link to="/products" className="text-sm text-violet-600 hover:underline">
      Browse all products →
    </Link>
  </div>
) : (
```

**Priority:** 🟡 Nice for Alpha.

---

## 5. Mobile Experience

### Current State
- Layout is responsive (grid adjusts columns)
- Touch targets: category buttons have `p-4` (adequate)
- Product cards have `p-3` with `gap-3` grid
- Filter bar is sticky at `top-16` (below header)

### What's Working ✅
- Mobile nav hamburger menu
- Sticky filter bar stays accessible
- Grid reflows appropriately

### 🟡 Recommendation: Increase touch target on filter selects

**WHAT:** Increase select height and tap area

**WHY:** Mobile users need larger touch targets (44px minimum)

**HOW:**
```tsx
// Home.tsx, filter selects (lines 77-111)
// Change: className="text-sm ... px-3 py-2"
// To: className="text-sm ... px-3 py-2.5 min-h-[44px]"
```

**Priority:** 🟡 Nice for Alpha.

---

### 🟢 Recommendation: Add scroll-to-top when filters change

**WHAT:** Auto-scroll to product grid when applying filters

**WHY:** On mobile, users select a filter and may not realize products updated above the fold

**HOW:** Use `scrollIntoView` in the filter change handlers.

**Priority:** 🟢 Beta.

---

## 6. Call to Action by Persona

### Current State
- Single CTA section: "New to curly hair care?" → Ingredient Checker
- No differentiation by user type

### 🔴 Recommendation: Add parallel entry points for each persona

**WHAT:** Add subtle, non-blocking persona hints at top of category section

**WHY:** Different personas need different first actions. Currently only Newbies have guidance.

**HOW:** Add a small "quick start" row above categories:
```tsx
<div className="flex flex-wrap gap-3 mb-6">
  <Link to="/ingredient-checker" className="flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
    🌱 New to curls? Check your products
  </Link>
  <Link to="/products?cg=approved" className="flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100">
    🔍 Find CG-safe products
  </Link>
  <Link to="/products" className="flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100">
    📋 Browse all 200+ products
  </Link>
</div>
```

**Persona mapping:**
- 🌱 Newbie → Ingredient Checker
- 🔍 Store Scanner → Pre-filtered CG products
- 📋 Optimizer → Full product list

**Priority:** 🔴 Must-have for Alpha — addresses all personas without being a gate.

---

## 7. Visual Hierarchy

### Current State
- Hero (violet gradient) → Filter bar (white, sticky) → Category grid → Product grid → Newbie CTA
- Clear visual sections with appropriate spacing

### What's Working ✅
- Violet accent color is consistent
- Section headings ("Browse by Category") provide structure
- Product count in filter bar gives constant feedback

### 🟡 Recommendation: De-emphasize category grid when filtered

**WHAT:** When a filter is active, collapse or hide the category grid

**WHY:** Currently the grid shows even when you've already selected a category via the filter dropdown. Redundant.

**HOW:** Already implemented! Line 130: `{!selectedCategory && !cgFilter && !brandFilter && (...)}`. ✅

### 🟡 Recommendation: Add visual break between filter bar and content

**WHAT:** Add subtle shadow to sticky filter bar

**WHY:** When scrolling, content slides under the filter bar. A shadow helps it feel "floating."

**HOW:**
```tsx
// Home.tsx line 75
// Change: className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3"
// To: className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3 shadow-sm"
```

**Priority:** 🟡 Nice for Alpha — small polish.

---

## 8. Placeholder UX (56 Imageless Products)

### Current State
ProductPlaceholder.tsx displays:
- Category-specific gradient background
- Category emoji icon
- Brand name (9px font)
- Product name (8px font)
- "Image coming soon" text
- Tooltip on hover/tap explaining copyright

### What's Working ✅
- Tooltip explains WHY there's no image (copyright respect)
- Category icons provide visual differentiation
- "Image coming soon" sets expectation

### Issues
- "Image coming soon" implies images ARE coming — are they?
- 8-9px text is barely readable
- The info icon is hard to notice

### 🟡 Recommendation: Remove "Image coming soon" if no timeline

**WHAT:** Replace with nothing, or "No image available"

**WHY:** "Coming soon" creates an expectation. If we can't deliver, it erodes trust.

**HOW:**
```tsx
// ProductPlaceholder.tsx line 51-53
// Remove entirely, or change to:
<span className="text-[7px] text-gray-400 leading-tight">
  No image
</span>
```

**Priority:** 🟡 Nice for Alpha — copy accuracy.

---

### 🟢 Recommendation: Make placeholder text more readable

**WHAT:** Increase font sizes slightly

**WHY:** 8px text is accessibility-problematic

**HOW:**
```tsx
// ProductPlaceholder.tsx
// Line 45: text-[9px] → text-[10px]
// Line 48-49: text-[8px] → text-[9px]
```

**Priority:** 🟢 Beta — accessibility improvement.

---

## Summary: Priority Matrix

| Priority | Recommendation | Effort |
|----------|----------------|--------|
| 🔴 Must-have | Rewrite hero copy for instant recognition | Low |
| 🔴 Must-have | Add "Why no price?" tooltip | Low |
| 🔴 Must-have | Make fallback-to-seed visible | Medium |
| 🔴 Must-have | Add parallel persona entry points | Medium |
| 🟡 Nice-to-have | Reorder categories by popularity | Low |
| 🟡 Nice-to-have | Add category pill to product cards | Low |
| 🟡 Nice-to-have | Improve "No matches" empty state | Low |
| 🟡 Nice-to-have | Increase touch target on filter selects | Low |
| 🟡 Nice-to-have | Add shadow to sticky filter bar | Low |
| 🟡 Nice-to-have | Remove/update "Image coming soon" | Low |
| 🟢 Beta | Add "Popular" badge to top categories | Low |
| 🟢 Beta | Scroll-to-top on filter change | Low |
| 🟢 Beta | Improve placeholder text readability | Low |

---

## Next Steps

1. **Frenchy** should implement 🔴 Must-haves for Alpha readiness
2. After implementing, get user feedback on:
   - Do Newbies understand the app in 3 seconds?
   - Do Store Scanners find what they need quickly?
3. Track category click-through rates to inform "Popular" badge logic

---

*Reviewed by: Jan, Product Designer*
