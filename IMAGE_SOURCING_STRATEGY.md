# Image Sourcing Strategy for 108 Products
**Domain Expert: Marty**
**Date:** 2026-04-30

## Executive Summary
We can legally source images for ~85-95 of the 108 imageless products through a multi-pronged approach: brand Shopify stores, brand-owned CDNs, Open Beauty Facts community photos, and direct brand relationships. Estimated coverage: 80-88% immediate, 95%+ with outreach.

---

## 1. BRAND SHOPIFY STORES (Estimated coverage: 35-40 products)
**Legal Safety:** ⭐⭐⭐⭐⭐ (Highest — direct brand permission implicit in CDN structure)
**Quality:** Professional product photos, high-resolution
**Sustainability:** Permanent (core brand infrastructure)

### Brands with Shopify Presence (Confirmed/Likely):
- **Mielle Organics** — Brand founded post-2018, likely Shopify
- **Cantu** — Independent brand, Shopify likely
- **SheaMoisture** — Check sheamoisture.com (parent co. Sundial)
- **Ouidad** — Premium indie brand, high likelihood
- **DevaCurl** — Iconic CGM brand, owned by Unilever but maintains brand site
- **Pattern** — Independent Black-owned brand (2020), Shopify likely
- **Innersense Organic Beauty** — Premium indie, Shopify likely
- **Jessicurl** — Indie brand, often on Shopify
- **Miss Jessie's** — (if in DB) Indie, Shopify likely
- **Kinky-Curly** — Indie CGM brand, Shopify likely
- **Curls** — Black-owned indie, Shopify infrastructure
- **Aunt Jackie's** — May have brand site
- **Carol's Daughter** — African beauty brand, potential Shopify
- **Creme of Nature** — Premium line, check brand site

### How to Extract:
```
Pattern: https://[brand-shopify].myshopify.com/products/[product-name]
or
https://[brand].com (Shopify backend)
```

### Action:
1. Domain check each brand: `curl -I https://[brandname].com | grep "Shopify\|WooCommerce\|Magento"`
2. Scrape product pages for high-res image URLs (usually in `<img>` or `data-src`)
3. Archive URLs in database with source attribution

---

## 2. OPEN BEAUTY FACTS (Estimated coverage: 30-45 products)
**Legal Safety:** ⭐⭐⭐⭐⭐ (CC-BY-4.0 license, community-driven)
**Quality:** Mixed (professional brand photos + user submissions)
**Sustainability:** High (non-profit, open data)

### Coverage Assessment:
- Currently: 28 products already sourced
- Potential: +30-45 products
- Brands well-represented: SheaMoisture, Giovanni, Garnier, Herbal Essences, OGX, Suave, VO5
- Less represented: Premium brands (Moroccanoil, Kérastase, Seen, Innersense)

### How to Access:
1. **API**: `https://world.openbeautyfacts.org/api/v3/product/[barcode]`
2. **Direct Search**: https://world.openbeautyfacts.org/search (web search)
3. **Community Uploads**: Search by brand name + product
4. **Bulk Data**: https://world.openbeautyfacts.org/data (monthly snapshots)

### Barcode Strategy:
- Match UPC/EAN from product DB to OBF entries
- Many products already have barcodes in DB (if populated)

### Action:
1. Run batch API queries against all products with barcodes
2. Extract `image_front_url` and `image_ingredients_url` fields
3. Validate URLs (HEAD requests) before storing
4. Attribution: "Open Beauty Facts Community"

---

## 3. BRAND OFFICIAL WEBSITES & CDNs (Estimated coverage: 25-35 products)
**Legal Safety:** ⭐⭐⭐⭐⭐ (Brand-owned content)
**Quality:** Professional, high-res
**Sustainability:** Variable (brand may rebrand/restructure)

### Brands with Known Official Presence:
- **Kérastase** (Loréal): kerastase.com (Loréal CDN)
- **Moroccanoil**: moroccanoil.com (brand CDN)
- **Redken** (Loréal): redken.com (Loréal CDN)
- **Garnier** (Loréal): garnier.com (Loréal CDN)
- **Giovanni**: giovanni-haircare.com (likely e-commerce)
- **Hask**: haskhair.com
- **Kristin Ess**: kristinessbeauty.com
- **Seen**: seenbeauty.com (premium brand)
- **Trader Joe's**: traderjoes.com (TJ's CDN)
- **Pantene** (P&G): pantene.com
- **Not Your Mother's**: notyourmothesbrand.com
- **Eco Styler**: usually on EcoStyler.com or beauty distributor sites
- **Carol's Daughter**: carolsdaughter.com

### Image URL Patterns:
- Loréal brands: `images.loreal.com/...` or brand site
- Unilever brands (SheaMoisture, Cantu parent): Often product sites
- Independent brands: Brand.com/cdn usually

### Action:
1. Crawl each brand website for product pages
2. Extract image URLs (typically in `<img src>` or `style="background-image"`)
3. Test persistence (re-crawl monthly to detect dead links)
4. Prefer CDN URLs over dynamic JavaScript rendering

---

## 4. DIRECT BRAND OUTREACH (Estimated coverage: 10-20 products)
**Legal Safety:** ⭐⭐⭐⭐⭐ (Explicit permission)
**Quality:** Whatever brand provides
**Sustainability:** High (documented agreement)

### Brands Most Likely to Respond Positively:
1. **Indie Brands** (natural affinity for community tools):
   - Jessicurl, Kinky-Curly, Ouidad, Mielle, Pattern, Innersense, Carol's Daughter
   - Message: "We're building a curly hair product database for the r/curlyhair community. Can we use your product images?"

2. **Small/Emerging Brands** (need visibility):
   - Seen (clean beauty positioning), Aunt Jackie's, Cantu (if indie-positioned)
   - Message: "Feature your products in curlyhair-focused database"

3. **PR/Brand Manager Access**:
   - Contact: brand@[website].com, info@[website].com, marketing@[website].com
   - Mention: Educational/non-commercial use, r/curlyhair community focus

### Template Email:
```
Subject: Product Images for r/curlyhair Community Database

Hi [Brand],

We're creating a free, open-source product database for the curly hair community 
on r/curlyhair. We'd love to feature [Brand] products with official images.

Can we use high-res photos from your website/press kit? We'll include your brand 
name and link attribution.

Best,
Scrunch Team
```

### Action:
1. Create contact list (info@ + marketing@ + brand manager LinkedIn)
2. Send bulk templated outreach
3. Track responses + permissions in DB
4. Store permission emails in compliance file

---

## 5. OPEN DATA & COMMUNITY SOURCES (Estimated coverage: 5-10 products)
**Legal Safety:** ⭐⭐⭐⭐ (Verify CC license on each)
**Quality:** Mixed
**Sustainability:** Varies

### Viable Sources:
1. **IsItCG.com** — Community-driven CGM product database
   - May have images or links to them
   - Possible data partnership or image linking

2. **r/curlyhair Wiki & Community** — User photos
   - Search Reddit for product mention + "[product] review photo"
   - Verify: User-posted content is generally CC-BY-SA (Reddit ToS)
   - Use only if explicitly CC-licensed or user gives permission

3. **Wikimedia Commons** — Public domain/CC-licensed
   - Search: `[brand] [product name] hair care`
   - Limited but possible

4. **Beauty Blogs with CC Licenses**:
   - Curlgeek.com, NaturallyCurly.com forums
   - Check license before use

### Action:
- Search each by brand name
- Verify license before linking
- Low priority (time-intensive for small coverage)

---

## 6. INFLUENCER/REVIEW SITES & BRAND PARTNERSHIPS (Estimated coverage: 5-10 products)
**Legal Safety:** ⭐⭐⭐ (Verify per-site license/partnership)
**Quality:** Often professional
**Sustainability:** Medium (sites may move/restructure)

### Potential Partners:
1. **CurlsBot** (Curly Girl Method community site)
   - May have product photos
   - Known to community, possible data sharing agreement

2. **YouTubers/Bloggers with Brand Deals**:
   - Many curly hair influencers have brand partnerships
   - Some provide CC-licensed content
   - Examples: Swavy Curvy Code, CurlyGirlDiaries (check individual licenses)

3. **Beauty Box Websites** (if used in promotions):
   - IPSY, FabFitFun, Birchbox
   - May have product photos in "past boxes" sections
   - Lower likelihood of permission for use

### Action:
- Low priority unless brand specifically offers assets
- Risk: Heavy follow-up for little gain

---

## 7. MANUFACTURER/DISTRIBUTOR PRESS KITS (Estimated coverage: 10-15 products)
**Legal Safety:** ⭐⭐⭐⭐ (Explicit for "editorial use")
**Quality:** Professional photos
**Sustainability:** Medium

### Major Corporations with Press Pages:
- **Loréal** (Kérastase, Garnier, Redken): loreal.com/press
- **Unilever** (SheaMoisture): unileverusa.com/press
- **P&G** (Pantene): pg.com/press
- **Henkel** (if any brands): henkelusa.com/press

### What to Find:
- Brand media kits (downloadable)
- "Use Our Images" sections (often CC or free for editorial)
- High-res product photos
- Brand assets libraries

### Action:
1. Visit [corporation].com/press for each parent company
2. Look for "Media Kit" or "Brand Assets" download
3. Verify editorial use rights
4. Download and archive

---

## 8. CREATIVE ALTERNATIVES & WORKAROUNDS (Estimated coverage: 5 products)

### A. Placeholder System + User Upload
- Generate procedural placeholders (brand color, product name)
- Allow community to upload verified product photos
- Tag as "user-verified" vs "official"
- *Caveat*: Requires moderation, but builds community

### B. Brand Logo + Product Description
- If image unavailable, display brand logo + detailed ingredients/reviews
- Less visually compelling but legally safe
- *Use for*: Discontinued or very niche products

### C. Screenshot Aggregation (Limited Use)
- r/curlyhair users often screenshot packaging
- Could request permission from content creators
- Attribute: "User photo from r/curlyhair — [user]"
- Risk: Time-intensive, variable quality

---

## IMPLEMENTATION ROADMAP

### Phase 1: Quick Wins (Week 1) — Est. 50-60 products
1. **Shopify domain audit** (1 day)
   - Check all 20-25 indie brands for Shopify/ecommerce
   - Script: `for brand in $(brands.txt); do curl -I https://${brand}.com 2>&1 | grep -i shopify; done`

2. **Open Beauty Facts API batch query** (1 day)
   - Run all products with barcodes through OBF API
   - Extract image URLs + verify (HEAD requests)
   - ~30-40 products likely

3. **Brand CDN crawl** (2 days)
   - Crawl official sites for Kérastase, Garnier, Moroccanoil, Giovanni, etc.
   - Extract product image URLs
   - ~25-35 products

### Phase 2: Medium Effort (Week 2-3) — Est. +20-30 products
1. **Direct brand outreach** (3-5 days)
   - Email indie brands (highest response rate)
   - Follow up after 5 days
   - Target: Mielle, Pattern, Jessicurl, Ouidad, Innersense, Carol's Daughter
   - Est. 40-50% response rate = 6-10 products

2. **Press kit harvesting** (2 days)
   - Visit Loréal, Unilever, P&G press pages
   - Download media kits
   - Est. 10-15 products

### Phase 3: Long Tail (Week 4+) — Est. +5-10 products
1. **Community data sources** (2-3 days)
   - IsItCG.com partnership outreach or image scraping
   - CurlsBot integration
   - Influencer outreach (lower priority)

2. **Placeholder system** (optional)
   - For remaining 5-10 products, create fallback visual UI

---

## FINAL COVERAGE ESTIMATE

| Source | Est. Products | Confidence | Legal Risk |
|--------|---|---|---|
| Shopify Stores | 35-40 | 85% | Minimal |
| Open Beauty Facts | 30-45 | 90% | None |
| Brand Official Sites | 25-35 | 80% | Minimal |
| Direct Brand Outreach | 10-20 | 60% | None |
| Press Kits | 10-15 | 70% | Minimal |
| Community/Other | 5-10 | 50% | Low-Medium |
| **Total Coverage** | **115-165** | — | — |
| **Realistic Overlap Adjustment** | **85-95** | **80-85%** | — |

**Minimum Guaranteed**: 85 products (80%)
**Optimistic Target**: 95+ products (88%+)
**Remaining Gap**: 5-15 products (may be discontinued, invalid, or niche)

---

## LEGAL & COMPLIANCE NOTES

✅ **Safe Approaches:**
- Brand Shopify CDNs (implicit permission)
- Open Beauty Facts (CC-BY-4.0)
- Brand official websites
- Explicit brand permission (email)
- Brand press kits (editorial use)

❌ **Prohibited:**
- Retailer CDNs (Amazon, Target, Ulta, Walmart) — ToS violates commercial use
- User photos without permission — copyright retained by photographer
- Aggregating screenshots — derivative works, murky rights

⚠️ **Recommended Practices:**
1. Store source attribution with each image URL
2. Monitor URLs quarterly (dead link detection)
3. Document all brand outreach + permissions
4. Create "image source: [brand official]" field in DB schema
5. Audit compliance annually as brands change

---

## NEXT STEPS FOR IMPLEMENTATION TEAM

1. **Frenchy** (Frontend): Design product card fallback for missing images
2. **Danny** (Backend): Build image URL validator + batch OBF API ingester
3. **Kenickie** (PM): Prioritize brand outreach list (indie brands first)
4. **Rizzo** (Tester): Verify image URLs don't break; test CDN persistence
5. **Scribe**: Document all image sources in compliance file

**Expected Timeline**: 4 weeks for 80%+ coverage | 8 weeks for 95%+
**Estimated Person-Hours**: 60-80 hours (mostly automation + outreach)
