# Jan — History

## Key Patterns & Corrections

### Design Philosophy
- **"No pre-browse gates, ever"** — even an optional bottom sheet before content is a gate. First screen must deliver immediate value.
- **Behavioral personalization > explicit profiling** — what users DO is more reliable than what they SAY. Track taps, filters, favorites.
- **Progressive disclosure across visits** — visit 1: curated static → visit 3: "based on your browsing" → visit 5+: reordered homepage. Never shift layout mid-session.
- **Deferred prompts earn the right to ask** — only after demonstrated engagement (3 product taps, filter use, a favorite). Inline, never modal.
- **On-device first** — behavioral signals in localStorage. No account needed. Merge to profile later.
- **Key principle:** Ask only when you can immediately deliver on the answer.

### Homepage Design (Prose-Inspired)
- **Hero simplification:** Single powerful headline, one CTA, one-line social proof. Removed value bullet grid.
- **Feature expansion:** 3 full-width narrative sections with alternating left/right layout (Ingredient Checker, Community Q&A, Recommendations).
- **Removed from homepage:** Sticky filter bar (belongs on /products), heavy 12-product grid (replaced with 4-6 teaser), category grid duplication, "New to curly hair?" CTA section.
- **Result:** ~500-600vh → ~360vh (~2.5 screen heights). Mission-first, not feature-first.
- **Principle:** Lead with "why we exist" not "what we have." Trust the mission to pull people in.

### Copy & Voice
- **Inclusive framing:** "From Reddit threads to TikTok reels" — additive, not replacement.
- **Shared vocabulary bridges audiences:** "wash day", "holy grails", "curl journey" used identically on Reddit and TikTok.
- **Dual social proof > single source:** "400K+ Reddit members AND millions of #HairTok views."
- **Discovery language for TikTok, depth language for Reddit:** "trending/viral/holy grail" vs "deep-dives/community wisdom/vetted."
- **One mention is enough:** Repeated copy across sections dilutes impact.

### UX Patterns
- **4 personas:** Newbie, Store Scanner, Budget Builder, Optimizer — all served by discovery-first homepage.
- **Remove non-functional UI:** Dead buttons ("coming soon" footnotes) erode trust. Remove until feature exists.
- **Redundant banners compete:** Merge "no ads" + "free and ad-free" into one clean block.
- **Copy verbosity scales with commitment:** Hero/feature cards short (scanning), About page longer (reading).
- **Footer must earn its space:** Stripped to tagline + nav links. Support ask moved to About as inline text link.

### Responsive & Mobile
- **Collapsible filters essential on mobile:** 15+ chips visible at once = cognitive overload. Toggle with badge count.
- **44px touch targets:** All interactive elements per Apple HIG and WCAG.
- **Rating popup:** 2x2 grid on mobile (4 buttons cramped in row at 375px).
- **Stack, don't squeeze:** `flex-col sm:flex-row` pattern for controls that overflow on mobile.
- **Pre-existing TS errors can block deploys** — `noUnusedLocals` errors fail `tsc -b`. Always clean up.

## Cross-Project Designer Knowledge (injected 2026-05-02)

### From EatDiscounted (Verbal)
- **SSE streaming as UX differentiator:** Progressive results create excitement. Protect streaming reveal moments.
- **Community reports as social signal:** "Not found" states should feel helpful, not empty.

### From MyDailyWin (Sidon)
- **Celebration psychology:** Task completions need modal + confetti + sound, not just toast.
- **PWA install prompt:** No `beforeinstallprompt` handler = missed retention.
- **Dark mode must be universal.** Unused CSS keyframes = dead code.

### From Slotted (Suki)
- **Emoji audit:** 4-criteria test — if text label exists, emoji is redundant. 87% reduction achieved.
- **Progressive disclosure by milestones:** Temporal design > spatial.
- **Settings:** Label controls, let users act. Explanations in onboarding, not settings.
- **Duplicate CTAs = decision paralysis.**

### From Slotted (Ty Lee)
- **"Visual diet, not redesign":** Strip, then polish.
- **Type scale:** 5 levels enforced globally. One accent color, grayscale for everything else.
- **Empty states need design:** Warm whitespace + illustration + CTA.
- **Micro-interactions for state transitions.**

### From HealthStitch (Book — UX Writing)
- **Voice:** Smart, personal, encouraging.
- **Null states:** Em-dash "—" for missing data. Loading states conversational ("Checking ingredients…").
- **Error framing:** Lead with what user wanted before technical detail.
- **Legal pages as standalone HTML** (not React routes) — inline CSS, no dependencies.

## Owner Preferences (learned)
- Discovery-first homepage: users come to FIND products, compliance checking secondary
- "Browse Products" = Primary CTA (overriding strategist recommendation of Ingredient Checker)
- New visitors want discovery, not tools

## Session Archive Summary

Jan completed 6+ sessions: invisible onboarding design (v1 bottom-sheet → v2 behavioral), Prose-inspired homepage redesign spec, homepage value prop refresh, copy refresh (Reddit + TikTok unified voice), visual/copy polish pass, browse page declutter + mobile audit, and comprehensive mobile responsiveness audit (8.5/10 rating, 4 critical issues, all 15 pages reviewed). Deliverables as design specs in `.squad/designs/` for Frenchy implementation.
