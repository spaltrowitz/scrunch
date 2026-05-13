import { memo } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORY_LABELS } from '../../lib/constants'
import type { Product } from '../../lib/database.types'
import { ProductImage } from '../../hooks/useProductImage'

type TriedRating = 'loved' | 'liked' | 'ok' | 'disliked'

function isUuid(key: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(key)
}

interface ProductCardProps {
  product: Product
  productKey: string
  hasTried: boolean
  hasBookmarked: boolean
  rating: TriedRating | undefined
  note: string | undefined
  isEditingNote: boolean
  isRatingPopup: boolean
  onToggleTried: () => void
  onToggleBookmark: () => void
  onSubmitRating: (rating: TriedRating) => void
  onCloseRating: () => void
  onStartEditNote: () => void
  onUpdateNote: (note: string) => void
  onStopEditNote: () => void
}

export const ProductCard = memo(function ProductCard({
  product,
  productKey,
  hasTried,
  hasBookmarked,
  rating,
  note,
  isEditingNote,
  isRatingPopup,
  onToggleTried,
  onToggleBookmark,
  onSubmitRating,
  onCloseRating,
  onStartEditNote,
  onUpdateNote,
  onStopEditNote,
}: ProductCardProps) {
  const isCg = product.cg_status === 'approved'
  const isCf = product.cruelty_free === 'yes'
  const productNotes = (product.notes || '').toLowerCase()
  const isFragFree = productNotes.includes('fragrance-free') || productNotes.includes('fragrance free')

  const badges = (
    <div className="flex items-center gap-1 shrink-0">
      <span className={`text-xs px-2 py-0.5 rounded-full ${isCg ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {isCg ? '🟢 CG' : '🔴 Not CG'}
      </span>
      {isCf && <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">🐰</span>}
      {isFragFree && <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600">🌸</span>}
    </div>
  )

  const productInfo = (
    <>
      <ProductImage
        brand={product.brand}
        name={product.name}
        seedImageUrl={product.image_url}
        category={product.category}
        className="w-16 h-16 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{product.brand}</p>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{product.name}</h3>
          </div>
          {badges}
        </div>
        <p className="text-xs text-gray-500">{PRODUCT_CATEGORY_LABELS[product.category]}</p>
      </div>
    </>
  )

  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200">
      {isUuid(productKey) ? (
        <Link to={`/products/${product.id}`} className="flex gap-3 min-w-0 mb-2">
          {productInfo}
        </Link>
      ) : (
        <div className="flex gap-3 min-w-0 mb-2">
          {productInfo}
        </div>
      )}

      <div className="pl-0">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={onToggleTried}
            aria-label={hasTried ? 'Update rating' : 'Mark as tried'}
            className={`text-xs px-3 py-2 min-h-[44px] rounded-full border cursor-pointer transition ${
              hasTried
                ? rating === 'loved' ? 'bg-pink-100 border-pink-300 text-pink-700'
                  : rating === 'liked' ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                  : rating === 'disliked' ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-amber-100 border-amber-300 text-amber-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {hasTried
              ? rating === 'loved' ? '💚 Loved it'
                : rating === 'liked' ? '👍 Liked it'
                : rating === 'disliked' ? '👎 Didn\'t like'
                : '😐 It was ok'
              : 'Tried it?'}
          </button>
          <button
            onClick={onToggleBookmark}
            aria-label={hasBookmarked ? 'Remove from saved' : 'Save product'}
            className={`text-xs px-3 py-2 min-h-[44px] rounded-full border cursor-pointer transition ${
              hasBookmarked
                ? 'bg-violet-100 border-violet-300 text-violet-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {hasBookmarked ? '★ Saved' : '☆ Save'}
          </button>
        </div>

        <RatingPopup
          isOpen={isRatingPopup}
          onSubmit={onSubmitRating}
          onClose={onCloseRating}
        />

        {note && !isEditingNote && (
          <div
            onClick={onStartEditNote}
            className="mt-2 text-xs text-gray-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 cursor-pointer hover:border-amber-200"
          >
            📝 {note}
          </div>
        )}
        {isEditingNote && (
          <div className="mt-2">
            <textarea
              autoFocus
              defaultValue={note || ''}
              placeholder="Add a personal note... e.g., 'Roots remain oily after use'"
              onBlur={(e) => {
                onUpdateNote(e.target.value)
                onStopEditNote()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onUpdateNote((e.target as HTMLTextAreaElement).value)
                  onStopEditNote()
                }
              }}
              className="w-full text-xs px-3 py-2 border border-violet-300 rounded-lg resize-none h-16 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}
      </div>
    </div>
  )
})

function RatingPopup({
  isOpen,
  onSubmit,
  onClose,
}: {
  isOpen: boolean
  onSubmit: (rating: TriedRating) => void
  onClose: () => void
}) {
  if (!isOpen) return null
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Rate this product"
      className="mt-2 p-3 bg-violet-50 border border-violet-200 rounded-lg"
    >
      <p className="text-xs font-medium text-gray-700 mb-2">How was it for your hair?</p>
      <div className="grid grid-cols-2 sm:flex gap-2">
        <button onClick={() => onSubmit('loved')} className="text-xs py-2.5 min-h-[44px] bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer font-medium sm:flex-1">
          💚 Loved it
        </button>
        <button onClick={() => onSubmit('liked')} className="text-xs py-2.5 min-h-[44px] bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer font-medium sm:flex-1">
          👍 Liked it
        </button>
        <button onClick={() => onSubmit('ok')} className="text-xs py-2.5 min-h-[44px] bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer font-medium sm:flex-1">
          😐 It was ok
        </button>
        <button onClick={() => onSubmit('disliked')} className="text-xs py-2.5 min-h-[44px] bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer font-medium sm:flex-1">
          👎 Didn't like
        </button>
      </div>
      <button onClick={onClose} className="text-xs text-gray-500 mt-2 hover:text-gray-700 cursor-pointer min-h-[36px]">Cancel</button>
    </div>
  )
}
