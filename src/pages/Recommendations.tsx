import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { PRODUCT_CATEGORY_LABELS, SCRUNCH_SCORE_CONFIG } from '../lib/constants'
import type { Product, ProductReview, Profile } from '../lib/database.types'
import { computeScrunchScore } from '../data/seedProducts'
import { ProductImage } from '../hooks/useProductImage'
import { QuickRateCard } from '../components/products/QuickRateCard'

const MIN_RATINGS = 10

export function Recommendations() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userReviews, setUserReviews] = useState<(ProductReview & { products: Product })[]>([])
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingCount, setRatingCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  const ratedProductIds = new Set(userReviews.map(r => r.product_id))

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    // Load profile, user reviews, and popular products in parallel
    const [profileRes, reviewsRes, productsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('product_reviews').select('*, products(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('review_count', { ascending: false }).limit(24),
    ])

    const userProfile = profileRes.data as unknown as Profile | null
    const reviews = (reviewsRes.data as unknown as (ProductReview & { products: Product })[]) ?? []
    const products = (productsRes.data as unknown as Product[]) ?? []

    setProfile(userProfile)
    setUserReviews(reviews)
    setRatingCount(reviews.length)
    setPopularProducts(products)

    // Load recommendations if profile is complete (curl pattern + porosity)
    if (userProfile?.curl_pattern && userProfile?.porosity) {
      await loadRecommendations(userProfile, reviews)
    } else if (reviews.length > 0) {
      // Even without full profile, show fallback recommendations
      await loadRecommendations(userProfile || {} as Profile, reviews)
    }

    setLoading(false)
  }, [user])

  const loadRecommendations = async (
    userProfile: Profile,
    reviews: (ProductReview & { products: Product })[]
  ) => {
    const reviewedIds = reviews.map(r => r.product_id)

    // Find similar users (same curl pattern + porosity)
    const { data: similarProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('curl_pattern', userProfile.curl_pattern!)
      .eq('porosity', userProfile.porosity!)

    const similarUserIds = ((similarProfiles as unknown as { id: string }[]) ?? [])
      .map(p => p.id)
      .filter(id => id !== userProfile.id)

    let recommended: Product[] = []

    if (similarUserIds.length > 0) {
      // Get products those similar users rated 4+
      const { data: similarReviews } = await supabase
        .from('product_reviews')
        .select('product_id, rating')
        .in('user_id', similarUserIds)
        .gte('rating', 4)

      const castReviews = (similarReviews as unknown as { product_id: string; rating: number }[]) ?? []

      // Count how many similar users loved each product, excluding already reviewed
      const productCounts: Record<string, number> = {}
      for (const review of castReviews) {
        if (!reviewedIds.includes(review.product_id)) {
          productCounts[review.product_id] = (productCounts[review.product_id] || 0) + 1
        }
      }

      const rankedIds = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([id]) => id)

      if (rankedIds.length > 0) {
        const { data: recProducts } = await supabase
          .from('products')
          .select('*')
          .in('id', rankedIds)

        recommended = (recProducts as unknown as Product[]) ?? []
        // Preserve ranking order
        recommended.sort((a, b) => rankedIds.indexOf(a.id) - rankedIds.indexOf(b.id))
      }
    }

    // Fallback: CG-approved products sorted by Scrunch Score
    if (recommended.length < 5) {
      const { data: fallbackProducts } = await supabase
        .from('products')
        .select('*')
        .eq('cg_status', 'approved')
        .limit(40)

      const fallback = (fallbackProducts as unknown as Product[]) ?? []
      const existingIds = new Set([...reviewedIds, ...recommended.map(p => p.id)])
      const scored = fallback
        .filter(p => !existingIds.has(p.id))
        .map(p => ({ ...p, scrunchScore: computeScrunchScore(p).score }))
        .sort((a, b) => b.scrunchScore - a.scrunchScore)
        .slice(0, 20 - recommended.length)

      recommended = [...recommended, ...scored]
    }

    setRecommendedProducts(recommended)
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRate = async (productId: string, rating: number) => {
    if (!user) return

    await supabase
      .from('product_reviews')
      .upsert({
        user_id: user.id,
        product_id: productId,
        rating,
        status: 'tried_once',
        would_repurchase: rating >= 4 ? 'yes' : rating <= 2 ? 'no' : 'maybe',
        photo_urls: [],
      } as never, { onConflict: 'user_id,product_id' })

    const newCount = ratingCount + 1
    setRatingCount(newCount)

    // Refresh reviews
    const { data: freshReviews } = await supabase
      .from('product_reviews')
      .select('*, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const reviews = (freshReviews as unknown as (ProductReview & { products: Product })[]) ?? []
    setUserReviews(reviews)

    // Celebration + load recs when they hit threshold
    if (newCount >= MIN_RATINGS && ratingCount < MIN_RATINGS) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
      if (profile?.curl_pattern && profile?.porosity) {
        await loadRecommendations(profile, reviews)
      }
    }
  }

  const handleBookmark = async (productId: string) => {
    if (!user) return
    await supabase
      .from('product_reviews')
      .upsert({
        user_id: user.id,
        product_id: productId,
        status: 'tried_once',
        photo_urls: [],
      } as never, { onConflict: 'user_id,product_id' })
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">For You</h1>
        <p className="text-gray-600 mb-4">Sign in to get personalized product recommendations.</p>
        <Link to="/login" className="text-violet-600 hover:underline">Sign in →</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-12 text-gray-500">Loading recommendations...</div>
      </div>
    )
  }

  const lovedReviews = userReviews.filter(r => r.rating != null && r.rating >= 4)
  const okReviews = userReviews.filter(r => r.rating === 3)
  const dislikedReviews = userReviews.filter(r => r.rating != null && r.rating <= 2)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">For You</h1>
      <p className="text-gray-600 mb-8">Product recommendations based on your hair profile and ratings.</p>

      {/* Celebration banner */}
      {showCelebration && (
        <div className="mb-6 p-4 bg-violet-50 border border-violet-200 rounded-xl text-center animate-pulse">
          <p className="text-lg font-bold text-violet-700">🎉 You did it!</p>
          <p className="text-sm text-violet-600">Your personalized recommendations are ready below.</p>
        </div>
      )}

      {/* Profile completion nudge */}
      {profile && !profile.onboarding_completed && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-medium text-amber-900">Complete your hair profile for better recommendations</p>
          <p className="text-xs text-amber-700 mt-1">We need your curl pattern and porosity to find people with similar hair.</p>
          <Link to="/onboarding" className="text-xs text-violet-600 font-medium hover:underline mt-2 inline-block">Complete profile →</Link>
        </div>
      )}

      {/* Quick rate section — always show if there are unrated products */}
      {popularProducts.filter(p => !ratedProductIds.has(p.id)).length > 0 && (
        <section className="mb-12">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Rate products you've used</h2>
            <p className="text-sm text-gray-500">The more you rate, the better your recommendations get</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularProducts
              .filter(p => !ratedProductIds.has(p.id))
              .slice(0, 12)
              .map(product => (
                <QuickRateCard
                  key={product.id}
                  product={product}
                  onRate={handleRate}
                />
              ))}
          </div>
        </section>
      )}

      {/* Recommended for you — always show if we have any */}
      {recommendedProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Recommended for {profile?.curl_pattern && profile?.porosity ? `your ${profile.curl_pattern} ${profile.porosity} porosity hair` : 'you'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {profile?.curl_pattern ? 'Based on what works for people with similar hair' : 'Top-rated CG-approved products you haven\'t tried yet'}
          </p>

          {recommendedProducts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-500 text-sm mb-2">
                We're building recommendations for your hair type — more users with similar hair will unlock better suggestions.
              </p>
              <p className="text-xs text-gray-400">In the meantime, browse our top-scored CG-approved products below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedProducts.map(product => {
                const { grade, score } = computeScrunchScore(product)
                const scoreConfig = SCRUNCH_SCORE_CONFIG[grade]
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200"
                  >
                    <ProductImage brand={product.brand} name={product.name} seedImageUrl={product.image_url} className="w-14 h-14" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">{product.brand}</p>
                      <Link to={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-violet-600 no-underline truncate block">
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">
                          {PRODUCT_CATEGORY_LABELS[product.category]}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${scoreConfig.bg} ${scoreConfig.color}`}>
                          {score} {scoreConfig.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleBookmark(product.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition cursor-pointer border-0"
                      >
                        📌 Try it
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition no-underline"
                      >
                        Already tried
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Bookmarked / Want to try */}
      {(() => {
        try {
          const stored = JSON.parse(localStorage.getItem('scrunch_actions') || '{}')
          const bookmarkedKeys = Object.entries(stored)
            .filter(([, actions]) => (actions as string[]).includes('bookmarked'))
            .map(([key]) => key)
          if (bookmarkedKeys.length === 0) return null
          return (
            <section className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">☆ Want to Try ({bookmarkedKeys.length})</h2>
              <p className="text-sm text-gray-500 mb-3">Products you've saved to try later</p>
              <div className="space-y-2">
                {bookmarkedKeys.map(key => {
                  const [brand, name] = key.split('::')
                  if (!brand || !name) return null
                  return (
                    <Link
                      key={key}
                      to="/products"
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
                    >
                      <ProductImage brand={brand} name={name} className="w-10 h-10" />
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
        } catch { return null }
      })()}

      {/* Section C: Your ratings */}
      {userReviews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Ratings</h2>

          {lovedReviews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-green-700 mb-2">👍 Loved ({lovedReviews.length})</h3>
              <div className="space-y-2">
                {lovedReviews.map(review => (
                  <RatingRow key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {okReviews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-amber-700 mb-2">😐 It was ok ({okReviews.length})</h3>
              <div className="space-y-2">
                {okReviews.map(review => (
                  <RatingRow key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {dislikedReviews.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-red-700 mb-2">👎 Didn't work ({dislikedReviews.length})</h3>
              <div className="space-y-2">
                {dislikedReviews.map(review => (
                  <RatingRow key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function RatingRow({ review }: { review: ProductReview & { products: Product } }) {
  return (
    <Link
      to={`/products/${review.product_id}`}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
    >
      <ProductImage brand={review.products.brand} name={review.products.name} seedImageUrl={review.products.image_url} className="w-10 h-10" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{review.products.brand}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{review.products.name}</p>
      </div>
      {review.results_notes && (
        <p className="text-xs text-gray-400 truncate max-w-[150px]">{review.results_notes}</p>
      )}
    </Link>
  )
}
