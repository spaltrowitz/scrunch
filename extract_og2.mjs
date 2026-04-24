const pages = [
  { name: "Monday Curl Define", url: "https://www.target.com/p/monday-haircare-curl-define-shampoo-12oz/-/A-89879268" },
  { name: "Curls Cashmere", url: "https://www.walmart.com/ip/CURLS-Curls-Cashmere-Curl-Jelly-Size-8-oz/279816707" },
  { name: "John Frieda", url: "https://www.walmart.com/ip/John-Frieda-Frizz-Ease-Dream-Curls-Mousse-7-2-oz/11048240" },
  { name: "Herbal Essences", url: "https://www.target.com/p/herbal-essences-set-me-up-max-hold-gel-6-oz/-/A-13380831" },
  { name: "Acure Clarifying", url: "https://acure.com/products/curiously-clarifying-shampoo" },
  { name: "Acure Clarifying 2", url: "https://www.walmart.com/ip/Acure-Curiously-Clarifying-Shampoo-8-fl-oz/50855064" },
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
