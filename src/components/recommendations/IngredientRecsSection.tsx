import { memo } from 'react'
import type { RecommendedProduct } from './recommendationEngine'
import { RecommendedCard } from './RecommendedCard'

interface IngredientRecsSectionProps {
  ingredientRecs: RecommendedProduct[]
  showRatingPopup: string | null
  dismissingProduct: string | null
  dismissReasons: Set<string>
  dismissNote: string
  emptySet: Set<string>
  onOpenRating: (id: string) => void
  onCloseRating: () => void
  onRate: (productId: string, rating: number) => Promise<void>
  onOpenDismiss: (id: string) => void
  onCloseDismiss: () => void
  onToggleDismissReason: (reason: string) => void
  onDismissNoteChange: (val: string) => void
  onSubmitDismiss: (id: string) => void
  onBookmark: (id: string) => void
}

export const IngredientRecsSection = memo(function IngredientRecsSection({
  ingredientRecs,
  showRatingPopup,
  dismissingProduct,
  dismissReasons,
  dismissNote,
  emptySet,
  onOpenRating,
  onCloseRating,
  onRate,
  onOpenDismiss,
  onCloseDismiss,
  onToggleDismissReason,
  onDismissNoteChange,
  onSubmitDismiss,
  onBookmark,
}: IngredientRecsSectionProps) {
  if (ingredientRecs.length === 0) return null

  return (
    <>
      <hr className="border-gray-200 mb-12" />
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Based on ingredients you love
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Products with similar ingredients to your favorites
        </p>
        <div className="space-y-3">
          {ingredientRecs.slice(0, 10).map(product => (
            <RecommendedCard
              key={product.id}
              product={product}
              reason={product._reason}
              sensitivityWarning={product._sensitivityWarning}
              showRatingPopup={showRatingPopup === product.id}
              onOpenRating={() => onOpenRating(product.id)}
              onCloseRating={onCloseRating}
              onRate={onRate}
              isDismissing={dismissingProduct === product.id}
              dismissReasons={dismissingProduct === product.id ? dismissReasons : emptySet}
              dismissNote={dismissingProduct === product.id ? dismissNote : ''}
              onOpenDismiss={() => onOpenDismiss(product.id)}
              onCloseDismiss={onCloseDismiss}
              onToggleDismissReason={onToggleDismissReason}
              onDismissNoteChange={onDismissNoteChange}
              onSubmitDismiss={() => onSubmitDismiss(product.id)}
              onBookmark={() => onBookmark(product.id)}
            />
          ))}
        </div>
      </section>
    </>
  )
})
