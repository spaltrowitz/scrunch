import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { PRODUCT_CATEGORY_LABELS, CG_STATUS_CONFIG } from '../lib/constants'
import type { Product, ProductReview, ReviewStatus, RepurchaseIntent } from '../lib/database.types'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Review form state
  const [rating, setRating] = useState(0)
  const [status, setStatus] = useState<ReviewStatus>('currently_using')
  const [repurchase, setRepurchase] = useState<RepurchaseIntent>('maybe')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) loadProduct()
  }, [id])

  const loadProduct = async () => {
    setLoading(true)
    const [productRes, reviewsRes] = await Promise.all([
      supabase.from('products').select('*').eq('id', id!).single(),
      supabase.from('product_reviews').select('*').eq('product_id', id!).order('created_at', { ascending: false }),
    ])
    setProduct(productRes.data)
    setReviews(reviewsRes.data ?? [])
    setLoading(false)
  }

  const handleSubmitReview = async () => {
    if (!user || !product || rating === 0) return
    setSubmitting(true)
    await supabase.from('product_reviews').upsert({
      user_id: user.id,
      product_id: product.id,
      rating,
      status,
      would_repurchase: repurchase,
      results_notes: notes || null,
      photo_urls: [],
    })
    setSubmitting(false)
    setShowReviewForm(false)
    loadProduct()
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (!product) return <div className="text-center py-12 text-gray-500">Product not found</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/products" className="text-sm text-violet-600 hover:underline mb-4 inline-block">← Back to Products</Link>

      {/* Product Header */}
      <div className={`p-4 rounded-xl ${CG_STATUS_CONFIG[product.cg_status].bg} mb-6`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{CG_STATUS_CONFIG[product.cg_status].icon}</span>
          <span className={`font-semibold ${CG_STATUS_CONFIG[product.cg_status].color}`}>
            {CG_STATUS_CONFIG[product.cg_status].label}
          </span>
        </div>
        <p className="text-xs text-gray-500">{product.brand}</p>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-sm text-gray-600 mt-1">{PRODUCT_CATEGORY_LABELS[product.category]}</p>
        {product.avg_rating != null && (
          <p className="text-sm text-gray-700 mt-2">
            {'★'.repeat(Math.round(product.avg_rating))}{'☆'.repeat(5 - Math.round(product.avg_rating))} {product.avg_rating} ({product.review_count} reviews)
          </p>
        )}
      </div>

      {product.status_conflict && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 mb-6">
          ⚠️ CurlScan ({product.curlscan_status}) and IsItCG ({product.isitcg_status}) disagree on this product's CG status.
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

      {/* Reviews */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Reviews ({reviews.length})</h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-sm px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer"
            >
              Write Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl cursor-pointer hover:scale-110 transition"
                  >
                    {star <= rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as ReviewStatus)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="currently_using">Currently using</option>
                  <option value="used_to_use">Used to use</option>
                  <option value="tried_once">Tried once</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Would repurchase?</label>
                <select value={repurchase} onChange={(e) => setRepurchase(e.target.value as RepurchaseIntent)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="maybe">Maybe</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did this product work for your hair?"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              onClick={handleSubmitReview}
              disabled={submitting || rating === 0}
              className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <span className="text-xs text-gray-500">
                    {review.status.replace(/_/g, ' ')} · Would repurchase: {review.would_repurchase}
                  </span>
                </div>
                {review.results_notes && (
                  <p className="text-sm text-gray-700">{review.results_notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
