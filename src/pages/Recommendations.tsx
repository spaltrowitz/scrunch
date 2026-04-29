import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { PRODUCT_CATEGORY_LABELS } from '../lib/constants'
import type { Product, ProductReview, Profile, ProductCategory, CurlPattern, Porosity } from '../lib/database.types'
import { ProductImage } from '../hooks/useProductImage'
import { QuickRateCard } from '../components/products/QuickRateCard'
import {
  buildIngredientProfile,
  scoreProductByIngredients,
  checkSensitivitiesWithStrictness,
  formatIngredientList,
} from '../utils/ingredientMatcher'

// ---------------------------------------------------------------------------
// Tier helpers
// ---------------------------------------------------------------------------

type Tier = 1 | 2 | 2.5 | 3 | 4

// A recommended product carries a reason string for display
interface RecommendedProduct extends Product {
  _reason?: string
  _sensitivityWarning?: string
}

const MIN_RATINGS_FOR_INGREDIENTS = 3

// Category priorities by POROSITY + TEXTURE (the guide says these matter most)
const POROSITY_TEXTURE_PRIORITY: Record<string, ProductCategory[]> = {
  // Low porosity, fine: lightweight everything, clarifying often
  'low_fine':    ['mousse', 'gel', 'spray_refresher', 'low_poo', 'clarifying_shampoo'],
  'low_medium':  ['gel', 'mousse', 'low_poo', 'leave_in_conditioner', 'spray_refresher'],
  'low_coarse':  ['gel', 'curl_cream', 'low_poo', 'rinse_out_conditioner'],

  // Medium porosity: flexible, most things work
  'medium_fine':    ['mousse', 'gel', 'leave_in_conditioner', 'low_poo'],
  'medium_medium':  ['gel', 'curl_cream', 'leave_in_conditioner', 'rinse_out_conditioner'],
  'medium_coarse':  ['curl_cream', 'gel', 'deep_conditioner', 'leave_in_conditioner', 'co_wash'],

  // High porosity: heavy moisture, sealing, protein treatments
  'high_fine':    ['gel', 'leave_in_conditioner', 'protein_treatment', 'deep_conditioner'],
  'high_medium':  ['curl_cream', 'gel', 'deep_conditioner', 'oil_serum', 'protein_treatment'],
  'high_coarse':  ['curl_cream', 'custard', 'oil_serum', 'deep_conditioner', 'co_wash', 'protein_treatment'],
}

// Fallback: curl pattern bands (secondary signal, used as tiebreaker)
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
  return 'coily' // 4A-4C
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

// Tier 1: pick ~3 from each major category for variety
const TIER1_CATEGORIES: ProductCategory[] = [
  'clarifying_shampoo', 'low_poo', 'rinse_out_conditioner', 'leave_in_conditioner',
  'curl_cream', 'gel', 'mousse', 'deep_conditioner',
]

function buildTier1(products: Product[], cgmExperience?: string | null): Product[] {
  const approved = products.filter(p => p.cg_status === 'approved')
  const result: Product[] = []

  // CGM beginners: always lead with clarifying shampoo
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

function buildTier2(
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

  // Primary: porosity + texture priorities
  const primaryPriorities = POROSITY_TEXTURE_PRIORITY[key] ?? POROSITY_TEXTURE_PRIORITY['medium_medium']

  // Secondary: curl pattern band (optional tiebreaker)
  const curlPriorities = profile.curl_pattern
    ? CURL_CATEGORY_PRIORITY[curlBand(profile.curl_pattern)] ?? []
    : []

  const scored = approved.map(p => {
    let s = 0
    // Primary: porosity + texture match (high weight)
    const primaryIdx = primaryPriorities.indexOf(p.category)
    if (primaryIdx !== -1) s += (primaryPriorities.length - primaryIdx) * 4

    // Secondary: curl pattern match (lower weight)
    const curlIdx = curlPriorities.indexOf(p.category)
    if (curlIdx !== -1) s += (curlPriorities.length - curlIdx) * 1

    s += porosityBoost(porosity, p.category)

    // Protein-moisture balance
    if (porosity === 'high' && p.category === 'protein_treatment') s += 3
    if (porosity === 'low' && p.category === 'protein_treatment') s -= 2

    // CGM beginner boost for clarifying shampoo
    if (profile.cgm_experience === 'just_starting' && p.category === 'clarifying_shampoo') s += 5

    // Climate-aware: humid → deprioritize heavy humectants, dry → boost sealing products
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

function buildTier3(
  allProducts: Product[],
  reviews: (ProductReview & { products: Product })[],
  ratedIds: Set<string>,
): RecommendedProduct[] {
  const loved = reviews.filter(r => r.rating != null && r.rating >= 4)
  const disliked = reviews.filter(r => r.rating != null && r.rating <= 2)

  // Count loved / disliked categories
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
    s += Math.min(p.review_count, 10) // popularity tiebreaker
    return { ...p, _score: s, _reason: 'Based on your ratings and hair profile' }
  })

  scored.sort((a, b) => b._score - a._score)
  return scored.slice(0, 5)
}

/** Tier 2.5: ingredient-based recommendations */
function buildIngredientTier(
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
    // Sensitivity filter (strict = exclude, flexible = warn)
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

// ---------------------------------------------------------------------------
// Dismiss-reason chips
// ---------------------------------------------------------------------------

const DISMISS_REASONS = [
  'Too heavy for my hair',
  'Contains ingredients I avoid',
  'Wrong for my porosity',
  'Too expensive',
  'Not available near me',
  'Already tried — didn\'t work',
  'Not interested',
]

// ---------------------------------------------------------------------------
// Header / subtitle per tier
// ---------------------------------------------------------------------------

function tierHeader(tier: Tier, profile: Profile | null): { title: string; subtitle: string } {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MIN_RATINGS_FOR_ADVANCED = 5

export function Recommendations() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userReviews, setUserReviews] = useState<(ProductReview & { products: Product })[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [ingredientRecs, setIngredientRecs] = useState<RecommendedProduct[]>([])
  const [tier, setTier] = useState<Tier>(1)
  const [loading, setLoading] = useState(true)
  const [ratingCount, setRatingCount] = useState(0)
  const [showRatingPopup, setShowRatingPopup] = useState<string | null>(null)
  const [sensitivityFilterCount, setSensitivityFilterCount] = useState(0)
  const [dismissingProduct, setDismissingProduct] = useState<string | null>(null)
  const [dismissReasons, setDismissReasons] = useState<Set<string>>(new Set())
  const [dismissNote, setDismissNote] = useState('')

  const ratedProductIds = new Set(userReviews.map(r => r.product_id))

  // ----- data loading -----

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [profileRes, reviewsRes, productsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('product_reviews')
        .select('*, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('products')
        .select('*')
        .order('review_count', { ascending: false })
        .limit(200),
    ])

    const userProfile = profileRes.data as unknown as Profile | null
    const reviews = (reviewsRes.data as unknown as (ProductReview & { products: Product })[]) ?? []
    const products = (productsRes.data as unknown as Product[]) ?? []

    setProfile(userProfile)
    setUserReviews(reviews)
    setRatingCount(reviews.length)
    setPopularProducts(products)

    const ratedIds = new Set(reviews.map(r => r.product_id))
    const reviewsWithRating = reviews.filter(r => r.rating != null)
    const sensitivities = userProfile?.sensitivities ?? []

    // Determine tier & build recommendations
    // Profile is "done" if porosity is set (the most important factor per CG guide)
    // curl_pattern is now optional
    const profileDone = userProfile?.onboarding_completed && !!userProfile.porosity
    let currentTier: Tier = 1
    let recs: RecommendedProduct[] = []
    let ingredientResults: RecommendedProduct[] = []
    let sensitivityFiltered = 0

    if (!profileDone) {
      // Tier 1
      currentTier = 1
      recs = buildTier1(products, userProfile?.cgm_experience)
    } else if (reviewsWithRating.length < MIN_RATINGS_FOR_INGREDIENTS) {
      // Tier 2 — now uses porosity + texture (not curl pattern)
      currentTier = 2
      recs = buildTier2(products, userProfile!, ratedIds)
    } else if (reviewsWithRating.length < MIN_RATINGS_FOR_ADVANCED) {
      // Tier 2.5 — ingredient-based
      currentTier = 2.5
      const tier2Recs = buildTier2(products, userProfile!.curl_pattern!, userProfile!.porosity!, ratedIds)
      const { recs: ingRecs, sensitivityFilterCount: filtCount } = buildIngredientTier(
        products, reviews, ratedIds, sensitivities,
      )
      sensitivityFiltered = filtCount

      if (ingRecs.length > 0) {
        // Blend: ingredient recs first, then hair-type fill
        const seen = new Set(ingRecs.map(p => p.id))
        const blended = [...ingRecs]
        for (const p of tier2Recs) {
          if (!seen.has(p.id)) {
            blended.push(p)
            seen.add(p.id)
          }
        }
        recs = blended.slice(0, 5)
        ingredientResults = ingRecs
      } else {
        currentTier = 2
        recs = tier2Recs
      }
    } else {
      // Tier 3 or 4 — check for similar users
      // Also build ingredient recs as a supplementary section
      const { recs: ingRecs, sensitivityFilterCount: filtCount } = buildIngredientTier(
        products, reviews, ratedIds, sensitivities,
      )
      ingredientResults = ingRecs
      sensitivityFiltered = filtCount

      const { collabRecs, hasSimilarUsers } = await loadCollaborativeRecs(
        userProfile!,
        reviews,
        ratedIds,
      )
      if (hasSimilarUsers && collabRecs.length > 0) {
        currentTier = 4
        const tier3 = buildTier3(products, reviews, ratedIds)
        // Blend: collab first, then tier3 fill, dedupe
        const seen = new Set(collabRecs.map(p => p.id))
        const blended: RecommendedProduct[] = collabRecs.map(p => ({
          ...p,
          _reason: 'Loved by people with similar hair',
        }))
        for (const p of tier3) {
          if (!seen.has(p.id)) {
            blended.push(p)
            seen.add(p.id)
          }
        }
        recs = blended.slice(0, 5)
      } else {
        currentTier = 3
        recs = buildTier3(products, reviews, ratedIds)
      }
    }

    setTier(currentTier)
    setRecommendedProducts(recs)
    setIngredientRecs(ingredientResults)
    setSensitivityFilterCount(sensitivityFiltered)
    setLoading(false)
  }, [user])

  /** Collaborative filtering: find users with same curl_pattern + porosity, get their 4-5 rated products */
  const loadCollaborativeRecs = async (
    userProfile: Profile,
    reviews: (ProductReview & { products: Product })[],
    ratedIds: Set<string>,
  ): Promise<{ collabRecs: Product[]; hasSimilarUsers: boolean }> => {
    if (!userProfile.curl_pattern || !userProfile.porosity) {
      return { collabRecs: [], hasSimilarUsers: false }
    }

    const { data: similarProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('curl_pattern', userProfile.curl_pattern)
      .eq('porosity', userProfile.porosity)

    const similarUserIds = ((similarProfiles as unknown as { id: string }[]) ?? [])
      .map(p => p.id)
      .filter(id => id !== userProfile.id)

    if (similarUserIds.length === 0) {
      return { collabRecs: [], hasSimilarUsers: false }
    }

    const { data: similarReviews } = await supabase
      .from('product_reviews')
      .select('product_id, rating')
      .in('user_id', similarUserIds)
      .gte('rating', 4)

    const castReviews =
      (similarReviews as unknown as { product_id: string; rating: number }[]) ?? []

    // Deprioritise categories the user disliked
    const dislikedCats = new Set(
      reviews.filter(r => r.rating != null && r.rating <= 2).map(r => r.products.category),
    )

    const productCounts: Record<string, number> = {}
    for (const review of castReviews) {
      if (!ratedIds.has(review.product_id)) {
        productCounts[review.product_id] = (productCounts[review.product_id] || 0) + 1
      }
    }

    const rankedIds = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id)

    if (rankedIds.length === 0) {
      return { collabRecs: [], hasSimilarUsers: true }
    }

    const { data: recProducts } = await supabase
      .from('products')
      .select('*')
      .in('id', rankedIds)

    let recs = (recProducts as unknown as Product[]) ?? []
    // Preserve ranking & deprioritise disliked categories
    recs.sort((a, b) => {
      const aDis = dislikedCats.has(a.category) ? 1 : 0
      const bDis = dislikedCats.has(b.category) ? 1 : 0
      if (aDis !== bDis) return aDis - bDis
      return rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id)
    })

    return { collabRecs: recs, hasSimilarUsers: true }
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  // ----- rating handler -----

  const handleRate = async (productId: string, rating: number) => {
    if (!user) return

    await supabase
      .from('product_reviews')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          rating,
          status: 'tried_once',
          would_repurchase: rating >= 4 ? 'yes' : rating <= 2 ? 'no' : 'maybe',
          photo_urls: [],
        } as never,
        { onConflict: 'user_id,product_id' },
      )

    setRatingCount(prev => prev + 1)
    setShowRatingPopup(null)

    // Refresh reviews
    const { data: freshReviews } = await supabase
      .from('product_reviews')
      .select('*, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const reviews = (freshReviews as unknown as (ProductReview & { products: Product })[]) ?? []
    setUserReviews(reviews)
  }

  // ----- bookmark handler -----

  const handleBookmark = (productId: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('scrunch_actions') || '{}')
      if (!stored[productId]) stored[productId] = []
      if (!stored[productId].includes('bookmarked')) {
        stored[productId].push('bookmarked')
      }
      localStorage.setItem('scrunch_actions', JSON.stringify(stored))
    } catch { /* ignore */ }
  }

  // ----- dismiss handler -----

  const handleDismiss = async (productId: string) => {
    if (!user || dismissReasons.size === 0) return

    const reasonText = [...dismissReasons].join(', ')
    const notes = dismissNote.trim()
      ? `${reasonText}. ${dismissNote.trim()}`
      : reasonText

    await supabase
      .from('product_reviews')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          rating: 1,
          would_repurchase: 'no',
          results_notes: notes,
          status: 'tried_once',
          photo_urls: [],
        } as never,
        { onConflict: 'user_id,product_id' },
      )

    setDismissingProduct(null)
    setDismissReasons(new Set())
    setDismissNote('')
    loadData()
  }

  // ----- render gates -----

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">For You</h1>
        <p className="text-gray-600 mb-4">
          Sign in to get personalized product recommendations.
        </p>
        <Link to="/login" className="text-violet-600 hover:underline">
          Sign in →
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12 text-gray-500">Loading recommendations…</div>
      </div>
    )
  }

  const firstName = profile?.display_name?.split(' ')[0] ?? 'there'
  const { title: recTitle, subtitle: recSubtitle } = tierHeader(tier, profile)

  const lovedReviews = userReviews.filter(r => r.rating != null && r.rating >= 4 && r.rating <= 5)
  const likedReviews = userReviews.filter(r => r.rating === 3)
  const mehReviews = userReviews.filter(r => r.rating === 2)
  const dislikedReviews = userReviews.filter(r => r.rating != null && r.rating <= 1)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Greeting */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Hey {firstName} ✨
      </h1>

      {/* ───────── Tier-appropriate recommendations ───────── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{recTitle}</h2>
        <p className="text-sm text-gray-500 mb-4">{recSubtitle}</p>

        {tier === 1 && (
          <Link
            to="/onboarding"
            className="inline-block mb-4 text-sm font-medium text-violet-600 hover:underline"
          >
            Complete your hair profile →
          </Link>
        )}

        {tier === 2 && (
          <p className="text-xs text-gray-400 mb-4">
            Rate products you've tried for even better recommendations
          </p>
        )}

        {sensitivityFilterCount > 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mb-4">
            Filtered out {sensitivityFilterCount} product{sensitivityFilterCount !== 1 ? 's' : ''} based on your sensitivities
          </p>
        )}

        {recommendedProducts.length > 0 ? (
          <div className="space-y-3">
            {recommendedProducts.map(product => (
              <RecommendedCard
                key={product.id}
                product={product}
                reason={product._reason}
                sensitivityWarning={product._sensitivityWarning}
                matchScore={product._score}
                showRatingPopup={showRatingPopup === product.id}
                onOpenRating={() => setShowRatingPopup(product.id)}
                onCloseRating={() => setShowRatingPopup(null)}
                onRate={handleRate}
                isDismissing={dismissingProduct === product.id}
                dismissReasons={dismissingProduct === product.id ? dismissReasons : new Set<string>()}
                dismissNote={dismissingProduct === product.id ? dismissNote : ''}
                onOpenDismiss={() => {
                  setDismissingProduct(product.id)
                  setDismissReasons(new Set())
                  setDismissNote('')
                  setShowRatingPopup(null)
                }}
                onCloseDismiss={() => {
                  setDismissingProduct(null)
                  setDismissReasons(new Set())
                  setDismissNote('')
                }}
                onToggleDismissReason={(reason: string) => {
                  setDismissReasons(prev => {
                    const next = new Set(prev)
                    if (next.has(reason)) next.delete(reason)
                    else next.add(reason)
                    return next
                  })
                }}
                onDismissNoteChange={(val: string) => setDismissNote(val)}
                onSubmitDismiss={() => handleDismiss(product.id)}
                onBookmark={() => handleBookmark(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No recommendations yet — keep rating!</p>
        )}
      </section>

      {/* ───────── Ingredient-based section (shown alongside Tier 3/4) ───────── */}
      {(tier === 3 || tier === 4) && ingredientRecs.length > 0 && (
        <>
          <hr className="border-gray-200 mb-12" />
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Based on ingredients you love
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Products with similar ingredients to your favorites
            </p>
            <div className="space-y-3">
              {ingredientRecs.slice(0, 10).map(product => (
                <RecommendedCard
                  key={product.id}
                  product={product}
                  reason={product._reason}
                  sensitivityWarning={product._sensitivityWarning}
                  showRatingPopup={showRatingPopup === product.id}
                  onOpenRating={() => setShowRatingPopup(product.id)}
                  onCloseRating={() => setShowRatingPopup(null)}
                  onRate={handleRate}
                  isDismissing={dismissingProduct === product.id}
                  dismissReasons={dismissingProduct === product.id ? dismissReasons : new Set<string>()}
                  dismissNote={dismissingProduct === product.id ? dismissNote : ''}
                  onOpenDismiss={() => {
                    setDismissingProduct(product.id)
                    setDismissReasons(new Set())
                    setDismissNote('')
                    setShowRatingPopup(null)
                  }}
                  onCloseDismiss={() => {
                    setDismissingProduct(null)
                    setDismissReasons(new Set())
                    setDismissNote('')
                  }}
                  onToggleDismissReason={(reason: string) => {
                    setDismissReasons(prev => {
                      const next = new Set(prev)
                      if (next.has(reason)) next.delete(reason)
                      else next.add(reason)
                      return next
                    })
                  }}
                  onDismissNoteChange={(val: string) => setDismissNote(val)}
                  onSubmitDismiss={() => handleDismiss(product.id)}
                  onBookmark={() => handleBookmark(product.id)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ───────── separator ───────── */}
      <hr className="border-gray-200 mb-12" />

      {/* ───────── Rate products you've used ───────── */}
      {popularProducts.filter(p => !ratedProductIds.has(p.id)).length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Rate products you've used
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            The more you rate, the better your recommendations get
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularProducts
              .filter(p => !ratedProductIds.has(p.id))
              .slice(0, 3)
              .map(product => (
                <QuickRateCard key={product.id} product={product} onRate={handleRate} />
              ))}
          </div>
        </section>
      )}

      {/* ───────── separator ───────── */}
      <hr className="border-gray-200 mb-12" />

      {/* ───────── Want to Try (bookmarked) ───────── */}
      {(() => {
        try {
          const stored = JSON.parse(localStorage.getItem('scrunch_actions') || '{}')
          const bookmarkedKeys = Object.entries(stored)
            .filter(([, actions]) => (actions as string[]).includes('bookmarked'))
            .map(([key]) => key)
          if (bookmarkedKeys.length === 0) return null
          return (
            <section className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ☆ Saved ({bookmarkedKeys.length})
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Products you've saved to try later
              </p>
              <div className="space-y-2">
                {bookmarkedKeys.map(key => {
                  const product = popularProducts.find(p => p.id === key)
                  const brand = product?.brand || (key.includes('::') ? key.split('::')[0] : null)
                  const name = product?.name || (key.includes('::') ? key.split('::')[1] : null)
                  if (!brand || !name) return null
                  return (
                    <Link
                      key={key}
                      to={product ? `/products/${product.id}` : '/products'}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
                    >
                      <ProductImage brand={brand} name={name} seedImageUrl={product?.image_url} className="w-10 h-10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">{brand}</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        } catch {
          return null
        }
      })()}

      {/* ───────── separator ───────── */}
      {userReviews.length > 0 && <hr className="border-gray-200 mb-12" />}

      {/* ───────── Your Ratings ───────── */}
      {userReviews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Ratings</h2>

          {lovedReviews.length > 0 && (
            <RatingGroup
              label="👍 Loved"
              count={lovedReviews.length}
              colorClass="text-green-700"
              reviews={lovedReviews}
            />
          )}

          {likedReviews.length > 0 && (
            <RatingGroup
              label="👍 Liked"
              count={likedReviews.length}
              colorClass="text-emerald-600"
              reviews={likedReviews}
            />
          )}

          {mehReviews.length > 0 && (
            <RatingGroup
              label="😐 It was ok"
              count={mehReviews.length}
              colorClass="text-amber-700"
              reviews={mehReviews}
            />
          )}

          {dislikedReviews.length > 0 && (
            <RatingGroup
              label="👎 Didn't like"
              count={dislikedReviews.length}
              colorClass="text-red-700"
              reviews={dislikedReviews}
            />
          )}
        </section>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RecommendedCard({
  product,
  reason,
  sensitivityWarning,
  matchScore,
  showRatingPopup,
  onOpenRating,
  onCloseRating,
  onRate,
  isDismissing,
  dismissReasons,
  dismissNote,
  onOpenDismiss,
  onCloseDismiss,
  onToggleDismissReason,
  onDismissNoteChange,
  onSubmitDismiss,
  onBookmark,
}: {
  product: Product
  reason?: string
  sensitivityWarning?: string
  matchScore?: number
  showRatingPopup: boolean
  onOpenRating: () => void
  onCloseRating: () => void
  onRate: (productId: string, rating: number) => Promise<void>
  isDismissing: boolean
  dismissReasons: Set<string>
  dismissNote: string
  onOpenDismiss: () => void
  onCloseDismiss: () => void
  onToggleDismissReason: (reason: string) => void
  onDismissNoteChange: (value: string) => void
  onSubmitDismiss: () => void
  onBookmark: () => void
}) {
  const isCg = product.cg_status === 'approved'
  const isCf = product.cruelty_free === 'yes'
  const productNotes = (product.notes || '').toLowerCase()
  const isFragFree =
    productNotes.includes('fragrance-free') || productNotes.includes('fragrance free')

  return (
    <div className="bg-white rounded-xl border border-gray-200 relative">
      <div className="flex items-center gap-4 p-4">
        <ProductImage
          brand={product.brand}
          name={product.name}
          seedImageUrl={product.image_url}
          className="w-14 h-14 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{product.brand}</p>
            {matchScore != null && matchScore > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                matchScore >= 80 ? 'bg-emerald-50 text-emerald-700' :
                matchScore >= 60 ? 'bg-green-50 text-green-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                {matchScore}% match
              </span>
            )}
          </div>
          <Link
            to={`/products/${product.id}`}
            className="font-semibold text-gray-900 hover:text-violet-600 no-underline truncate block"
          >
            {product.name}
          </Link>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">
              {PRODUCT_CATEGORY_LABELS[product.category]}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${isCg ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
            >
              {isCg ? '🟢 CG' : '🔴 Not CG'}
            </span>
            {isCf && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                🐰
              </span>
            )}
            {isFragFree && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600">
                🌸
              </span>
            )}
          </div>
          {reason && (
            <p className="text-xs text-violet-500 mt-1 truncate">
              ✨ {reason}
            </p>
          )}
          {sensitivityWarning && (
            <p className="text-xs text-amber-600 mt-1 truncate">
              {sensitivityWarning}
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onBookmark}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition cursor-pointer border-0"
          >
            👍 Try it
          </button>
          <button
            onClick={onOpenRating}
            className="text-xs px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition cursor-pointer border-0"
          >
            Tried it?
          </button>
          <button
            onClick={isDismissing ? onCloseDismiss : onOpenDismiss}
            className={`text-xs px-3 py-1.5 rounded-lg transition cursor-pointer border-0 ${
              isDismissing
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            ✕ Not for me
          </button>
        </div>

        {/* Inline rating popup */}
        {showRatingPopup && (
          <div className="absolute right-4 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex gap-2">
            {[
              { rating: 5, emoji: '👍', label: 'Loved' },
              { rating: 3, emoji: '😐', label: 'Ok' },
              { rating: 1, emoji: '👎', label: 'Nope' },
            ].map(({ rating, emoji, label }) => (
              <button
                key={rating}
                onClick={() => onRate(product.id, rating)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer border-0 bg-transparent"
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </button>
            ))}
            <button
              onClick={onCloseRating}
              className="text-xs text-gray-400 hover:text-gray-600 px-1 cursor-pointer border-0 bg-transparent"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Inline dismiss feedback form */}
      {isDismissing && (
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Why doesn't this work for you?
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {DISMISS_REASONS.map(r => {
              const selected = dismissReasons.has(r)
              return (
                <button
                  key={r}
                  onClick={() => onToggleDismissReason(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition ${
                    selected
                      ? 'bg-violet-100 border-violet-300 text-violet-700 font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {r}
                </button>
              )
            })}
          </div>
          <input
            type="text"
            placeholder="Any other details (optional)"
            value={dismissNote}
            onChange={e => onDismissNoteChange(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:border-violet-300"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSubmitDismiss}
              disabled={dismissReasons.size === 0}
              className={`text-xs px-4 py-1.5 rounded-lg border-0 transition cursor-pointer ${
                dismissReasons.size > 0
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
            <button
              onClick={onCloseDismiss}
              className="text-xs px-3 py-1.5 text-gray-400 hover:text-gray-600 cursor-pointer border-0 bg-transparent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function RatingGroup({
  label,
  count,
  colorClass,
  reviews,
}: {
  label: string
  count: number
  colorClass: string
  reviews: (ProductReview & { products: Product })[]
}) {
  return (
    <div className="mb-6">
      <h3 className={`text-sm font-medium ${colorClass} mb-2`}>
        {label} ({count})
      </h3>
      <div className="space-y-2">
        {reviews.map(review => (
          <RatingRow key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}

function RatingRow({ review }: { review: ProductReview & { products: Product } }) {
  return (
    <Link
      to={`/products/${review.product_id}`}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
    >
      <ProductImage
        brand={review.products.brand}
        name={review.products.name}
        seedImageUrl={review.products.image_url}
        className="w-10 h-10"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{review.products.brand}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {review.products.name}
        </p>
      </div>
      {review.results_notes && (
        <p className="text-xs text-gray-400 truncate max-w-[150px]">
          {review.results_notes}
        </p>
      )}
    </Link>
  )
}
