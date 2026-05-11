import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth.utils'
import { getLocalRatings } from '../lib/localProfile'
import { supabase } from '../lib/supabase'
import { useToast } from './useToast.utils'

const MIGRATION_KEY = 'scrunch_ratings_migrated'

/**
 * On first login, syncs any localStorage ratings to Supabase.
 * Runs once after auth state changes to logged-in.
 * Server wins on conflict (upsert with ignoreDuplicates).
 */
export function useMigrateLocalRatings() {
  const { user, loading } = useAuth()
  const { addToast } = useToast()
  const queryClient = useQueryClient()
  const attempted = useRef(false)

  const { mutateAsync } = useMutation({
    mutationFn: async (userId: string) => {
      const localRatings = getLocalRatings()
      const keys = Object.keys(localRatings)
      if (keys.length === 0) return 0

      const ratingMap: Record<string, number> = { loved: 5, liked: 4, ok: 3, disliked: 1 }
      const repurchaseMap: Record<string, string> = { loved: 'yes', liked: 'yes', ok: 'maybe', disliked: 'no' }

      const isUuid = (k: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(k)
      const uuidKeys = keys.filter(isUuid)

      const reviews = uuidKeys.map(productId => ({
        user_id: userId,
        product_id: productId,
        rating: ratingMap[localRatings[productId]] ?? 3,
        would_repurchase: repurchaseMap[localRatings[productId]] ?? 'maybe',
        status: 'tried_once' as const,
        photo_urls: [] as string[],
      }))

      if (reviews.length === 0) return 0

      // ignoreDuplicates: true → server wins on conflict (existing reviews preserved)
      const { error } = await supabase
        .from('product_reviews')
        .upsert(reviews as never[], { onConflict: 'user_id,product_id', ignoreDuplicates: true })

      if (error) throw error

      // Only drop migrated UUID keys; keep seed-product ratings (keyed "Brand::Name")
      // so they aren't lost on login.
      const remaining: Record<string, string> = {}
      for (const key of keys) {
        if (!isUuid(key)) remaining[key] = localRatings[key]
      }
      if (Object.keys(remaining).length === 0) {
        localStorage.removeItem('scrunch_ratings')
      } else {
        localStorage.setItem('scrunch_ratings', JSON.stringify(remaining))
      }
      return reviews.length
    },
    onSuccess: (count) => {
      if (count && count > 0) {
        addToast(`✓ Synced ${count} rating${count !== 1 ? 's' : ''} to your account`, 'success')
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
        queryClient.invalidateQueries({ queryKey: ['review-count'] })
        queryClient.invalidateQueries({ queryKey: ['product-rating'] })
      }
      localStorage.setItem(MIGRATION_KEY, 'true')
    },
    onError: (error) => {
      console.error('Rating migration failed:', error)
      addToast('Some ratings could not be synced. They will stay saved locally.', 'error')
    },
  })

  useEffect(() => {
    if (loading || !user || attempted.current) return
    if (localStorage.getItem(MIGRATION_KEY) === 'true') return

    const localRatings = getLocalRatings()
    if (Object.keys(localRatings).length === 0) {
      localStorage.setItem(MIGRATION_KEY, 'true')
      return
    }

    attempted.current = true
    mutateAsync(user.id)
  }, [loading, user, mutateAsync])
}
