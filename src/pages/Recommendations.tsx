import { useState, useMemo, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.utils'
import type { Product, ProductReview, Profile } from '../lib/database.types'
import { useRecommendationProducts, useUserProfile, useUserReviews } from '../hooks/useProducts'
import { getLocalReviewsForRecs, getLocalRatings } from '../lib/localProfile'
import {
  buildTier1,
  buildTier2,
  buildTier3,
  buildIngredientTier,
  tierHeader,
  MIN_RATINGS_FOR_INGREDIENTS,
  MIN_RATINGS_FOR_ADVANCED,
} from '../components/recommendations/recommendationEngine'
import type { Tier, RecommendedProduct } from '../components/recommendations/recommendationEngine'
import { RecommendedCard } from '../components/recommendations/RecommendedCard'
import { RatingGroup } from '../components/recommendations/RatingGroup'
import { SavedProducts } from '../components/recommendations/SavedProducts'
import { IngredientRecsSection } from '../components/recommendations/IngredientRecsSection'
import {
  trackRecommendationShown,
  trackRecommendationEngaged,
} from '../lib/analytics'
import { safeLocalSet } from '../lib/safeStorage'

const EMPTY_SET: Set<string> = new Set()
const ALGORITHM_VERSION = 'v1'

async function loadCollaborativeRecs(
  userProfile: Profile,
  reviews: (ProductReview & { products: Product })[],
  ratedIds: Set<string>,
): Promise<{ collabRecs: Product[]; hasSimilarUsers: boolean }> {
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

  if (similarUserIds.length === 0) return { collabRecs: [], hasSimilarUsers: false }

  const { data: similarReviews } = await supabase
    .from('product_reviews')
    .select('product_id, rating')
    .in('user_id', similarUserIds)
    .gte('rating', 4)

  const castReviews = (similarReviews as unknown as { product_id: string; rating: number }[]) ?? []
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

  if (rankedIds.length === 0) return { collabRecs: [], hasSimilarUsers: true }

  const { data: recProducts } = await supabase
    .from('products')
    .select('id,brand,name,category,cg_status,cruelty_free,image_url,avg_rating,review_count')
    .in('id', rankedIds)

  const recs = (recProducts as unknown as Product[]) ?? []
  recs.sort((a, b) => {
    const aDis = dislikedCats.has(a.category) ? 1 : 0
    const bDis = dislikedCats.has(b.category) ? 1 : 0
    if (aDis !== bDis) return aDis - bDis
    return rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id)
  })

  return { collabRecs: recs, hasSimilarUsers: true }
}

export function Recommendations() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.id
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId)
  const { data: remoteReviews = [], isLoading: reviewsLoading } = useUserReviews(userId)
  const { data: productsData } = useRecommendationProducts()
  const products = useMemo(() => productsData?.products ?? [], [productsData])

  // For logged-out users, build reviews from localStorage ratings
  const localReviews = useMemo(() => {
    if (user || products.length === 0) return []
    return getLocalReviewsForRecs(products)
  }, [user, products])

  const userReviews = user ? remoteReviews : localReviews as unknown as typeof remoteReviews
  const [showRatingPopup, setShowRatingPopup] = useState<string | null>(null)
  const [dismissingProduct, setDismissingProduct] = useState<string | null>(null)
  const [dismissReasons, setDismissReasons] = useState<Set<string>>(new Set())
  const [dismissNote, setDismissNote] = useState('')

  const ratedProductIds = useMemo(() => new Set(userReviews.map(r => r.product_id)), [userReviews])
  const reviewsWithRating = useMemo(() => userReviews.filter(r => r.rating != null), [userReviews])
  const popularProducts = useMemo(
    () => [...products].sort((a, b) => b.review_count - a.review_count).slice(0, 200),
    [products],
  )
  const profileDone = !!profile?.onboarding_completed && !!profile?.porosity
  const sensitivities = useMemo(() => profile?.sensitivities ?? [], [profile?.sensitivities])
  const ratedProductIdList = useMemo(() => userReviews.map(r => r.product_id), [userReviews])
  const dislikedCategoriesKey = useMemo(() => (
    userReviews
      .filter(r => r.rating != null && r.rating <= 2)
      .map(r => r.products.category)
      .sort()
      .join('|')
  ), [userReviews])
  const shouldLoadCollab = !!user && profileDone && !!profile?.curl_pattern
    && reviewsWithRating.length >= MIN_RATINGS_FOR_ADVANCED
  const { data: collabData, isLoading: collabLoading } = useQuery({
    queryKey: ['collab-recs', userId, profile?.curl_pattern, profile?.porosity, ratedProductIdList, dislikedCategoriesKey],
    enabled: shouldLoadCollab,
    queryFn: async () => {
      const ratedIds = new Set(ratedProductIdList)
      return await loadCollaborativeRecs(profile!, userReviews, ratedIds)
    },
  })
  // Only block rendering if we have zero products (no placeholder either).
  // Profile/reviews load in the background - the tier upgrades reactively.
  const loading = !productsData

  const {
    tier,
    recommendedProducts,
    ingredientRecs,
    sensitivityFilterCount,
  } = useMemo(() => {
    if (popularProducts.length === 0) {
      return { tier: 1 as Tier, recommendedProducts: [], ingredientRecs: [], sensitivityFilterCount: 0 }
    }
    const userProfile = profile ?? null
    const ratedIds = ratedProductIds
    let currentTier: Tier = 1
    let recs: RecommendedProduct[] = []
    let ingredientResults: RecommendedProduct[] = []
    let sensitivityFiltered = 0

    if (!profileDone) {
      currentTier = 1
      recs = buildTier1(popularProducts, userProfile?.cgm_experience)
    } else if (reviewsWithRating.length < MIN_RATINGS_FOR_INGREDIENTS) {
      currentTier = 2
      recs = buildTier2(popularProducts, userProfile!, ratedIds)
    } else if (reviewsWithRating.length < MIN_RATINGS_FOR_ADVANCED) {
      currentTier = 2.5
      const tier2Recs = buildTier2(popularProducts, userProfile!, ratedIds)
      const { recs: ingRecs, sensitivityFilterCount: filtCount } = buildIngredientTier(
        popularProducts, userReviews, ratedIds, sensitivities,
      )
      sensitivityFiltered = filtCount
      if (ingRecs.length > 0) {
        const seen = new Set(ingRecs.map(p => p.id))
        const blended = [...ingRecs]
        for (const p of tier2Recs) {
          if (!seen.has(p.id)) { blended.push(p); seen.add(p.id) }
        }
        recs = blended.slice(0, 5)
        ingredientResults = ingRecs
      } else {
        currentTier = 2
        recs = tier2Recs
      }
    } else {
      const { recs: ingRecs, sensitivityFilterCount: filtCount } = buildIngredientTier(
        popularProducts, userReviews, ratedIds, sensitivities,
      )
      ingredientResults = ingRecs
      sensitivityFiltered = filtCount
      if (collabData?.hasSimilarUsers && collabData.collabRecs.length > 0) {
        currentTier = 4
        const tier3 = buildTier3(popularProducts, userReviews, ratedIds)
        const seen = new Set(collabData.collabRecs.map(p => p.id))
        const blended: RecommendedProduct[] = collabData.collabRecs.map(p => ({
          ...p, _reason: 'Loved by people with similar hair',
        }))
        for (const p of tier3) {
          if (!seen.has(p.id)) { blended.push(p); seen.add(p.id) }
        }
        recs = blended.slice(0, 5)
      } else {
        currentTier = 3
        recs = buildTier3(popularProducts, userReviews, ratedIds)
      }
    }
    return { tier: currentTier, recommendedProducts: recs, ingredientRecs: ingredientResults, sensitivityFilterCount: sensitivityFiltered }
  }, [collabData, popularProducts, profile, profileDone, ratedProductIds, reviewsWithRating.length, sensitivities, userReviews])

  // ----- mutations -----

  // Fire one recommendation_shown event per product whenever the recommended
  // list changes. Key includes tier so a tier upgrade re-emits impressions.
  const shownKey = useMemo(
    () => `${tier}:${recommendedProducts.map(p => p.id).join(',')}`,
    [tier, recommendedProducts],
  )
  useEffect(() => {
    if (recommendedProducts.length === 0) return
    recommendedProducts.forEach((p, rank) => {
      trackRecommendationShown({
        product_id: p.id,
        rank,
        score: p._score ?? null,
        tier: String(tier),
        algorithm_version: ALGORITHM_VERSION,
      })
    })
    // shownKey is the stable identity of the impression set; deps lint disabled
    // because tier/recommendedProducts are baked into shownKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownKey])

  const rateMutation = useMutation({
    mutationFn: async ({ productId, rating }: { productId: string; rating: number }) => {
      if (!userId) return
      const { error } = await supabase
        .from('product_reviews')
        .upsert(
          { user_id: userId, product_id: productId, rating, status: 'tried_once',
            would_repurchase: rating >= 4 ? 'yes' : rating <= 2 ? 'no' : 'maybe', photo_urls: [] } as never,
          { onConflict: 'user_id,product_id' },
        )
      if (error) throw error
    },
    onError: (error) => { console.error('Rating upsert failed:', error) },
    onSuccess: () => { if (userId) queryClient.invalidateQueries({ queryKey: ['reviews', userId] }) },
  })

  const handleRate = useCallback(async (productId: string, rating: number) => {
    const ratingLabel: 'loved' | 'liked' | 'ok' | 'disliked' =
      rating >= 5 ? 'loved' : rating >= 4 ? 'liked' : rating >= 2 ? 'ok' : 'disliked'
    trackRecommendationEngaged({
      product_id: productId,
      tier: String(tier),
      action: 'rate',
      algorithm_version: ALGORITHM_VERSION,
    })
    if (userId) {
      try { await rateMutation.mutateAsync({ productId, rating }) }
      finally { setShowRatingPopup(null) }
    } else {
      // Save to localStorage for logged-out users
      const localRatings = getLocalRatings()
      localRatings[productId] = ratingLabel
      safeLocalSet('scrunch_ratings', JSON.stringify(localRatings))
      setShowRatingPopup(null)
    }
  }, [userId, rateMutation, tier])

  const handleBookmark = useCallback((productId: string) => {
    trackRecommendationEngaged({
      product_id: productId,
      tier: String(tier),
      action: 'bookmark',
      algorithm_version: ALGORITHM_VERSION,
    })
    try {
      const stored = JSON.parse(localStorage.getItem('scrunch_actions') || '{}')
      if (!stored[productId]) stored[productId] = []
      if (!stored[productId].includes('bookmarked')) stored[productId].push('bookmarked')
      localStorage.setItem('scrunch_actions', JSON.stringify(stored))
    } catch { /* ignore */ }
  }, [tier])

  const dismissMutation = useMutation({
    mutationFn: async ({ productId, notes }: { productId: string; notes: string }) => {
      if (!userId) return
      const { error } = await supabase
        .from('product_reviews')
        .upsert(
          { user_id: userId, product_id: productId, rating: 1, would_repurchase: 'no',
            results_notes: notes, status: 'tried_once', photo_urls: [] } as never,
          { onConflict: 'user_id,product_id' },
        )
      if (error) throw error
    },
    onError: (error) => { console.error('Dismiss upsert failed:', error) },
    onSuccess: () => { if (userId) queryClient.invalidateQueries({ queryKey: ['reviews', userId] }) },
  })

  const handleDismiss = useCallback(async (productId: string) => {
    if (!userId || dismissReasons.size === 0) return
    trackRecommendationEngaged({
      product_id: productId,
      tier: String(tier),
      action: 'dismiss',
      algorithm_version: ALGORITHM_VERSION,
    })
    const reasonText = [...dismissReasons].join(', ')
    const notes = dismissNote.trim() ? `${reasonText}. ${dismissNote.trim()}` : reasonText
    try { await dismissMutation.mutateAsync({ productId, notes }) }
    finally { setDismissingProduct(null); setDismissReasons(new Set()); setDismissNote('') }
  }, [userId, dismissReasons, dismissNote, dismissMutation, tier])

  const handleToggleDismissReason = useCallback((reason: string) => {
    setDismissReasons(prev => {
      const next = new Set(prev)
      if (next.has(reason)) next.delete(reason)
      else next.add(reason)
      return next
    })
  }, [])

  const handleOpenDismiss = useCallback((productId: string) => {
    setDismissingProduct(productId)
    setDismissReasons(new Set())
    setDismissNote('')
    setShowRatingPopup(null)
  }, [])

  const handleCloseDismiss = useCallback(() => {
    setDismissingProduct(null)
    setDismissReasons(new Set())
    setDismissNote('')
  }, [])

  // ----- render gates -----

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12 text-gray-500">Loading recommendations…</div>
      </div>
    )
  }

  const firstName = profile?.display_name?.split(' ')[0] ?? 'there'
  const { title: recTitle, subtitle: recSubtitle } = tierHeader(tier, profile ?? null)

  const lovedReviews = userReviews.filter(r => r.rating != null && r.rating >= 4 && r.rating <= 5)
  const likedReviews = userReviews.filter(r => r.rating === 3)
  const mehReviews = userReviews.filter(r => r.rating === 2)
  const dislikedReviews = userReviews.filter(r => r.rating != null && r.rating <= 1)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Hey {firstName} ✨</h1>

      {/* Tier-appropriate recommendations */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{recTitle}</h2>
        <p className="text-sm text-gray-500 mb-4">{recSubtitle}</p>

        {tier === 1 && (
          <Link to="/onboarding" className="inline-block mb-4 text-sm font-medium text-violet-600 hover:underline">
            Complete your hair profile →
          </Link>
        )}
        {(profileLoading || reviewsLoading) && (
          <p className="text-xs text-violet-500 mb-4 animate-pulse">Personalizing your recommendations…</p>
        )}
        {shouldLoadCollab && collabLoading && (
          <p className="text-xs text-violet-500 mb-4 animate-pulse">Finding people with similar hair…</p>
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
                dismissReasons={dismissingProduct === product.id ? dismissReasons : EMPTY_SET}
                dismissNote={dismissingProduct === product.id ? dismissNote : ''}
                onOpenDismiss={() => handleOpenDismiss(product.id)}
                onCloseDismiss={handleCloseDismiss}
                onToggleDismissReason={handleToggleDismissReason}
                onDismissNoteChange={setDismissNote}
                onSubmitDismiss={() => handleDismiss(product.id)}
                onBookmark={() => handleBookmark(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No recommendations yet - keep rating!</p>
        )}
      </section>

      {/* Ingredient-based section (shown alongside Tier 3/4) */}
      {(tier === 3 || tier === 4) && (
        <IngredientRecsSection
          ingredientRecs={ingredientRecs}
          showRatingPopup={showRatingPopup}
          dismissingProduct={dismissingProduct}
          dismissReasons={dismissReasons}
          dismissNote={dismissNote}
          emptySet={EMPTY_SET}
          onOpenRating={setShowRatingPopup}
          onCloseRating={() => setShowRatingPopup(null)}
          onRate={handleRate}
          onOpenDismiss={handleOpenDismiss}
          onCloseDismiss={handleCloseDismiss}
          onToggleDismissReason={handleToggleDismissReason}
          onDismissNoteChange={setDismissNote}
          onSubmitDismiss={handleDismiss}
          onBookmark={handleBookmark}
        />
      )}

      <hr className="border-gray-200 mb-12" />

      <SavedProducts products={products} />

      {userReviews.length > 0 && <hr className="border-gray-200 mb-12" />}

      {userReviews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Ratings</h2>
          {lovedReviews.length > 0 && <RatingGroup label="💚 Loved" count={lovedReviews.length} colorClass="text-pink-700" reviews={lovedReviews} />}
          {likedReviews.length > 0 && <RatingGroup label="👍 Liked" count={likedReviews.length} colorClass="text-emerald-600" reviews={likedReviews} />}
          {mehReviews.length > 0 && <RatingGroup label="😐 It was ok" count={mehReviews.length} colorClass="text-amber-700" reviews={mehReviews} />}
          {dislikedReviews.length > 0 && <RatingGroup label="👎 Didn't like" count={dislikedReviews.length} colorClass="text-red-700" reviews={dislikedReviews} />}
        </section>
      )}
    </div>
  )
}
