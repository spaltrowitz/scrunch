import type { Product, ProductReview, Profile, ProductCategory, CurlPattern, Porosity } from '../../lib/database.types'
import {
  buildIngredientProfile,
  scoreProductByIngredients,
  checkSensitivitiesWithStrictness,
  formatIngredientList,
} from '../../utils/ingredientMatcher'

export type Tier = 1 | 2 | 2.5 | 3 | 4

export interface RecommendedProduct extends Product {
  _reason?: string
  _sensitivityWarning?: string
  _score?: number
}

export const MIN_RATINGS_FOR_INGREDIENTS = 3
export const MIN_RATINGS_FOR_ADVANCED = 5

const POROSITY_TEXTURE_PRIORITY: Record<string, ProductCategory[]> = {
  'low_fine':    ['mousse', 'gel', 'spray_refresher', 'low_poo', 'clarifying_shampoo'],
  'low_medium':  ['gel', 'mousse', 'low_poo', 'leave_in_conditioner', 'spray_refresher'],
  'low_coarse':  ['gel', 'curl_cream', 'low_poo', 'rinse_out_conditioner'],
  'medium_fine':    ['mousse', 'gel', 'leave_in_conditioner', 'low_poo'],
  'medium_medium':  ['gel', 'curl_cream', 'leave_in_conditioner', 'rinse_out_conditioner'],
  'medium_coarse':  ['curl_cream', 'gel', 'deep_conditioner', 'leave_in_conditioner', 'co_wash'],
  'high_fine':    ['gel', 'leave_in_conditioner', 'protein_treatment', 'deep_conditioner'],
  'high_medium':  ['curl_cream', 'gel', 'deep_conditioner', 'oil_serum', 'protein_treatment'],
  'high_coarse':  ['curl_cream', 'custard', 'oil_serum', 'deep_conditioner', 'co_wash', 'protein_treatment'],
}

const CURL_CATEGORY_PRIORITY: Record<string, ProductCategory[]> = {
  wavy:       ['mousse', 'gel', 'low_poo'],
  wavy_curly: ['gel', 'leave_in_conditioner', 'curl_cream'],
  curly:      ['curl_cream', 'gel', 'custard', 'deep_conditioner'],
  coily:      ['curl_cream', 'custard', 'oil_serum', 'deep_conditioner', 'co_wash'],
}

function curlBand(cp: CurlPattern): string {
  if (cp === '2A' || cp === '2B') return 'wavy'
  if (cp === '2C' || cp === '3A') return 'wavy_curly'
  if (cp === '3B' || cp === '3C') return 'curly'
  return 'coily'
}

function porosityTextureKey(porosity: Porosity, width: string | null): string {
  const texture = width || 'medium'
  return `${porosity}_${texture}`
}

const LIGHTWEIGHT_CATEGORIES: ProductCategory[] = ['mousse', 'gel', 'spray_refresher']
const HEAVY_MOISTURE_CATEGORIES: ProductCategory[] = ['deep_conditioner', 'oil_serum', 'curl_cream']

function porosityBoost(porosity: Porosity, category: ProductCategory): number {
  if (porosity === 'low' && (LIGHTWEIGHT_CATEGORIES as string[]).includes(category)) return 2
  if (porosity === 'high' && (HEAVY_MOISTURE_CATEGORIES as string[]).includes(category)) return 2
  return 0
}

const TIER1_CATEGORIES: ProductCategory[] = [
  'clarifying_shampoo', 'low_poo', 'rinse_out_conditioner', 'leave_in_conditioner',
  'curl_cream', 'gel', 'mousse', 'deep_conditioner',
]

export function buildTier1(products: Product[], cgmExperience?: string | null): Product[] {
  const approved = products.filter(p => p.cg_status === 'approved')
  const result: Product[] = []

  if (!cgmExperience || cgmExperience === 'just_starting') {
    const clarifiers = products.filter(p => p.category === 'clarifying_shampoo')
    if (clarifiers.length > 0) result.push(clarifiers[0])
  }

  for (const cat of TIER1_CATEGORIES) {
    const catProducts = approved
      .filter(p => p.category === cat && !result.some(r => r.id === p.id))
      .slice(0, 3)
    result.push(...catProducts)
  }
  return result.slice(0, 5)
}

export function buildTier2(
  products: Product[],
  profile: Profile,
  ratedIds: Set<string>,
): RecommendedProduct[] {
  const approved = products.filter(
    p => p.cg_status === 'approved' && !ratedIds.has(p.id),
  )
  const porosity = profile.porosity || 'medium'
  const width = profile.hair_width || 'medium'
  const key = porosityTextureKey(porosity, width)

  const primaryPriorities = POROSITY_TEXTURE_PRIORITY[key] ?? POROSITY_TEXTURE_PRIORITY['medium_medium']
  const curlPriorities = profile.curl_pattern
    ? CURL_CATEGORY_PRIORITY[curlBand(profile.curl_pattern)] ?? []
    : []

  const scored = approved.map(p => {
    let s = 0
    const primaryIdx = primaryPriorities.indexOf(p.category)
    if (primaryIdx !== -1) s += (primaryPriorities.length - primaryIdx) * 4

    const curlIdx = curlPriorities.indexOf(p.category)
    if (curlIdx !== -1) s += (curlPriorities.length - curlIdx) * 1

    s += porosityBoost(porosity, p.category)

    if (porosity === 'high' && p.category === 'protein_treatment') s += 3
    if (porosity === 'low' && p.category === 'protein_treatment') s -= 2
    if (profile.cgm_experience === 'just_starting' && p.category === 'clarifying_shampoo') s += 5
    if (profile.climate === 'humid' && p.category === 'oil_serum') s += 2
    if (profile.climate === 'dry' && p.category === 'oil_serum') s += 3

    const reasonParts = [`${porosity} porosity`]
    if (width !== 'medium') reasonParts.push(`${width} texture`)
    if (profile.curl_pattern) reasonParts.push(profile.curl_pattern)
    const reason = `Recommended for ${reasonParts.join(', ')} hair`

    return { ...p, _score: s, _reason: reason }
  })

  scored.sort((a, b) => b._score - a._score)
  return scored.slice(0, 5)
}

export function buildTier3(
  allProducts: Product[],
  reviews: (ProductReview & { products: Product })[],
  ratedIds: Set<string>,
): RecommendedProduct[] {
  const loved = reviews.filter(r => r.rating != null && r.rating >= 4)
  const disliked = reviews.filter(r => r.rating != null && r.rating <= 2)

  const lovedCats: Record<string, number> = {}
  for (const r of loved) {
    const cat = r.products.category
    lovedCats[cat] = (lovedCats[cat] || 0) + 1
  }
  const dislikedCats = new Set(disliked.map(r => r.products.category))

  const candidates = allProducts.filter(p => !ratedIds.has(p.id))

  const scored = candidates.map(p => {
    let s = 0
    if (lovedCats[p.category]) s += lovedCats[p.category] * 5
    if (dislikedCats.has(p.category)) s -= 10
    if (p.cg_status === 'approved') s += 3
    s += Math.min(p.review_count, 10)
    return { ...p, _score: s, _reason: 'Based on your ratings and hair profile' }
  })

  scored.sort((a, b) => b._score - a._score)
  return scored.slice(0, 5)
}

export function buildIngredientTier(
  allProducts: Product[],
  reviews: (ProductReview & { products: Product })[],
  ratedIds: Set<string>,
  sensitivities: string[],
): { recs: RecommendedProduct[]; sensitivityFilterCount: number } {
  const loved = reviews
    .filter(r => r.rating != null && r.rating >= 4)
    .map(r => r.products)
  const disliked = reviews
    .filter(r => r.rating != null && r.rating <= 2)
    .map(r => r.products)

  const profile = buildIngredientProfile(loved, disliked)

  if (profile.commonIngredients.length === 0) {
    return { recs: [], sensitivityFilterCount: 0 }
  }

  const candidates = allProducts.filter(
    p => p.cg_status === 'approved' && !ratedIds.has(p.id),
  )

  let sensitivityFilterCount = 0

  const scored: (RecommendedProduct & { _score: number })[] = []
  for (const product of candidates) {
    if (sensitivities.length > 0) {
      const { strict, flexible } = checkSensitivitiesWithStrictness(product, sensitivities)
      if (strict.length > 0) {
        sensitivityFilterCount++
        continue
      }
      if (flexible.length > 0) {
        const { score, matchedIngredients } = scoreProductByIngredients(product, profile)
        if (score > 0 && matchedIngredients.length > 0) {
          const reason = `Contains ${formatIngredientList(matchedIngredients)} — ingredients you've loved in other products`
          const warning = `⚠️ Contains ${formatIngredientList(flexible)} (you prefer to avoid)`
          scored.push({ ...product, _score: score * 0.7, _reason: reason, _sensitivityWarning: warning })
        }
        continue
      }
    }

    const { score, matchedIngredients } = scoreProductByIngredients(product, profile)
    if (score > 0 && matchedIngredients.length > 0) {
      const reason = `Contains ${formatIngredientList(matchedIngredients)} — ingredients you've loved in other products`
      scored.push({ ...product, _score: score, _reason: reason })
    }
  }

  scored.sort((a, b) => b._score - a._score)
  return { recs: scored.slice(0, 5), sensitivityFilterCount }
}

export function tierHeader(tier: Tier, profile: Profile | null): { title: string; subtitle: string } {
  const porosity = profile?.porosity || 'your'
  const width = profile?.hair_width ? `, ${profile.hair_width}` : ''
  const curlInfo = profile?.curl_pattern ? ` ${profile.curl_pattern}` : ''
  switch (tier) {
    case 1:
      return {
        title: 'Popular CG-Approved Products',
        subtitle: profile?.cgm_experience === 'just_starting'
          ? 'Starting CGM? Your first step is a clarifying wash — we\'ve included one below'
          : 'Complete your hair profile to get personalized recommendations',
      }
    case 2:
      return {
        title: `Recommended for ${porosity} porosity${width} hair`,
        subtitle: `Based on what works for ${porosity} porosity${width}${curlInfo} hair`,
      }
    case 2.5:
      return {
        title: 'Based on ingredients you love',
        subtitle: 'Products with similar ingredients to your favorites',
      }
    case 3:
      return {
        title: 'Recommended for you',
        subtitle: 'Based on your ratings and hair profile',
      }
    case 4:
      return {
        title: `People with ${porosity} porosity${width} hair who like similar products also loved\u2026`,
        subtitle: 'Based on your ratings and hair profile',
      }
  }
}
