import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Product, ProductReview } from '../../lib/database.types'
import { ProductImage } from '../../hooks/useProductImage'

const RatingRow = memo(function RatingRow({ review }: { review: ProductReview & { products: Product } }) {
  return (
    <Link
      to={`/products/${review.product_id}`}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
    >
      <ProductImage
        brand={review.products.brand}
        name={review.products.name}
        seedImageUrl={review.products.image_url}
        category={review.products.category}
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
})

export const RatingGroup = memo(function RatingGroup({
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
})
