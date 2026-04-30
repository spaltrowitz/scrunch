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


