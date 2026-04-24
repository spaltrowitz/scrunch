// Test remaining URLs I couldn't find
const urls = [
  { name: "Curls Cashmere", url: "https://target.scene7.com/is/image/Target/GUEST_9744c948-744d-461c-a861-ba924983c807" },
  { name: "John Frieda Mousse", url: "https://i5.walmartimages.com/asr/8aa82247-fd17-4af8-90c9-7eef5ad7300d.2298eb89c2efa924901da908e2ff4717.jpeg" },
  { name: "John Frieda 2", url: "https://target.scene7.com/is/image/Target/GUEST_8a68c926-acb4-4dfa-9419-61431e2c5491" },
  { name: "Herbal Set Me Up", url: "https://target.scene7.com/is/image/Target/GUEST_831d6fe6-329a-4b2e-bdb6-bcbc5e96f564" },
  { name: "Herbal Set Me Up 2", url: "https://target.scene7.com/is/image/Target/GUEST_48a30e9a-c203-4b1e-b931-d7d871f61aad" },
  { name: "Acure Clarifying Shopify", url: "https://cdn.shopify.com/s/files/1/0550/4896/2261/files/PDP_CuriouslyClarifyingShampoo_01.jpg?v=1762457382" },
  { name: "TréLuxe curl warehouse", url: "https://curlwarehouse.com/cdn/shop/products/Hi_Definition_CurlEnhancerStylingGel-Jan2022.png?v=1762530522" },
  { name: "Bounce Curl Shopify", url: "https://www.bouncecurl.com/cdn/shop/files/gentle-shampoo-pdp-main_af891fbb-959d-4da1-bcab-621b647a82da_1200x1200.png?v=1769509589" },
  { name: "Eco Styler Walmart", url: "https://i5.walmartimages.com/seo/Eco-Styler-Olive-Oil-Styling-Hair-Gel-16oz_3cb2024e-8daf-4cd1-ade5-d765fb8b68b4.3a3a40739496f88184e999d022d072eb.jpeg" },
  { name: "LA Looks Walmart", url: "https://i5.walmartimages.com/seo/L-A-LOOKS-Extreme-Sport-Tri-Active-Hold-Gel-for-All-Hair-Types-Men-20-oz_26fe6e65-39e3-4618-a7d2-206d67043609.c182e1eff09d95540e66d8e2c4acdc70.png" },
  { name: "SheaMoisture JBCO Walmart", url: "https://i5.walmartimages.com/seo/SheaMoisture-Jamaican-Black-Castor-Oil-Strengthen-Restore-Shampoo-13-0oz_2216a155-f8c5-4aad-9c5e-c480bec9a5cf.8592be79cf41d3b2d3098850c785a17b.jpeg" },
  { name: "Curls Goddess Walmart", url: "https://i5.walmartimages.com/seo/Curls-Curls-Botanical-Gelle-8-oz_90d42642-c6f9-4d01-90ae-65b790dc3ba4.7488ffb95e03749268af4fe0807510cc.jpeg" },
  { name: "Monday Target", url: "https://target.scene7.com/is/image/Target/GUEST_044fec5b-76e5-4850-80a3-7097850426cf" },
  { name: "Acure Argan Marula", url: "https://acure.com/cdn/shop/files/marula-oil.jpg" },
  { name: "Acure Argan", url: "https://acure.com/cdn/shop/files/moroccan-argan-oil.jpg" },
];

for (const p of urls) {
  try {
    const r = await fetch(p.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    console.log(`${r.ok ? '✅' : '❌'} ${p.name}: ${r.status}`);
  } catch (e) {
    console.log(`❌ ${p.name}: ${e.message}`);
  }
}
