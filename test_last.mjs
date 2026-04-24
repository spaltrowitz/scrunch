const urls = [
  // John Frieda Dream Curls Mousse
  { name: "JF 1", url: "https://target.scene7.com/is/image/Target/GUEST_4952ca41-1f8d-42f8-ab77-632bd6e16932" },
  { name: "JF 2", url: "https://i5.walmartimages.com/seo/John-Frieda-Frizz-Ease-Dream-Curls-Curl-Reviver-Mousse-7-2-oz_11048240.jpeg" },
  { name: "JF 3", url: "https://target.scene7.com/is/image/Target/GUEST_3bd7fed1-2c6d-44b2-8141-0919f6caf789" },
  // Acure Moroccan Argan Oil
  { name: "Acure argan 1", url: "https://acure.com/cdn/shop/files/the-essentials-moroccan-argan-oil.jpg" },
  { name: "Acure argan 2", url: "https://target.scene7.com/is/image/Target/GUEST_a3e645f2-43c0-4c9b-bb0b-cdc379d4d133" },
  { name: "Acure argan 3", url: "https://media.ulta.com/i/ulta/2551161" },
  // Herbal Essences Set Me Up Gel specifically  
  { name: "HE Set Me Up Gel", url: "https://target.scene7.com/is/image/Target/GUEST_9b4920a0-5d05-4041-a9fb-9d0ced868e63" },
];

for (const p of urls) {
  try {
    const r = await fetch(p.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5000) });
    console.log(`${r.ok ? '✅' : '❌'} ${p.name}: ${r.status}`);
  } catch (e) {
    console.log(`❌ ${p.name}: ${e.message}`);
  }
}
