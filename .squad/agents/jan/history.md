# History

## Project Context
- **Project:** Scrunch — curly hair care app
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, React Query, React Router, Vitest
- **Deployment:** GitHub Pages
- **User:** Shari Paltrowitz

## Learnings

### 2025-01-30: Goal Capture Onboarding UX (v1 — SUPERSEDED)
- **Bottom sheet > full-screen** for optional onboarding — it signals "quick interaction" and keeps discovery content visible behind it, reinforcing the app's core value immediately.
- **"I don't know" must be a real option, not a skip** — treating it as a first-class choice (with its own UX path) respects the user and avoids the "you did something wrong by not answering" anti-pattern.
- **One question, one tap** — the curly hair community skews mobile-heavy and time-poor (often in-store). Multi-step onboarding would have high abandonment.
- **Re-engagement timing: session count, not days** — asking again after 3 sessions (not 3 days) ensures the user is actually engaged before we ask again, regardless of whether they use the app daily or weekly.
- **Additive personalization** — the goal answer should ADD a personalized section to the homepage, never remove or rearrange the base discovery UX. Users shouldn't feel punished for answering or confused by layout changes.
- **No source code exists yet** — app is in design/planning phase. All specs are forward-looking.

### 2025-01-30: Invisible Onboarding Pivot (v2 — CURRENT)
- **No pre-browse gates, ever** — even an optional bottom sheet is a gate. If it appears before the user has done anything, it signals "answer me before I help you." The first screen must be immediately useful content.
- **Zero-state must serve all personas** — a curated homepage (popular, approved, affordable, by-brand) covers Newbies, Store Scanners, Budget Builders, and Optimizers without knowing who's visiting.
- **Deferred prompts earn the right to ask** — only prompt after the user has demonstrated engagement (3 product taps, a filter use, a favorite). The prompt must appear inline in the content flow, never as a modal or overlay.
- **Behavioral personalization > explicit profiling** — what users DO is more reliable and less interruptive than what they SAY. Track taps, filters, favorites, and adapt between sessions.
- **Progressive disclosure across visits** — personalization reveals gradually (visit 1: curated static, visit 3: "based on your browsing", visit 5+: reordered homepage). Never shift layout mid-session.
- **Safety net ≠ gate** — "New to curly hair?" content should always be discoverable (footer link, empty states) but never forced. Viewing it should not lock a user into a "newbie" track.
- **On-device first** — behavioral signals live in localStorage. No account needed. Merge to profile later if they register. This respects privacy and removes friction.
- **Key principle: ask only when you can immediately deliver on the answer** — if the prompt says "tell us your goal," the very next screen must reflect that goal. Otherwise don't ask.


# Jan — Product Design History

## 2026-05-02: Prose-Inspired Homepage Redesign — Design Spec

**Context:** Shari requested a sleeker, more mission-driven homepage redesign using Prose (prose.com) as a reference.

**What I analyzed:**
- Prose homepage design patterns: single mission statement, minimal aesthetic, one CTA, trust signals, progressive disclosure
- Current Scrunch homepage: 5-6 screen heights of content (hero + 3 value bullets + feature cards + filter bar + 8 categories + 12 products + "new to curly hair" section)
- User personas: Newbie, Store Scanner, Budget Builder, Optimizer — all served by discovery-first homepage

**Design decisions:**
1. **Hero simplification** — Single powerful headline ("Your curly hair deserves better than a Google spreadsheet"), remove value bullet grid, one CTA button, add one-line social proof. Reduces visual clutter while making mission crystal clear.

2. **Feature expansion** — Convert cramped 3-card feature spotlight into 3 full-width narrative sections with alternating left/right layout. Each feature tells a story (Ingredient Checker, Community Q&A, Recommendations) — users scroll through why Scrunch is different.

3. **Remove sticky filter bar from homepage** — Filters belong on `/products` page. Removing it from homepage saves cognitive load in the hero zone and respects "invisible onboarding" (don't gate discovery behind questions).

4. **Replace heavy product grid** — Instead of 12-product grid on homepage, create lightweight "Popular Products" teaser showing 4-6 items. Send users to `/products` for full catalog with filters. Reduces cognitive overload.

5. **Kill category grid duplication** — Current homepage shows 8 category cards PLUS full product grid below. Reposition categories as lightweight navigation links below products, all 14 shown. Serves discovery without duplication.

6. **Remove "New to curly hair?" CTA section** — This content is discoverable via direct CTAs to `/ingredient-checker` and `/community`. Burying it on homepage dilutes the mission. Users who need it will find it through feature CTAs.

**Result:** Homepage compresses from ~500-600vh to ~360vh (~2.5 screen heights). User lands, sees mission, takes one action. Content progressively discloses as they scroll — no overwhelm.

**Key principle applied:** Prose trusts the mission to pull people in. Scrunch should do the same — lead with "why we exist" (curly hair deserves better), not "what we have" (200+ products). Product discovery happens *after* mission clarity.

**Deliverable:** Complete design spec at `.squad/designs/homepage-redesign-prose-inspired.md` with exact copy, component structure, Tailwind classes, responsive breakpoints, and implementation notes for Frenchy.

## Learnings

### 2026-07-14: Copy Refresh — Reddit + TikTok Unified Voice
- **Inclusive framing > replacement framing** — "From Reddit threads to TikTok reels" works because it's additive. Saying "we now focus on TikTok" would alienate the OG Reddit community who built the product data we depend on. Always use "X to Y" spectrum framing.
- **Shared vocabulary is the bridge** — terms like "wash day", "holy grails", "curl journey", and "protein-moisture balance" are used identically on both Reddit and TikTok. Using this shared language makes copy feel native to BOTH audiences simultaneously without having to split messaging.
- **Dual social proof > single source** — "400K+ Reddit members AND millions of #HairTok views" is stronger than either number alone. Each audience validates the other.
- **Recognition moments drive connection** — the line "discovered your hair is wavy from a TikTok" describes a real, specific experience thousands of people have. Specific > generic for emotional resonance.
- **Discovery language for TikTok, depth language for Reddit** — TikTok users respond to "trending", "viral", "holy grail"; Reddit users respond to "deep-dives", "community wisdom", "vetted". Good copy uses both registers.
- **Deliverable:** `.squad/designs/copy-refresh-hairtok-reddit.md` — 16 changes across Home.tsx and About.tsx, ready for Frenchy.

### 2025-01-30: Goal Capture Onboarding UX (v1 — SUPERSEDED)
- **Bottom sheet > full-screen** for optional onboarding — it signals "quick interaction" and keeps discovery content visible behind it, reinforcing the app's core value immediately.
- **"I don't know" must be a real option, not a skip** — treating it as a first-class choice (with its own UX path) respects the user and avoids the "you did something wrong by not answering" anti-pattern.
- **One question, one tap** — the curly hair community skews mobile-heavy and time-poor (often in-store). Multi-step onboarding would have high abandonment.
- **Re-engagement timing: session count, not days** — asking again after 3 sessions (not 3 days) ensures the user is actually engaged before we ask again, regardless of whether they use the app daily or weekly.
- **Additive personalization** — the goal answer should ADD a personalized section to the homepage, never remove or rearrange the base discovery UX. Users shouldn't feel punished for answering or confused by layout changes.
- **No source code exists yet** — app is in design/planning phase. All specs are forward-looking.

### 2025-01-30: Invisible Onboarding Pivot (v2 — CURRENT)
- **No pre-browse gates, ever** — even an optional bottom sheet is a gate. If it appears before the user has done anything, it signals "answer me before I help you." The first screen must be immediately useful content.
- **Zero-state must serve all personas** — a curated homepage (popular, approved, affordable, by-brand) covers Newbies, Store Scanners, Budget Builders, and Optimizers without knowing who's visiting.
- **Deferred prompts earn the right to ask** — only prompt after the user has demonstrated engagement (3 product taps, a filter use, a favorite). The prompt must appear inline in the content flow, never as a modal or overlay.
- **Behavioral personalization > explicit profiling** — what users DO is more reliable and less interruptive than what they SAY. Track taps, filters, favorites, and adapt between sessions.
- **Progressive disclosure across visits** — personalization reveals gradually (visit 1: curated static, visit 3: "based on your browsing", visit 5+: reordered homepage). Never shift layout mid-session.
- **Safety net ≠ gate** — "New to curly hair?" content should always be discoverable (footer link, empty states) but never forced. Viewing it should not lock a user into a "newbie" track.
- **On-device first** — behavioral signals live in localStorage. No account needed. Merge to profile later if they register. This respects privacy and removes friction.
- **Key principle: ask only when you can immediately deliver on the answer** — if the prompt says "tell us your goal," the very next screen must reflect that goal. Otherwise don't ask.


**Context:** Discovery-first homepage redesign — products lead, no gates before value.

**What I reviewed:**
- `src/pages/Home.tsx` — main homepage implementation
- `src/components/products/ProductPlaceholder.tsx` — imageless product handling
- `src/components/products/ProductCard.tsx` — product display component
- `src/App.tsx` — routing structure
- `src/lib/constants.ts` — category labels and configuration

**Key findings:**
1. Homepage successfully implements discovery-first philosophy — categories visible immediately, no login gate
2. Category grid is intuitive with user-friendly labels (not database snake_case)
3. "CG status" jargon in hero copy is barrier for Newbie persona
4. No price information hurts Budget Builder persona — need to set expectations
5. Fallback to seed data on Supabase error is invisible — users don't know they're seeing cached data
6. Placeholder UX is well-designed with category icons and tooltip, but "Image coming soon" may overpromise

**4 Must-Haves for Alpha:**
1. Rewrite hero copy to remove jargon and improve 3-second recognition
2. Add "Why no price?" tooltip for Budget Builders
3. Surface fallback-to-seed state visibly
4. Add parallel entry points for each persona (not gates — paths)

**Deliverable:** Full recommendations in `.squad/decisions/inbox/jan-homepage-ux.md`

---

## 2025-05-01: Homepage Value Prop Refresh — Design Spec

**Context:** Shari feedback — homepage lacked clear value proposition, feature showcase, and call-to-action clarity.

**What I analyzed:**
- Current Home.tsx structure — hero + filters + category grid + product cards
- Persona positioning — pills scattered, not integrated
- Feature discoverability — ingredient checker is a link, not promoted as a key differentiator
- Visual hierarchy — no narrative explaining why Scrunch vs. generic product browse

**Design decisions:**
1. **Enhanced hero section** — added tagline explaining Scrunch's role (personal assistant) + 3-line value prop bullets (ingredients, community, personalization). Kept existing tagline ("find curly hair products...") as the hook, replaced generic "200+ products" subtitle.

2. **Feature Spotlight row** — 3 cards (Ingredient Checker, Community Q&A, Smart Recommendations) as horizontal cards between hero and category grid. Each card is a discoverable link, not a gate. Mobile stacks to 1 column.

3. **Hero CTAs** — Added two buttons below value props: primary "Check Your Products" (violet), secondary "Browse Products" (gray). Gives first-time visitors a clear next action without forcing them.

4. **Persona pills logic** — recognized that feature cards ARE persona-specific paths (Ingredient Checker = Store Scanner, Community = Newbie, Recommendations = Optimizer). No need to duplicate or hide — the feature cards replace scattered information.

**Key principle applied:** Add narrative without adding visual clutter. The 2 new sections (hero value props + feature cards) replace scattered, less-coherent information. Net visual change: same or cleaner.

**Deliverable:** Comprehensive spec with exact Tailwind classes, implementation code snippets, and accessibility notes. Ready for Frenchy to implement directly.

**Why this works:**
- Addresses Shari's feedback: visitor lands and immediately understands what Scrunch does, why it's different, and what to do
- Respects "invisible onboarding" philosophy: feature cards are discoverable paths, not gates or forced flows
- Mobile-first responsive design (stack on mobile, 3-col on desktop)
- Maintains discovery-first homepage structure (products still visible immediately after scroll)
- Builds trust: community badges + ingredient checking + personalization all visible above the fold

### 2026-07-15: Visual + Copy Polish Pass
- **Footer must earn its space** — the footer had a donation CTA ("Buy my next curl cream"), a tagline ("wherever you scroll"), and no useful navigation. Stripped to tagline + 4 nav links. Support ask moved to About page as inline text link — much more tasteful.
- **One mention is enough** — "holy grail" and "#HairTok" were repeated across hero subtitle, feature card descriptions, AND product section headers on the homepage. Consolidated to fewer, higher-impact placements.
- **Remove non-functional UI** — Community page had a "Post to Scrunch community" button with a "coming soon" footnote. Dead buttons erode trust. Removed entirely until the feature exists.
- **Redundant banners compete** — About page had both a "No ads, ever" banner AND a "Scrunch is free and ad-free" support CTA. Merged into one clean block.
- **Copy verbosity scales with commitment** — hero/feature cards should be short (scanning mode). About page can be longer (reading mode). Shortened feature card descriptions that were trying to explain too much.
- **Pre-existing TS errors can silently block deploys** — `noUnusedLocals` errors in Products.tsx and Recommendations.tsx were passing `npm run build` locally (unclear caching) but failing in `npm run deploy`. Always verify deploy works, not just build.

### 2026-07-15: Browse Page Declutter + Mobile Audit
- **Collapsible filters are essential on mobile** — the Browse page showed ~15 category chips, 2 dropdowns, 2 checkboxes, and a request button all at once on 375px screens. Collapsing filters behind a "☰ Filters" toggle with an active-count badge reduces cognitive load without hiding functionality. Desktop stays unchanged.
- **44px is the magic number** — Apple's HIG and WCAG both recommend 44px minimum touch targets. Applied across: nav links, search input, filter toggle, dropdowns, checkboxes, submit buttons, "Show more", suggested questions, and feedback buttons. Smaller than 44px = frustrating on phone.
- **Rating popup needs 2x2 grid on mobile** — four rating buttons ("Loved", "Liked", "Ok", "Didn't like") in a single row at 375px makes each button ~70px wide with tiny text. Grid-cols-2 on mobile gives each button double the width. Desktop stays in a row.
- **ProductCard action buttons shouldn't be indented on mobile** — the `pl-20` indent (80px) aligned actions under the product text on desktop, but on mobile it pushed "Tried it?" and "☆ Save" into a ~295px gutter. Removed indent on mobile (`pl-0 sm:pl-20`).
- **Stack, don't squeeze** — the ratings prompt banner, search form controls, and brand/region dropdowns all used `flex` row layout that overflowed on mobile. Changed to `flex-col sm:flex-row` pattern everywhere.
- **Pre-existing TS errors from other sessions can block deploys** — found unused `featuredProducts` variable in Home.tsx and unused `RatePromptSection` import in Recommendations.tsx from prior session's changes. These blocked `tsc -b`. Always clean up unused code before committing.

### 2025-05-01: Comprehensive Mobile Responsiveness Audit

**Context:** Completed full mobile audit of Scrunch covering all 15 page components, 2 layout components, and key shared components.

**Key Findings:**

1. **Overall Mobile Readiness: 8.5/10** — Strong mobile-first foundation with a few critical fixes needed

2. **Mobile Design Patterns Observed:**
   - Consistent `px-4` mobile padding across all pages
   - Excellent use of responsive breakpoints: `sm:`, `md:`, `lg:`
   - Grid collapsing patterns: 6 → 3 → 2 columns for product grids
   - Touch targets: Most buttons properly sized at 44px minimum
   - Sticky header with mobile menu — best-in-class implementation
   - Typography scales responsively (e.g., `text-xl md:text-2xl lg:text-3xl`)

3. **Critical Issues Identified:**
   - **ProductDetail ingredient list** (line 206-224): Long ingredient names cause horizontal scroll on <375px screens. Needs `break-words` class.
   - **Auth forms** (Login/SignUp): Input fields use `py-2` (~40px height), below 44px touch target minimum. Should use `py-3`.
   - **ProductDetail rating buttons** (line 267-274): 4 buttons side-by-side cramped on mobile. Should use `grid grid-cols-2 sm:grid-cols-4`.
   - **Community post buttons** (line 286): Touch target is 36px, should be 44px minimum.

4. **File Paths for Reference:**
   - Pages: `src/pages/{Home,Products,Recommendations,Dashboard,Profile,Community,About,IngredientCheckerPage,Login,SignUp,ProductDetail,MyProducts,Onboarding}.tsx`
   - Layout: `src/components/layout/{Header,Footer}.tsx`
   - Key components: `src/components/products/ProductCard.tsx`, `src/components/onboarding/OnboardingWizard.tsx`

5. **Best Practices Observed:**
   - Header mobile menu implementation (`Header.tsx` lines 63-92) — perfect touch targets with explicit `min-h-[44px]` and `min-w-[44px]`
   - Product grid responsive patterns: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`
   - Proper truncation with `truncate` class to prevent text overflow
   - Flex wrapping on tags and badges: `flex-wrap gap-2`
   - Single-column layouts (Recommendations, Dashboard) naturally mobile-friendly

6. **Tech Stack:**
   - React 19 with TypeScript
   - Tailwind CSS 4 for styling
   - Deployed to GitHub Pages (static hosting)
   - Responsive design uses Tailwind breakpoints: sm (640px), md (768px), lg (1024px)

7. **Quick Wins Identified:**
   - Add explicit `grid-cols-1` to implicit grids (Products page line 419)
   - Add `min-h-[44px]` to Dashboard CTA (line 37) and Profile edit button (line 22)
   - Add `flex-wrap` to Footer nav links (line 10)
   - Stack ProductDetail header on mobile: change to `flex-col sm:flex-row`

8. **Mobile Testing Recommendations:**
   - Test on iOS Safari: iPhone SE (375px), iPhone 14 (390px)
   - Test on Android Chrome: 360px small device
   - Test edge cases at 320px width (smallest modern phones)
   - Key interactions: product browsing, rating flow, ingredient list scrolling, auth forms

9. **Component Patterns to Reuse:**
   - Mobile menu toggle pattern from Header.tsx
   - Responsive grid: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`
   - Touch-friendly button: `px-4 py-3 min-h-[44px]`
   - Responsive text: `text-sm md:text-base`
   - Card stacking: `flex flex-col gap-4` (natural mobile stack)

**Output:** Detailed audit report saved to `mobile-audit-report.md` with page-by-page analysis, critical issues prioritized, and mobile readiness scoring.

