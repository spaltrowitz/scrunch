When assigned a GitHub Issue with the `product-request` label, follow this process to add the product to the Scrunch database:

## Step 1: Parse the issue
Extract the brand name, product name, category, and any product link from the issue body.

## Step 2: Research the product
1. Search for the product on the brand's website, Target, Ulta, Walmart, or Amazon
2. Find the full ingredient list
3. Find a product image URL (prefer Target scene7 CDN > Ulta > Walmart > brand site)
4. Determine CG status by analyzing ingredients against curly girl method rules:
   - Non-water-soluble silicones → not_approved
   - Harsh sulfates (SLS, SLES) → not_approved (unless clarifying shampoo)
   - Drying alcohols (isopropyl, denatured) → not_approved
   - Mineral oil, petrolatum → not_approved
   - Water-soluble silicones (PEG-modified) → caution
5. Determine cruelty-free status (check Leaping Bunny, PETA, CFK databases)
6. Map to the correct product category from this list:
   - clarifying_shampoo, low_poo, co_wash, rinse_out_conditioner
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
- Always include an image_url — use the image waterfall: Target > Ulta > Walmart > brand site > Open Beauty Facts > null
- The notes field should include cruelty-free certification (PETA, LB, CFK) and any relevant warnings (fragrance-free, sample sizes available, etc.)
