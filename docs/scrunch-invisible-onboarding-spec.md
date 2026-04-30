# Scrunch: Invisible Onboarding Specification

**Author:** Kenickie (PM)  
**For:** Jan (Design), Engineering  
**Status:** Draft  
**Date:** 2025-07-17

---

## Overview

We are killing the interstitial onboarding flow. No more modal wizards, no "tell us about yourself" gates, no friction before first value.

The replacement is a three-layer system that infers, then asks, then adapts — in that order. The user should never feel like they are being "onboarded." They should feel like the product just works for them.

### Core Constraint: Invisible Onboarding

The user must reach meaningful product content within seconds of their first visit. Every personalization signal we collect comes either from observation or from prompts embedded naturally within the product surface — never from a dedicated onboarding screen.

### The Three Layers

| Layer | Trigger | User Awareness | Data Collected |
|-------|---------|----------------|----------------|
| **1. Silent Inference** | Immediately, from first interaction | None | Behavioral signals, referral context, device/locale |
| **2. Deferred Inline Prompt** | After 3+ product views | Low — feels like product UI | Explicit preferences via contextual micro-asks |
| **3. Embedded Personalization** | Ongoing, after enough signal | Medium — user sees tailored content | Feedback loops refine the model |

---

## Layer 1: Silent Inference

### What It Does

Passively builds a user profile from behavioral and contextual signals. No UI. No prompts. Runs from the moment the user lands.

### Signals to Capture

| Signal | Source | Inferred Meaning |
|--------|--------|-------------------|
| Referral source / UTM | URL params | Intent category (e.g., came from a fitness blog → wellness interest) |
| First content interacted with | Click/tap tracking | Topic affinity |
| Scroll depth & dwell time | Page engagement | Interest intensity per content area |
| Device type & screen size | User-agent / viewport | Mobile-first vs desktop user; layout preferences |
| Locale / timezone | Browser API | Language, regional content relevance |
| Time of day | Timestamp | Usage pattern (morning routine vs evening browsing) |
| Search queries (if any) | Search input | Explicit intent |
| Navigation pattern | Page sequence | Explorer vs goal-directed behavior |

### Behavioral Segmentation (Initial)

After the first session, silently assign the user to one or more behavioral segments:

- **Explorer** — browses widely, low dwell time per item, high page count
- **Seeker** — uses search or filters early, navigates directly
- **Returner** — comes back within 24h; high-value signal regardless of pattern

These segments drive default content ordering and feature emphasis — no UI changes the user would consciously notice.

### Rules

- No popups, tooltips, or modals triggered by Layer 1.
- All inference is probabilistic. Never lock a user into a segment permanently.
- Segment assignment updates continuously with new behavior.

---

## Layer 2: Deferred Inline Prompt

### What It Does

After the user has viewed **3 or more distinct product views** (pages, detail screens, or content cards), we surface a single inline prompt embedded in the natural content flow. This is not a modal. It lives inside the product surface.

### Trigger Condition

```
product_view_count >= 3 AND inline_prompt_shown == false
```

A "product view" counts when the user has meaningfully engaged with a distinct piece of content (not just scrolled past). Minimum dwell time of 2 seconds on the content area qualifies as a view.

### Prompt Design Requirements

1. **Appears inline** — rendered as a card within the content feed or as a contextual element on a detail page. Never as an overlay, modal, or interstitial.
2. **Single question** — one micro-ask per prompt instance. Examples:
   - "What are you most interested in?" → 3-4 tappable pills (e.g., Nutrition, Fitness, Sleep, Stress)
   - "How often do you want updates?" → Daily / Weekly / Just browsing
   - "Is this for you or someone you care for?" → Me / Someone else
3. **Dismissible** — user can scroll past or explicitly dismiss. Dismissed = don't re-show the same prompt for 7 days.
4. **Contextual** — the prompt content adapts to what the user has been viewing. If they've been looking at nutrition content, the prompt should relate to nutrition preferences, not generic onboarding questions.
5. **Skippable without penalty** — product remains fully functional if the user never answers.

### Prompt Sequencing

We have a prioritized queue of micro-asks. Only one is shown per session. Priority order:

1. **Primary interest area** — highest value for personalization
2. **Goal orientation** — tracking, learning, or managing
3. **Frequency preference** — how often they want to engage
4. **Household context** — personal use vs caregiving (if relevant to content viewed)

Each answered prompt removes it from the queue and enriches the user profile. Unanswered prompts rotate to the next session.

### Placement Rules

- **Feed view:** Render as a card between content items, positioned after the 3rd or 4th item.
- **Detail view:** Render as a contextual callout below the main content, above related items.
- Never at the top of the page. Never before the user has seen real content.

---

## Layer 3: Embedded Personalization

### What It Does

Once we have signal (from Layer 1 behavior + any Layer 2 responses), the product adapts. Personalization is woven into the existing UI — not called out as "personalized for you."

### Personalization Surfaces

| Surface | How It Adapts |
|---------|---------------|
| **Content feed ordering** | Prioritize topics matching inferred/stated interests |
| **Detail page "Related" section** | Weight toward user's demonstrated affinities |
| **Search result ranking** | Boost results in preferred categories |
| **Feature discovery** | Progressively reveal features aligned with usage pattern (e.g., show tracking tools to Seekers, browsing features to Explorers) |
| **Notification defaults** | Set frequency based on stated preference or inferred engagement cadence |
| **Empty states** | Replace generic empty states with contextual suggestions based on profile |

### Progressive Disclosure of Features

Instead of showing all features upfront, reveal them as the user's behavior indicates readiness:

- **Session 1-2:** Core browse/read experience only
- **Session 3-4:** Surface save/bookmark and mild customization
- **Session 5+:** Introduce tracking, goals, sharing — if behavior signals interest

### Feedback Loop

- If the user ignores personalized content consistently (low CTR on recommended items), decay the confidence score on that signal and diversify.
- If the user engages with a new category, update the model within the same session.
- Never show a "we personalized this for you" badge. The adaptation should feel like the product naturally has what they need.

---

## User Flows

### Flow A: New User, Organic Search → Browse → Convert

```
1. User lands on content page via Google
2. [Layer 1] Capture: referral=organic, content_topic=sleep, device=mobile
3. User reads article (dwell 45s), taps related article
4. [Layer 1] Update: interest=sleep (high confidence), behavior=Seeker
5. User views 3rd piece of content
6. [Layer 2] Inline card appears in feed: "What matters most to you?" 
   → [Sleep, Nutrition, Fitness, Stress] — Sleep is pre-highlighted based on inference
7. User taps "Sleep" — confirms inference
8. [Layer 3] Feed reorders: sleep content rises, related features surface
9. User continues browsing with no interruption
```

### Flow B: New User, Ignores All Prompts

```
1. User arrives via direct link
2. [Layer 1] Capture: referral=direct, browses broadly
3. User views 5 content items across categories
4. [Layer 2] Inline card shown — user scrolls past
5. Product continues working. Feed uses Layer 1 behavioral signals only
6. [Layer 2] Different prompt shown next session — user dismisses
7. Prompt queue pauses for 7 days
8. [Layer 3] Personalization runs on behavioral inference alone — still effective
```

### Flow C: Returning User, Deepening Engagement

```
1. User returns next day (Returner segment activated)
2. [Layer 1] Session 2 signals confirm interest areas
3. [Layer 2] New contextual prompt: "Want to track your sleep habits?" 
   (shown because user has viewed 6+ sleep articles)
4. User engages → tracking feature surfaces
5. [Layer 3] Product shifts to show tracking-oriented UI elements
6. Future sessions: personalization deepens with usage data
```

---

## What We're Killing

| Old Pattern | Status | Replacement |
|-------------|--------|-------------|
| Post-signup interstitial wizard ("Tell us about you") | **Killed** | Layer 1 inference + Layer 2 inline prompts |
| Category selection modal on first visit | **Killed** | Silent inference from first content interaction |
| "Complete your profile" persistent banner | **Killed** | Embedded personalization adapts without explicit profile |
| Onboarding tooltip tour | **Killed** | Progressive feature disclosure in Layer 3 |
| Mandatory preference selection before accessing content | **Killed** | Product is fully usable with zero explicit input |

---

## Success Metrics

### Primary

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Time to first meaningful interaction** | < 10 seconds | User reaches real content immediately |
| **Bounce rate (new users)** | Reduce by 25% vs interstitial baseline | No friction gate = fewer bounces |
| **Day-1 retention** | Increase by 15% vs current | Better first experience drives return |

### Secondary

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Layer 2 prompt response rate** | > 30% of users who see it | Validates inline placement over modal |
| **Personalization accuracy (CTR on recommended content)** | > 2x vs unpersonalized | Confirms inference model works |
| **Sessions to feature discovery** | Median ≤ 4 sessions for core features | Progressive disclosure isn't hiding things too long |
| **Layer 2 dismissal rate** | < 50% | Prompts feel natural, not intrusive |

### Guardrails

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Content engagement (non-personalized users)** | Must not drop vs current | Ensure product works well without any personalization |
| **Layer 2 prompt fatigue** | Dismissal rate > 60% across 2 sessions | Pause prompts, review placement/copy |
| **False segmentation rate** | Spot-check monthly | Users acting on personalized suggestions should find them relevant |

---

## Open Questions for Jan (Design)

1. What's the visual treatment for inline prompt cards? They need to feel native to the feed but still be noticeable enough to get 30%+ response rate.
2. How do we handle the transition when personalization "kicks in" — should feed reordering be instant or use a subtle animation?
3. For progressive feature disclosure, do new features appear in their natural position, or do we use a "new" indicator?

## Notes for Engineering

1. Layer 1 requires an event pipeline that can process behavioral signals in near-real-time (within the session). Batch processing is not sufficient for in-session personalization.
2. The `product_view_count` trigger for Layer 2 must persist across page navigations — use session-level state, not page-level.
3. Segment assignment should be stored as weighted scores, not hard labels. A user can be 70% Explorer / 30% Seeker.
4. All personalization must degrade gracefully. If the inference service is down, the user gets the default unpersonalized experience — never an error state.
