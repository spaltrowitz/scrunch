# Decision: Homepage CTA Priority & Structure

**Date:** 2026-05-01  
**By:** Kenickie (Product Manager)  
**Status:** Approved for Frenchy implementation  
**Request:** Shari Paltrowitz  

---

## The Problem

Scrunch homepage has **5 CTAs**, with **3 critical overlaps**:
1. Hero "Explore Products" + Products Teaser "See All Products" → same destination, confusing priority
2. Ingredient Checker appears twice (Feature Box 1 + bottom callout) → dilutes message
3. Recommendations positioned equal to discovery, but requires friction (hair profile form) → misaligned expectations

**Result:** First-time visitor doesn't know what to do first.

---

## Analysis: User Journey

A first-time visitor from Reddit/TikTok:
- No account created yet
- No hair profile filled out
- Curious but not committed
- Wants to know: "Does this app solve my problem?"

**Fastest aha moment?**
- **Ingredient Checker wins:** Paste label → instant pass/fail (15 sec) vs. Browse 410+ products (need filters + profile context)
- **Zero friction:** No account, no onboarding required
- **Proof of concept:** User tests Scrunch on THEIR shampoo bottle — builds trust immediately
- **Unique differentiator:** This is what only Scrunch does; Reddit can't do this

**Per team decisions:**
- "No gates before value" (invisible onboarding principle)
- Newbie persona is most vulnerable to overwhelm
- "The app must work great with ZERO personalization"

---

## Decision: Ingredient Checker = Primary CTA

### Homepage Hierarchy (New)

| **Priority** | **CTA** | **Location** | **Button Style** | **Why** |
|---|---|---|---|---|
| **PRIMARY** | Check Ingredients Now | Hero | Violet-600, large, unmissable | Fastest aha moment, zero friction, proves app value |
| **Secondary** | Browse Products | Feature grid | Violet-600, equal sizing | Discovery is the next logical step |
| **Tertiary** | Get Recommendations | Lower page | Outline or muted | Future engagement driver, not present value |
| **Support** | Community Q&A | Feature grid | Violet-600, equal sizing | Social proof, answers Newbie questions |

### What Changes

**Keep:**
- Hero section copy ("Finally, one place...")
- Community Q&A feature box
- #HairTok section
- Featured Creators
- Products teaser grid display

**Remove:**
- Feature box #1 (Ingredient Checker) — moved to hero
- Feature box #4 (Recommendations) — moved to lower page
- Products teaser "See All Products" CTA — consolidate with hero
- Bottom "New to curly hair?" section — removes duplicate Ingredient Checker

**Restructure:**

1. **Hero:**
   - CTA: "Check Ingredients Now →" (was "Explore Products →")
   - Add subheading: "Paste any ingredient list — Scrunch tells you if it's curl-safe in seconds"

2. **Feature Grid (2 boxes):**
   - Box 1: Browse Products ("Browse 410+ curl-safe products")
   - Box 2: Community Q&A (keep as-is)
   - Remove: Ingredient Checker box + Recommendations box

3. **Products Teaser:**
   - Remove "See All Products →" CTA
   - Keep grid, add inline text: "Click any product to check ingredients or read reviews"

4. **#HairTok Section:** (unchanged)

5. **NEW: "Ready to get personalized?" section** (after #HairTok)
   - Position: "After exploring, get picks tailored to YOUR hair"
   - CTA: "Create Profile & Get Recommendations"
   - Style: Outline button or lighter styling (not primary)

---

## Rationale

This flow guides visitors through a natural journey:
1. **Test (Ingredient Checker)** → builds trust
2. **Explore (Product Discovery)** → expands horizons  
3. **Ask (Community)** → social proof
4. **Personalize (Recommendations)** → future value unlock

**Resolves Shari's concern:** One unmissable primary action (Ingredient Checker), with Product Discovery repositioned as co-secondary (not competing), and Recommendations moved to lower-friction positioning.

---

## For Frenchy: Implementation Spec

**File:** `src/pages/Home.tsx`

1. **Update Hero CTA:**
   ```
   OLD: to="/products" | "Explore Products →"
   NEW: to="/ingredient-checker" | "Check Ingredients Now →"
   ```
   Add subheading above button: "Paste any ingredient list — Scrunch tells you if it's curl-safe in seconds"

2. **Reorder feature boxes (lines 60–104):**
   - Delete Box 1 (Ingredient Checker)
   - Keep Box 2 (Community Q&A) as first box
   - Create new Box 3: "Browse Products"
     ```
     <h2>Browse 410+ curl-safe products</h2>
     <p>Discover trusted brands from the community</p>
     <Link to="/products" className="...">Browse Products →</Link>
     ```
   - Delete Box 4 (Recommendations)

3. **Products Teaser (lines 106–148):**
   - Keep grid display
   - Remove CTA: "See All Products →" (line 140–145)
   - Replace with: "Click any product to view details, check ingredients, or read reviews"

4. **Delete Section: "New to curly hair" (lines 214–233)**
   - This section duplicates Ingredient Checker in hero

5. **Add NEW section after #HairTok (after line 211):**
   ```jsx
   <section className="py-16 px-4">
     <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-violet-50 border border-violet-100">
       <h3 className="font-semibold text-gray-900 mb-1">Ready to get personalized?</h3>
       <p className="text-sm text-gray-600 mb-4">
         After exploring our products, tell us about your hair and get picks tailored to YOU.
       </p>
       <Link
         to="/profile"
         className="text-sm px-4 py-2.5 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700"
       >
         Create Profile & Get Recommendations
       </Link>
     </div>
   </section>
   ```

---

## Measurement

Track these metrics post-launch:
- **Hero CTA click rate** (Ingredient Checker) vs. old "Explore Products"
- **Feature box engagement** (which box gets clicked most?)
- **New to account conversion** (visitors who try Ingredient Checker → account creation rate)
- **Recommendations click rate** (repositioned lower section — does it still drive signups?)

---

## Sign-off

- ✅ Aligns with invisible onboarding philosophy
- ✅ Removes friction for Newbie personas (P0)
- ✅ Unique value prop (Ingredient Checker) is unmissable
- ✅ Product Discovery + Community still visible, not removed
- ✅ Recommendations repositioned (future value, not competing)
