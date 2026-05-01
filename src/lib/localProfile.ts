import type { Profile } from './database.types'

const PROFILE_KEY = 'scrunch_profile'

export function getLocalProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Profile
  } catch {
    return null
  }
}

export function setLocalProfile(profile: Partial<Profile>) {
  try {
    const existing = getLocalProfile()
    const merged = { ...existing, ...profile }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged))
  } catch { /* localStorage full */ }
}

export function getLocalRatingCount(): number {
  try {
    const ratings = JSON.parse(localStorage.getItem('scrunch_ratings') || '{}')
    return Object.keys(ratings).length
  } catch {
    return 0
  }
}

type TriedRating = 'loved' | 'liked' | 'ok' | 'disliked'
type LocalRatings = Record<string, TriedRating>

const RATING_MAP: Record<TriedRating, number> = { loved: 5, liked: 4, ok: 3, disliked: 1 }
const REPURCHASE_MAP: Record<TriedRating, string> = { loved: 'yes', liked: 'yes', ok: 'maybe', disliked: 'no' }

export function getLocalRatings(): LocalRatings {
  try {
    return JSON.parse(localStorage.getItem('scrunch_ratings') || '{}')
  } catch {
    return {}
  }
}

/** Convert localStorage ratings into ProductReview-shaped objects for the recommendation engine */
export function getLocalReviewsForRecs(products: { id: string; brand: string; name: string; category: string }[]) {
  const ratings = getLocalRatings()
  const productMap = new Map(products.map(p => [p.id, p]))

  // Also check brand::name keys from seed products
  const brandNameMap = new Map(products.map(p => [`${p.brand}::${p.name}`, p]))

  return Object.entries(ratings).map(([key, rating]) => {
    const product = productMap.get(key) || brandNameMap.get(key)
    const numericRating = RATING_MAP[rating]
    return {
      id: `local-${key}`,
      user_id: 'local',
      product_id: product?.id || key,
      rating: numericRating,
      status: 'tried_once' as const,
      would_repurchase: REPURCHASE_MAP[rating] as 'yes' | 'no' | 'maybe',
      application_method: null,
      results_notes: null,
      routine_context: null,
      photo_urls: [],
      created_at: '',
      updated_at: '',
      products: product ? {
        brand: product.brand,
        name: product.name,
        category: product.category,
        cg_status: 'approved' as const,
      } : { brand: '', name: '', category: '', cg_status: 'approved' as const },
    }
  }).filter(r => r.products.brand !== '') // Filter out ratings with no matching product
}
