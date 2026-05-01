# Decision: HairTok Product Categories

**Date:** 2025-07-25
**Author:** Danny (Backend Dev)
**Status:** Implemented

## Context
Shari requested HairTok-sourced products be added to the Scrunch catalog with new product categories.

## Decision
1. Added two new ProductCategory values: `scalp_care` and `bond_repair`.
2. Added `hairtok_trending?: boolean` optional field to the `SeedProduct` interface for filtering.
3. Existing products that were already in the catalog under other categories (protein_treatment, oil_serum, deep_conditioner, curl_cream) were NOT moved — they were tagged with `hairtok_trending: true` and `#HairTok` notes in place.

## Rationale
- Moving existing products to new categories would break any user reviews or saved references tied to those products.
- The `hairtok_trending` field plus notes-based `#HairTok` tagging gives us two ways to filter: structured (boolean) and text-based (notes search).
- `scalp_care` is distinct from existing `scalp_treatment` — scalp_treatment is for medical/therapeutic products, scalp_care is for wellness/maintenance (oils, serums).

## Impact
- Frontend (Frenchy): New categories will need filter UI support in Products page.
- Database: No migration needed — seed data only. If/when we sync to Supabase, the `product_category` enum will need `scalp_care` and `bond_repair` added.
