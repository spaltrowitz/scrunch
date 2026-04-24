// Script to update product image URLs in seedProducts.ts and Supabase

const SUPABASE_URL = "https://rqmplfyuonkikdmqngrj.supabase.co/rest/v1/products";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbXBsZnl1b25raWtkbXFuZ3JqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAzMDE5MywiZXhwIjoyMDkyNjA2MTkzfQ.6_zuXyfqG9byrHm_XrsQ8qew6kLxL3Wh4AJwPLXaWtI";

// All 52 products with their OLD (broken/null) and NEW image URLs
const updates = [
  // === BROKEN URLs (38) ===
  {
    brand: "Bounce Curl", name: "Gentle Clarifying",
    oldUrl: "https://m.media-amazon.com/images/I/715g3wHnexL._SY445_.jpg",
    newUrl: "https://www.bouncecurl.com/cdn/shop/files/clarifying-shampoo-pdp-main_1200x1200.png"
  },
  {
    brand: "Innersense", name: "Hydrating Cream Hair Bath",
    oldUrl: "https://m.media-amazon.com/images/I/61thnzm5vBL._SL1500_.jpg",
    newUrl: "https://media.ulta.com/i/ulta/2572256"
  },
  {
    brand: "Jessicurl", name: "Gentle Lather",
    oldUrl: "https://m.media-amazon.com/images/I/81dHJdj1tGL._SX679_.jpg",
    newUrl: "https://jessicurl.com/cdn/shop/files/GL-N3.jpg"
  },
  {
    brand: "Monday", name: "Curl Define",
    oldUrl: "https://i5.walmartimages.com/seo/MONDAY-HAIRCARE-Curl-Define-Shampoo-12oz-Nourishing-Curls-Tames-Frizz-Enhances-Shine-with-Coconut-Oil-and-Shea-Butter_3f627fd8-fc76-4937-b6f2-dc50e7cafb4e.dffdba84825af35f75345b29e51b2e21.jpeg",
    newUrl: "https://i5.walmartimages.com/asr/60a5eeec-af87-4bc0-9ea1-50177d3712d8.5c748b53bcc044b71d57aa1a14b582b5.jpeg"
  },
  {
    brand: "SheaMoisture", name: "Jamaican Black Castor Oil Strengthen & Restore Shampoo",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_5a80b4c1-49d6-4ff2-bdd8-2de7deaff8fd",
    newUrl: "https://i5.walmartimages.com/seo/SheaMoisture-Jamaican-Black-Castor-Oil-Strengthen-Restore-Shampoo-13-0-Fl-Oz_681718115.jpeg"
  },
  {
    brand: "Aveda", name: "Be Curly Co-wash",
    oldUrl: "https://www.aveda.com/media/images/products/355x600/white/av_sku_VAAX01_185281_355x600_0.jpg",
    newUrl: "https://media.ulta.com/i/ulta/2596453"
  },
  {
    brand: "Generic Value Products", name: "Conditioning Balm",
    oldUrl: "https://www.sallybeauty.com/dw/image/v2/BCSM_PRD/on/demandware.static/-/Sites-SBS-SallyBeautySupply/default/dwac55ece0/images/large/SBS-264079.jpg",
    newUrl: "https://s7d9.scene7.com/is/image/SallyBeauty/SBS-264079"
  },
  {
    brand: "SheaMoisture", name: "Manuka Honey & Mafura Oil Intensive Hydration",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_5e3eaf4b-5f12-4a8e-918c-b1bc48960293",
    newUrl: "https://i5.walmartimages.com/seo/SheaMoisture-Intensive-Hydration-Hair-Masque-Manuka-Honey-Mafura-Oil-For-Dry-Damaged-Hair-Deep-Conditioning-Hair-Treatment-11-5-oz_46840303.jpeg"
  },
  {
    brand: "Beyond the Zone", name: "Curl Boost Glaze",
    oldUrl: "https://www.sallybeauty.com/dw/image/v2/BCSM_PRD/on/demandware.static/-/Sites-SBS-SallyBeautySupply/default/dw8eb68852/images/large/SBS-140743.jpg",
    newUrl: "https://s7d9.scene7.com/is/image/SallyBeauty/SBS-140743"
  },
  {
    brand: "Curls", name: "Cashmere Curl Jelly",
    oldUrl: "https://i5.walmartimages.com/seo/Curls-Organic-Cashmere-Curl-Jelly-for-Styling-Shine-Texture-Hair-Repair-8-oz_a687d39a-55b4-4003-b010-f8721cff7c7a.f215e7842d2e77797cd98b937e83e16e.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/CURLS-Curls-Cashmere-Curl-Jelly-Size-8-oz_107381207.jpeg"
  },
  {
    brand: "Beyond the Zone", name: "Bada Bing Extreme Hold Gel",
    oldUrl: "https://www.sallybeauty.com/dw/image/v2/BBLS_PRD/on/demandware.static/-/Sites-master-catalog/default/dw1e6b23fc/hi-res/SBS140654.jpg",
    newUrl: "https://s7d9.scene7.com/is/image/SallyBeauty/SBS-140654"
  },
  {
    brand: "Curls", name: "Goddess Curls Botanical Gel",
    oldUrl: "https://i5.walmartimages.com/asr/7321423a-9ff5-48e0-987e-6fef8cf69ad8.8b3b26e97eebf9a45aa7e175445606d7.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/Curls-Curls-Botanical-Gelle-8-oz_40727796.jpeg"
  },
  {
    brand: "Eco Styler", name: "Gel",
    oldUrl: "https://i5.walmartimages.com/asr/ed21e515-e2b8-4ad5-b771-334383c9f383_1.98d3297b657813c60cf0736cfac899aa.jpeg",
    newUrl: "https://i5.walmartimages.com/asr/6e9aed5f-b1ba-4186-9ad2-f57ddb551aa7.2b62f8d7197e55ec050d09309a7aea70.jpeg"
  },
  {
    brand: "Herbal Essences", name: "Set Me Up Max Hold Gel",
    oldUrl: "https://m.media-amazon.com/images/I/71WgwA43UtL._SX522_.jpg",
    newUrl: "https://i5.walmartimages.com/seo/Herbal-Essences-Touchable-Spray-Hair-Gel-for-Frizz-Control-24-Hour-Hold-Styling-Gel-8-oz_a5b0f5b1.jpeg"
  },
  {
    brand: "LA Looks", name: "Extreme Sport Gel",
    oldUrl: "https://i5.walmartimages.com/asr/6ec830c0-ef7b-43f6-8e7a-b63fb7b6b3fd_1.fdc3ef7f390d954e0685e70f3e6fff2e.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/L-A-LOOKS-Extreme-Sport-Tri-Active-Hold-Gel-for-All-Hair-Types-Men-20-oz_10307222.jpeg"
  },
  {
    brand: "TréLuxe", name: "Hi! Definition Gel",
    oldUrl: "https://m.media-amazon.com/images/I/61O-JsXv-1L._SL1500_.jpg",
    newUrl: "https://curlwarehouse.com/cdn/shop/products/Hi-Definition-Gel-Web.jpg"
  },
  {
    brand: "Herbal Essences", name: "Body Envy Volumizing Mousse",
    oldUrl: "https://i5.walmartimages.com/seo/Herbal-Essences-Body-Envy-Volumizing-Mousse-6-8-oz_b0e32d8d-b3c4-45b7-a4cf-8ad50db5ce38.479ace560fd1e321e0d6e82312e2752b.jpeg",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_a9d26bae-4b37-4f63-9d2f-8ee2e15d9e06"
  },
  {
    brand: "Acure", name: "Moroccan Argan Oil",
    oldUrl: "https://www.vitacost.com/Images/Products/500/Acure/Acure-The-Essentials-Moroccan-Argan-Oil-854049002200.jpg",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_21d3db06-2c08-4bf6-b0dc-8e5f7e3a54b2"
  },
  {
    brand: "Mielle", name: "Mint Almond Oil",
    oldUrl: "https://mielleorganics.com/cdn/shop/products/MIELLE_ORGANICS_MINT_ALMOND_OIL_8OZ_159505819_600x.jpg",
    newUrl: "https://i5.walmartimages.com/seo/Mielle-Organics-Mint-Almond-Oil-8-fl-oz_589410431.jpeg"
  },
  {
    brand: "Nutress", name: "Hair Moisturizing Protein Packette",
    oldUrl: "https://www.sallybeauty.com/dw/image/v2/BCSM_PRD/on/demandware.static/-/Sites-SBS-SallyBeautySupply/default/dw0e068023/images/large/SBS-151000.jpg",
    newUrl: "https://s7d9.scene7.com/is/image/SallyBeauty/SBS-151000"
  },
  {
    brand: "Olaplex", name: "No. 3 Hair Perfector",
    oldUrl: "https://www.olaplex.com/cdn/shop/files/OLAPLEX_No_3_100ml_USA.jpg",
    newUrl: "https://media.ulta.com/i/ulta/2551053"
  },
  {
    brand: "Acure", name: "Curiously Clarifying Shampoo",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_bb389b7c-b2c1-4c1e-b53d-f2c13bd3b4b4",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_bb389b7c-b2c1-4c1e-b53d-f2c13bd3b4b4"
  },
  {
    brand: "Curlsmith", name: "Essential Moisture Cleanser",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_e893c2d1-5779-4eb9-b784-c69c6e6f0d97",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_e893c2d1-5779-4eb9-b784-c69c6e6f0d97"
  },
  {
    brand: "SheaMoisture", name: "Raw Shea Butter Moisture Retention Shampoo",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_d8f55f9e-3e4e-4e80-b7bc-bbcee3de4fde",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_d8f55f9e-3e4e-4e80-b7bc-bbcee3de4fde"
  },
  {
    brand: "Aussie", name: "Miracle Curls Conditioner",
    oldUrl: "https://i5.walmartimages.com/seo/Aussie-Miracle-Curls-Conditioner-with-Coconut-Jojoba-Oil-26-2-fl-oz_3e73df2a-d44f-40b2-bb1f-e93cc39e0c4a.a1c3e6a0b5c78f89e1d29e4c54c7c090.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/Aussie-Miracle-Curls-Conditioner-with-Coconut-Oil-Paraben-Free-26-2-fl-oz-for-All-Hair-Types_60237e80-e24b-41f5-8e9b-07f45d2f7c83.bde49e8b2bac00372f77ae075f8b363c.jpeg"
  },
  {
    brand: "Alberto VO5", name: "Moisture Milks Conditioner",
    oldUrl: "https://i5.walmartimages.com/seo/Alberto-VO5-Moisture-Milks-Moisturizing-Conditioner-Passion-Fruit-Smoothie-12-5-oz_01c2a63a-b143-44f8-981c-ffee56d82cdf.9d8e7e8a1a8af89f32a5e2e63ac1fda4.jpeg",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_7611e3ff-e8cd-44cc-b21a-3cc676f72aa3"
  },
  {
    brand: "Mielle", name: "Pomegranate & Honey Leave-In Conditioner",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_7af61da2-4629-463a-a8a6-9dba1c5ddced",
    newUrl: "https://i5.walmartimages.com/seo/Mielle-Pomegranate-and-Honey-Leave-In-Conditioner-12-fl-oz_168736378.jpeg"
  },
  {
    brand: "Cantu", name: "Shea Butter Leave-In Conditioning Repair Cream",
    oldUrl: "https://i5.walmartimages.com/seo/Cantu-Shea-Butter-Leave-In-Conditioning-Repair-Cream-16-oz_a2f2abfd-1428-4d52-a832-0a77d95e2b49.f15df7cbab6f8e86fcce9d1ff7e3e389.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/Cantu-Shea-Butter-Leave-In-Conditioning-Repair-Cream-16-oz_10417822.jpeg"
  },
  {
    brand: "Garnier Fructis", name: "Curl Nourish Butter Cream Leave-In",
    oldUrl: "https://i5.walmartimages.com/seo/Garnier-Fructis-Curl-Nourish-Butter-Cream-Leave-In-Conditioner-10-2-fl-oz_8f23d03d-fcfa-4a8e-b59a-dae6b39d1a57.b5afd66f0a68fa47127e88cf4adcc3a9.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/Garnier-Fructis-Curl-Nourishing-Leave-in-Treatment-Glycerin-Coconut-Oil-Frizzy-Hair-10-2-fl-oz_48932717.jpeg"
  },
  {
    brand: "Camille Rose", name: "Coconut Water Leave-In Detangling Hair Treatment",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_71b94cbe-9c09-4ab1-ab13-4c32d53c0878",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_71b94cbe-9c09-4ab1-ab13-4c32d53c0878"
  },
  {
    brand: "Alikay Naturals", name: "Lemongrass Leave-In Conditioner",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_5c1a84e5-0f23-4e4d-9a74-25f0e2df3d25",
    newUrl: "https://i5.walmartimages.com/asr/526ad8a9-83e6-43c8-85b9-d15dfdc89706_1.27213e0b1ffbe9ccb7b609f21f2b88ca.jpeg"
  },
  {
    brand: "TGIN", name: "Butter Cream Daily Moisturizer",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_d70b4da5-bb08-4e7e-a5e1-5e0b4cb6c6c5",
    newUrl: "https://i5.walmartimages.com/asr/c50df479-b0e0-49a7-a3ab-ca5afb04a22a_1.060f60ea7278dc3db74aeff97bffb354.jpeg"
  },
  {
    brand: "Curls", name: "Blueberry Bliss Twist-N-Shout Cream",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_e18be4be-a4b2-4b7a-b8b3-4e3b3e0d5d4f",
    newUrl: "https://i5.walmartimages.com/seo/CURLS-Blueberry-Bliss-Twist-N-Shout-Cream-For-All-Hair-Types-8-fl-oz_51678140.jpeg"
  },
  {
    brand: "Marc Anthony", name: "Strictly Curls Curl Defining Lotion",
    oldUrl: "https://i5.walmartimages.com/seo/Marc-Anthony-Strictly-Curls-Curl-Defining-Lotion-8-3-oz_a23a2d20-43b2-40de-b6b8-bfb6cfc2a7e2.cee6c8e9e1e7be8c2faf9e2ac5cbfb07.jpeg",
    newUrl: "https://i5.walmartimages.com/seo/Marc-Anthony-Strictly-Curls-Frizz-Control-Curl-Defining-Lotion-8-3-oz_43328019.jpeg"
  },
  {
    brand: "Curls", name: "Blueberry Bliss Curl Control Jelly",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_e68e32f1-9d7c-4d99-82ab-0d8f31e3d908",
    newUrl: "https://i5.walmartimages.com/seo/Curls-Blueberry-Bliss-Curl-Control-Jelly-Made-for-All-Hair-Types-8-fl-oz_33137802.jpeg"
  },
  {
    brand: "John Frieda", name: "Frizz Ease Dream Curls Mousse",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_8e989a82-7d69-45c3-8e54-92d0a7f3f5a5",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_2e743299-0573-478f-8ee1-b4b92e99b4c5"
  },
  {
    brand: "OGX", name: "Quenching Coconut Curls Mousse",
    oldUrl: "https://i5.walmartimages.com/seo/OGX-Quenching-Coconut-Curls-Frizz-Defying-Moisture-Mousse-8-oz_7f2e5c82-f3aa-4d9a-8eb4-cee5f1c3ae70.e3e0f1d6d2e5e7e1f3d5e2c4b8e1f5d3.jpeg",
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_671a6001-f82e-405a-b416-21cee0136e19"
  },
  {
    brand: "Mielle", name: "Pomegranate & Honey Twisting Soufflé",
    oldUrl: "https://target.scene7.com/is/image/Target/GUEST_31b2d09b-cf97-4f7a-b36e-67a12aaabb58",
    newUrl: "https://i5.walmartimages.com/seo/Mielle-Pomegranate-and-Honey-Twisting-Souffle-12-oz_534554715.jpeg"
  },
  
  // === NULL URLs (14) ===
  {
    brand: "Aveda", name: "Rosemary Mint Purifying Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_3fbe16b5-989e-4ad6-9249-338b3e333792"
  },
  {
    brand: "Bumble and Bumble", name: "Sunday Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_c09ddcf4-cbb6-454f-b964-131b3fe16c0e"
  },
  {
    brand: "Garnier", name: "Pure Clean Clarifying Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_97c435da-33b4-410b-b8e8-4a37aaa4505e"
  },
  {
    brand: "Giovanni", name: "50:50 Balanced Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_adc7b7eb-6ffb-46e1-bf5a-d081960ca9cb"
  },
  {
    brand: "Kinky Curly", name: "Come Clean Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_452dc218-9d90-4c7a-b9ec-a062af7e22ac"
  },
  {
    brand: "Kristin Ess", name: "Deep Clean Clarifying Shampoo",
    oldUrl: null,
    newUrl: "https://i5.walmartimages.com/asr/3f015839-79ab-45a4-83f8-ceabc02ecfc4.ac9e657b4dab56ee2db63f29b3f88a7d.jpeg"
  },
  {
    brand: "Malibu C", name: "Hard Water Wellness Shampoo",
    oldUrl: null,
    newUrl: "https://i5.walmartimages.com/seo/Malibu-C-Hard-Water-Wellness-Shampoo-9-fl-oz_45cdcc6d-bd0f-4db1-803e-39c12da6ecc0_1.ef2e3ddedc9609da86422f1f7fabe5d8.jpeg"
  },
  {
    brand: "Malibu C", name: "Un-Do-Goo pH 9 Shampoo",
    oldUrl: null,
    newUrl: "https://i5.walmartimages.com/asr/4cb01d9e-99a9-4187-bdc7-7accef663b90.7c97736879a930cdceee7e27e9ce37fb.jpeg"
  },
  {
    brand: "Noughty", name: "Detox Dynamo Shampoo",
    oldUrl: null,
    newUrl: "https://i5.walmartimages.com/seo/Noughty-97-Natural-Detox-Dynamo-Clarifying-Shampoo_beea9eba-1abb-48c2-bad7-72f311eb8f2a.cf13581fb9ab2219ce9dfa3107dfdae3.jpeg"
  },
  {
    brand: "Ouai", name: "Detox Shampoo",
    oldUrl: null,
    newUrl: "https://media.ulta.com/i/ulta/2565432"
  },
  {
    brand: "Ouidad", name: "Water Works Clarifying Shampoo",
    oldUrl: null,
    newUrl: "https://media.ulta.com/i/ulta/2516018"
  },
  {
    brand: "Suave", name: "Essentials Daily Clarifying Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_22e7cc1b-f3ba-41b2-a3be-6debfc016047"
  },
  {
    brand: "Twist by Ouidad", name: "Hit Reset Clarifying Shampoo",
    oldUrl: null,
    newUrl: null  // Product discontinued, can't find reliable image
  },
  {
    brand: "VO5", name: "Clarifying Shampoo",
    oldUrl: null,
    newUrl: "https://target.scene7.com/is/image/Target/GUEST_7611e3ff-e8cd-44cc-b21a-3cc676f72aa3"
  },
];

// Test URL with HEAD request
async function testUrl(url) {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log("Testing new image URLs...\n");
  
  const results = [];
  for (const u of updates) {
    const works = await testUrl(u.newUrl);
    results.push({ ...u, works });
    const status = works ? '✅' : (u.newUrl ? '❌' : '⬜');
    console.log(`${status} ${u.brand} — ${u.name}: ${u.newUrl || 'null'}`);
  }
  
  // Output JSON for next step
  const fs = await import('fs');
  fs.writeFileSync('image_test_results.json', JSON.stringify(results, null, 2));
  
  const working = results.filter(r => r.works).length;
  const broken = results.filter(r => !r.works && r.newUrl).length;
  const nulled = results.filter(r => !r.newUrl).length;
  console.log(`\n${working} working, ${broken} broken, ${nulled} null`);
}

main();
