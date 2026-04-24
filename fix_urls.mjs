// Try multiple URL candidates for each broken product

const broken_products = [
  { brand: "Bounce Curl", name: "Gentle Clarifying", urls: [
    "https://www.bouncecurl.com/cdn/shop/files/enzyme-gentle-clarifying-shampoo_1200x1200.png",
    "https://www.bouncecurl.com/cdn/shop/files/clarifying-shampoo-pdp-main_09011d0c-a2cc-4e59-b866-80c0a6e445bf_1200x1200.png",
    "https://www.bouncecurl.com/cdn/shop/products/clarifying-shampoo_1200x1200.png",
  ]},
  { brand: "Monday", name: "Curl Define", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_3f627fd8-fc76-4937-b6f2-dc50e7cafb4e",
    "https://i5.walmartimages.com/seo/MONDAY-Haircare-Curl-Define-Shampoo-12oz_3f627fd8-fc76-4937-b6f2-dc50e7cafb4e.dffdba84825af35f75345b29e51b2e21.jpeg",
  ]},
  { brand: "SheaMoisture", name: "JBCO Shampoo", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_d37d4c8e-8e3f-4f68-8b7d-8a23b2b29c69",
    "https://i5.walmartimages.com/seo/SheaMoisture-Jamaican-Black-Castor-Oil-Strengthen-Restore-Shampoo-13-0oz_681718115.efb4b2e54dbc54d9a92d4c8e9a4e4e76.jpeg",
    "https://i5.walmartimages.com/seo/SheaMoisture-Jamaican-Black-Castor-Oil-Strengthen-Restore-Shampoo-Sulfate-Free-13-fl-oz_38311136.jpeg",
  ]},
  { brand: "SheaMoisture", name: "Manuka Honey Deep", urls: [
    "https://i5.walmartimages.com/seo/SheaMoisture-Intensive-Hydration-Hair-Masque-Manuka-Honey-Mafura-Oil-11-5-oz_14645507355.jpeg",
    "https://target.scene7.com/is/image/Target/GUEST_7f9eb44e-ec11-4fda-ae51-25bf17ea2aa1",
  ]},
  { brand: "Curls", name: "Cashmere Curl Jelly", urls: [
    "https://i5.walmartimages.com/seo/CURLS-Curls-Cashmere-Curl-Jelly-8-oz_279816707.jpeg",
    "https://i5.walmartimages.com/seo/Curls-Cashmere-Curl-Jelly-Size-8-oz_107381207.3f2e5b5f0e8e9a5b5a5d5e5a5f5b5c5d.jpeg",
  ]},
  { brand: "Curls", name: "Goddess Curls", urls: [
    "https://i5.walmartimages.com/seo/Curls-Botanical-Gelle-8-oz_40727796.2c8e8a8b8c8d8e8f8a8b8c8d8e8f8a8b.jpeg",
  ]},
  { brand: "Eco Styler", name: "Gel", urls: [
    "https://i5.walmartimages.com/seo/Eco-Styler-Olive-Oil-Styling-Hair-Gel-16oz_40720827.jpeg",
    "https://i5.walmartimages.com/seo/Eco-Styler-Olive-Oil-Styling-Hair-Gel-16oz_10315313.e2b62f8d7197e55ec050d09309a7aea70.jpeg",
  ]},
  { brand: "Herbal Essences", name: "Set Me Up Gel", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_71WgwA43UtL",
  ]},
  { brand: "LA Looks", name: "Extreme Sport", urls: [
    "https://i5.walmartimages.com/seo/L-A-LOOKS-Extreme-Sport-Tri-Active-Hold-Gel-20-oz_10307222.3fdc3ef7f390d954e0685e70f3e6fff2e.jpeg",
  ]},
  { brand: "TréLuxe", name: "Hi Definition", urls: [
    "https://curlwarehouse.com/cdn/shop/products/Hi-Definition-Gel-Web.jpg?v=1669930046",
    "https://curlwarehouse.com/cdn/shop/files/Hi-Definition-Gel-Web.jpg",
  ]},
  { brand: "Acure", name: "Moroccan Argan Oil", urls: [
    "https://acure.com/cdn/shop/files/marula-oil.jpg",
    "https://target.scene7.com/is/image/Target/GUEST_16989f13-d8ff-4320-ad69-00d659e7e5fe",
  ]},
  { brand: "Mielle", name: "Mint Almond Oil", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_420abcc9-8eff-46d5-9332-7abd4f83ebc2",
  ]},
  { brand: "Acure", name: "Clarifying Shampoo", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_48c7eb69-3cc0-43e7-82ff-a88fcafe8c3d",
    "https://acure.com/cdn/shop/files/curiously-clarifying-shampoo.jpg",
  ]},
  { brand: "Curlsmith", name: "Essential Moisture", urls: [
    "https://media.ulta.com/i/ulta/2598433",
    "https://target.scene7.com/is/image/Target/GUEST_ad11c758-874a-4ca5-b049-546d602e4aaf",
  ]},
  { brand: "SheaMoisture", name: "Raw Shea Butter Shampoo", urls: [
    "https://i5.walmartimages.com/seo/SheaMoisture-Raw-Shea-Butter-Deep-Moisturizing-Shampoo-13-oz_37211055.jpeg",
    "https://target.scene7.com/is/image/Target/GUEST_0896cdd7-c1c0-4b3e-98f0-8c8f417dfb2c",
  ]},
  { brand: "Aussie", name: "Miracle Curls Conditioner", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_f11e8c90-394a-4102-b757-c8a42939503a",
    "https://i5.walmartimages.com/seo/Aussie-Miracle-Curls-Conditioner-Coconut-Oil-26-2-fl-oz_517291870.bde49e8b2bac00372f77ae075f8b363c.jpeg",
  ]},
  { brand: "Mielle", name: "Pomegranate Leave-In", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_e9dedd59-82c3-4952-8ef8-6d70d06bf1bb",
    "https://i5.walmartimages.com/seo/Mielle-Pomegranate-Honey-Leave-In-Conditioner-12-fl-oz_768620339.jpeg",
  ]},
  { brand: "Cantu", name: "Leave-In", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_29ca3d21-57fd-49ea-ac79-1a9676ffcff3",
    "https://i5.walmartimages.com/seo/Cantu-Leave-In-Conditioning-Repair-Cream-16-oz_12351344.f15df7cbab6f8e86fcce9d1ff7e3e389.jpeg",
  ]},
  { brand: "Garnier Fructis", name: "Curl Nourish", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_9b4920a0-5d05-4041-a9fb-9d0ced868e63",
  ]},
  { brand: "Camille Rose", name: "Coconut Water", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_43e9b942-e37d-4e11-918f-c4bd459d56bf",
    "https://target.scene7.com/is/image/Target/GUEST_e321db7c-9728-4a63-a08f-3cc1eaec1d4d",
  ]},
  { brand: "Alikay Naturals", name: "Lemongrass", urls: [
    "https://cdn11.bigcommerce.com/s-xdujedzl24/products/134/images/433/61QONZRbhoL._UF10001000_QL80___50470.1760075084.386.513.jpg",
    "https://target.scene7.com/is/image/Target/GUEST_63faf09e-2934-4b37-a121-a8c3502b7235",
  ]},
  { brand: "TGIN", name: "Butter Cream", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_afc637f9-6d79-46b7-bd61-a4f7ec77f9c2",
  ]},
  { brand: "Curls", name: "Twist-N-Shout", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_452dc218-9d90-4c7a-b9ec-a062af7e22ac",
    "https://i5.walmartimages.com/seo/Curls-Blueberry-Bliss-Twist-N-Shout-Cream-8-oz_100746978.jpeg",
  ]},
  { brand: "Marc Anthony", name: "Strictly Curls", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_4952ca41-1f8d-42f8-ab77-632bd6e16932",
    "https://i5.walmartimages.com/seo/Marc-Anthony-Strictly-Curls-Curl-Defining-Lotion-8-3-oz_19970856.cee6c8e9e1e7be8c2faf9e2ac5cbfb07.jpeg",
  ]},
  { brand: "Curls", name: "Curl Control Jelly", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_f1d7e44e-6102-4322-b255-3c90f749b855",
  ]},
  { brand: "John Frieda", name: "Dream Curls Mousse", urls: [
    "https://i5.walmartimages.com/asr/8aa82247-fd17-4af8-90c9-7eef5ad7300d.2298eb89c2efa924901da908e2ff4717.jpeg",
  ]},
  { brand: "Mielle", name: "Twisting Soufflé", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_05135cf7-035b-4cb4-a55a-20a6c0d84baa",
    "https://target.scene7.com/is/image/Target/GUEST_e9dedd59-82c3-4952-8ef8-6d70d06bf1bb",
  ]},
  { brand: "Kristin Ess", name: "Deep Clean", urls: [
    "https://target.scene7.com/is/image/Target/GUEST_112d5847-5917-45ed-b25d-6780d9b895af",
    "https://media.ulta.com/i/ulta/2579349",
  ]},
  { brand: "Malibu C", name: "Hard Water", urls: [
    "https://media.ulta.com/i/ulta/2536432",
    "https://i5.walmartimages.com/asr/fae15176-cb6b-44d6-9c38-9975a05919b7.ae25194ab800b6ebf7e4abf516207e0d.jpeg",
  ]},
  { brand: "Malibu C", name: "Un-Do-Goo", urls: [
    "https://media.ulta.com/i/ulta/2536431",
  ]},
  { brand: "Twist by Ouidad", name: "Hit Reset", urls: [
    "https://media.ulta.com/i/ulta/2580126",
    "https://target.scene7.com/is/image/Target/GUEST_7c719704-10ca-4c9b-9801-b0196d999864",
  ]},
];

async function testUrl(url) {
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    return r.ok;
  } catch { return false; }
}

async function main() {
  for (const p of broken_products) {
    let found = null;
    for (const url of p.urls) {
      if (await testUrl(url)) { found = url; break; }
    }
    console.log(`${found ? '✅' : '❌'} ${p.brand} — ${p.name}: ${found || 'NONE'}`);
  }
}
main();
