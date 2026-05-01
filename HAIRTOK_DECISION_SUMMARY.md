# SCRUNCH × TIKTOK HAIR ROUTINE INTEGRATION — DECISION SUMMARY

**Requested by:** Shari Paltrowitz  
**Analyzed by:** Sandy (Lead Engineer)  
**Date:** 2026-05-01  
**Status:** ✅ APPROVED

---

## EXECUTIVE SUMMARY

✅ **YES, Scrunch can integrate #HairTok content and products without legal violation.**

The key: **Catalog product data + describe routines functionally + attribute everything + zero media reproduction.**

---

## QUICK ANSWERS

| Question | Answer | Reasoning |
|----------|--------|-----------|
| Can we list K18, Olaplex, Redken products? | ✅ YES | Product names are factual data, not copyrightable. Fair use applies. |
| Can we reference Abbey Yung's routine? | ✅ YES | Factual reference + paraphrased steps (not copied) + attribution = fair use. |
| Can we use her images/video? | ❌ NO | Copyrighted media. Requires written permission. Link only. |
| Can we say she endorses Scrunch? | ❌ NO | False advertising. Use "featured in" instead. |
| How should we credit her? | ✅ NAME + LINK | Creator name + handle + TikTok link on every view. |

---

## SAFE APPROACHES ✅

- List product names in catalog
- Describe routine steps in own words (functional, not creative)
- Link to TikTok video (drives traffic to creator)
- Add "Trending on #HairTok" badge
- Mention creator by name with full attribution
- Build "Trending Routines" collection feature

---

## PROHIBITED ❌

- Embed/host TikTok videos or screenshots (DMCA violation)
- Use creator's photo without permission (copyright)
- Copy captions word-for-word (derivative work)
- Imply creator endorses Scrunch (false advertising)
- Combine routines without attribution (copyright infringement)
- Republish as Scrunch's own content (plagiarism)
- Scrape #HairTok automatically (DMCA violation)

---

## IMPLEMENTATION ROADMAP

### Phase 1: MVP (1-2 days)
**Build "Trending on TikTok" collection page**
- Abbey Yung's 5-step routine (manually transcribed)
- Link steps to products in existing catalog
- Add TikTok link + creator attribution
- New sidebar nav: "Trending on TikTok"
- "Featured in Abbey Yung's routine" badge on product cards

### Phase 2: Scale (2-3 days)
- Add Supabase schema (routines + routine_steps)
- Build admin CRUD (Shari adds/edits routines)
- Scale to 5-10 trending routines
- Moderation workflow

### Phase 3: Community (optional, Month 2+)
- User submissions + moderation
- Contributor credits
- Analytics

---

## LEGAL FOUNDATION

1. **Scrunch is MIT-licensed** → Open-source, non-commercial context strengthens fair use
2. **Product names are factual** → Not copyrightable, descriptive use is fair use
3. **Routine steps are functional** → Instructions are not creative expression
4. **Attribution is essential** → Transforms from plagiarism to curation
5. **No media = zero risk** → Linking (not embedding) is always safe

---

## RISK MITIGATION

**If creator objects:**
- Remove immediately, apologize, offer to link instead
- Ask permission for future content

**Best case:**
- Creator appreciates exposure → informal partnership possible
- She features Scrunch, Scrunch features her routines

**Transparency:**
- Add "How We Credit Creators" page
- Document fair use approach

---

## FULL DOCUMENTATION

**Complete analysis:** `.squad/decisions/inbox/sandy-hairtok-integration.md`

**Contains:**
- Detailed legal analysis (7 sections)
- Attribution best practices with examples
- Phase-by-phase implementation guide
- Prohibited approaches + legal risks
- Legal summary table (quick reference)
- Sample routine (Abbey Yung 5-step for MVP)
- Pre-launch checklist

**Learnings logged:** `.squad/agents/sandy/history.md`

---

## NEXT STEPS

1. ✅ Shari reviews & approves this decision
2. → Assign Phase 1 to Frenchy (frontend engineer)
3. → Frenchy builds TrendingRoutines.tsx component
4. → Deploy MVP (Abbey Yung routine) to production
5. → Measure engagement, decide whether to scale to Phase 2

---

**Status:** Decision Ready ✅  
**Blocked on:** Shari approval + resource assignment
