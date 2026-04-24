// Extract og:image from product pages
const pages = [
  { name: "Monday Curl Define", url: "https://mondayhaircare.com/products/curl-define-shampoo" },
  { name: "SheaMoisture JBCO", url: "https://www.walmart.com/ip/SheaMoisture-Jamaican-Black-Castor-Oil-Strengthen-Restore-Shampoo-13-0oz/681718115" },
  { name: "Curls Cashmere", url: "https://www.walmart.com/ip/Curls-Cashmere-Curl-Jelly-Size-8-oz/107381207" },
  { name: "Curls Goddess", url: "https://www.walmart.com/ip/Curls-Curls-Botanical-Gelle-8-oz/40727796" },
  { name: "TréLuxe Hi Def", url: "https://curlwarehouse.com/products/hi-definition-curl-enhancer-styling-gel" },
  { name: "John Frieda", url: "https://www.walmart.com/ip/John-Frieda-Frizz-Ease-Dream-Curls-Curl-Reviver-Mousse-Anti-Frizz-Hair-Mousse-for-Curly-Hair-7-2-oz/11048240" },
  { name: "Herbal Essences Set Me Up", url: "https://www.walmart.com/ip/Herbal-Essences-Set-Me-Up-Gel-Max-Hold/10818093" },
  { name: "Acure Clarifying", url: "https://www.target.com/p/acure-curiously-clarifying-shampoo-8-fl-oz/-/A-50855064" },
];

for (const p of pages) {
  try {
    const r = await fetch(p.url, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
    const html = await r.text();
    const match = html.match(/property="og:image"\s+content="([^"]+)"/);
    if (match) {
      console.log(`✅ ${p.name}: ${match[1]}`);
    } else {
      console.log(`❌ ${p.name}: no og:image found`);
    }
  } catch (e) {
    console.log(`❌ ${p.name}: fetch error - ${e.message}`);
  }
}
