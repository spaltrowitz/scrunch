import { memo } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'
import type { Product } from '../../lib/database.types'
import { ProductImage } from '../../hooks/useProductImage'

const DISMISS_REASONS = [
  'Too heavy for my hair',
  'Contains ingredients I avoid',
  'Wrong for my porosity',
  'Too expensive',
  'Not available near me',
  'Already tried - didn\'t work',
  'Not interested',
]

interface RecommendedCardProps {
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
}

export const RecommendedCard = memo(function RecommendedCard({
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
}: RecommendedCardProps) {
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
          seedImageUrl={product.image_url} category={product.category}
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
            className="text-xs px-3 py-2 min-h-[44px] rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition cursor-pointer border-0"
          >
            👍 Try it
          </button>
          <button
            onClick={onOpenRating}
            className="text-xs px-3 py-2 min-h-[44px] rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition cursor-pointer border-0"
          >
            Tried it?
          </button>
          <button
            onClick={isDismissing ? onCloseDismiss : onOpenDismiss}
            className={`text-xs px-3 py-2 min-h-[44px] rounded-lg transition cursor-pointer border-0 ${
              isDismissing
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            ✕ Not for me
          </button>
        </div>

        {showRatingPopup && (
          <div className="absolute right-0 sm:right-4 top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex gap-2 max-w-[calc(100vw-2rem)]">
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
})
