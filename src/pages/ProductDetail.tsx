import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_DESCRIPTIONS } from '../lib/constants'
import { ProductImage } from '../hooks/useProductImage'
import type { Product, ProductReview, Profile } from '../lib/database.types'

type TriedRating = 'loved' | 'liked' | 'ok' | 'disliked'

type ReviewWithProfile = ProductReview & {
  profile?: Pick<Profile, 'display_name' | 'curl_pattern' | 'porosity'> | null
}

const RATING_OPTIONS: { value: TriedRating; label: string; icon: string; numeric: number; bg: string; border: string; text: string }[] = [
  { value: 'loved', label: 'Loved it', icon: '💚', numeric: 5, bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-700' },
  { value: 'liked', label: 'Liked it', icon: '👍', numeric: 4, bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' },
  { value: 'ok', label: 'Ok', icon: '😐', numeric: 3, bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700' },
  { value: 'disliked', label: "Didn't like", icon: '👎', numeric: 1, bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-700' },
]

function numericToTriedRating(n: number): TriedRating {
  if (n >= 5) return 'loved'
  if (n >= 4) return 'liked'
  if (n >= 2) return 'ok'
  return 'disliked'
}

function triedRatingLabel(r: TriedRating): string {
  return RATING_OPTIONS.find(o => o.value === r)?.label ?? r
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([])
  const [myReview, setMyReview] = useState<ReviewWithProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Rating form state
  const [ratingPopup, setRatingPopup] = useState(false)
  const [selectedRating, setSelectedRating] = useState<TriedRating | null>(null)
  const [personalNote, setPersonalNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) loadProduct()
  }, [id])

  const loadProduct = async () => {
    setLoading(true)
    const [productRes, reviewsRes] = await Promise.all([
      supabase.from('products').select('*').eq('id', id!).single(),
      supabase
        .from('product_reviews')
        .select('*, profile:profiles!product_reviews_user_id_fkey(display_name, curl_pattern, porosity)')
        .eq('product_id', id!)
        .order('created_at', { ascending: false }),
    ])
    setProduct(productRes.data as unknown as Product | null)
    const allReviews = (reviewsRes.data ?? []) as unknown as ReviewWithProfile[]
    if (user) {
      const mine = allReviews.find(r => r.user_id === user.id) ?? null
      setMyReview(mine)
      if (mine?.rating != null) {
        setSelectedRating(numericToTriedRating(mine.rating))
        setPersonalNote(mine.results_notes ?? '')
      }
      setReviews(allReviews.filter(r => r.user_id !== user.id))
    } else {
      setMyReview(null)
      setReviews(allReviews)
    }
    setLoading(false)
  }

  const submitRating = async (rating: TriedRating) => {
    if (!user || !product) return
    setSelectedRating(rating)
    setSubmitting(true)
    const ratingMap: Record<TriedRating, number> = { loved: 5, liked: 4, ok: 3, disliked: 1 }
    const repurchaseMap: Record<TriedRating, string> = { loved: 'yes', liked: 'yes', ok: 'maybe', disliked: 'no' }
    await supabase.from('product_reviews').upsert({
      user_id: user.id,
      product_id: product.id,
      status: 'tried_once',
      rating: ratingMap[rating],
      would_repurchase: repurchaseMap[rating],
      results_notes: personalNote.trim() || null,
    } as never, { onConflict: 'user_id,product_id' })
    setSubmitting(false)
    setRatingPopup(false)
    loadProduct()
  }

  const saveNote = async () => {
    if (!user || !product) return
    setSubmitting(true)
    await supabase.from('product_reviews').upsert({
      user_id: user.id,
      product_id: product.id,
      results_notes: personalNote.trim() || null,
    } as never, { onConflict: 'user_id,product_id' })
    setSubmitting(false)
    loadProduct()
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading…</div>
  if (!product) return <div className="text-center py-12 text-gray-500">Product not found</div>

  const isCg = product.cg_status === 'approved'
  const isCf = product.cruelty_free === 'yes'
  const productNotes = (product.notes || '').toLowerCase()
  const isFragFree = productNotes.includes('fragrance-free') || productNotes.includes('fragrance free') || productNotes.includes('no added fragrance')

  // Community rating stats
  const allRatings = [...reviews, ...(myReview ? [myReview] : [])].filter(r => r.rating != null)
  const lovedCount = allRatings.filter(r => r.rating != null && r.rating >= 5).length
  const lovedPct = allRatings.length > 0 ? Math.round((lovedCount / allRatings.length) * 100) : 0

  // Hair-type breakdown from reviews with profiles
  const reviewsWithProfiles = allRatings.filter(r => r.profile?.curl_pattern && r.profile?.porosity)
  const hairTypeGroups = new Map<string, { sum: number; count: number }>()
  for (const r of reviewsWithProfiles) {
    const key = `${r.profile!.curl_pattern} ${r.profile!.porosity}`
    const existing = hairTypeGroups.get(key) ?? { sum: 0, count: 0 }
    existing.sum += r.rating!
    existing.count += 1
    hairTypeGroups.set(key, existing)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/products" className="text-sm text-violet-600 hover:underline mb-6 inline-block">← Back to browse</Link>

      {/* Product Header */}
      <div className="flex gap-6 mb-6">
        <ProductImage
          brand={product.brand}
          name={product.name}
          seedImageUrl={product.image_url}
          className="w-28 h-28 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-2" title={PRODUCT_CATEGORY_DESCRIPTIONS[product.category]}>
            {PRODUCT_CATEGORY_LABELS[product.category]}
            <span className="text-gray-400 ml-1 cursor-help" title={PRODUCT_CATEGORY_DESCRIPTIONS[product.category]}>ⓘ</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isCg ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {isCg ? '🟢 CG Approved' : '🔴 Not CG'}
            </span>
            {isCf && <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">🐰 Cruelty-Free</span>}
            {isFragFree && <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-medium">🌸 Fragrance-Free</span>}
          </div>
          {product.avg_rating != null && (
            <p className="text-sm text-gray-700 mt-2">
              {'★'.repeat(Math.round(product.avg_rating))}{'☆'.repeat(5 - Math.round(product.avg_rating))}
              {' '}{product.avg_rating.toFixed(1)} ({product.review_count} review{product.review_count !== 1 ? 's' : ''})
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      {product.notes && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-6">
          📝 {product.notes}
        </div>
      )}

      {/* Ingredients */}
      {product.ingredients.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Ingredients</h2>
          <div className="space-y-1 text-sm">
            {product.ingredients.map((ing, i) => {
              const flagged = product.flagged_ingredients.find(
                f => ing.toLowerCase().includes(f.name.toLowerCase())
              )
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">{flagged ? (flagged.severity === 'bad' ? '🔴' : '🟡') : '🟢'}</span>
                  <span className={flagged ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                    {ing}
                    {flagged && <span className="text-gray-500 font-normal"> — {flagged.reason}</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Your Rating */}
      {user && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Your Rating</h2>
          {myReview?.rating != null ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {RATING_OPTIONS.find(o => o.value === numericToTriedRating(myReview.rating!))?.icon}{' '}
                  {triedRatingLabel(numericToTriedRating(myReview.rating!))}
                </span>
                <button
                  onClick={() => { setSelectedRating(numericToTriedRating(myReview.rating!)); setRatingPopup(true) }}
                  className="text-xs text-violet-600 hover:underline cursor-pointer"
                >
                  Change
                </button>
              </div>
              {myReview.results_notes && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">📝 {myReview.results_notes}</p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-3">Tried it? Rate this product for your hair.</p>
              <button
                onClick={() => setRatingPopup(true)}
                className="text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer"
              >
                Rate this product
              </button>
            </div>
          )}

          {/* Rating popup */}
          {ratingPopup && (
            <div className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-3">How was it for your hair?</p>
              <div className="flex gap-2 mb-4">
                {RATING_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedRating(opt.value)}
                    className={`flex-1 text-xs py-2.5 rounded-lg border cursor-pointer font-medium transition ${
                      selectedRating === opt.value
                        ? `${opt.bg} ${opt.border} ${opt.text} ring-2 ring-offset-1 ring-violet-400`
                        : `${opt.bg} ${opt.border} ${opt.text} hover:opacity-80`
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
              <div className="mb-3">
                <textarea
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Add a personal note (optional)… e.g., 'Great for day 2 refresh'"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg resize-none h-16 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => selectedRating && submitRating(selectedRating)}
                  disabled={!selectedRating || submitting}
                  className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setRatingPopup(false)} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Community Ratings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Community Ratings</h2>

        {allRatings.length === 0 ? (
          <p className="text-sm text-gray-500">No ratings yet. Be the first!</p>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-4">
              {allRatings.length} {allRatings.length === 1 ? 'person' : 'people'} rated this — {lovedPct}% loved it
            </p>

            {/* Hair type breakdown */}
            {hairTypeGroups.size > 0 && (
              <div className="mb-4 space-y-1">
                {Array.from(hairTypeGroups.entries()).map(([key, { sum, count }]) => (
                  <p key={key} className="text-xs text-gray-600">
                    People with <span className="font-medium">{key}</span> hair rated this{' '}
                    <span className="font-medium">{(sum / count).toFixed(1)}</span>/5
                  </p>
                ))}
              </div>
            )}

            {/* Individual reviews */}
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {review.rating != null && (
                        <span className="text-sm font-medium">
                          {RATING_OPTIONS.find(o => o.value === numericToTriedRating(review.rating!))?.icon}{' '}
                          {triedRatingLabel(numericToTriedRating(review.rating!))}
                        </span>
                      )}
                      {review.profile?.display_name && (
                        <span className="text-xs text-gray-500">by {review.profile.display_name}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                  </div>
                  {(review.profile?.curl_pattern || review.profile?.porosity) && (
                    <p className="text-xs text-gray-500 mb-1">
                      {[review.profile.curl_pattern, review.profile.porosity && `${review.profile.porosity} porosity`].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {review.results_notes && (
                    <p className="text-sm text-gray-700">{review.results_notes}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-2">About {PRODUCT_CATEGORY_LABELS[product.category]}</h2>
        <p className="text-sm text-gray-600">{PRODUCT_CATEGORY_DESCRIPTIONS[product.category]}</p>
      </div>
    </div>
  )
}
