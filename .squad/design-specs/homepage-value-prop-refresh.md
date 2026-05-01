# Homepage Design Spec — Value Prop Refresh
**Designed by:** Jan (Product Designer)  
**Requested by:** Shari Paltrowitz  
**For implementation by:** Frenchy (Frontend Engineer)  
**Status:** Ready for implementation  
**Date:** May 1, 2025

---

## Problem Statement

The current homepage is discovery-first (good), but it lacks:
- **Value prop clarity** — visitors don't understand what makes Scrunch different
- **Feature showcase** — key differentiators (ingredient checker, community Q&A, personalized recs) are buried or hidden
- **Clear CTAs** — what action should a first-time visitor take?
- **Business logic** — why would someone use this vs. Google + Reddit?

**Current state:**
- Hero tagline: "Find curly hair products that actually work"
- Only says "200+ products + community reviews" (basic, transactional)
- Features are scattered: ingredient checker link is a pill, "new to curls" section is at the bottom
- No narrative arc showing why to trust Scrunch

**Goal:** Add narrative without adding visual clutter. Replace visual weight, don't add to it.

---

## Solution Overview

**Keep:** Hero, filter bar, category grid, product cards, "new to curly hair" CTA structure  
**Replace:** Hero subtitle + add feature showcase  
**Reposition:** Persona pills → integrated into feature cards  
**Net visual change:** Same or cleaner

---

## Design Changes

### 1. Enhanced Hero Section

**Location:** Replace current hero section (Home.tsx lines 76–84)

**Copy changes:**
- **H1 stays:** "Find curly hair products that actually work" (keep the hook)
- **Replace subtitle:** Instead of "Browse 200+..." create a cohesive tagline

**New subtitle copy:**
```
Scrunch is your personal curly hair assistant — search, check, and discover products the community loves.
```

**Value prop bullets (BELOW tagline):**
```
✅ Check any product's ingredients instantly
💬 Get answers from 400K+ Reddit community members
🎯 Personalized recommendations for your hair type
```

**Styling:**
- Font: text-sm, color: text-gray-700
- Grid: 3 columns on desktop, 1 column on mobile
- Container: gap-3, max-w-2xl mx-auto, centered
- Icon: emoji inline
- Each line: one sentence max, no punctuation at line end

**Implementation:**
```tsx
<section className="py-8 md:py-12 px-4 text-center bg-gradient-to-b from-violet-50 to-white">
  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
    Find <span className="text-violet-600">curly hair products</span> that actually work
  </h1>
  <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-5">
    Scrunch is your personal curly hair assistant — search, check, and discover products the community loves.
  </p>
  
  {/* New: Value props grid */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm text-gray-700">
    <div className="flex items-start justify-center gap-2">
      <span className="text-lg">✅</span>
      <span>Check any product's ingredients instantly</span>
    </div>
    <div className="flex items-start justify-center gap-2">
      <span className="text-lg">💬</span>
      <span>Get answers from 400K+ Reddit community members</span>
    </div>
    <div className="flex items-start justify-center gap-2">
      <span className="text-lg">🎯</span>
      <span>Personalized recommendations for your hair type</span>
    </div>
  </div>
  
  {/* Hero CTAs */}
  <div className="mt-6 flex flex-wrap gap-3 justify-center">
    <Link 
      to="/ingredient-checker"
      className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-sm"
    >
      Check Your Products
    </Link>
    <Link 
      to="/products"
      className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-gray-100 text-gray-900 no-underline hover:bg-gray-200 font-medium text-sm"
    >
      Browse Products
    </Link>
  </div>
</section>
```

---

### 2. Feature Spotlight Row

**Location:** NEW — insert between hero and category grid (after filter bar, before category section)  
**Purpose:** Make key differentiators discoverable without a gate

**Structure:** 3 equal-width cards in a horizontal row

**Card data:**

| Feature | Icon | Description | Link |
|---------|------|-------------|------|
| Ingredient Checker | 🔬 | Paste a product label, we'll tell you if it's curl-safe | `/ingredient-checker` |
| Community Q&A | 💬 | Ask questions, see answers from 400K+ Redditors | `/community` |
| Smart Recommendations | 🎯 | Get personalized product picks based on your hair type | `/recommendations` |

**Implementation:**
```tsx
{/* Feature Spotlight Row — insert after filter bar, before category grid */}
<section className="max-w-6xl mx-auto px-4 py-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Link 
      to="/ingredient-checker"
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all no-underline hover:bg-violet-50"
    >
      <div className="text-5xl">🔬</div>
      <h3 className="font-semibold text-base text-gray-900">Ingredient Checker</h3>
      <p className="text-sm text-gray-600 text-center">Paste a product label, we'll tell you if it's curl-safe</p>
      <span className="text-sm text-violet-600 hover:text-violet-800">Explore →</span>
    </Link>
    
    <Link 
      to="/community"
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all no-underline hover:bg-violet-50"
    >
      <div className="text-5xl">💬</div>
      <h3 className="font-semibold text-base text-gray-900">Community Q&A</h3>
      <p className="text-sm text-gray-600 text-center">Ask questions, see answers from 400K+ Redditors</p>
      <span className="text-sm text-violet-600 hover:text-violet-800">Explore →</span>
    </Link>
    
    <Link 
      to="/recommendations"
      className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all no-underline hover:bg-violet-50"
    >
      <div className="text-5xl">🎯</div>
      <h3 className="font-semibold text-base text-gray-900">Smart Recommendations</h3>
      <p className="text-sm text-gray-600 text-center">Get personalized product picks based on your hair type</p>
      <span className="text-sm text-violet-600 hover:text-violet-800">Explore →</span>
    </Link>
  </div>
</section>
```

**Mobile behavior:** Stack vertically on sm: screens (one column)

---

### 3. CTA Placement Strategy

**Primary CTA:** "Check Your Products" button in hero section  
**Secondary CTAs:**
- Feature cards link to their respective pages
- "New to curly hair?" section stays at bottom (discoverable, not forced)

---

## Tailwind Styling Guidelines

- **Hero section:** Keep bg-gradient-to-b from-violet-50 to-white, add py-10 or py-12
- **Feature cards:** border border-gray-200 + hover:border-violet-300 hover:shadow-md hover:bg-violet-50
- **Text hierarchy:** H1 text-2xl md:text-3xl, card titles text-base, descriptions text-sm
- **Spacing:** Hero + buttons = mb-6, feature row = py-8, cards = gap-4 p-6
- **Buttons:** 
  - Primary: bg-violet-600 hover:bg-violet-700 text-white
  - Secondary: bg-gray-100 hover:bg-gray-200 text-gray-900
  - Link style: text-violet-600 hover:text-violet-800
- **Mobile-first:** All grids use grid-cols-1 default, then md:grid-cols-3 for desktop
- **Min heights:** All clickable elements min-h-[44px]

---

## Implementation Checklist

- [ ] Update hero section with new subtitle copy
- [ ] Add value props grid (3 items with icons)
- [ ] Add hero CTAs ("Check Your Products" + "Browse Products")
- [ ] Create Feature Spotlight row component (3 feature cards)
- [ ] Insert feature row between hero and category grid
- [ ] Test responsive behavior (mobile 1-col, desktop 3-col)
- [ ] Verify all links point to correct routes
- [ ] Check hover states on feature cards and buttons
- [ ] Ensure minimum touch target size (44px)

---

## Success Criteria

✅ First-time visitor understands:
1. What Scrunch does (find curl-safe products)
2. Why it's different (ingredient checker, community, personalization)
3. What to do next (check products, browse, or ask community)

✅ Visual design doesn't feel cramped (same or less visual weight)

✅ Feature cards are discoverable but not forced (no modal, no gate)

✅ Mobile experience is clean (cards stack, buttons readable)

---

## Routes Referenced

Assumes these routes exist in App.tsx:
- /ingredient-checker — existing
- /products — existing
- /community — may need to create (Q&A hub)
- /recommendations — may need to create (personalized recs)

If /community or /recommendations don't exist yet, stub with placeholder pages or Link to /products as fallback.
