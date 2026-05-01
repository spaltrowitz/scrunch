# Decision: Mobile-First Design Standards

**Date:** 2025-05-01  
**By:** Jan (Product Designer)  
**Context:** Mobile responsiveness audit findings

## Proposed Standards

Based on the mobile audit, recommend establishing these **mobile-first design standards** for the team:

### 1. Touch Target Minimum
**Standard:** All interactive elements (buttons, links, inputs) must have minimum 44×44px touch target.
- Use `min-h-[44px]` for buttons
- Use `py-3` for form inputs
- Use `min-h-[44px] min-w-[44px]` for icon buttons (see Header.tsx line 65)

**Why:** Apple HIG and Android Material Design both specify 44-48px minimum for touch accuracy.

### 2. Explicit Grid Columns
**Standard:** Always specify mobile-first grid columns explicitly.
- ✅ `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`
- ❌ `grid gap-4 md:grid-cols-2` (implicit single column)

**Why:** Explicit is clearer and prevents misunderstandings about mobile layout.

### 3. Text Wrapping for User Content
**Standard:** User-generated or variable-length text must have wrapping utilities.
- Use `break-words` for long words (URLs, ingredient names)
- Use `truncate` only for known-short content (product names in cards)
- Use `line-clamp-N` for multi-line truncation

**Why:** Prevents horizontal scroll on narrow viewports.

### 4. Mobile Padding Consistency
**Standard:** Use `px-4` for mobile horizontal padding on all page containers.
- Already consistently applied — maintain this pattern

**Why:** Provides visual breathing room on small screens.

### 5. Responsive Typography Scale
**Standard:** Use this scale for headings:
- H1: `text-xl md:text-2xl lg:text-3xl`
- H2: `text-lg md:text-xl lg:text-2xl`
- H3: `text-base md:text-lg`
- Body: `text-sm md:text-base`

**Why:** Improves readability without overwhelming small screens.

### 6. Form Input Height
**Standard:** Form inputs must reach 44px minimum height.
- Use `py-3` for text inputs
- Use `h-44` or `min-h-[44px]` for buttons

**Why:** Ensures keyboard inputs are easily tappable.

## Implementation Priority

**High (Do Now):**
- Fix ProductDetail ingredient list wrapping
- Fix auth form input heights
- Fix Community button touch targets

**Medium (Next Sprint):**
- Audit all buttons for 44px minimum
- Add explicit grid-cols-1 to all grids
- Update ProductDetail rating button layout

**Low (Backlog):**
- Document mobile patterns in component library
- Add automated touch target testing

## Team Adoption

Recommend adding these standards to:
1. Component library documentation
2. PR review checklist
3. Design system Figma file

**Question for team:** Should we enforce these with ESLint rules or automated tests?
