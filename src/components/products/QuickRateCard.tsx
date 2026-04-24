import { useState } from 'react'
import { ProductImage } from '../../hooks/useProductImage'

interface QuickRateCardProps {
  product: {
    id: string
    brand: string
    name: string
    image_url?: string | null
  }
  onRate: (productId: string, rating: number) => Promise<void>
  currentRating?: number | null
}

export function QuickRateCard({ product, onRate, currentRating }: QuickRateCardProps) {
  const [saving, setSaving] = useState(false)
  const [rated, setRated] = useState<number | null>(currentRating ?? null)

  const handleRate = async (rating: number) => {
    setSaving(true)
    try {
      await onRate(product.id, rating)
      setRated(rating)
    } finally {
      setSaving(false)
    }
  }

  const ratingLabel = rated === 5 ? '👍 Loved' : rated === 3 ? '😐 Ok' : rated === 1 ? '👎 Nope' : null

  return (
    <div className={`p-4 bg-white rounded-xl border transition ${rated != null ? 'border-violet-200 bg-violet-50/30' : 'border-gray-200'}`}>
      <div className="flex flex-col items-center text-center gap-3 mb-3">
        <ProductImage brand={product.brand} name={product.name} seedImageUrl={product.image_url} className="w-20 h-20" />
        <div className="min-w-0">
          <p className="text-xs text-gray-500">{product.brand}</p>
          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
        </div>
      </div>

      {rated != null ? (
        <div className="text-center text-xs text-violet-600 font-medium py-1">
          {ratingLabel}
        </div>
      ) : (
        <div className="flex gap-1.5">
          <button
            onClick={() => handleRate(5)}
            disabled={saving}
            className="flex-1 text-xs py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition cursor-pointer disabled:opacity-50 border-0"
          >
            👍
          </button>
          <button
            onClick={() => handleRate(3)}
            disabled={saving}
            className="flex-1 text-xs py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition cursor-pointer disabled:opacity-50 border-0"
          >
            😐
          </button>
          <button
            onClick={() => handleRate(1)}
            disabled={saving}
            className="flex-1 text-xs py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition cursor-pointer disabled:opacity-50 border-0"
          >
            👎
          </button>
        </div>
      )}
    </div>
  )
}
