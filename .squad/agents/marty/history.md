# Marty — History

## Key Patterns & Corrections

### #HairTok Landscape Research
- **Top 15 influencers ranked** by Scrunch relevance: Manes by Mell (2M+, ★★★★★), Ali Noskowiak (900K+, ★★★★★ exact target user), BiancaReneeToday (1.2M+, ★★★★★), SunKissAlba (~500K, ★★★★★), Swavy Curly Courtney (~400K, ★★★★★). Full ranking documented.
- **Catalog validation:** Most-relevant creators overwhelmingly recommend products already in Scrunch catalog. Gaps are incremental additions, not fundamental holes.
- **30 most-mentioned products:** 18 already in catalog ✅, 12 additions needed (prioritized by brand presence).

### HairTok Product Analysis
- **Key insight:** Most HairTok routines are anti-CGM — silicone-heavy, sulfate-laden, designed for straight/smooth transformation, NOT curl enhancement.
- **Wavy vs curly fit:** HairTok is wavy-forward (2A-2C: lighter, scalp-focused) — reveals Scrunch underserves wavies.
- **Add:** Rosemary Oil (universal, CG-approved), K18 Leave-In (bond-repair, verify formula), Olaplex Weightless (community-trusted, verify silicones).
- **Skip:** Dove Derma, Tresemmé Keratin Smooth, Redken lines (harsh sulfates + non-water-soluble silicones, zero curly community adoption).

### Category Expansion
- **`scalp_care`** — NEW: Zero products at time of audit. TikTok + Reddit demand high. Especially for wavies (2A-2C) with oily scalps.
- **`bond_repair`** — NEW: K18, Olaplex trending post-color/bleach. Appeals to Optimizers.
- **`heat_protectant`** — DEFER to Phase 2 (lower curly demand, wavy use only).

### Trending Techniques (Feature Opportunities)
1. **Gel Cast Method (SOTC)** — THE core CGM technique. Scrunch should have dedicated tutorial flow.
2. **Bowl Method** — Viral for wavy types.
3. **Hair Cycling** — Rotating clarifying/moisturizing/protein treatments. TikTok-born concept.
4. **Squish to Condish** — Foundational CGM.
5. **Microplopping, Root Clipping, Refresh Routines** — Simple techniques with viral results.
6. **Scalp-First Routines** — Huge trend crossing into curly space.

### Product Categorization Audit
- **7 products recategorized:** 3 bond-repair (Olaplex No. 3, K18, Curlsmith Bond Rehab) from protein_treatment → bond_repair. 4 scalp oils (As I Am, Hollywood Beauty, Mielle, Eden Bodyworks) from oil_serum → scalp_care.
- **1 duplicate removed:** Acure Dry Shampoo (appeared twice).
- **Root cause:** Product marketing is inconsistent. When name says "scalp," it's scalp_care. Bond-repair ≠ protein treatment (disulfide bonds vs keratin).
- **Catalog gaps:** bond_repair (1→4-5), scalp_care (3→8-9), dry_shampoo (6→8-9).

## Cross-Project Domain Expert Knowledge (injected 2026-05-02)

### From EatDiscounted (Redfoot)
- **Platform accuracy audit:** Review each source for reliability, matching quality, community reports. `\b` word-boundary matching prevents short names matching inside longer words.
- **Dead code identification:** Functions defined + tested but never called. Audit regularly.
- **API landscape audit:** Classify sources as (1) immediately actionable, (2) needs partnership, (3) special handling.
- **Sitemap-based data is most reliable** — extend to all platforms with public directories.

### From HealthStitch (River)
- **Multi-source data ingestion:** Unified ingest service pattern. Applicable to Scrunch's multi-source product data.
- **Rolling baseline computation:** Configurable windows for trending scores (7d, 30d).
- **Expression indexes** on computed columns improve filter performance.
- **Pre-computed aggregates:** Store rollups instead of computing on the fly. Applies to category counts, trending products, popular brands.
- **Gap indicators:** Fill missing dates with `has_data: false` so UI distinguishes "no data" from "zero value."

## Session Archive Summary

Marty completed 4 sessions: comprehensive #HairTok landscape research (15 influencers ranked, 30 products analyzed, 10 trending techniques cataloged), Abbey Yung viral routine analysis (12 products evaluated for CGM compatibility), product categorization audit (7 recategorized, 1 duplicate removed, category expansion recommended), and HairTok product integration decision (3 ADD, 6 SKIP, 2 new categories proposed). Key contribution: identifying wavy-underserving gap and validating existing catalog strength against influencer recommendations.
