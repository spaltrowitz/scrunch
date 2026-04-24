const pages = [
  { name: "Curls Cashmere", url: "https://curls.biz/products/cashmere-curl-jelly" },
  { name: "John Frieda", url: "https://www.target.com/p/john-frieda-frizz-ease-dream-curls-curl-reviver-mousse/-/A-86675593" },
  { name: "Herbal Essences", url: "https://www.target.com/p/herbal-essences-totally-twisted-curl-boosting-mousse-6-8oz/-/A-86675591" },
  { name: "John Frieda 2", url: "https://www.target.com/s?searchTerm=john+frieda+dream+curls+mousse&category=5xu0g" },
];

for (const p of pages) {
  try {
    const r = await fetch(p.url, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const html = await r.text();
    const match = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (!match) {
      const m2 = html.match(/content="([^"]+)"\s+property="og:image"/);
      if (m2) { console.log(`✅ ${p.name}: ${m2[1]}`); continue; }
    }
    if (match) {
      console.log(`✅ ${p.name}: ${match[1]}`);
    } else {
      console.log(`❌ ${p.name}: no og:image (status ${r.status})`);
    }
  } catch (e) {
    console.log(`❌ ${p.name}: ${e.message}`);
  }
}
