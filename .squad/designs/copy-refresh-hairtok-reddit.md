# Copy Refresh: Reddit + TikTok Unified Voice

**Author:** Jan (Product Design)
**Date:** 2026-07-14
**Status:** Ready for Frenchy
**Scope:** `src/pages/Home.tsx`, `src/pages/About.tsx`

---

## Guiding Principles

1. **Inclusive, not exclusive** — always "Reddit threads AND TikTok reels", never one replacing the other
2. **Social proof** — combined community size (400K+ Reddit members + millions of #HairTok views)
3. **Shared vocabulary** — terms like "wash day", "holy grails", "routine" resonate with BOTH communities
4. **Discovery-focused** — TikTok users are product-discovery machines; lean into "find YOUR products"
5. **Credibility stack** — community wisdom (Reddit deep-dives) + trending picks (TikTok virality)

---

## File: `src/pages/Home.tsx`

### Change 1 — Hero Headline

**Current (line 35):**
```
Finally, one place for curly hair that actually works.
```

**Replace with:**
```
Your wash day just got a whole lot smarter.
```

**Why:** "Wash day" is universal vocabulary across Reddit AND TikTok curly communities. It immediately signals "this app speaks my language." The old headline was generic — this one is specific to the ritual both audiences share.

---

### Change 2 — Hero Subtitle

**Current (lines 38-40):**
```
Instantly check if any product is curl-safe, discover what works for YOUR hair type, and learn from 400K+ community members.
```

**Replace with:**
```
Find your holy grail products, check any ingredient list in seconds, and discover what actually works — backed by 400K+ Reddit members and millions of #HairTok views.
```

**Why:** "Holy grail products" is the #1 shared term between Reddit and TikTok curly communities. Adding explicit dual-source credibility ("Reddit members AND #HairTok views") signals to BOTH audiences: "we see you." The word "actually" mirrors the skeptical, cut-the-BS tone both communities love.

---

### Change 3 — Feature Card 2: Community Heading

**Current (line 77):**
```
Learn from 400K+ curly heads
```

**Replace with:**
```
Wisdom from Reddit threads to TikTok reels
```

**Why:** Directly bridges both communities. The "from X to Y" construction is inclusive — it says "we cover the whole spectrum." Drops the number from the heading (it appears in the body copy below).

---

### Change 4 — Feature Card 2: Community Body

**Current (lines 79-81):**
```
Ask any question and get real answers from r/curlyhair, r/curlygirl, and r/wavyhair community members.
```

**Replace with:**
```
Real answers from 400K+ r/curlyhair members, trending routines from #HairTok creators, and hard-won tips from people with hair like yours.
```

**Why:** Adds TikTok as a source alongside Reddit without removing Reddit. "Hard-won tips from people with hair like yours" is the emotional hook — it's personal and relatable. "Trending routines" speaks to TikTok's format (routine videos are the #1 curly content type).

---

### Change 5 — Feature Card 3: Recommendations Heading

**Current (line 90):**
```
Personalized picks based on YOUR hair
```

**Replace with:**
```
Your hair goals, your perfect routine
```

**Why:** "Hair goals" is peak TikTok vocabulary (#hairgoals has billions of views). "Routine" resonates with both communities — Reddit has routine megathreads, TikTok has routine videos. Shifts from clinical "personalized picks" to aspirational language.

---

### Change 6 — Feature Card 3: Recommendations Body

**Current (lines 92-94):**
```
Tell us about your waves, curls, or coils — Scrunch finds products that match your hair profile.
```

**Replace with:**
```
Whether you're building your first wash day routine or fine-tuning your protein-moisture balance — Scrunch matches products to your curl pattern, porosity, and goals.
```

**Why:** "Wash day routine", "protein-moisture balance", and "curl pattern" are terms used daily on both platforms. This copy serves two personas at once: the Newbie ("first wash day routine") and the Optimizer ("fine-tuning protein-moisture balance"). Shows depth without jargon-gating.

---

### Change 7 — Products Teaser Subtitle

**Current (line 115):**
```
410+ curl-safe products from the community's most trusted brands.
```

**Replace with:**
```
410+ curl-safe products — from community holy grails to trending #HairTok picks.
```

**Why:** "Holy grails" (Reddit's term for top products) + "trending #HairTok picks" (TikTok's discovery language) in one line. Signals the catalog spans both worlds.

---

### Change 8 — HairTok Section Subtitle

**Current (line 159):**
```
Products the curly community is talking about on TikTok
```

**Replace with:**
```
The products going viral on #CurlyHairTikTok — checked for curl safety by Scrunch
```

**Why:** "#CurlyHairTikTok" is a real, high-volume hashtag that TikTok users will recognize. Adding "checked for curl safety by Scrunch" is our unique value prop — TikTok shows you what's trending, Scrunch tells you if it's actually safe. This is the bridge: discovery (TikTok) + verification (Scrunch).

---

### Change 9 — "New to curly hair" Section

**Current (lines 220-223):**
```
<h3>New to curly hair care?</h3>
<p>Not sure where to start? Check our ingredient checker to see if your current products are curl-friendly.</p>
```

**Replace with:**
```
<h3>Starting your curl journey?</h3>
<p>Whether you just discovered your hair is wavy from a TikTok or you've been deep in Reddit threads — check if your current products are actually curl-safe.</p>
```

**Why:** "Curl journey" is universally used on both platforms. The "discovered your hair is wavy from a TikTok" line is a REAL scenario — thousands of people find out they have wavy/curly hair from TikTok videos. This is a recognition moment. "Deep in Reddit threads" validates the OG community. The two-source framing is inclusive.

---

## File: `src/pages/About.tsx`

### Change 10 — Page Subtitle

**Current (line 10):**
```
The curly hair community deserves better tools. We're building them.
```

**Replace with:**
```
From Reddit deep-dives to TikTok holy grails — one place for curly hair that actually works.
```

**Why:** The old subtitle was generic. This one names both sources and uses "holy grails" (the shared vocabulary). "Actually works" is the skeptical, earned-trust tone both communities respond to. This is the About page — it should explain what Scrunch bridges.

---

### Change 11 — "Why Scrunch?" Body Copy

**Current (lines 17-19):**
```
Product info for curly hair is scattered across spreadsheets, Reddit threads, and ingredient checkers that only say yes or no. Scrunch brings it all into one place where you can search, share, and track results.
```

**Replace with:**
```
Product info for curly hair is scattered across spreadsheets, Reddit threads, TikTok reels, and ingredient checkers that only say yes or no. You're watching a #HairTok routine, googling ingredients, cross-referencing r/curlyhair reviews — all in different tabs. Scrunch brings it all into one place where you can search, share, and track results.
```

**Why:** Adds TikTok to the "scattered info" list naturally. The second sentence ("watching a #HairTok routine, googling ingredients, cross-referencing r/curlyhair") paints a SPECIFIC scenario that TikTok AND Reddit users both live every day. It's recognition humor — "that's literally me."

---

### Change 12 — Community Feature Card

**Current (line 36):**
```
Get answers sourced from r/curlyhair (339K), r/curlygirl (61K), and r/wavyhair.
```

**Replace with:**
```
Community wisdom from r/curlyhair (339K+), r/curlygirl (61K+), r/wavyhair, and trending picks from #HairTok creators.
```

**Why:** Adds TikTok as a source without changing the Reddit-specific numbers (those are verifiable and impressive). "#HairTok creators" is deliberately vague on numbers because TikTok metrics are harder to cite precisely, but the term carries weight.

---

### Change 13 — "Built on Community Wisdom" Heading

**Current (line 42):**
```
Built on Community Wisdom
```

**Replace with:**
```
Built on Community Wisdom — Reddit to TikTok
```

**Why:** Simple extension that signals the breadth of sources. "Reddit to TikTok" is the spectrum framing — Scrunch covers the whole range.

---

### Change 14 — "Built on Community Wisdom" Body

**Current (lines 43-51):**
```
Scrunch is built on the incredible work of the curly hair community — the r/curlyhair Holy Grail Product List, ingredient tools like CurlScan, IsItCG, and CurlsBot, and the Curly Girl Method by Lorraine Massey.
```

**Replace with:**
```
Scrunch is built on the incredible work of the curly hair community — the r/curlyhair Holy Grail Product List, trending products from #HairTok and #CurlyHairTikTok, ingredient tools like CurlScan, IsItCG, and CurlsBot, and the Curly Girl Method by Lorraine Massey.
```

**Why:** Inserts TikTok sources alongside existing Reddit/tool credits. Keeps the sentence structure intact. The hashtags (#HairTok, #CurlyHairTikTok) are real, recognizable tags that TikTok users will identify with.

---

### Change 15 — Sources & Credits: Add TikTok Community Source

**Current (lines 95-99):**
```
<SourceGroup title="💬 Community" sources={[
  { name: 'r/curlyhair', url: 'https://www.reddit.com/r/curlyhair/' },
  { name: 'r/curlygirl', url: 'https://www.reddit.com/r/curlygirl/' },
  { name: 'r/wavyhair', url: 'https://www.reddit.com/r/wavyhair/' },
]} />
```

**Replace with:**
```
<SourceGroup title="💬 Community" sources={[
  { name: 'r/curlyhair', url: 'https://www.reddit.com/r/curlyhair/' },
  { name: 'r/curlygirl', url: 'https://www.reddit.com/r/curlygirl/' },
  { name: 'r/wavyhair', url: 'https://www.reddit.com/r/wavyhair/' },
  { name: '#HairTok', url: 'https://www.tiktok.com/tag/hairtok' },
  { name: '#CurlyHairTikTok', url: 'https://www.tiktok.com/tag/curlyhair' },
]} />
```

**Why:** Proper attribution. If we're citing TikTok as a source, it should appear in credits. Uses real TikTok tag URLs.

---

### Change 16 — Footer Tagline

**Current (line 72):**
```
Made with 🌀 by the curly hair community, for the curly hair community.
```

**Replace with:**
```
Made with 🌀 by curly people, for curly people — wherever you scroll.
```

**Why:** "Wherever you scroll" is a subtle nod to the multi-platform nature (Reddit scrolling, TikTok scrolling, Scrunch scrolling). "Curly people" is warmer and more human than "curly hair community." Light, fun, memorable.

---

## What NOT to Change

- **Featured Creators section** — Do not modify. Legal attribution rules apply.
- **Source links/URLs** — Keep all existing Reddit links intact.
- **Product counts** ("410+") — Keep current; update when catalog grows.
- **CTA button text** — "Explore Products →", "Try Ingredient Checker →" etc. are clear and action-oriented. No change needed.
- **Feature Card 1** (Ingredient Checker) — Already platform-neutral. No change needed.

---

## Summary of Voice Shift

| Element | Before | After |
|---------|--------|-------|
| Hero | Generic "one place for curly hair" | "Wash day" — community-specific hook |
| Social proof | "400K+ community members" (Reddit only) | "400K+ Reddit + millions of #HairTok views" |
| Vocabulary | Clinical ("personalized", "curl-safe") | Natural ("holy grails", "wash day", "curl journey") |
| Discovery framing | Feature-led ("check ingredients") | Journey-led ("find YOUR products") |
| Community scope | Reddit-only ("r/curlyhair members") | Both ("Reddit threads to TikTok reels") |
| Tone | Informational | Relatable, "I've been there" |

Total changes: **16** (9 in Home.tsx, 7 in About.tsx)
