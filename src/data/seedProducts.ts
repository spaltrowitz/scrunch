import type { ProductCategory, CgStatus } from '../lib/database.types'
import type { ScrunchScore } from '../lib/constants'

export interface SeedProduct {
  brand: string
  name: string
  category: ProductCategory
  cg_status: CgStatus
  cruelty_free: 'yes' | 'no' | 'unclear' | null
  notes: string | null
  image_url: string | null
  hairtok_trending?: boolean
}

// Compute Scrunch Score from product data
export function computeScrunchScore(product: Pick<SeedProduct, 'cg_status' | 'cruelty_free' | 'notes' | 'category'>): { score: number; grade: ScrunchScore; reasons: string[] } {
  let score = 100
  const reasons: string[] = []

  if (product.cg_status === 'not_approved') { score -= 40; reasons.push('Not CG-approved (−40)') }
  else if (product.cg_status === 'caution') { score -= 15; reasons.push('CG caution (−15)') }
  else { reasons.push('CG-approved ✓') }

  const n = (product.notes || '').toLowerCase()
  if (n.includes('drying alcohol')) { score -= 15; reasons.push('Contains drying alcohol (−15)') }
  if (n.includes('silicone')) { score -= 20; reasons.push('Contains silicone (−20)') }
  if (n.includes('sulfate') && product.category !== 'clarifying_shampoo') { score -= 20; reasons.push('Contains sulfate (−20)') }
  if (n.includes('mineral oil')) { score -= 15; reasons.push('Contains mineral oil (−15)') }
  if (n.includes('wax')) { score -= 10; reasons.push('Contains wax (−10)') }

  if (product.cruelty_free === 'yes') { score += 5; reasons.push('Cruelty-free (+5)') }
  if (n.includes('fragrance-free') || n.includes('fragrance free')) { score += 3; reasons.push('Fragrance-free (+3)') }
  if (n.includes('sample sizes')) { score += 2; reasons.push('Sample sizes available (+2)') }

  score = Math.max(0, Math.min(100, score))
  const grade: ScrunchScore = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'
  return { score, grade, reasons }
}

export const SEED_PRODUCTS: SeedProduct[] = [
  // ── SHAMPOO (low_poo) ──────────────────────────────────────────────
  { brand: 'As I Am', name: 'Dandruff', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/2241/0171/files/Dry_and_itchy_scalp_care_shampoo_front.jpg?v=1739054505' },
  { brand: 'Bounce Curl', name: 'Gentle Clarifying', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://www.bouncecurl.com/cdn/shop/files/gentle-shampoo-pdp-main_af891fbb-959d-4da1-bcab-621b647a82da_1200x1200.png?v=1769509589' },
  { brand: 'Briogeo', name: 'Curl Charisma', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0905/3204/files/s1784651-main.jpg?v=1762439465' },
  { brand: 'Camille Rose', name: 'Sweet Ginger Cleansing Rinse', category: 'low_poo', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0980/9736/files/ginger_cr_fr.webp?v=1772789893' },
  { brand: "Carol's Daughter", name: 'Wash Day Delight', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/082/064/500/6966/front_en.3.400.jpg' },
  { brand: 'Curlsmith', name: 'Shine Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free. Sample sizes available', image_url: 'https://curlsmith.com/cdn/shop/files/Fragrance-Free-Shampoo_packshot-front_1200x1600_21cd8e56-10a0-4f5f-89b4-af3ca3ad273e.jpg' },
  { brand: 'Giovanni', name: 'Eco Chic Smooth as Silk Deep Moisture', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/LB', image_url: 'https://cdn.shopify.com/s/files/1/0643/6510/1212/files/18053_-SAS_Shampoo_8.5oz_Tapered-Bottle_Straight-scaled_3f71c7b3-e13a-46ca-a6b2-3f48c511e440.jpg?v=1734044085' },
  { brand: 'Hask', name: 'Curl Care', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0575/1390/2193/files/s209.Shampoo-Curlcare_coconutoil-front.png?v=1759526071' },
  { brand: 'Innersense', name: 'Hydrating Cream Hair Bath', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://innersensebeauty.com/cdn/shop/files/HydratingCreamHairbathRetail.jpg?v=1709161327' },
  { brand: 'Innersense', name: 'Pure Harmony Hair Bath', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/PureHairbathRetail.jpg?v=1709165523' },
  { brand: 'Jessicurl', name: 'Gentle Lather', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/GL-N3.jpg' },
  { brand: 'Jessicurl', name: 'Hair Cleansing Cream', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/HC-N3.jpg' },
  { brand: 'Kérastase', name: 'Curl Manifesto', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'Kristin Ess', name: 'Daily Cleansing', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://cdn.shopify.com/s/files/1/0268/0229/0871/files/10ozDailyCleansingShampoo-Front.png?v=1715714189' },
  { brand: 'LUS', name: '3-Step System (Wavy/Curly/Coily)', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free option', image_url: 'https://loveurcurls.com/cdn/shop/files/1-Hero_2ac1d02d-6373-4bef-ba92-1c7cab2ff4c3.webp' },
  { brand: 'Maui Moisture', name: 'Any', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/002/279/617/0514/front_fr.4.400.jpg' },
  { brand: 'Mielle', name: 'Rosemary Mint Strengthening', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0763/8199/files/Main-Images-Swatches-Strengthening_Conditioner_8922653d-3dd1-44eb-90b6-cebbf4f7fcc1.jpg?v=1761171236' },
  { brand: 'Monday', name: 'Curl Define', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'MopTop', name: 'Gentle', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://moptophair.com/cdn/shop/files/16oz_Gentle-Shampoo_Front.jpg' },
  { brand: "Not Your Mother's", name: 'Curl Talk', category: 'low_poo', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://images.openbeautyfacts.org/images/products/068/804/713/0647/front_en.3.400.jpg' },
  { brand: "Not Your Mother's", name: 'Any Naturals Line', category: 'low_poo', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/14009_NYMN_TahitianGardenia_Shampoo_1.jpg?v=1737653888' },
  { brand: 'Odele', name: 'Volumizing', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0055/5859/9754/files/Bulk_Front_3-4_Angle_Volumizing_Shampoo.jpg?v=1768600156' },
  { brand: 'Ouidad', name: 'Unbreakable Bonds Bond Building Shampoo', category: 'low_poo', cg_status: 'not_approved', cruelty_free: null, notes: 'Fragrance-free. Contains silicone and drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/UB_Shampoo_D.png?v=1753674785' },
  { brand: 'Rizos Curls', name: 'Hydrating', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/1822/5087/files/RizosCurls_Shampoo_Vitamins_Minerals.webp?v=1762457453' },
  { brand: 'Seen', name: 'Skin-caring Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://helloseen.com/cdn/shop/files/0057_Shampoo_Scented_Front-_REG_4519fdee-515c-486a-8cd4-07c427d3447b.webp?v=1746083624' },
  { brand: 'SheaMoisture', name: 'Coconut & Hibiscus Curl & Shine Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/764/302/221/0298/front_nl.7.400.jpg' },
  { brand: 'SheaMoisture', name: 'Jamaican Black Castor Oil Strengthen & Restore Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/872/018/141/3377/front_nl.19.400.jpg' },
  { brand: 'Tgin', name: 'Moisture Rich', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0716/9540/1252/files/Moist_Shampoo_1.png?v=1741715551' },
  { brand: 'Tgin', name: 'Rose Water', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0716/9540/1252/files/Rose_Water_Hydrating_Styling_Lotion.png?v=1740502902' },
  { brand: "Trader Joe's", name: 'Tea Tree Tingle', category: 'low_poo', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: null },
  { brand: 'TréLuxe', name: 'Curl Renew & Restore', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://curlwarehouse.com/cdn/shop/products/CurlRenew_RestoreGentleCleansingRinse_-Jan2022.png' },
  { brand: 'TRESemmé', name: 'Pro Care Curls', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/002/240/000/7724/front_en.3.400.jpg' },
  { brand: 'TRESemmé', name: 'Botanique Coconut for Damaged Hair', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/002/240/000/0473/front_en.4.400.jpg' },
  { brand: 'Vanicream', name: 'Sensitive Skin Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://images.openbeautyfacts.org/images/products/034/533/420/0123/front_en.5.400.jpg' },

  // ── CO-WASH ─────────────────────────────────────────────────────────
  { brand: 'As I Am', name: 'Coconut Co-wash', category: 'co_wash', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://images.openbeautyfacts.org/images/products/085/838/000/2141/front_nl.8.400.jpg' },
  { brand: 'As I Am', name: 'Dry Itchy Scalp Care Co-wash', category: 'co_wash', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://cdn.shopify.com/s/files/1/2241/0171/files/DISC_itch_soothing_drops_with_hand_square.jpg?v=1774978758' },
  { brand: 'Aveda', name: 'Be Curly Co-wash', category: 'co_wash', cg_status: 'approved', cruelty_free: 'unclear', notes: 'CFK/PETA, owned by Estee Lauder (NOT CF)', image_url: 'https://images.openbeautyfacts.org/images/products/001/808/405/3683/front_fr.3.400.jpg' },
  { brand: 'Curl Junkie', name: 'Daily Fix', category: 'co_wash', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://curljunkie.com/cdn/shop/files/Daily_Fix_copy3.webp' },
  { brand: 'Curlsmith', name: 'Curl Quenching Co-wash', category: 'co_wash', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Drying alcohol. CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Curl-Quenching-Conditioning-Wash_12floz_Front_2000x2000_5041eba0-a6e5-49c2-a7ee-250506f96fc9.jpg?v=1755506259' },
  { brand: 'Jessicurl', name: 'Hair Cleansing Cream Co-wash', category: 'co_wash', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/HC-N3.jpg' },
  { brand: 'Kristin Ess', name: 'Frizz Management Co-wash', category: 'co_wash', cg_status: 'not_approved', cruelty_free: null, notes: 'Drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0268/0229/0871/files/FrizzManagementCleansingCo-Wash.png?v=1715640422' },
  { brand: 'Kristin Ess', name: 'Ultra Hydrating Co-wash', category: 'co_wash', cg_status: 'not_approved', cruelty_free: null, notes: 'Drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0268/0229/0871/files/UltraHydrading-CurlCoWash-Front_aeb749e5-1efc-4365-89f0-59d2dce47b0a.png?v=1715811051' },
  { brand: 'Ouidad', name: 'Curl Shaper Co-wash', category: 'co_wash', cg_status: 'not_approved', cruelty_free: null, notes: 'Drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/CS_Mist_1_Hero-Desktop-2x_1.png?v=1774894682' },
  { brand: 'Ouidad', name: 'Coil Infusion Co-wash', category: 'co_wash', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/CI-PDP-Hero_4_D_2x_100785be-9881-4db7-b3cb-6d7b0611c39a.png?v=1753460826' },

  // ── RINSE-OUT CONDITIONER ───────────────────────────────────────────
  { brand: 'Aussie', name: 'Miracle Moist for Dry Hair', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'PETA. Contains silicone and drying alcohol', image_url: 'https://images.openbeautyfacts.org/images/products/038/151/918/6769/front_en.3.400.jpg' },
  { brand: 'Curlsmith', name: 'Shine Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Fragrance-free. Sample sizes available', image_url: 'https://curlsmith.com/cdn/shop/files/CS_Fragrance-Free-Conditioner_packshot-front_2000x2000_ae7002cf-1640-487a-b81e-798d5fc2bf2b.jpg' },
  { brand: 'Curlsmith', name: 'Multi-Tasking Conditioner', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'CFK. Sample sizes available. Drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Multi-Tasking-Conditioner_8floz_Front_2000x2000_7861df14-b7ef-496f-ad7f-ea2b9f574911.jpg?v=1755506244' },
  { brand: 'Generic Value Products', name: 'Conditioning Balm', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: null },
  { brand: 'Giovanni', name: 'Smooth as Silk Deeper Moisture Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/LB', image_url: 'https://cdn.shopify.com/s/files/1/0643/6510/1212/files/02008_SAS_Conditioner_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1734044086' },
  { brand: 'Giovanni', name: 'Tea Tree Triple Treat Invigorating Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/LB', image_url: 'https://cdn.shopify.com/s/files/1/0643/6510/1212/files/15008_TeaTree_Conditioner_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1734044084' },
  { brand: 'Jessicurl', name: 'Aloeba Daily Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/products/AL-N3.jpg' },
  { brand: 'Jessicurl', name: 'Too Shea! Extra Moisturizing', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/TS-N3_BS_Med.png' },
  { brand: 'Kristin Ess', name: 'Shine Enhancing Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://cdn.shopify.com/s/files/1/0268/0229/0871/products/shineenhancecondition1.png?v=1621020174' },
  { brand: "Not Your Mother's", name: 'Any Naturals Line Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/14010_NYMN_TahitianGardenia_Conditioner_1.jpg?v=1733769957' },
  { brand: "Not Your Mother's", name: 'Curl Talk 3-in-1 Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/13061_NYM_CurlTalk_Conditioner_1_1200x1200.jpg?v=1743520966' },
  { brand: 'Ouidad', name: 'Unbreakable Bonds Bond Building Conditioner', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: null, notes: 'Fragrance-free. Sample sizes available. Drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/UBConditioner_D.png?v=1753674205' },
  { brand: 'Seen', name: 'Skin-caring Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://cdn.shopify.com/s/files/1/0016/5144/1717/files/0059_Conditioner_FragranceFree_Front-_REG_7673dc39-cc54-4fd9-aca1-61b5914eae42.webp?v=1746083731' },
  { brand: 'SheaMoisture', name: 'Coconut & Hibiscus Curl & Shine Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/764/302/221/0298/front_nl.7.400.jpg' },
  { brand: 'SheaMoisture', name: 'Jamaican Black Castor Oil Strengthen & Restore Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },
  { brand: 'Suave', name: 'Essentials Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/0808/2282/9368/files/383711004575_SV_WMWC_SVCDESSDailyClarifying6p22.5z_FOP.png?v=1775188152' },
  { brand: "Trader Joe's", name: 'Tea Tree Tingle Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: null },
  { brand: 'TRESemmé', name: 'Botanique Coconut Nourish for Damaged Hair', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/002/240/000/0473/front_en.4.400.jpg' },
  { brand: 'TRESemmé', name: 'Pro Pure Micellar Moisture for Dry Hair', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/002/240/000/6758/front_en.7.400.jpg' },
  { brand: 'TRESemmé', name: 'Pro Pure Damage Recovery for Damaged Hair', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/002/240/000/6758/front_en.7.400.jpg' },

  // ── DEEP CONDITIONER ────────────────────────────────────────────────
  { brand: 'Aussie', name: '3 Minute Miracle Moist Deep', category: 'deep_conditioner', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'PETA. Contains silicone and drying alcohol', image_url: 'https://images.openbeautyfacts.org/images/products/006/640/017/2815/front_en.8.400.jpg' },
  { brand: 'Briogeo', name: "Don't Despair Repair!", category: 'deep_conditioner', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'CF but owned by Wella. Drying alcohol. #HairTok favorite for deep conditioning', image_url: 'https://cdn.shopify.com/s/files/1/0905/3204/products/ddr-mask-full-size-1.jpg?v=1762439465', hairtok_trending: true },
  { brand: 'Camille Rose', name: 'Algae Renew', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0980/9736/files/ProductCard_Signature_AlgaeRenew.webp?v=1772792750' },
  { brand: 'Jessicurl', name: 'Deep Conditioning Treatment', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/DT-N3TubeLogoUpdateShot.png' },
  { brand: 'Mielle', name: 'Babassu & Mint Deep Conditioner', category: 'deep_conditioner', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0763/8199/files/Packshot_Mielle_SHAseal_BabMint_DeepCond_8oz_En_80835620_2048px.jpg?v=1759329346' },
  { brand: "Not Your Mother's", name: 'Matcha Green Tea & Wild Apple Blossom Nutrient Rich Butter', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://cdn.shopify.com/s/files/1/0517/1868/4866/files/14022_NYMN_MatchaGreenTea_Mask_1.jpg?v=1725631003' },
  { brand: 'SheaMoisture', name: 'Manuka Honey & Mafura Oil Intensive Hydration', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/764/302/220/9094/front_en.3.400.jpg' },
  { brand: 'SheaMoisture', name: 'Raw Shea Butter Deep Treatment Masque', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },

  // ── LEAVE-IN CONDITIONER ────────────────────────────────────────────
  { brand: 'Alikay Naturals', name: 'Shea Yogurt Hair Moisturizer', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://cdn11.bigcommerce.com/s-xdujedzl24/products/134/images/433/61QONZRbhoL._UF10001000_QL80___50470.1760075084.386.513.jpg' },
  { brand: 'As I Am', name: 'Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/2241/0171/files/CoconutWater_CurlClarityShampoo_andCoconutLeave-InConditionerproductimage.png?v=1765834643' },
  { brand: 'Camille Rose', name: 'Curl Love Moisture Milk', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0980/9736/files/ProductCard_Signature_LeaveinConditioner.webp?v=1772795367' },
  { brand: 'Curls', name: 'Blueberry Bliss Reparative Leave-In', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://images.openbeautyfacts.org/images/products/085/977/600/0208/front_en.5.400.jpg' },
  { brand: 'Giovanni', name: 'Direct Weightless Moisture Leave-In', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/LB', image_url: 'https://cdn.shopify.com/s/files/1/0643/6510/1212/files/07008_Direct_Conditioner_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1744932566' },
  { brand: 'Innersense', name: 'I Create Volume', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/VolumeRetail.jpg?v=1709164675' },
  { brand: 'Innersense', name: 'Sweet Spirit Leave-In', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/SweetSpiritRetail_1.jpg?v=1709167972' },
  { brand: 'Kinky Curly', name: 'Knot Today', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Fine texture/low porosity TOP PICK!', image_url: 'http://kinky-curly.com/cdn/shop/products/Kinky-CurlyKnotToday_1200x1200.png?v=1606339935' },
  { brand: 'Mixed Chicks', name: 'Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Contains silicone. Multicultural curls TOP PICK!', image_url: null },
  { brand: 'Seen', name: 'Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://cdn.shopify.com/s/files/1/0016/5144/1717/files/SCENTED-UPDATED_1.jpg?v=1757020307' },
  { brand: 'SheaMoisture', name: 'Miracle Styler Leave-In', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },
  { brand: 'SheaMoisture', name: 'Raw Shea Butter Extra Moisture Detangler', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },
  { brand: 'SheaMoisture', name: 'Coconut & Hibiscus Curl & Style Milk', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/076/430/229/0223/front_en.5.400.jpg' },

  // ── CURL CREAM ──────────────────────────────────────────────────────
  { brand: 'Briogeo', name: 'Curl Charisma Rice Amino + Avocado Defining Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'unclear', notes: 'CF but owned by Wella', image_url: 'https://media.ulta.com/i/ulta/2575494' },
  { brand: 'Bumble and Bumble', name: 'Curl Defining Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'PETA. Contains silicone (dimethicone), petrolatum, wax (microcrystalline)', image_url: 'https://target.scene7.com/is/image/Target/GUEST_d4b1b33d-e9d4-4535-9fe9-d173535d24c6' },
  { brand: 'Cantu', name: 'Shea Butter for Natural Hair Curl Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://target.scene7.com/is/image/Target/GUEST_29ca3d21-57fd-49ea-ac79-1a9676ffcff3' },
  { brand: 'Curlsmith', name: 'Shine Curl Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free. Sample sizes available', image_url: 'https://curlsmith.com/cdn/shop/files/Fragrance-Free-Leave-in-Conditioner_8oz_packshot-front-shadow_2000x2000_5293258e-652a-4dbd-b997-c77540dfe021_600x600.jpg' },
  { brand: 'Curlsmith', name: 'Feather-Light Protein Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Feather-Light-Protein-Cream_8floz_Front_2000x2000_fe5efc37-a0d2-414d-bce1-1b6afbff8629.jpg?v=1755506226' },
  { brand: 'Curlsmith', name: 'Hold Me Softly Style Balm', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Hold-Me-Softly-Style-Balm_8floz_Front_2000x2000_fd9a6c22-610c-4268-8dec-2b5e5d26ccef.jpg?v=1755506223' },
  { brand: 'Curlsmith', name: 'Weightless Air Dry Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Weightless-Air-Dry-Cream_8floz_Front_2000x2000_e9e1f08f-e182-43cd-8123-68eb3dcd2eef.jpg?v=1764234993' },
  { brand: 'Innersense', name: 'Quiet Calm Curl Control', category: 'curl_cream', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/QuietCalmRetail_1.jpg?v=1709166407' },
  { brand: 'Kristin Ess', name: 'Soft Shine Grooming Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://kristinesshair.com/cdn/shop/files/softshinegroomingcream-front.png' },
  { brand: "Miss Jessie's", name: 'Multicultural Curls Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. TOP PICK!', image_url: 'https://missjessies.com/cdn/shop/products/MCC.png?v=1558469975' },
  { brand: "Not Your Mother's", name: 'Curl Talk Defining Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/13062_NYM_CurlTalk_Cream_1_1200x1200.jpg?v=1687957804' },
  { brand: "Not Your Mother's", name: 'Naturals Tahitian Gardenia Flower & Mango Butter Curl Defining Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/14010_NYMN_TahitianGardenia_Conditioner_1.jpg?v=1733769957' },
  { brand: 'Ouai', name: 'Hydrating Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: null, notes: 'Fragrance free option. Contains drying alcohol', image_url: null },
  { brand: 'Ouidad', name: 'Featherlight Styling Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains silicone and drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/ACC-Featherlight-1_2x_43afb712-864c-46b0-a856-5401732cfd00.png?v=1774894634' },
  { brand: 'Pacifica', name: 'Pineapple Swirl Curl Defining Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V', image_url: 'https://www.pacificabeauty.com/cdn/shop/files/1_b12d89a4-8f95-4e52-84c7-de91847a11d6.jpg' },
  { brand: 'Rizos Curls', name: 'Curl Defining Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains wax. #HairTok recommended styling cream', image_url: 'https://cdn.shopify.com/s/files/1/1822/5087/files/RizosCurls_CurlDefiningCream_AloeVera_DeepNourish.webp?v=1762457438', hairtok_trending: true },
  { brand: 'Seen', name: 'Curly Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free', image_url: 'https://cdn.shopify.com/s/files/1/0016/5144/1717/files/0053_CurlyCreme_FragranceFree_Front-_REG_97e881e1-4b51-4923-a078-88512618eff2.webp?v=1746083838' },
  { brand: 'SheaMoisture', name: 'Coconut & Hibiscus Curl Enhancing Smoothie', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/764/302/221/0366/front_nl.8.400.jpg' },
  { brand: 'Taliah Waajid', name: 'Curly Curl Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: null },

  // ── CUSTARD / CURL ENHANCER ─────────────────────────────────────────
  { brand: 'AG Cosmetics', name: 'Re:Coil Curl Activator', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'http://ag.care/cdn/shop/files/CARE_1536x2048_Recoil6oz.jpg?v=1775767262' },
  { brand: "Aunt Jackie's", name: 'Curl La La', category: 'custard', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains silicone and drying alcohol', image_url: 'https://images.openbeautyfacts.org/images/products/003/428/569/6153/front_en.19.400.jpg' },
  { brand: 'Bed Head by Tigi', name: 'Catwalk Curls Rock Amplifier', category: 'custard', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Contains silicone and drying alcohol', image_url: null },
  { brand: 'Beyond the Zone', name: 'Curl Boost Glaze', category: 'custard', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: null },
  { brand: 'Bounce Curl', name: 'Avocado/Rose Oil Clump & Define', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://www.bouncecurl.com/cdn/shop/files/avocado-cream-pdp-main_09011d0c-a2cc-4e59-b866-80c0a6e445bf_1200x1200.png' },
  { brand: 'Camille Rose', name: 'Curl Maker', category: 'custard', cg_status: 'approved', cruelty_free: 'unclear', notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0980/9736/files/ProductCard_Signature_CurlMaker.webp?v=1772794164' },
  { brand: 'Cantu', name: 'Curl Activator', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://images.openbeautyfacts.org/images/products/081/751/301/9913/front_nl.7.400.jpg' },
  { brand: 'Curls', name: 'Cashmere Curl Jelly', category: 'custard', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: null },
  { brand: 'Curlsmith', name: 'Curl Defining Styling Soufflé', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Curl-Defining-Styling-Souffle_8floz_Front_no-shadow_2000x2000_allure-award.jpg?v=1758024613' },
  { brand: 'Jessicurl', name: "Rockin' Ringlets Styling Potion", category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/RR-N3.jpg' },
  { brand: 'Jessicurl', name: 'Confident Coils Styling Solution', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/products/CC-N3.jpg' },
  { brand: 'Kinky Curly', name: 'Original Curling Custard', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/0489/0371/7029/products/Kinky-CurlyCurlingCustardWebcopy.png?v=1607051114' },
  { brand: 'LUS', name: 'All-in-One Wavy', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://loveurcurls.com/cdn/shop/files/1-AiOWavyHero.webp' },
  { brand: 'LUS', name: 'All-in-One Curly', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://loveurcurls.com/cdn/shop/files/1-AiOCurlyHero.webp' },
  { brand: 'LUS', name: 'All-in-One Kinky', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://loveurcurls.com/cdn/shop/files/1-AiOKinky-CoilyHero.webp' },
  { brand: 'Mop Top', name: 'Curly Hair Custard', category: 'custard', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://moptophair.com/cdn/shop/files/8oz_Curly-Hair-Custard_Front.jpg' },
  { brand: 'SheaMoisture', name: 'Coconut & Hibiscus Curling Gel Soufflé', category: 'custard', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/764/302/221/0366/front_nl.8.400.jpg' },
  { brand: "Uncle Funky's Daughter", name: 'Curly Magic Curl Stimulator', category: 'custard', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: null },

  // ── GEL ──────────────────────────────────────────────────────────────
  { brand: 'As I Am', name: 'Smoothing Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/2241/0171/products/11.AsIAmClassic_SmoothingGelsquare.jpg?v=1661197702' },
  { brand: 'Aussie', name: 'Instant Freeze Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: 'Beyond the Zone', name: 'Bada Bing Extreme Hold Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'Biosilk', name: 'Rock Hard Gelee', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing but sold in China', image_url: null },
  { brand: 'Bounce Curl', name: 'Light Hold Creme Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Think Dirty 0-3, dermatologist tested, woman owned', image_url: 'https://www.bouncecurl.com/cdn/shop/files/light-gel-pdp-main_1200x1200.png' },
  { brand: 'Briogeo', name: 'Curl Charisma Rice Amino + Quinoa Frizz Control Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'CF but owned by Wella', image_url: 'https://cdn.shopify.com/s/files/1/0905/3204/products/01_cc-gel.jpg?v=1762439479' },
  { brand: 'Curl Keeper', name: 'Original Liquid Styler', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://curlkeeper.com/cdn/shop/files/1_50c0adcc-0d7c-46ee-8787-2ef190aeff61_1200x1200.png' },
  { brand: 'Curl Keeper', name: 'Ultimate Hold Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://curlkeeper.com/cdn/shop/files/13_bce3c0b7-93d1-47c0-9889-134a032edb0d_1200x1200.png' },
  { brand: 'Curls', name: 'Goddess Curls Botanical Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: null },
  { brand: 'Curlsmith', name: 'Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: 'Fragrance-free. Sample sizes available', image_url: 'https://curlsmith.com/cdn/shop/files/Fragrance-free-Strong-Hold-Gel_8oz_packshot-front-shadow_2000x2000_18b95661-c483-4776-9fa0-150b0bdb479d_600x600.jpg' },
  { brand: 'Curlsmith', name: 'Hydro Style Flexi Jelly', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/CS_Hydro-Style-Flexi-Jelly_8floz_Front_2000x2000_6a70a4d1-1de6-4164-864e-16e8a5bf2abf.jpg?v=1755506238' },
  { brand: 'Curlsmith', name: 'In-Shower Style Fixer', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/In-Shower-Style-Fixer_8floz_Front_2000x2000_20fed113-6516-4901-b4c8-a951bd3b4f5e.jpg?v=1755506236' },
  { brand: 'Curlsmith', name: 'Shape Up Aqua Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/CS_ShapeUpAqua_gel2oz_W137780_230613-shadow-1200x1600.jpg?v=1769077296' },
  { brand: 'Dippity Do', name: 'Girls with Curls Gelee', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'Ecoslay', name: 'Orange Marmalade Flaxseed & Aloe Curl Definer', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://ecoslay.com/cdn/shop/files/OM8_dc4d1f4c-7eca-43a2-b21a-19807e7b6e25_-_Edited.png' },
  { brand: 'Eco Styler', name: 'Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://images.openbeautyfacts.org/images/products/074/837/800/1112/front_en.9.400.jpg' },
  { brand: 'Garnier', name: 'Pure Clean Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: "Site claims no animal testing but owned by L'Oreal", image_url: null },
  { brand: 'Giovanni', name: 'Eco Chic L.A. Hold Styling Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/LB', image_url: 'https://giovannicosmetics.com/cdn/shop/files/10008_LAHold_StylingGel.jpg?v=1734044135' },
  { brand: "Harry's", name: 'Sculpting Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'Herbal Essences', name: 'Set Me Up Max Hold Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: 'Innersense', name: 'I Create Hold Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/HoldRetail.jpg?v=1709162417' },
  { brand: 'Jessicurl', name: 'Spiralicious Styling Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/V. No added fragrance option. Sample sizes available', image_url: 'https://jessicurl.com/cdn/shop/files/SG-N3_BS_Med.png' },
  { brand: 'LA Looks', name: 'Extreme Sport Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'LUS', name: 'Irish Sea Moss Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://loveurcurls.com/cdn/shop/files/1-ISMGHero_0554569e-b088-4d13-af91-161ef3f98e00.webp' },
  { brand: "Miss Jessie's", name: 'Jelly Soft Curls Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://missjessies.com/cdn/shop/products/JSC.png?v=1558469841' },
  { brand: "Not Your Mother's", name: 'Curl Talk Frizz Control Sculpting Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/13063_NYM_CurlTalk_Gel.jpg?v=1756236155' },
  { brand: "Not Your Mother's", name: 'Flash Freeze Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://notyourmothers.com/cdn/shop/files/13127_NYM_CurlTalk_FlashFreezeGel_1_49.png?v=1724944407' },
  { brand: 'Ouidad', name: 'Advanced Climate Control Heat and Humidity Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/ACC-StrongerHold-3_2x_5923e7ab-0f03-4491-9445-32ff23d7af8a.png?v=1753135604' },
  { brand: 'Pattern', name: 'Curl Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0149/4794/2500/files/Pattern_PDP_PaloSanto_CurlGel_red_2000x2000_copy_copy.jpg?v=1761950331' },
  { brand: 'Rizos Curls', name: 'Light Hold Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/1822/5087/files/LightHoldGel.jpg?v=1762461880' },
  { brand: 'TréLuxe', name: 'Hi! Definition Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://curlwarehouse.com/cdn/shop/products/Hi_Definition_CurlEnhancerStylingGel-Jan2022.png?v=1762530522' },
  { brand: 'Vanicream', name: 'Gel', category: 'gel', cg_status: 'not_approved', cruelty_free: null, notes: 'Fragrance-free. Contains silicone', image_url: null },
  { brand: 'Wetline Xtreme', name: 'Professional Styling Gel', category: 'gel', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },

  // ── MOUSSE / FOAM ───────────────────────────────────────────────────
  { brand: 'Cake', name: 'The Curl Whip Whipped Curl Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://cdn.shopify.com/s/files/1/0214/7032/files/TheCurlWhip_Slide1_PackShot_Front.jpg?v=1711568360' },
  { brand: 'Curlsmith', name: 'Bouncy Strength Volume Foam', category: 'mousse', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'CFK. Contains drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/CS_Bouncy-Strength-Volume-Foam_7.5floz_Front_2000x2000_855eb423-7422-4bf0-96df-dbf64f03b4f1.jpg?v=1755506224' },
  { brand: 'Giovanni', name: 'Mousse Air-Turbo Charged Styling Foam', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA/LB', image_url: 'https://cdn.shopify.com/s/files/1/0643/6510/1212/files/12008_Mousse_Air-turboCharged_HairStylingFoam.jpg?v=1734044121' },
  { brand: 'Herbal Essences', name: 'Body Envy Volumizing Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://images.openbeautyfacts.org/images/products/006/640/001/2937/front_en.4.400.jpg' },
  { brand: 'Herbal Essences', name: 'Set Me Up Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://images.openbeautyfacts.org/images/products/038/151/901/9647/front_en.5.400.jpg' },
  { brand: 'Herbal Essences', name: 'Totally Twisted Curl Boosting Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://images.openbeautyfacts.org/images/products/038/151/901/9647/front_en.5.400.jpg' },
  { brand: 'Herbal Essences', name: 'Tousle Me Softly Tousling Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://images.openbeautyfacts.org/images/products/038/151/901/9647/front_en.5.400.jpg' },
  { brand: 'Innersense', name: 'I Create Lift Volumizing Foam', category: 'mousse', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/LiftRetail.jpg?v=1709164314' },
  { brand: "Not Your Mother's", name: 'Curl Talk Activating Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://images.openbeautyfacts.org/images/products/068/804/713/0647/front_en.3.400.jpg' },
  { brand: 'Pantene', name: 'Soft Curls Shaping Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'no', notes: null, image_url: 'https://images.openbeautyfacts.org/images/products/800/654/034/9328/front_fr.3.400.jpg' },
  { brand: 'Verb', name: 'Curl Foaming Gel', category: 'mousse', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Contains drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0045/9790/7545/files/1-Curl_Foaming_Gel_6.7oz_Packshot_45b746ae-05c3-4a46-9f1e-dd111768325b.jpg?v=1762440865' },

  // ── OIL / SERUM ─────────────────────────────────────────────────────
  { brand: 'Acure', name: 'Moroccan Argan Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA/LB', image_url: 'https://acure.com/cdn/shop/files/argan-oil.jpg' },
  { brand: 'Acure', name: 'Marula Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA/LB', image_url: 'https://acure.com/cdn/shop/files/marula-oil.jpg' },
  { brand: 'As I Am', name: 'Dry Itchy Scalp Care Oil', category: 'scalp_care', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/2241/0171/files/DISC_itch_soothing_drops_with_hand_square.jpg?v=1774978758' },
  { brand: 'Aura Cacia', name: 'Organic Argan Skincare Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: 'Aura Cacia', name: 'Jojoba Skincare Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: 'Cantu', name: 'Flaxseed Smoothing Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: "Carol's Daughter", name: 'Goddess Strength 7 Blend Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/0707/7609/4772/files/Goddess_Strength_7_Oil_Blend_Hair_Scalp_Oil.webp?v=1775086103' },
  { brand: 'Desert Essence', name: '100% Pure Jojoba Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: 'https://cdn.shopify.com/s/files/1/0744/2392/7074/files/2112NDE_1_66f5a4d0-7090-4d24-aa06-ecaac055ba13.jpg?v=1683916192' },
  { brand: 'Eden Bodyworks', name: 'Peppermint Tea Tree Hair Oil', category: 'scalp_care', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://cdn.shopify.com/s/files/1/0233/9417/products/PPT-HairOil-Front.jpg?v=1731083804' },
  { brand: 'Heritage Store', name: 'Castor Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0074/0347/0894/files/Castor-Ginger-img-1.jpg?v=1735591739' },
  { brand: 'Hollywood Beauty', name: 'Tea Tree Skin & Scalp Oil', category: 'scalp_care', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://hollywoodbeautyproducts.com/cdn/shop/files/45836005904_HB_TeaTreeOil_2ozBottle_FRONT.jpg?v=1758551388' },
  { brand: 'Hollywood Beauty', name: 'Jojoba Hair Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://hollywoodbeautyproducts.com/cdn/shop/products/Organic-Jojoba-Oil.jpg?v=1676068140' },
  { brand: 'Hollywood Beauty', name: 'Jamaican Black Castor Hair Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://hollywoodbeautyproducts.com/cdn/shop/files/45836005775_HB_JamaicanBlackCastorOil_2ozBottle_FRONT.jpg?v=1758637788' },
  { brand: 'Mielle', name: 'Rosemary Mint Scalp & Hair Strengthening Oil', category: 'scalp_care', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Trending on #HairTok for scalp care and hair growth', image_url: 'https://cdn.shopify.com/s/files/1/0763/8199/files/Rosemary_Oil_SHAcopy.jpg?v=1764011088', hairtok_trending: true },
  { brand: 'Mielle', name: 'Mint Almond Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing', image_url: 'https://cdn.shopify.com/s/files/1/0763/8199/products/MIELLE_ORGANICS_MINT_ALMOND_OIL_8OZ_159505819.jpg?v=1747830333' },
  { brand: 'SheaMoisture', name: '100% Pure Argan Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },
  { brand: 'SheaMoisture', name: 'Extra Virgin Coconut Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },
  { brand: 'SheaMoisture', name: 'Pure Jamaican Black Castor Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/872/018/141/3377/front_nl.19.400.jpg' },
  { brand: 'The Ordinary', name: '100% Cold-Pressed Virgin Marula Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: 'The Ordinary', name: '100% Organic Cold-Pressed Argan Oil', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA', image_url: null },
  { brand: 'Verb', name: 'Ghost Oil', category: 'oil_serum', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Contains silicone', image_url: 'https://cdn.shopify.com/s/files/1/0045/9790/7545/files/Verb_Ghost_Oil_4oz_Glass_Shelfie_Coral_1.jpg?v=1762440852' },

  // ── PROTEIN TREATMENT ───────────────────────────────────────────────
  { brand: 'ApHogee', name: 'Two Minute Intensive Keratin Reconstructor', category: 'protein_treatment', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains mineral oil, silicone, and drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0912/9404/0430/files/Keratin2Minute8oz.jpg?v=1750195232' },
  { brand: 'Colorful', name: 'Neutral Protein Filler', category: 'protein_treatment', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'Curlsmith', name: 'Bond Curl Rehab Salve', category: 'bond_repair', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Bond-Curl-Rehab-Salve_8floz_Front_2000x2000_2f18e69f-fb6d-4d92-9573-e49eab94865b.jpg?v=1763792409' },
  { brand: 'Hask', name: 'Keratin Protein Smoothing Deep Conditioner', category: 'protein_treatment', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://cdn.shopify.com/s/files/1/0575/1390/2193/files/1_Smooth_DC_FRT_2500px.png?v=1764949405' },
  { brand: 'Hask', name: "Henna 'n' Placenta Super Strength Packette", category: 'protein_treatment', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: null },
  { brand: 'K18', name: 'Leave-In Molecular Repair Hair Mask', category: 'bond_repair', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Bond builder. Contains drying alcohol. Viral on #HairTok — bond-repair technology', image_url: 'http://www.k18hair.com/cdn/shop/files/00_Mask_1024x1024.jpg?v=1726613673', hairtok_trending: true },
  { brand: 'Nutress', name: 'Hair Moisturizing Protein Packette', category: 'protein_treatment', cg_status: 'approved', cruelty_free: null, notes: null, image_url: null },
  { brand: 'Olaplex', name: 'No. 3 Hair Perfector', category: 'bond_repair', cg_status: 'approved', cruelty_free: null, notes: 'Bond builder. #HairTok favorite — bond-building treatment', image_url: 'https://cdn.shopify.com/s/files/1/0434/1661/files/1-No3_product_1440_7cd8abc9-5c07-40be-a7c6-eeb73f63dc32.png?v=1762271835', hairtok_trending: true },
  { brand: 'Ouidad', name: 'Unbreakable Bonds Mixing Drops', category: 'protein_treatment', cg_status: 'not_approved', cruelty_free: null, notes: 'Fragrance-free. Contains drying alcohol', image_url: 'https://curlwarehouse.com/cdn/shop/files/31002_ALT1_005_NEW_PNG_2048x3072_2000x_03075a8b-0057-4bad-a85c-7d1c0a5b09e1.webp?v=1722458432' },
  { brand: 'SheaMoisture', name: 'Manuka Honey & Yogurt Hydrate + Repair Protein Treatment', category: 'protein_treatment', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA', image_url: 'https://images.openbeautyfacts.org/images/products/764/302/220/9094/front_en.3.400.jpg' },
  { brand: 'TGIN', name: 'Miracle RepaiRx Deep Hydrating Hair Masque', category: 'protein_treatment', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Contains silicone', image_url: 'https://cdn.shopify.com/s/files/1/0716/9540/1252/products/MRx-Mask-2021-scaled.jpg?v=1738350162' },

  // ── HAIRSPRAY / SPRAY REFRESHER ─────────────────────────────────────
  { brand: 'Bounce Curl', name: 'Strong Hold Hairspray', category: 'spray_refresher', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Think Dirty 0-3, dermatologist tested, woman owned', image_url: 'https://www.bouncecurl.com/cdn/shop/files/hairspray-pdp-main_1200x1200.png' },
  { brand: 'Curlsmith', name: 'Flexible Hold Hairspray', category: 'spray_refresher', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'CFK. Contains sulfate', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Flawless-Finish-Hairspray_front_2000x2000_0dd7a0df-643f-45a0-ac30-1eb17cb137ad.jpg?v=1776335665' },
  { brand: 'Curlsmith', name: 'Strong Hold Hairspray', category: 'spray_refresher', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'CFK. Contains sulfate', image_url: 'https://curlsmith.com/cdn/shop/files/Flawless-Finish-Hairspray_front_2000x2000_0dd7a0df-643f-45a0-ac30-1eb17cb137ad.jpg' },
  { brand: 'Innersense', name: 'I Create Finish Hairspray', category: 'spray_refresher', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'CFK. Contains drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0626/1063/6976/files/Finish10ozRetail.jpg?v=1709162334' },
  { brand: 'Pantene Pro-V', name: 'Lightweight Finish Level 2 Hairspray', category: 'spray_refresher', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains drying alcohol and silicone', image_url: null },
  { brand: 'Rizos Curls', name: 'Volumizing Hairspray', category: 'spray_refresher', cg_status: 'approved', cruelty_free: null, notes: null, image_url: 'https://cdn.shopify.com/s/files/1/1822/5087/files/RizosCurls_HairSpray_Breakage_KernelOil.webp?v=1762468270' },

  // ══════════════════════════════════════════════════════════════════════
  // REDDIT-SOURCED PRODUCTS (r/curlyhair, r/curlygirl & r/wavyhair community picks)
  // ══════════════════════════════════════════════════════════════════════

  // ── CLARIFYING SHAMPOO ─────────────────────────────────────────────
  { brand: 'Acure', name: 'Curiously Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB/PETA. Contains sodium coco-sulfate (gentle sulfate, suitable for clarifying use)', image_url: 'https://cdn.shopify.com/s/files/1/0550/4896/2261/files/PDP_CuriouslyClarifyingShampoo_01.jpg?v=1762457382' },
  { brand: 'Aveda', name: 'Rosemary Mint Purifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains sulfate (intentional for clarifying)', image_url: null },
  { brand: 'Bumble and Bumble', name: 'Sunday Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Contains sulfate (intentional for clarifying)', image_url: null },
  { brand: 'Garnier', name: 'Pure Clean Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains sulfate and drying alcohol', image_url: null },
  { brand: 'Giovanni', name: '50:50 Balanced Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains sulfate', image_url: 'https://cdn.shopify.com/s/files/1/0643/6510/1212/files/03008_5050_Shampoo_8.5oz_Tapered-Bottle_Straight-scaled.jpg?v=1734044085' },
  { brand: 'Kinky Curly', name: 'Come Clean Shampoo', category: 'clarifying_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: 'Chelating (sulfate-free clarifier)', image_url: 'https://images.openbeautyfacts.org/images/products/068/907/619/5188/front_en.3.400.jpg' },
  { brand: 'Kristin Ess', name: 'Deep Clean Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains sulfate', image_url: 'https://cdn.shopify.com/s/files/1/0268/0229/0871/files/DeepCleanClarifyingShampoo-Front.png?v=1715802253' },
  { brand: 'Malibu C', name: 'Hard Water Wellness Shampoo', category: 'clarifying_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: 'Chelating (sulfate-free)', image_url: 'https://cdn.shopify.com/s/files/1/0256/7756/1919/files/6.png?v=1734558787' },
  { brand: 'Malibu C', name: 'Un-Do-Goo pH 9 Shampoo', category: 'clarifying_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: null, image_url: 'https://cdn.shopify.com/s/files/1/0256/7756/1919/files/1.png?v=1759966358' },
  { brand: 'Noughty', name: 'Detox Dynamo Shampoo', category: 'clarifying_shampoo', cg_status: 'approved', cruelty_free: null, notes: 'Chelating (sulfate-free)', image_url: 'https://cdn.shopify.com/s/files/1/1668/1791/files/TILE-1_Detox-Dynamo_Shampoo_Packshot_1000x1000_8dbf0307-e628-49ed-9fac-e3e30e0a9707.webp?v=1750324938' },
  { brand: 'Ouai', name: 'Detox Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Chelating. Contains drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/1043/7322/files/Updated_Detox_Site_Asset_PDP_Product_Thumbnail_1316x1526_Jumbo_bf95a83a-6b89-40c3-a616-a7a2fd4e40a0.jpg?v=1762289177' },
  { brand: 'Ouidad', name: 'Water Works Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Chelating. Contains sulfate and drying alcohol', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/Waterworks_Shampoo_1_Hero-Desktop-2x.png?v=1774894486' },
  { brand: "Sally's", name: 'Ion Hard Water Shampoo', category: 'clarifying_shampoo', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Chelating', image_url: null },
  { brand: 'Suave', name: 'Essentials Daily Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Suave Naturally Derived are NOT clarifying. Contains sulfate', image_url: 'http://www.suave.com/cdn/shop/files/383711004582_SV_WMWC_SVSHESSDailyClarifying6p22.5z_FOP_1200x1200.png?v=1775188096' },
  { brand: 'Twist by Ouidad', name: 'Hit Reset Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: null, notes: 'Contains sulfate and drying alcohol', image_url: null },
  { brand: 'VO5', name: 'Clarifying Shampoo', category: 'clarifying_shampoo', cg_status: 'not_approved', cruelty_free: 'no', notes: 'NOT 2- or 3-in-one. Contains sulfate', image_url: null },

  // ── DRY SHAMPOO ────────────────────────────────────────────────────
  { brand: 'Acure', name: 'Dry Shampoo', category: 'dry_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB/PETA. Non-aerosol powder. Corn starch + arrowroot based, no silicones or sulfates', image_url: 'https://target.scene7.com/is/image/Target/GUEST_7a34f713-43b3-48ba-bdaa-e331900f502d' },

  // ── LOW POO (Reddit) ────────────────────────────────────────────────
  { brand: 'Inahsi Naturals', name: 'Soothing Mint Gentle Cleansing Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned. Sulfate-free, vegan', image_url: 'https://inahsi.com/cdn/shop/files/Soothing-Mint-Gentle-Cleansing-Shampoo-12oz_1200x1200.jpg?v=1739426592' },
  { brand: 'Curlsmith', name: 'Essential Moisture Cleanser', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK. Deep hydration without stripping', image_url: 'https://cdn.shopify.com/s/files/1/1719/1281/files/Essential-Moisture-Shampoo_12floz_Front_2000x2000_ea90b3c5-4f7c-4e2a-a0b7-5b32055d1e73.jpg?v=1755506233' },
  { brand: 'Only Curls', name: 'All Curl Cleanser', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'UK brand. Vegan, sulfate-free', image_url: 'https://onlycurls.com/cdn/shop/files/PDP_ACC_TILE1_7d2b4d73-3731-4128-9514-48a92dcc1de5.png?v=1776430594' },
  { brand: 'SheaMoisture', name: 'Raw Shea Butter Moisture Retention Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'CFK/PETA. Popular for 4C hair', image_url: null },

  // ── CO-WASH (Reddit) ────────────────────────────────────────────────
  { brand: 'DevaCurl', name: 'No-Poo Original', category: 'co_wash', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'PETA. Zero-lather conditioning cleanser. Some formulation concerns per CurlScan', image_url: 'https://www.devacurl.com/cdn/shop/files/No-Poo-Original-12oz.jpg' },

  // ── RINSE-OUT CONDITIONER (Reddit) ──────────────────────────────────
  { brand: 'DevaCurl', name: 'One Condition Original', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. For medium to coarse curls', image_url: 'https://www.devacurl.com/cdn/shop/files/One-Condition-Original-12oz.jpg' },
  { brand: 'Aussie', name: 'Miracle Curls Conditioner', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'PETA. Contains dimethicone. Great slip for detangling', image_url: 'https://images.openbeautyfacts.org/images/products/000/003/815/4218/front_en.17.400.jpg' },
  { brand: 'Redken', name: 'All Soft Conditioner', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains PEG-modified silicone. Salon favorite for dry hair', image_url: 'https://images.openbeautyfacts.org/images/products/088/448/604/1869/front_en.3.400.jpg' },
  { brand: 'Alberto VO5', name: 'Moisture Milks Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'no', notes: 'Ultra-budget CG staple. Sold in China (parent Henkel)', image_url: null },

  // ── DEEP CONDITIONER (Reddit) ───────────────────────────────────────
  { brand: 'Ecoslay', name: 'Banana Cream Deep Conditioner', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Vegan. Black-owned indie brand. Rich banana-based formula', image_url: 'https://ecoslay.com/cdn/shop/files/5M2A7918.png?v=1764257540' },

  // ── LEAVE-IN CONDITIONER (Reddit) ───────────────────────────────────
  { brand: 'Mielle', name: 'Pomegranate & Honey Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Popular for Type 4 hair, excellent slip', image_url: 'https://images.openbeautyfacts.org/images/products/085/000/126/5515/front_en.3.400.jpg' },
  { brand: 'Bread Beauty Supply', name: 'Elastic Bounce Leave-In Conditioning Styler', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Vegan. Lightweight hydration for all curl types', image_url: 'https://breadbeautysupply.com/cdn/shop/files/Untitled_design_bd69b3d2-fbdd-4c8e-89c2-92cbd30c6714.png?v=1723637619' },
  { brand: 'Inahsi Naturals', name: 'Aloe Hibiscus Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned. Lightweight moisture and protein balance', image_url: 'https://inahsi.com/cdn/shop/files/Aloe-Hibiscus-Leave-In-12oz-v2_1200x1200.jpg?v=1739426899' },
  { brand: 'Oyin Handmade', name: 'Hair Dew', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned indie brand. Vegan. Great for coils and kinks', image_url: 'https://cdn.shopify.com/s/files/1/0697/2879/6895/files/oyin_hair_dew_unscented__47391.1699648370.1280.1280.jpg?v=1714484221' },
  { brand: 'Cantu', name: 'Shea Butter Leave-In Conditioning Repair Cream', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Drugstore staple, rich moisture', image_url: 'https://images.openbeautyfacts.org/images/products/085/601/700/0126/front_nl.22.400.jpg' },
  { brand: 'Garnier Fructis', name: 'Curl Nourish Butter Cream Leave-In', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'no', notes: 'Silicone-free formula. Parent company L\'Oréal sells in China', image_url: null },
  { brand: "Aunt Jackie's", name: 'Quench Moisture Intensive Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: null, notes: 'Budget-friendly. Silicone-free. Popular for Type 3/4 hair', image_url: 'https://cdn.shopify.com/s/files/1/0573/6123/6126/files/34285693060_AUNTJACKIES_Quench_8ozBottle_FRONT.jpg?v=1752761788' },
  { brand: 'Ouidad', name: 'Moisture Lock Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: null, notes: 'Lightweight hydration prep before styling', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/MoistureLockLeave-in-Front_D.png?v=1753737690' },
  { brand: 'Pattern', name: 'Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'By Tracee Ellis Ross. Great for coily and tightly curled hair', image_url: 'https://cdn.shopify.com/s/files/1/0149/4794/2500/files/leave-in-IR-sample.jpg?v=1772824983' },
  { brand: 'Camille Rose', name: 'Coconut Water Leave-In Detangling Hair Treatment', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Lightweight moisture with coconut water base', image_url: 'https://cdn.shopify.com/s/files/1/0980/9736/files/ProductCard_CoconutWater_Leavein.webp?v=1772790755' },
  { brand: 'Alikay Naturals', name: 'Lemongrass Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned. Botanical, natural ingredients', image_url: 'https://cdn11.bigcommerce.com/s-xdujedzl24/products/112/images/392/LL-LEAVE-IN-8oz__33880.1777370138.386.513.jpg?c=1' },
  { brand: 'Redken', name: 'Acidic Bonding Concentrate Leave-In Treatment', category: 'leave_in_conditioner', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains silicone. Bond repair for fragile curls. Parent L\'Oréal', image_url: null },

  // ── CURL CREAM (Reddit) ─────────────────────────────────────────────
  { brand: 'DevaCurl', name: 'SuperCream Coconut Curl Styler', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Rich definition for medium to coarse curls', image_url: 'https://www.devacurl.com/cdn/shop/files/SuperCream-5.1oz.jpg' },
  { brand: 'TGIN', name: 'Butter Cream Daily Moisturizer', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned. Intense moisture for thick/high-porosity curls', image_url: 'https://cdn.shopify.com/s/files/1/0716/9540/1252/files/NOW_1_3fc70889-b818-4b4d-8b03-26c9d58273c7.png?v=1761235296' },
  { brand: 'Curls', name: 'Blueberry Bliss Twist-N-Shout Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned. Great for twist-outs and braid-outs', image_url: null },
  { brand: 'AG Hair', name: 'Curl Fresh Definer Soft Hold Styling Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Lightweight for fine/low-density curls. Good for arid climates', image_url: 'https://cdn.shopify.com/s/files/1/2352/9949/files/6oz-CurlFreshDefiner_Pea__Ecomm_Front.jpg?v=1715632250' },
  { brand: 'Marc Anthony', name: 'Strictly Curls Curl Defining Lotion', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains silicone. Drugstore option, not CGM-friendly', image_url: 'https://marcanthony.com/cdn/shop/files/PDP_SC_CurlDefiningLotion_FOP_Web_600x.jpg?v=1767024552' },

  // ── GEL (Reddit) ────────────────────────────────────────────────────
  { brand: 'Ecoslay', name: 'Jello Shot Flaxseed Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'Vegan. Black-owned indie brand. Flaxseed + okra + agave based', image_url: 'https://ecoslay.com/cdn/shop/files/Jello_Shot_8oz_front.png?v=1764257576' },
  { brand: 'Curls', name: 'Blueberry Bliss Curl Control Jelly', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'Black-owned. Medium hold, great for Type 3/4 hair', image_url: null },
  { brand: 'DevaCurl', name: 'Ultra Defining Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Strong hold for very curly and coily hair', image_url: 'https://www.devacurl.com/cdn/shop/files/Ultra-Defining-Gel-12oz.jpg' },

  // ── MOUSSE (Reddit) ─────────────────────────────────────────────────
  { brand: 'John Frieda', name: 'Frizz Ease Dream Curls Mousse', category: 'mousse', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains silicone. Parent company Kao sells in China', image_url: null },
  { brand: 'Ouidad', name: 'VitalCurl+ Soft Defining Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: null, notes: 'Lightweight volume for fine/mixed-texture curls', image_url: 'https://cdn.shopify.com/s/files/1/0610/4488/3714/files/VC-Mousse_D-Front_2x_7b8e8b7f-62e4-422f-8f60-8aaf72e0bfcc.png?v=1753668479' },
  { brand: 'OGX', name: 'Quenching Coconut Curls Mousse', category: 'mousse', cg_status: 'approved', cruelty_free: 'no', notes: 'Silicone-free mousse formula. Parent J&J sells in China', image_url: 'https://images.ctfassets.net/ya8mvjlg9l8b/7o02qYPe7rLbWuovfVD68M/beb6e846ad364a6a824c4730cd817dca/OGX_Talent_Still_CoconutMilk.webp' },

  // ── CUSTARD (Reddit) ────────────────────────────────────────────────
  { brand: 'Mielle', name: 'Pomegranate & Honey Twisting Soufflé', category: 'custard', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Popular for Type 4 twist-outs', image_url: 'https://cdn.shopify.com/s/files/1/0763/8199/products/MIELLE_POMEGRANATE___HONEY_TWISTING_SOUFFLE_12OZ_158565770.jpg?v=1747750618' },

  // ── OIL / SERUM (Reddit) ────────────────────────────────────────────
  { brand: 'Noughty', name: 'To The Rescue Anti-Frizz Serum', category: 'oil_serum', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB/PETA. UK brand. Kukui, argan & coconut oils. Silicone-free', image_url: 'https://cdn.shopify.com/s/files/1/1668/1791/files/TILE-1_ToTheRescue_Serum_Packshot_1000x1000_0d0b96cf-8d85-4036-a844-056e64ff4d7d.webp?v=1750326178' },

  // ── SPRAY REFRESHER (Reddit) ────────────────────────────────────────
  { brand: 'DevaCurl', name: 'Mist of Wonders Multi-Benefit Spray', category: 'spray_refresher', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Multi-benefit hydration and refresh spray', image_url: 'https://www.devacurl.com/cdn/shop/files/Mist-of-Wonders-8oz.jpg' },

  // ── SEPHORA: LOW POO ──────────────────────────────────────────────────
  { brand: 'Pattern', name: 'Hydration Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. By Tracee Ellis Ross. Sulfate-free gentle cleanser', image_url: 'https://cdn.shopify.com/s/files/1/0149/4794/2500/files/Pattern_PDP_PaloSanto_hydrationshampoo_red_2000x2000copy_1_copy.jpg?v=1761950608' },
  { brand: 'Fable & Mane', name: 'HoliRoots Hydrating Shampoo', category: 'low_poo', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Sulfate-free with plant oils and botanical extracts', image_url: 'https://cdn.shopify.com/s/files/1/0587/3801/6450/files/HS_f9b61911-41c4-4217-8823-b14c344b1fa1.png?v=1758104021' },
  { brand: 'Moroccanoil', name: 'Hydrating Shampoo', category: 'low_poo', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains SLS/SLES (harsh sulfate) and silicone', image_url: 'http://www.moroccanoil.com/cdn/shop/files/18_SHAMPOO_HYDRATING_250mL_v2_1.jpg?v=1683502939' },
  { brand: 'JVN', name: 'Embody Daily Volumizing Shampoo', category: 'low_poo', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Contains SLES and dimethicone (non-water-soluble silicone)', image_url: 'https://cdn.shopify.com/s/files/1/0573/9626/5149/files/Embody_S_e0b9f870-cae1-417a-a9cc-77104af5d436.jpg?v=1750197880' },
  { brand: 'Pureology', name: 'Hydrate Shampoo', category: 'low_poo', cg_status: 'caution', cruelty_free: 'no', notes: 'L\'Oreal-owned (not cruelty-free). Contains PEG-modified silicones (water-soluble)', image_url: 'https://images.openbeautyfacts.org/images/products/081/259/500/2525/front_en.3.400.jpg' },

  // ── SEPHORA: RINSE-OUT CONDITIONER ────────────────────────────────────
  { brand: 'Pattern', name: 'Lightweight Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. By Tracee Ellis Ross. Silicone-free, lightweight formula', image_url: 'http://patternbeauty.com/cdn/shop/files/lightweight-cond_copy.jpg?v=1761949557' },
  { brand: 'Fable & Mane', name: 'HoliRoots Hydrating Conditioner', category: 'rinse_out_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Plant-based conditioning, no silicones', image_url: 'https://cdn.shopify.com/s/files/1/0587/3801/6450/files/HC_53887f69-f971-43f4-9b5c-ebcd2db797a5.png?v=1758034045' },
  { brand: 'Moroccanoil', name: 'Hydrating Conditioner', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains non-water-soluble silicones (cyclopentasiloxane, dimethicone)', image_url: 'http://www.moroccanoil.com/cdn/shop/files/26_CONDITIONER_HYDRATING_250mL_v2.jpg?v=1682817924' },
  { brand: 'JVN', name: 'Embody Daily Volumizing Conditioner', category: 'rinse_out_conditioner', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Contains dimethicone (non-water-soluble silicone)', image_url: 'https://cdn.shopify.com/s/files/1/0573/9626/5149/files/Embody_C_477afe92-eaa1-4d11-a86e-f6416240bdd6.jpg?v=1750204549' },
  { brand: 'Pureology', name: 'Hydrate Conditioner', category: 'rinse_out_conditioner', cg_status: 'caution', cruelty_free: 'no', notes: 'L\'Oreal-owned (not cruelty-free). Contains PEG-modified silicones (water-soluble)', image_url: null },

  // ── SEPHORA: DEEP CONDITIONER ─────────────────────────────────────────
  { brand: 'Pattern', name: 'Treatment Mask', category: 'deep_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. By Tracee Ellis Ross. Protein-rich rice water formula', image_url: 'http://patternbeauty.com/cdn/shop/files/TREATMASKbadge_copy.jpg?v=1761953242' },
  { brand: 'Moroccanoil', name: 'Intense Hydrating Mask', category: 'deep_conditioner', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains non-water-soluble silicones (dimethicone, cyclopentasiloxane)', image_url: 'http://www.moroccanoil.com/cdn/shop/files/121_MASK_INTENSE-HYDRATING_250mL_v3.jpg?v=1682737044' },
  { brand: 'Mizani', name: 'Moisture Fusion Deep Conditioning Mask', category: 'deep_conditioner', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains dimethicone (non-water-soluble silicone). L\'Oreal-owned', image_url: null },

  // ── SEPHORA: LEAVE-IN CONDITIONER ─────────────────────────────────────
  { brand: 'adwoa beauty', name: 'Baomint Leave In Conditioning Styler', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'Silicone-free, plant-based. Baobab oil, aloe, and peppermint', image_url: 'https://static1.squarespace.com/static/698e40f33ba47f4b87dedf4c/t/6991ca2bea7b683116d77f13/1771162155399/Baomint_and_Blue_Tansy_family_on_white_210622+%281%29.jpg?format=1500w' },
  { brand: 'Gisou', name: 'Honey Infused Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB. Honey and argan oil based, no silicones', image_url: 'https://cdn.shopify.com/s/files/1/0361/1987/1619/files/Leavein_PDP_DTC_01.jpg?v=1773072113' },
  { brand: 'Melanin Haircare', name: 'Multi-Use Softening Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. Plant-based, silicone-free and sulfate-free', image_url: 'https://cdn.shopify.com/s/files/1/0744/7124/4035/files/01_Multi-UseSofteningLeaveInConditioner_NewOunces_5.jpg?v=1741054928' },
  { brand: 'Mizani', name: '25 Miracle Milk Leave-In Conditioner', category: 'leave_in_conditioner', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains dimethicone (non-water-soluble silicone). L\'Oreal-owned', image_url: null },

  // ── PROSE ALTERNATIVES (ingredient-matched) ────────────────────────────
  { brand: 'Ceremonia', name: 'Pequi Curl Activator', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB. Vegan. Contains pequi oil, murumuru butter, açaí oil. Similar to Prose curl cream (pequi oil)', image_url: 'https://ceremonia.com/cdn/shop/files/pequi-curl-activator-pdp-1.jpg' },
  { brand: 'Cantu', name: 'Flaxseed Smoothing Cream Gel', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'unclear', notes: 'Contains flaxseed (linseed) oil, shea butter, avocado oil. Similar to Prose curl cream (linseed)', image_url: 'https://i5.walmartimages.com/seo/Cantu-Flaxseed-Smoothing-Cream-Gel-Hair-Moisturizer-for-Coily-Curly-Hair-Sulfate-Free-16-oz_2619af5b-8bfe-4ec3-818c-0ddb9b415660.a5893882d95acb038b380dfc1317a53f.jpeg' },
  { brand: 'TPH by Taraji', name: 'Curls 4 Days Moisture-Rich Curl Crème', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'PETA. Contains pequi oil, mango butter, broccoli seed oil. Contains drying alcohol (isopropyl). Similar to Prose curl cream (pequi oil)', image_url: 'https://s7d5.scene7.com/is/image/SallyBeauty/sbs007724' },

  // ── SEPHORA: CURL CREAM ───────────────────────────────────────────────
  { brand: 'Moroccanoil', name: 'Curl Defining Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains non-water-soluble silicones (dimethicone, cyclopentasiloxane) and drying alcohol', image_url: 'http://www.moroccanoil.com/cdn/shop/files/106_STYLE-FINISHER_CURL-DEFINING-CREAM_250mL_v2.jpg?v=1682737780' },
  { brand: 'Fenty Hair', name: 'The Homecurl Curl-Defining Styling Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Contains cyclopentasiloxane (non-water-soluble silicone). LVMH-owned', image_url: 'https://cdn.shopify.com/s/files/1/0341/3458/9485/files/FH_SMR24_LAUNCH_T2PRODUCT_ECOMM_PROTECTIVE-TYPE_DELUXE-MINI_1200X1500_72DPI_1.jpg?v=1762286535' },
  { brand: 'amika', name: 'Curl Corps Defining Cream', category: 'curl_cream', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB/PETA. Silicone-free formula with sea buckthorn and oat peptides', image_url: 'https://cdn.shopify.com/s/files/1/2117/1151/products/amika_220314_PDP_Curl_Collection_Curl_Corps_Cream_200ml_3026-RGB-trans-shadow-2000x2000.png?v=1649430209' },
  { brand: 'Mizani', name: 'True Textures Curl Enhancing Cream', category: 'curl_cream', cg_status: 'not_approved', cruelty_free: 'no', notes: 'Contains dimethicone and petrolatum. L\'Oreal-owned', image_url: null },

  // ── SEPHORA: SPRAY REFRESHER ──────────────────────────────────────────
  { brand: 'Pattern', name: 'Hydrating Hair Mist', category: 'spray_refresher', cg_status: 'approved', cruelty_free: 'yes', notes: 'PETA. By Tracee Ellis Ross. Alcohol-free curl refresher', image_url: 'https://cdn.shopify.com/s/files/1/0149/4794/2500/files/stylers2_0002_Layer16_copy.jpg?v=1761948191' },

  // ── SEPHORA: CLARIFYING SHAMPOO ───────────────────────────────────────
  { brand: 'Melanin Haircare', name: 'African Black Soap Reviving Shampoo', category: 'clarifying_shampoo', cg_status: 'caution', cruelty_free: 'yes', notes: 'PETA. Potentially drying cleansers, use with deep conditioning', image_url: 'https://cdn.shopify.com/s/files/1/0744/7124/4035/files/01_AfricanBlackSoapRevingShampoo_NewOunces_5.jpg?v=1741054482' },

  // ── SEPHORA: OIL / SERUM ──────────────────────────────────────────────
  { brand: 'COLOR WOW', name: 'Dream Coat Anti-Frizz Treatment for Curly Hair', category: 'oil_serum', cg_status: 'not_approved', cruelty_free: 'unclear', notes: 'Contains non-water-soluble silicones (amodimethicone, dimethicone)', image_url: 'https://cdn.shopify.com/s/files/1/0587/5210/6688/products/CW530_DreamCoatCurly_200ml_2048x2048_423125ac-91f1-4122-b216-1c0659be55e4.jpg?v=1648589845' },

  // ── DRY SHAMPOO ─────────────────────────────────────────────────────
  { brand: 'Klorane', name: 'Dry Shampoo with Oat Milk', category: 'dry_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB. Cult classic. Gentle, plant-based formula', image_url: null },
  { brand: 'Batiste', name: 'Original Dry Shampoo', category: 'dry_shampoo', cg_status: 'not_approved', cruelty_free: 'yes', notes: 'Contains silicone (cyclopentasiloxane). Most popular dry shampoo globally', image_url: null },
  { brand: "Not Your Mother's", name: 'Clean Freak Refreshing Dry Shampoo', category: 'dry_shampoo', cg_status: 'caution', cruelty_free: 'unclear', notes: 'Site claims no animal testing. Contains some potentially drying ingredients', image_url: null },
  { brand: 'amika', name: 'Perk Up Dry Shampoo', category: 'dry_shampoo', cg_status: 'approved', cruelty_free: 'yes', notes: 'LB/PETA. Rice starch-based, no silicones', image_url: null },

  // ══════════════════════════════════════════════════════════════════════
  // HAIRTOK-SOURCED PRODUCTS (trending on #HairTok, CGM-verified)
  // ══════════════════════════════════════════════════════════════════════

  // ── SCALP CARE ──────────────────────────────────────────────────────
  { brand: 'Generic', name: 'Rosemary Oil', category: 'scalp_care', cg_status: 'approved', cruelty_free: null, notes: 'Trending on #HairTok. Pure plant oil, no silicones or sulfates. Used for scalp massage and hair growth', image_url: null, hairtok_trending: true },

  // ── BOND REPAIR ─────────────────────────────────────────────────────
  { brand: 'Olaplex', name: 'No. 0 Intensive Bond Building Treatment', category: 'bond_repair', cg_status: 'caution', cruelty_free: null, notes: '#HairTok favorite. Bond-building primer used before No. 3. Needs ingredient verification', image_url: null, hairtok_trending: true },

  // ── MOUSSE (from Marty's research) ──────────────────────────────────
  { brand: 'AG Care', name: 'Cloud Air Volumizing Mousse', category: 'mousse', cg_status: 'caution', cruelty_free: null, notes: '#HairTok recommended. Lightweight volumizing mousse. Needs ingredient verification', image_url: null, hairtok_trending: true },

  // ── LEAVE-IN (HairTok additions) ────────────────────────────────────
  { brand: 'Rizos Curls', name: 'Multivitamin Leave-In', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: '#HairTok trending. Lightweight multivitamin formula for defined curls', image_url: null, hairtok_trending: true },
  { brand: 'adwoa beauty', name: 'Melonberry Hair Milk', category: 'leave_in_conditioner', cg_status: 'approved', cruelty_free: 'unclear', notes: '#HairTok trending. Lightweight moisturizer for all curl types', image_url: null, hairtok_trending: true },

  // ── GEL (HairTok additions) ─────────────────────────────────────────
  { brand: 'Rizos Curls', name: 'Strong Hold Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: '#HairTok trending. Strong hold without crunch', image_url: null, hairtok_trending: true },
  { brand: 'The Doux', name: 'Big Poppa Defining Gel', category: 'gel', cg_status: 'approved', cruelty_free: 'unclear', notes: '#HairTok trending. Textured hair specialist brand', image_url: null, hairtok_trending: true },

  // ── SCALP CARE (HairTok additions) ──────────────────────────────────
  { brand: 'Act+Acre', name: 'Cold Processed Scalp Renew', category: 'scalp_care', cg_status: 'caution', cruelty_free: 'unclear', notes: '#HairTok trending. Cold-processed scalp treatment', image_url: null, hairtok_trending: true },
  { brand: 'Nature Spell', name: 'Rosemary Oil for Hair & Skin', category: 'scalp_care', cg_status: 'approved', cruelty_free: 'unclear', notes: '#HairTok trending. Pure rosemary oil treatment', image_url: null, hairtok_trending: true },

  // ── CURL CREAM (HairTok additions) ──────────────────────────────────
  { brand: 'Davines', name: 'LOVE Curl Cream', category: 'curl_cream', cg_status: 'caution', cruelty_free: 'unclear', notes: '#HairTok trending. Salon-quality curl enhancer', image_url: null, hairtok_trending: true },
]
