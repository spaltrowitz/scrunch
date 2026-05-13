import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Product, ProductReview } from '../../lib/database.types'

const CATEGORY_ICONS: Record<string, string> = {
  clarifying_shampoo: '🧴',
  dry_shampoo: '💨',
  low_poo: '🧴',
  co_wash: '🧴',
  rinse_out_conditioner: '🪷',
  deep_conditioner: '🧖',
  leave_in_conditioner: '💧',
  curl_cream: '☁️',
  gel: '✨',
  mousse: '🫧',
  custard: '🍮',
  oil_serum: '💛',
  spray_refresher: '💦',
  protein_treatment: '💪',
  scalp_treatment: '🌿',
  bond_repair: '🔗',
}

const RatingChip = memo(function RatingChip({ review }: { review: ProductReview & { products: Product } }) {
  const icon = CATEGORY_ICONS[review.products.category] || '🧴'
  return (
    <Link
      to={`/products/${review.product_id}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 hover:border-violet-300 transition no-underline text-sm text-gray-800 truncate max-w-[200px] sm:max-w-[260px]"
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{review.products.brand} {review.products.name}</span>
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
    <div className="mb-4">
      <h3 className={`text-sm font-medium ${colorClass} mb-2`}>
        {label} ({count})
      </h3>
      <div className="flex flex-wrap gap-2">
        {reviews.map(review => (
          <RatingChip key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
})
