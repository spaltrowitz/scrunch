# Scrunch Homepage Redesign: Prose-Inspired Sleek + Mission-Driven

**Requested by:** Shari Paltrowitz  
**Designed by:** Jan (Product Designer)  
**Date:** 2026-05-02  
**Status:** Ready for Implementation (Frenchy)

---

## Design Direction

Learn from Prose (prose.com):
- **Single, powerful mission statement** front and center
- **Clean, minimal aesthetic** with lots of whitespace
- **One clear CTA** — not competing buttons
- **Visual storytelling** — narrative > product grids
- **Trust signals** — credibility in one line
- **Progressive disclosure** — scroll to see more

**Key insight:** Prose doesn't show you their full product lineup on the homepage. They show you the *idea* and ask you to take a "free consultation." They trust the mission to pull you in. Scrunch should do the same: show the mission, show social proof, and let users discover products through natural exploration (category links), not overwhelming grids.

---

## Current Scrunch Homepage Problems

1. **Hero is busy** — tagline + 3 value bullets + 2 CTAs = feels cluttered
2. **Feature cards are buried** — they're good, but competing with grids below
3. **Filter bar is sticky but homepage-scoped** — belongs on `/products` page, not here
4. **Category + product grids are too much** — 8 category cards + 12 product cards = 20 items to scan
5. **"New to curly hair?" section is weak** — buried at bottom, feels like an afterthought
6. **Total scroll height** — ~5-6 screen heights. Should be ~2.

---

## New Structure (2 Scroll Heights)

### 1. Hero Section (100vh first fold)
**Goal:** Visitor lands. Immediately knows Scrunch's mission. One action to take.

**Copy:** "Your curly hair deserves better than a Google spreadsheet."

**Layout:**
- Large, bold headline centered
- One paragraph of supporting copy (below)
- One CTA button
- Social proof line (lightweight, subtle)
- Generous padding/whitespace

**Exact Copy:**

```
HEADLINE:
"Your curly hair deserves better than a Google spreadsheet."

SUPPORTING COPY:
"Scrunch is your personal curly hair assistant. Instantly check if any product is curl-safe, discover what works for YOUR hair type, and learn from 400K+ community members. All in one place."

CTA BUTTON:
Primary: "Explore Products →" (links to #browse-by-category or smooth scroll)

SOCIAL PROOF LINE (subtle, one line, no visual clutter):
"Built on data from r/curlyhair (339K members) · Community-powered with CurlScan, IsItCG, and CurlsBot"
```

**Tailwind Styling:**
```jsx
{/* Hero */}
<section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center bg-gradient-to-b from-violet-50 to-white">
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-3xl">
    Your curly hair deserves better than a Google spreadsheet.
  </h1>
  
  <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
    Scrunch is your personal curly hair assistant. Instantly check if any product is curl-safe, discover what works for YOUR hair type, and learn from 400K+ community members. All in one place.
  </p>
  
  <a
    href="#browse-by-category"
    className="px-8 py-4 min-h-[48px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-lg transition-colors"
  >
    Explore Products →
  </a>
  
  <p className="text-xs md:text-sm text-gray-500 mt-12 max-w-2xl">
    Built on data from r/curlyhair (339K members) · Community-powered with CurlScan, IsItCG, and CurlsBot
  </p>
</section>
```

**Design Notes:**
- Hero takes **full viewport height** — no competing content visible
- Gradient background (violet-50 to white) is subtle, not flashy
- Font sizes scale aggressively on mobile (text-4xl → text-6xl)
- Social proof is de-emphasized (text-xs, gray-500) — credible but not loud
- Single CTA button (violet-600) is the only interactive element
- Lots of breathing room (mb-6, mb-8, mt-12, max-w-2xl)

---

### 2. Feature Sections (Full-Width Rows, Scroll-Reveal)
**Goal:** As user scrolls, reveal why Scrunch is different. Each feature gets its own space + image/visual.

**Replace:** The current 3-card feature spotlight row (those cards are cluttered). Expand them into full-width sections, one per scroll.

**Exact Copy + Links:**

```
FEATURE 1 — Check Ingredients
HEADLINE: "Check any ingredient list in seconds"
COPY: "Paste or upload a product label. Scrunch instantly tells you if it's curl-safe — backed by r/curlyhair community standards. No more guessing in the aisle."
CTA: "Try Ingredient Checker →" (links to /ingredient-checker)
VISUAL: Icon or placeholder (🔬) — or a "paste label" visual mockup

FEATURE 2 — Ask the Community
HEADLINE: "Learn from 400K+ curly heads"
COPY: "Stuck choosing between two products? Got a weird hair day? Ask in Community Q&A and get real answers from people who've been there."
CTA: "Visit Community Q&A →" (links to /community)
VISUAL: Icon (💬) — or a chat bubble mockup

FEATURE 3 — Find What Works for YOU
HEADLINE: "Personalized product picks based on YOUR hair"
COPY: "Not all curly hair is the same. Tell us about your waves, curls, or coils — Scrunch finds products that match your hair profile."
CTA: "Get Recommendations →" (links to /recommendations)
VISUAL: Icon (🎯) — or a hair type visual
```

**Tailwind Styling (Alternating Left/Right):**
```jsx
{/* Feature Section 1 — Left text, right visual */}
<section className="py-20 px-4 border-b border-gray-200">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Check any ingredient list in seconds
      </h2>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Paste or upload a product label. Scrunch instantly tells you if it's curl-safe — backed by r/curlyhair community standards. No more guessing in the aisle.
      </p>
      <a
        href="/ingredient-checker"
        className="inline-block px-6 py-3 min-h-[44px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
      >
        Try Ingredient Checker →
      </a>
    </div>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-6xl">
      🔬
    </div>
  </div>
</section>

{/* Feature Section 2 — Right text, left visual (alternate) */}
<section className="py-20 px-4 border-b border-gray-200">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-6xl md:order-2">
      💬
    </div>
    <div className="md:order-1">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Learn from 400K+ curly heads
      </h2>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Stuck choosing between two products? Got a weird hair day? Ask in Community Q&A and get real answers from people who've been there.
      </p>
      <a
        href="/community"
        className="inline-block px-6 py-3 min-h-[44px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
      >
        Visit Community Q&A →
      </a>
    </div>
  </div>
</section>

{/* Feature Section 3 — Left text, right visual */}
<section className="py-20 px-4 border-b border-gray-200">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Personalized product picks based on YOUR hair
      </h2>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        Not all curly hair is the same. Tell us about your waves, curls, or coils — Scrunch finds products that match your hair profile.
      </p>
      <a
        href="/recommendations"
        className="inline-block px-6 py-3 min-h-[44px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
      >
        Get Recommendations →
      </a>
    </div>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-6xl">
      🎯
    </div>
  </div>
</section>
```

**Design Notes:**
- Each feature is a full scroll height (py-20 = 80px padding top/bottom)
- Alternating left/right layout creates visual rhythm
- Text on one side, visual placeholder on other (use md:order-2 to flip on desktop)
- Generous gap (gap-12) between columns
- Each has its own CTA button (violet-600)
- No visual clutter — just emoji placeholders for now (can be replaced with real images later)
- Mobile: stacks 1 column, no alternation needed

---

### 3. Popular Products Teaser (Reduced Row)
**Goal:** Show just 4-6 top products. Not a grid. Not a filter showcase. A "see what's popular" teaser.

**Copy:**
```
SECTION HEADLINE: "Popular Products"
SUBHEADLINE: "Discover products loved by the community. Browse 200+ more on our full catalog."
LINK: "See All Products →" (links to /products)
```

**Tailwind Styling:**
```jsx
{/* Popular Products Teaser */}
<section className="py-16 px-4 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Popular Products
      </h2>
      <p className="text-gray-600">
        Discover products loved by the community. Browse 200+ more on our full catalog.
      </p>
    </div>
    
    {/* Show 4-6 products in a horizontal scroll or grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Render top 4-6 products from data */}
      {featuredProducts.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all no-underline group"
        >
          <ProductImage
            brand={product.brand}
            name={product.name}
            seedImageUrl={product.image_url}
            className="w-full h-24 object-cover"
          />
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-700">
            {product.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{product.brand}</p>
        </Link>
      ))}
    </div>
    
    <div className="text-center">
      <Link
        to="/products"
        className="text-violet-600 hover:text-violet-800 font-medium no-underline"
      >
        See All Products →
      </Link>
    </div>
  </div>
</section>
```

**Design Notes:**
- Light gray background (bg-gray-50) to separate from hero
- Show only 4-6 products, not 12
- Responsive grid: 2 cols mobile, 3 tablet, 6 desktop
- Each product is a small card with image + name + brand
- Bottom link goes to full `/products` page for deeper browse
- This **replaces** the heavy filter bar + 8 category cards + 12 product grid from current homepage

---

### 4. Browse by Category (Anchor Point)
**Goal:** Still let users navigate by category — this is their entry point to deeper browsing. But keep it light and link to `/products` with category pre-filter.

**Copy:**
```
SECTION HEADLINE: "Browse by Category"
SUBHEADLINE (optional): "Or explore our full catalog with filters."
```

**Tailwind Styling:**
```jsx
{/* Browse by Category */}
<section id="browse-by-category" className="py-16 px-4">
  <div className="max-w-6xl mx-auto">
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Browse by Category
      </h2>
      <p className="text-gray-600">
        Or visit our full catalog with filters.
      </p>
    </div>
    
    {/* Show all categories as quick links */}
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
      {CATEGORY_DATA.map((cat) => (
        <Link
          key={cat.key}
          to={`/products?category=${cat.key}`}
          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-colors no-underline text-center"
        >
          <span className="text-2xl">{CATEGORY_ICONS[cat.key]}</span>
          <span className="text-xs font-medium text-gray-800">{cat.label}</span>
          <span className="text-xs text-gray-500">{cat.count}</span>
        </Link>
      ))}
    </div>
    
    <div className="text-center mt-8">
      <Link
        to="/products"
        className="text-violet-600 hover:text-violet-800 font-medium no-underline"
      >
        Browse All Products with Filters →
      </Link>
    </div>
  </div>
</section>
```

**Design Notes:**
- All 14 categories shown (not limited to 8)
- Each category is a small link, not a "featured" card
- Links go to `/products?category=X` to pre-filter
- Light hover state (hover:border-violet-300, hover:bg-violet-50)
- Mobile: 3 columns, desktop: 6-7 columns
- This is NOT a filter interface — it's a navigation tool

---

## What Gets Removed from Current Homepage

**Kill:**
1. ❌ **Sticky filter bar** — it belongs on `/products` page, not homepage. Clutters the hero experience.
2. ❌ **Category grid at top** — replaced by "Browse by Category" section below (same categories, lighter touch).
3. ❌ **12-product grid on homepage** — replaced by "Popular Products" teaser (4-6 only).
4. ❌ **"New to curly hair?" section at bottom** — this content is still discoverable via `/community` and `/ingredient-checker` CTAs. Doesn't need to be on homepage.

**Keep but Restructure:**
1. ✅ **Feature cards** → Expand into full-width sections with better narrative
2. ✅ **Hero section** → Simplify, remove jargon, one CTA
3. ✅ **Social proof** → Lightweight one-liner, not buried

---

## Visual Hierarchy & Spacing

| Section | Height | Purpose |
|---------|--------|---------|
| Hero | 100vh | Mission statement + social proof + one CTA |
| Feature 1 | 60vh | Ingredient Checker narrative + visual |
| Feature 2 | 60vh | Community narrative + visual |
| Feature 3 | 60vh | Recommendations narrative + visual |
| Popular Products | 40vh | Teaser grid + link to full catalog |
| Browse by Category | 40vh | Category navigation grid |
| **Total** | **~360vh (~2.5 screen heights)** | — |

Current homepage: ~500-600vh (5-6 screen heights)  
**New homepage: ~360vh (2.5 screen heights)** ✅

---

## Responsive Behavior

### Mobile (< 640px)
- Hero: Full height, centered text
- Features: Stack 1 column (no left/right alternation)
- Features: Smaller text (text-2xl instead of text-4xl)
- Popular products: 2-column grid
- Categories: 3-column grid
- All padding/gaps scaled down

### Tablet (640px - 1024px)
- Hero: Full height
- Features: 1-2 column layout (alt: could stack)
- Popular products: 3-column grid
- Categories: 4-column grid

### Desktop (> 1024px)
- Hero: Full height
- Features: 2-column alternating layout
- Popular products: 6-column grid
- Categories: 6-7 column grid

---

## Implementation Notes for Frenchy

1. **Remove the sticky filter bar** (line 124 in current Home.tsx)
2. **Simplify hero section** (line 74-113):
   - Remove the 3 value bullet grid
   - Keep only headline + paragraph + one CTA button
   - Add social proof line
3. **Expand feature cards** (line 182-215):
   - Convert from 3-card row to 3 full-width sections
   - Add left/right layout alternation
   - Add visual placeholders
4. **Replace category + product grids** (line 217-320):
   - Create "Popular Products" section showing top 4-6 items
   - Keep "Browse by Category" but reposition it below
5. **Remove "New to curly hair?" section** (line 322-339)
   - Still accessible via ingredient checker and community links

---

## Prose Design Principles Applied

| Prose Principle | Scrunch Implementation |
|-----------------|------------------------|
| Clear mission statement | "Your curly hair deserves better than a Google spreadsheet." |
| Minimal aesthetic | Single hero, lots of whitespace, no filters on homepage |
| One CTA | Primary button in hero only (others are discovery links) |
| Visual storytelling | 3 feature sections with narrative + visual (emoji placeholders) |
| Trust signals | One-line social proof in hero ("Built on r/curlyhair 339K members...") |
| Progressive disclosure | Content reveals as user scrolls (hero → features → products → categories) |

---

## Copy Tone

- **Confident** — "deserves better," not "might help"
- **Clear jargon-free** — removed "CG status," "community members" instead of "Redditors"
- **Action-oriented** — verbs lead (Check, Learn, Discover, Browse)
- **Human** — addresses user directly ("YOUR hair," "you deserve")

---

## Next Steps

1. **Frenchy:** Implement this spec in `src/pages/Home.tsx`
2. **Jan:** Review the code implementation for visual fidelity
3. **Shari:** Feedback on messaging + visual feel
4. **Iterate:** Refine hero copy, feature visuals, product teaser ordering based on feedback

---

**Design Status:** ✅ Ready for Implementation  
**Complexity:** Medium (restructure sections, remove filter bar, simplify hero)  
**Testing:** Visual regression on mobile/tablet/desktop. Verify all links work.
