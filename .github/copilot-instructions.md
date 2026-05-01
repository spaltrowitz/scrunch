When assigned a GitHub Issue with the `product-request` label, follow this process to add the product to the Scrunch database:

## Step 0: Validate the request

Before doing any research, verify that the request is for a legitimate hair care product:

1. **Check that the product is a hair care product.** Scrunch only tracks hair care products (shampoos, conditioners, gels, creams, oils, treatments, etc.). If the submitted brand/product name clearly refers to a non-hair-care item (e.g., household goods, food, clothing, electronics, skincare-only products, body wash, etc.), **reject the request immediately**.
2. **Check for spam or joke submissions.** Reject requests that contain nonsensical text, profanity, obvious trolling, or product names that don't correspond to any real product.
3. **Check for duplicates.** Search `src/data/seedProducts.ts` for the brand + product name. If it already exists, close the issue as a duplicate.

**How to reject:**
- Add a comment explaining why (e.g., "This doesn't appear to be a hair care product" or "This looks like a duplicate of an existing product")
- Add the `invalid` label to the issue
- Close the issue
- Do NOT create a PR or modify any code

Only proceed to Step 1 if the request passes all validation checks.

## Step 1: Parse the issue
Extract the brand name, product name, category, and any product link from the issue body.

## Step 2: Research the product
1. Search for the product on the brand's website, Target, Ulta, Walmart, or Amazon
2. Find the full ingredient list
3. Find a product image URL — see **Image Sourcing Policy** below
4. Determine CG status by analyzing ingredients against curly girl method rules:
   - Non-water-soluble silicones → not_approved
   - Harsh sulfates (SLS, SLES) → not_approved (unless clarifying shampoo)
   - Drying alcohols (isopropyl, denatured) → not_approved
   - Mineral oil, petrolatum → not_approved
   - Water-soluble silicones (PEG-modified) → caution
5. Determine cruelty-free status (check Leaping Bunny, PETA, CFK databases)
6. Map to the correct product category from this list:
   - clarifying_shampoo, dry_shampoo, low_poo, co_wash, rinse_out_conditioner
   - deep_conditioner, leave_in_conditioner, curl_cream, gel
   - mousse, custard, oil_serum, spray_refresher
   - protein_treatment, scalp_treatment

## Step 3: Add to seed data
Edit `src/data/seedProducts.ts` and add a new entry to the SEED_PRODUCTS array in the appropriate category section:

```typescript
{ brand: 'Brand Name', name: 'Product Name', category: 'category_here', cg_status: 'approved', cruelty_free: 'yes', notes: 'Any relevant notes', image_url: 'https://...' },
```

## Step 4: Verify
- Run `npm run build` to ensure no TypeScript errors
- Verify the product count increased

## Step 5: Create PR
- Create a branch named `add-product/{brand}-{product}` (kebab-case)
- Commit with message: `Add {Brand} {Product Name} to product database`
- Create a PR referencing the original issue: `Closes #{issue_number}`
- Add the `product-request` label to the PR

## Step 6: Comment on issue
Comment on the original issue with:
- ✅ Product added
- The CG status determined
- The Scrunch Score
- Link to the PR

## Important notes
- If you cannot find reliable ingredient data, comment on the issue asking the requester to provide ingredients
- If the product appears to be discontinued, comment noting this and label the issue `discontinued`
- The notes field should include cruelty-free certification (PETA, LB, CFK) and any relevant warnings (fragrance-free, sample sizes available, etc.)

## Image Sourcing Policy

Product images must come from **approved sources only**. Before adding any image_url, verify the domain is allowed.

### Allowed sources ✅ (in priority order)
1. **Brand's own official website** — The brand owns the copyright and benefits from product visibility. This is the preferred source. Look for product pages on the brand's `.com` site or their Shopify CDN (e.g., `brandname.com/cdn/shop/...`).
2. **Open Beauty Facts** (`images.openbeautyfacts.org`) — Community-contributed, open license.
3. **Product submitted by the requester** — If the issue includes a direct image URL from an allowed source.

### Prohibited sources ❌
These retailer CDNs must **never** be used. Their Terms of Service prohibit hotlinking and their product photos are separately copyrighted.

| Domain pattern | Retailer |
|---|---|
| `target.scene7.com` | Target |
| `media.ulta.com` | Ulta |
| `i5.walmartimages.com`, `walmartimages.com` | Walmart |
| `pics.walgreens.com` | Walgreens |
| `m.media-amazon.com`, `images-na.ssl-images-amazon.com` | Amazon |
| `s7d9.scene7.com` | Sally Beauty |

### Image search process
When looking for a product image, follow this waterfall — **do not stop until you have exhausted all options**:

1. Search the brand's own website for the product page and grab the product image URL
2. Search Open Beauty Facts: `https://world.openbeautyfacts.org/cgi/search.pl?search_terms={brand}+{product}&json=1`
3. Search for `{brand} {product name} site:{brand-domain}` to find the product page
4. Check if the product link provided in the issue has a compliant image
5. Only use `null` as an absolute last resort — and add a note explaining that no compliant image could be found

### Validating image URLs on product requests
When a user submits a product request with a product link, check the domain against the prohibited list above. If the link points to a prohibited retailer, still use it for ingredient research, but **source the image from the brand's own website instead**.

## Rejection criteria (Step 0 detail)
A product request should be rejected if ANY of the following are true:
- The product is not designed for use on hair (e.g., body lotion, face wash, laundry detergent, blankets, food)
- The brand/product name is gibberish or clearly a joke
- You cannot find evidence the product exists from any retailer or brand website
- The product has already been added to `seedProducts.ts`
