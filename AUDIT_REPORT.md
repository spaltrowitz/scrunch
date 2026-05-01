# Product Categorization Audit — Scrunch Seed Catalog

**Audit Date:** 2026-05-02  
**Auditor:** Marty (Domain Expert — Curly Hair Care)  
**Requested by:** Shari Paltrowitz  
**Total Products Reviewed:** 299 across 16 categories

---

## Executive Summary

**Finding:** The catalog has **significant miscategorization issues**, primarily:
1. **Bond repair products misplaced** in `protein_treatment` category
2. **Scalp care products living in `oil_serum`** — they have "scalp" in the name/notes but wrong category
3. **Duplicate/redundant products** in `dry_shampoo`
4. **Very thin categories** (bond_repair: 1, scalp_care: 3, dry_shampoo: 6) need filling

---

## A. PRODUCTS TO MOVE (Immediate Fixes)

### Priority 1: Bond Repair Miscategorization
These are clearly bond-building treatments but wrongly sit in `protein_treatment`:

| # | Product | Brand | Current Category | MOVE TO | Reason |
|----|---------|-------|------------------|---------|--------|
| 1 | No. 3 Hair Perfector | Olaplex | protein_treatment → | **bond_repair** | Explicitly described as "bond builder"; flagship product marketed for bond repair |
| 2 | Leave-In Molecular Repair Hair Mask | K18 | protein_treatment → | **bond_repair** | "Bond-repair technology"; viral #HairTok trending; uses keratin-peptide repair technology, not pure protein |
| 3 | Bond Curl Rehab Salve | Curlsmith | protein_treatment → | **bond_repair** | "Bond curl" in name; designed for broken disulfide bonds from heat/color |

### Priority 2: Scalp Care Products Hiding in Oil/Serum
These have explicit scalp-care purpose but are in `oil_serum`:

| # | Product | Brand | Current Category | MOVE TO | Reason |
|----|---------|-------|------------------|---------|--------|
| 1 | Dry Itchy Scalp Care Oil | As I Am | oil_serum → | **scalp_care** | "Scalp care" in name; designed for scalp itch/dryness, not general shine sealing |
| 2 | Tea Tree Skin & Scalp Oil | Hollywood Beauty | oil_serum → | **scalp_care** | "Scalp" in name; tea tree is scalp-specific; for oil control + soothing |
| 3 | Rosemary Mint Scalp & Hair Strengthening Oil | Mielle | oil_serum → | **scalp_care** | "Scalp" in name; #HairTok trending for scalp health; used for growth + circulation, not styling |
| 4 | Peppermint Tea Tree Hair Oil | Eden Bodyworks | oil_serum → | **scalp_care** | Peppermint + tea tree = scalp treatments; for stimulation + clarifying, not moisture sealing |

### Priority 3: Duplicate Products  
Same product listed twice with identical specs:

| # | Product | Brand | Category | Note |
|----|---------|-------|----------|------|
| 1 | Dry Shampoo | Acure | dry_shampoo | **Remove duplicate** — appears 2x in seed file |

---

## B. PRODUCTS TO ADD (Filling Thin Categories)

### 1. BOND REPAIR (currently 1 → needs 4-5 more)

Well-known bond repair products missing:

| Brand | Product | Why Add | Price Range | CGM Status |
|-------|---------|---------|-------------|------------|
| Olaplex | No. 0 Intensive Bond Building Treatment | Primer for No. 3; already have No. 3 | ~$35 | Caution (in catalog but in oil_serum, should move) |
| SheaMoisture | Bond Maintainer Strengthening Conditioner | Affordable bond repair; complements Olaplex | ~$12 | Likely approved |
| Briogeo | Don't Despair Repair Deep Conditioning Mask | #HairTok staple; deep repair (currently deep_conditioner, not bond repair) | ~$32 | Not approved (drying alcohol) |
| Aunt Jackie's | Don't Burn My Hair Protein Conditioner | Budget-friendly bond support; strength building | ~$3 | Caution (needs verification) |

### 2. SCALP CARE (currently 3 → needs 5-6 more)

Popular scalp care products missing (especially oils with scalp-specific benefits):

| Brand | Product | Why Add | Price Range | CGM Status |
|-------|---------|---------|-------------|------------|
| Dr. Jart+ | Cicapair Cream | K-beauty scalp calming; popular with curly community | ~$40 | Likely approved |
| Cantu | Shea Butter Leave-In Conditioning Repair Cream | Already have oils; Cantu's scalp serum would add to scalp line | ~$8 | Likely approved |
| Innersense | Yucca Baobab Scalp Oil | Already in catalog; scalp-focused variant should be added | ~$42 | Likely approved |
| SheaMoisture | Raw Shea Butter Restorative Shea & Argan Oil | Already in catalog; this is the scalp-specific version | ~$12 | Likely approved |
| Tea Botanicals | Moroccan Tea Scalp Care Treatment | Trending; moroccan oils + scalp focus | ~$22 | Likely approved |

### 3. DRY SHAMPOO (currently 6 → needs 3-4 more)

Popular dry shampoos missing:

| Brand | Product | Why Add | Price Range | CGM Status |
|-------|---------|---------|-------------|------------|
| Bumble and Bumble | Dry Shampoo | Cult classic; lightweight for curls | ~$30 | Caution (verify silicones) |
| Living Proof | Advanced Dry Volume Shampoo | Award-winning; silicone-free formulation | ~$35 | Likely approved |
| Batiste | Dry Shampoo for Colored Hair | Already have original; colored hair variant for protection | ~$5 | Not approved (silicones) |
| Davines | Dry Shampoo | Premium Italian brand; likely CG-approved | ~$28 | Likely approved |

---

## C. OTHER CATEGORIZATION ISSUES FOUND

### 1. Misplaced Products Requiring Verification
- **Briogeo Don't Despair Repair** → Currently in `deep_conditioner` but marked as #HairTok trending for "deep conditioning". This product is actually a **bond repair mask** (its primary function is repairing broken bonds post-color/bleach). **SUGGEST: Move to bond_repair OR note prominently that it has bond-repair benefits.**

### 2. Confusing Category Overlaps
- **Briogeo Don't Despair Repair** in `deep_conditioner` vs. K18/Olaplex No. 3 in `protein_treatment` — this inconsistency confuses users about what "repair" means:
  - Some repair = deep conditioning (hydration)
  - Some repair = bond building (structural)
  - **ACTION: Clarify category descriptions in UI to distinguish these two repair types**

### 3. Products Marked "not_approved" but Trending
Several bond-repair products are marked CG-status `not_approved` but are viral #HairTok staples:
- K18 Leave-In Molecular Repair Hair Mask → `not_approved` (drying alcohol)
- Olaplex No. 0 Intensive Bond Building Treatment → `caution`  
- Briogeo Don't Despair Repair → `not_approved` (drying alcohol)

**This is intentional and correct** — these products contain alcohol to enable the bond-building chemistry. The "not approved" status is accurate per CGM standards, but the category placement suggests they belong in this collection anyway (for "aware users" shopping for bond repair).

---

## D. RECOMMENDATIONS FOR DANNY (Implementation)

### Immediate Actions (High Priority)

**MOVE operations:**
```
1. Olaplex No. 3 Hair Perfector           | protein_treatment → bond_repair
2. K18 Leave-In Molecular Repair Hair Mask | protein_treatment → bond_repair
3. Curlsmith Bond Curl Rehab Salve        | protein_treatment → bond_repair
4. As I Am Dry Itchy Scalp Care Oil       | oil_serum → scalp_care
5. Hollywood Beauty Tea Tree Skin & Scalp Oil | oil_serum → scalp_care
6. Mielle Rosemary Mint Scalp & Hair Strengthening Oil | oil_serum → scalp_care
7. Eden Bodyworks Peppermint Tea Tree Hair Oil | oil_serum → scalp_care
```

**DELETE duplicates:**
```
1. Acure Dry Shampoo (remove one instance; keep one)
```

### Short-term Actions (Product Additions)

**ADD to bond_repair (2-3 products):**
- Olaplex No. 0 Intensive Bond Building Treatment (move from oil_serum OR add as new entry)
- SheaMoisture Bond Maintainer Strengthening Conditioner

**ADD to scalp_care (3-4 products):**
- Dr. Jart+ Cicapair Cream
- Innersense Yucca Baobab Scalp Oil (already have brand; add this variant)
- SheaMoisture Raw Shea Butter Restorative Shea & Argan Oil (already have brand; add this variant)

**ADD to dry_shampoo (1-2 products):**
- Bumble and Bumble Dry Shampoo
- Davines Dry Shampoo

### Medium-term Actions (Strategic)

1. **Review category descriptions** for "repair" — clarify in UI that bond_repair ≠ deep_conditioner (both heal hair but different mechanisms)
2. **Verify CG-status** for newly added products (especially bond-repair ones; many intentionally non-CG due to alcohol)
3. **Consider sub-tagging** products with "bond-repair benefits" even if in other categories, to help "Optimizer" persona discover them

---

## Marty's Domain Notes

**Why these miscategorizations happen:**
- Product marketing is inconsistent. A "Repair" product could mean: hydration repair (deep conditioner), protein repair (protein treatment), or bond repair (chemical restructuring).
- #HairTok products blur these lines — they're trending across multiple use cases.
- The scalp-care oil question is real: pure oils can seal moisture (oil_serum) OR nourish scalp (scalp_care). **Context matters.** An oil with "scalp" in the name + tea tree/peppermint is clearly scalp-targeting.

**What this tells us about user needs:**
- Users are searching for **bond repair** heavily (#HairTok influence). We buried it. ONE product is embarrassing for a category with 3-4 household-name options.
- **Scalp care is exploding** (wavy users especially). We have 3 products. Not nearly enough.
- **Dry shampoo has fans** but we're weak here. This is a refresh category (between-wash maintenance) that wavies love.

**Next audit priority:**
Once moves/additions are done, audit `protein_treatment` category — it's now become a catch-all for any "strengthening" product and may have other misfits.

