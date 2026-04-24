import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { CG_STATUS_CONFIG, PRODUCT_CATEGORY_LABELS } from '../lib/constants'
import type { ProductReview, Product } from '../lib/database.types'

type ReviewWithProduct = ProductReview & { products: Product }

export function MyProducts() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadMyReviews()
  }, [user])

  const loadMyReviews = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('product_reviews')
      .select('*, products(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })

    setReviews((data as ReviewWithProduct[] | null) ?? [])
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Products</h1>
        <p className="text-gray-600 mb-4">Sign in to see your product shelf.</p>
        <Link to="/login" className="text-violet-600 hover:underline">Sign in →</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Products</h1>
      <p className="text-gray-600 mb-8">Products you've reviewed and logged.</p>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">You haven't logged any products yet.</p>
          <Link to="/products" className="text-violet-600 hover:underline text-sm">Browse products to get started →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <Link
              key={review.id}
              to={`/products/${review.product_id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 transition no-underline"
            >
              <div className="text-xl shrink-0">
                {CG_STATUS_CONFIG[review.products.cg_status].icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{review.products.brand}</p>
                <h3 className="font-semibold text-gray-900 truncate">{review.products.name}</h3>
                <p className="text-xs text-gray-500">
                  {PRODUCT_CATEGORY_LABELS[review.products.category]} · {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  review.would_repurchase === 'yes' ? 'bg-green-50 text-green-600' :
                  review.would_repurchase === 'no' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {review.would_repurchase === 'yes' ? '👍 Repurchase' : review.would_repurchase === 'no' ? '👎 Nope' : '🤔 Maybe'}
                </span>
                <p className="text-xs text-gray-400 mt-1">{review.status.replace(/_/g, ' ')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
