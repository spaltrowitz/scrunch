import { memo } from 'react'
import type { Product } from '../../lib/database.types'
import { QuickRateCard } from '../products/QuickRateCard'

interface RatePromptSectionProps {
  products: Product[]
  ratedProductIds: Set<string>
  onRate: (productId: string, rating: number) => Promise<void>
}

export const RatePromptSection = memo(function RatePromptSection({
  products,
  ratedProductIds,
  onRate,
}: RatePromptSectionProps) {
  const unratedProducts = products.filter(p => !ratedProductIds.has(p.id))
  if (unratedProducts.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Rate products you've used
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        The more you rate, the better your recommendations get
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {unratedProducts.slice(0, 3).map(product => (
          <QuickRateCard key={product.id} product={product} onRate={onRate} />
        ))}
      </div>
    </section>
  )
})
