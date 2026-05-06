import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth.utils'
import { supabase } from '../lib/supabase'
import { getLocalRatings } from '../lib/localProfile'
import type { RepurchaseIntent } from '../lib/database.types'

export type TriedRating = 'loved' | 'liked' | 'ok' | 'disliked'

const RATING_MAP: Record<TriedRating, number> = { loved: 5, liked: 4, ok: 3, disliked: 1 }
const REPURCHASE_MAP: Record<TriedRating, RepurchaseIntent> = { loved: 'yes', liked: 'yes', ok: 'maybe', disliked: 'no' }

function numericToTried(n: number): TriedRating {
  if (n >= 5) return 'loved'
  if (n >= 4) return 'liked'
  if (n >= 2) return 'ok'
  return 'disliked'
}

/**
 * Fetch user's rating for a specific product.
 * Logged in → Supabase. Logged out → localStorage.
 */
export function useProductRating(productId: string | null) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['product-rating', productId, user?.id ?? 'local'],
    enabled: !!productId,
    queryFn: async (): Promise<{ rating: TriedRating; notes: string | null } | null> => {
      if (!productId) return null

      if (!user) {
        const local = getLocalRatings()
        const r = local[productId]
        return r ? { rating: r, notes: null } : null
      }

      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating,results_notes')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (error?.code === 'PGRST116') return null
      if (error) throw error
      const row = data as { rating: number; results_notes: string | null } | null
      if (!row || row.rating == null) return null
      return { rating: numericToTried(row.rating), notes: row.results_notes }
    },
    staleTime: 5 * 60 * 1000,
  })
}

interface RatingInput {
  productId: string
  rating: TriedRating
  notes?: string
}

/**
 * Save/update a rating.
 * Logged in → Supabase upsert. Logged out → localStorage.
 */
export function useRatingMutation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RatingInput) => {
      if (!user) {
        const local = getLocalRatings()
        local[input.productId] = input.rating
        localStorage.setItem('scrunch_ratings', JSON.stringify(local))
        return
      }

      const payload = {
        user_id: user.id,
        product_id: input.productId,
        rating: RATING_MAP[input.rating],
        would_repurchase: REPURCHASE_MAP[input.rating],
        status: 'tried_once',
        results_notes: input.notes?.trim() || null,
        photo_urls: [] as string[],
        application_method: null,
        routine_context: null,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from('product_reviews').upsert(
        payload as any,
        { onConflict: 'user_id,product_id' }
      )
      if (error) throw error
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ['product-rating', input.productId] })
      queryClient.invalidateQueries({ queryKey: ['product-reviews', input.productId] })
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['reviews', user.id] })
        queryClient.invalidateQueries({ queryKey: ['review-count', user.id] })
      }
    },
  })
}

/**
 * Delete a rating.
 * Logged in → Supabase delete. Logged out → localStorage remove.
 */
export function useDeleteRating() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        const local = getLocalRatings()
        delete local[productId]
        localStorage.setItem('scrunch_ratings', JSON.stringify(local))
        return
      }

      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      if (error) throw error
    },
    onSuccess: (_data, productId) => {
      queryClient.invalidateQueries({ queryKey: ['product-rating', productId] })
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['reviews', user.id] })
        queryClient.invalidateQueries({ queryKey: ['review-count', user.id] })
      }
    },
  })
}
