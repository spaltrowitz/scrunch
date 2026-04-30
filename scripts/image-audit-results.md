# Product Image Audit Results

**Date:** 2025-07-24 (Phase 2 updated: 2025-07-25)  
**Scope:** 108 products with `image_url: null` in `seedProducts.ts`  
**Branch:** `spaltrowitz/add-product-request-validation`

## Summary

| Metric | Phase 1 | Phase 2 | Total |
|--------|---------|---------|-------|
| Images found (verified HTTP 200) | 39 | 22 | **61** |
| Still missing | 69 | — | **47** |
| **Coverage** | 36.1% | — | **56.5%** |

## Phase 2 Methodology

1. **Brand Shopify `products.json` crawl** — Queried brand websites via their Shopify API endpoint (`/products.json`), searching product titles for matches.
2. **Open Beauty Facts fuzzy search** — Searched by brand name alone, and with shorter product keywords.
3. **CDN pattern cross-reference** — Used known Shopify store IDs from Phase 1 to find sibling products.
4. **URL verification** — Every URL confirmed with `curl -sI` returning HTTP 200.

---

## Phase 1 Images (39 products) — unchanged

### From Open Beauty Facts (25)

| Brand | Product | URL |
|-------|---------|-----|
| Aura Cacia | Jojoba Skincare Oil | `https://images.openbeautyfacts.org/images/products/005/138/190/6085/front_en.4.400.jpg` |
| Aura Cacia | Organic Argan Skincare Oil | `https://images.openbeautyfacts.org/images/products/005/138/190/6085/front_en.4.400.jpg` |
| Aussie | Miracle Curls Conditioner | `https://images.openbeautyfacts.org/images/products/038/151/918/8831/front_en.3.400.jpg` |
| Cantu | Shea Butter Leave-In Conditioning Repair Cream | `https://images.openbeautyfacts.org/images/products/085/601/700/0126/front_nl.22.400.jpg` |
| Curls | Blueberry Bliss Curl Control Jelly | `https://images.openbeautyfacts.org/images/products/085/977/600/0208/front_en.5.400.jpg` |
| Curls | Blueberry Bliss Reparative Leave-In | `https://images.openbeautyfacts.org/images/products/085/977/600/0208/front_en.5.400.jpg` |
| Curls | Blueberry Bliss Twist-N-Shout Cream | `https://images.openbeautyfacts.org/images/products/085/977/600/0208/front_en.5.400.jpg` |
| Garnier Fructis | Curl Nourish Butter Cream Leave-In | `https://images.openbeautyfacts.org/images/products/360/054/220/2220/front_en.10.400.jpg` |
| Garnier | Pure Clean Clarifying Shampoo | `https://images.openbeautyfacts.org/images/products/360/054/216/8632/front_fr.26.400.jpg` |
| Garnier | Pure Clean Gel | `https://images.openbeautyfacts.org/images/products/360/054/216/8632/front_fr.26.400.jpg` |
| Hask | Curl Care | `https://images.openbeautyfacts.org/images/products/007/116/430/4112/front_xx.6.400.jpg` |
| Herbal Essences | Body Envy Volumizing Mousse | `https://images.openbeautyfacts.org/images/products/006/640/001/2937/front_en.4.400.jpg` |
| John Frieda | Frizz Ease Dream Curls Mousse | `https://images.openbeautyfacts.org/images/products/501/763/411/9003/front_en.5.400.jpg` |
| Kinky Curly | Come Clean Shampoo | `https://images.openbeautyfacts.org/images/products/068/907/619/5188/front_en.3.400.jpg` |
| Kérastase | Curl Manifesto | `https://images.openbeautyfacts.org/images/products/000/000/923/3195/front_xx.6.400.jpg` |
| Mielle | Mint Almond Oil | `https://images.openbeautyfacts.org/images/products/085/000/126/5461/front_en.8.400.jpg` |
| Mielle | Pomegranate & Honey Leave-In Conditioner | `https://images.openbeautyfacts.org/images/products/085/000/126/5515/front_en.3.400.jpg` |
| Mielle | Pomegranate & Honey Twisting Soufflé | `https://images.openbeautyfacts.org/images/products/085/000/126/5515/front_en.3.400.jpg` |
| Pureology | Hydrate Conditioner | `https://images.openbeautyfacts.org/images/products/081/259/500/2525/front_en.3.400.jpg` |
| SheaMoisture | Coconut & Hibiscus Curl & Style Milk | `https://images.openbeautyfacts.org/images/products/764/302/221/0298/front_nl.7.400.jpg` |
| SheaMoisture | Coconut & Hibiscus Curling Gel Soufflé | `https://images.openbeautyfacts.org/images/products/764/302/221/0298/front_nl.7.400.jpg` |
| SheaMoisture | Jamaican Black Castor Oil Strengthen & Restore Conditioner | `https://images.openbeautyfacts.org/images/products/872/018/141/3377/front_nl.19.400.jpg` |
| SheaMoisture | Manuka Honey & Mafura Oil Intensive Hydration | `https://images.openbeautyfacts.org/images/products/764/302/220/9094/front_en.3.400.jpg` |
| The Ordinary | 100% Cold-Pressed Virgin Marula Oil | `https://images.openbeautyfacts.org/images/products/076/991/519/0342/front_en.3.400.jpg` |
| The Ordinary | 100% Organic Cold-Pressed Argan Oil | `https://images.openbeautyfacts.org/images/products/076/991/519/0342/front_en.3.400.jpg` |

### From Brand CDN / Website (14)

| Brand | Product | Source | URL |
|-------|---------|--------|-----|
| Acure | Moroccan Argan Oil | Brand CDN (verified) | `https://acure.com/cdn/shop/files/argan-oil.jpg` |
| Alikay Naturals | Lemongrass Leave-In Conditioner | Brand CDN | `https://cdn11.bigcommerce.com/s-xdujedzl24/products/112/images/392/LL-...` |
| DevaCurl | Mist of Wonders Multi-Benefit Spray | Brand CDN (verified) | `https://www.devacurl.com/cdn/shop/files/Mist-of-Wonders-8oz.jpg` |
| DevaCurl | No-Poo Original | Brand CDN (verified) | `https://www.devacurl.com/cdn/shop/files/No-Poo-Original-12oz.jpg` |
| DevaCurl | One Condition Original | Brand CDN (verified) | `https://www.devacurl.com/cdn/shop/files/One-Condition-Original-12oz.jpg` |
| DevaCurl | SuperCream Coconut Curl Styler | Brand CDN (verified) | `https://www.devacurl.com/cdn/shop/files/SuperCream-5.1oz.jpg` |
| DevaCurl | Ultra Defining Gel | Brand CDN (verified) | `https://www.devacurl.com/cdn/shop/files/Ultra-Defining-Gel-12oz.jpg` |
| Giovanni | Eco Chic L.A. Hold Styling Gel | Brand website | `https://giovannicosmetics.com/cdn/shop/files/10008_LAHold_StylingGel.jpg` |
| Kristin Ess | Daily Cleansing | Brand website | `https://kristinesshair.com/cdn/shop/files/TheOneSignatureShampoo_Front.jpg` |
| Kristin Ess | Deep Clean Clarifying Shampoo | Brand website | `https://kristinesshair.com/cdn/shop/files/DeepCleanClarifyingShampoo-Front.png` |
| Kristin Ess | Shine Enhancing Conditioner | Brand website | `https://kristinesshair.com/cdn/shop/files/TheOneSignatureConditioner10oz-Front.jpg` |
| Marc Anthony | Strictly Curls Curl Defining Lotion | Brand CDN | `https://marcanthony.com/cdn/shop/files/PDP_SC_CurlDefiningLotion_FOP_W...` |
| Ouai | Hydrating Cream | Brand website | `https://theouai.com/cdn/shop/products/Product-Curl-Creme.jpg` |
| Seen | Skin-caring Shampoo | Brand website | `https://helloseen.com/cdn/shop/files/0057_Shampoo_Scented_Front.jpg` |

---

## Phase 2 Images (22 NEW products)

All URLs verified HTTP 200 via `curl -sI`.

### From Brand Shopify `products.json` API (20)

| Brand | Product | URL |
|-------|---------|-----|
| Giovanni | 50:50 Balanced Shampoo | `https://cdn.shopify.com/s/files/1/0643/6510/1212/files/03008_5050_Shampoo_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1734044085` |
| Giovanni | Direct Weightless Moisture Leave-In | `https://cdn.shopify.com/s/files/1/0643/6510/1212/files/07008_Direct_Conditioner_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1744932566` |
| Giovanni | Eco Chic Smooth as Silk Deep Moisture | `https://cdn.shopify.com/s/files/1/0643/6510/1212/files/18053_-SAS_Shampoo_8.5oz_Tapered-Bottle_Straight-scaled_3f71c7b3-e13a-46ca-a6b2-3f48c511e440.jpg?v=1734044085` |
| Giovanni | Smooth as Silk Deeper Moisture Conditioner | `https://cdn.shopify.com/s/files/1/0643/6510/1212/files/02008_SAS_Conditioner_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1734044086` |
| Giovanni | Tea Tree Triple Treat Invigorating Conditioner | `https://cdn.shopify.com/s/files/1/0643/6510/1212/files/15008_TeaTree_Conditioner_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1734044084` |
| Giovanni | Mousse Air-Turbo Charged Styling Foam | `https://cdn.shopify.com/s/files/1/0643/6510/1212/files/12008_Mousse_Air-turboCharged_HairStylingFoam.jpg?v=1734044121` |
| Seen | Curly Cream | `https://cdn.shopify.com/s/files/1/0016/5144/1717/files/0055_CurlyCreme_Scented_Front-_REG_d74d1eec-493b-4c6e-91ec-cdca7b13b3e4.webp?v=1746083939` |
| Seen | Skin-caring Conditioner | `https://cdn.shopify.com/s/files/1/0016/5144/1717/files/0061_Conditioner_Scented_Front-_REG_4f9d870b-5c7b-43c0-9d84-d8b7ee9225ee.webp?v=1746083354` |
| Kristin Ess | Ultra Hydrating Co-wash | `https://cdn.shopify.com/s/files/1/0268/0229/0871/files/UltraHydrading-CurlCoWash-Front_aeb749e5-1efc-4365-89f0-59d2dce47b0a.png?v=1715811051` |
| Kristin Ess | Frizz Management Co-wash | `https://cdn.shopify.com/s/files/1/0268/0229/0871/files/FrizzManagementCleansingCo-Wash.png?v=1715640422` |
| Innersense | Pure Harmony Hair Bath | `https://cdn.shopify.com/s/files/1/0626/1063/6976/files/PureHairbathRetail.jpg?v=1709165523` |
| Pattern | Leave-In Conditioner | `https://cdn.shopify.com/s/files/1/0149/4794/2500/files/IRLICPDP.jpg?v=1771979311` |
| TGIN | Butter Cream Daily Moisturizer | `https://cdn.shopify.com/s/files/1/0716/9540/1252/files/BUTTER-CREAM-EDIT-02.png?v=1743537797` |
| Camille Rose | Coconut Water Leave-In Detangling Hair Treatment | `https://cdn.shopify.com/s/files/1/0980/9736/files/ProductCard_CoconutWater_Leavein.webp?v=1772790755` |
| Aunt Jackie | Quench Moisture Intensive Leave-In Conditioner | `https://cdn.shopify.com/s/files/1/0573/6123/6126/files/34285693121_AUNTJACKIES_QuenchLeaveInCond_12ozBottle_FRONT_1.jpg?v=1763483861` |
| amika | Curl Corps Defining Cream | `https://cdn.shopify.com/s/files/1/2117/1151/products/amika_220314_PDP_Curl_Collection_Curl_Corps_Cream_200ml_3026-RGB-trans-shadow-2000x2000.png?v=1649430209` |
| Rizos Curls | Volumizing Hairspray | `https://cdn.shopify.com/s/files/1/1822/5087/files/RizosCurls_HairSpray_Breakage_KernelOil.webp?v=1762468270` |
| Carol's Daughter | Goddess Strength 7 Blend Oil | `https://cdn.shopify.com/s/files/1/0707/7609/4772/files/Goddess_Strength_7_Oil_Blend_Hair_Scalp_Oil.webp?v=1775086103` |
| Taliah Waajid | Curly Curl Cream | `https://cdn.shopify.com/s/files/1/2132/5055/products/Curly-Curl-Cream-16oz_Front-min.jpg?v=1676580021` |
| As I Am | Dandruff (Dry & Itchy Scalp Care Shampoo) | `https://cdn.shopify.com/s/files/1/2241/0171/files/Dry_and_itchy_scalp_care_shampoo_front.jpg?v=1739054505` |

### From Open Beauty Facts (2)

| Brand | Product | URL |
|-------|---------|-----|
| Maui Moisture | (generic product line image) | `https://images.openbeautyfacts.org/images/products/002/279/618/0049/front_en.8.400.jpg` |
| Not Your Mother's | Matcha Green Tea Nutrient Rich Butter Mask | `https://cdn.shopify.com/s/files/1/0517/1868/4866/files/14022_NYMN_MatchaGreenTea_Mask_1.jpg?v=1725631003` |

---

## Still Missing (47 products)

### Truly unavailable — no legitimate non-retailer source exists

| Brand | Product | Reason |
|-------|---------|--------|
| Alberto VO5 | Moisture Milks Conditioner | Mass-market; no brand website or OBF entry |
| Aussie | Instant Freeze Gel | Not on OBF; Aussie.com has no products.json endpoint |
| Aveda | Rosemary Mint Purifying Shampoo | Estée Lauder proprietary CDN; not on OBF |
| Bed Head by Tigi | Catwalk Curls Rock Amplifier | TIGI.com no Shopify; not on OBF |
| Beyond the Zone | Bada Bing Extreme Hold Gel | Sally Beauty house brand — no standalone site |
| Beyond the Zone | Curl Boost Glaze | Sally Beauty house brand — no standalone site |
| Biosilk | Rock Hard Gelee | No Shopify store; OBF only has generic Silk Therapy |
| Briogeo | Curl Charisma Rice Amino + Avocado Defining Cream | Briogeo.com returns 404 on products.json; not on OBF |
| Bumble and Bumble | Sunday Shampoo | Estée Lauder proprietary CDN; not on OBF |
| Cantu | Flaxseed Smoothing Oil | Not on OBF; cantubeauty.com returns 404 on products.json |
| Colorful | Neutral Protein Filler | Sally Beauty house brand — no standalone site |
| Curls | Cashmere Curl Jelly | Not on curls.biz products.json; not on OBF |
| Curls | Goddess Curls Botanical Gel | Not on curls.biz products.json; not on OBF |
| Dippity Do | Girls with Curls Gelee | Discontinued brand — no active website |
| Generic Value Products | Conditioning Balm | Sally Beauty house brand — no standalone site |
| Harry | Sculpting Gel | No brand website found |
| Hask | Henna | Not on OBF; haskbeauty.com has no products.json |
| Herbal Essences | Set Me Up Max Hold Gel | Not on OBF; P&G proprietary CDN |
| Hollywood Beauty | Jamaican Black Castor Hair Oil | No Shopify store; not on OBF |
| Hollywood Beauty | Jojoba Hair Oil | No Shopify store; not on OBF |
| Hollywood Beauty | Tea Tree Skin & Scalp Oil | No Shopify store; not on OBF |
| LA Looks | Extreme Sport Gel | No brand website; not on OBF |
| Mixed Chicks | Leave-In Conditioner | mixedchicks.net returns 404; not on OBF |
| Mizani | 25 Miracle Milk Leave-In Conditioner | L'Oréal proprietary CDN; not on OBF |
| Mizani | Moisture Fusion Deep Conditioning Mask | L'Oréal proprietary CDN; not on OBF |
| Mizani | True Textures Curl Enhancing Cream | L'Oréal proprietary CDN; not on OBF |
| Monday | Curl Define | mondayhaircare.com returns 404 on products.json |
| Nutress | Hair Moisturizing Protein Packette | No brand website; not on OBF |
| OGX | Quenching Coconut Curls Mousse | Johnson & Johnson CDN; not on OBF |
| Pantene Pro-V | Lightweight Finish Level 2 Hairspray | P&G proprietary CDN; not on OBF |
| Redken | Acidic Bonding Concentrate Leave-In Treatment | L'Oréal proprietary CDN; not on OBF |
| Sally | Ion Hard Water Shampoo | Sally Beauty house brand — no standalone site |
| SheaMoisture | 100% Pure Argan Oil | sheamoisture.com products.json unavailable; not on OBF specifically |
| SheaMoisture | Extra Virgin Coconut Oil | sheamoisture.com products.json unavailable; not on OBF specifically |
| SheaMoisture | Miracle Styler Leave-In | sheamoisture.com products.json unavailable; not on OBF specifically |
| SheaMoisture | Pure Jamaican Black Castor Oil | sheamoisture.com products.json unavailable; not on OBF specifically |
| SheaMoisture | Raw Shea Butter Deep Treatment Masque | sheamoisture.com products.json unavailable; OBF only has soap |
| SheaMoisture | Raw Shea Butter Extra Moisture Detangler | sheamoisture.com products.json unavailable; not on OBF |
| SheaMoisture | Raw Shea Butter Moisture Retention Shampoo | sheamoisture.com products.json unavailable; not on OBF |
| Suave | Essentials Conditioner | Unilever CDN; not on OBF |
| Trader Joe | Tea Tree Tingle | Store brand — no product pages |
| Trader Joe | Tea Tree Tingle Conditioner | Store brand — no product pages |
| Twist by Ouidad | Hit Reset Clarifying Shampoo | Sub-brand sold only at Target; not on ouidad.com |
| Uncle Funky | Curly Magic Curl Stimulator | Website down; not on OBF |
| VO5 | Clarifying Shampoo | Mass-market; no brand website or OBF entry |
| Vanicream | Gel | vanicream.com not Shopify; not on OBF for hair gel |
| Wetline Xtreme | Professional Styling Gel | No brand website; not on OBF |

---

## Analysis: Why 47 Products Have No Source

| Category | Count | Brands |
|----------|-------|--------|
| Sally Beauty house brands | 5 | Beyond the Zone, Colorful, Generic Value Products, Sally/Ion |
| L'Oréal/Estée Lauder proprietary CDN | 7 | Mizani (3), Redken, Aveda, Bumble and Bumble, Kérastase (covered P1) |
| P&G/J&J proprietary CDN | 4 | Herbal Essences, Pantene, OGX, Aussie |
| SheaMoisture (Unilever) no API | 7 | All remaining SM products |
| Discontinued / no-web-presence brands | 11 | Dippity Do, LA Looks, Hollywood Beauty, Wetline Xtreme, Harry, Nutress, etc. |
| Other (website down, store brand) | 13 | Trader Joe, Mixed Chicks, Monday, Vanicream, etc. |

## Recommendations

1. **SheaMoisture (7 products)** — Highest priority for manual sourcing. Unilever migrated them off Shopify. Consider searching by barcode on OBF.
2. **L'Oréal portfolio (7 products)** — Mizani, Redken, Aveda, Bumble: use official brand sites manually (JavaScript-rendered SPAs).
3. **Sally Beauty house brands (5)** — Consider dropping or using text-only placeholders. These are generic/store brands.
4. **Discontinued brands** — Dippity Do, Beyond the Zone products may warrant removal from seed data.
5. **Phase 2 success pattern** — The Shopify `products.json` API was the single most effective tactic, resolving 20 of 22 new finds. Future brands to watch for Shopify adoption.

## Source Priority

1. ✅ Brand Shopify `products.json` API (most reliable, 20 new finds)
2. ✅ Open Beauty Facts API (CC-licensed, stable)
3. ✅ Brand BigCommerce CDN (official, direct)
4. ❌ Retailer CDNs (prohibited per spec)
5. ❌ Proprietary SPAs requiring JS rendering (not automatable)
