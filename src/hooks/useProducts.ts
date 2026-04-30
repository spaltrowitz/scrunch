import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Product, ProductReview, Profile } from '../lib/database.types'
import type { SeedProduct } from '../data/seedProducts'

type ReviewWithProduct = ProductReview & { products: Product }

const PRODUCT_SELECT = 'id,brand,name,category,ingredients,cg_status,flagged_ingredients,curlscan_status,isitcg_status,status_conflict,country_availability,price_range,protein_free,fragrance_free,key_ingredients,avg_rating,review_count,verified,submitted_by,image_url,notes,cruelty_free,created_at,updated_at'

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Map<string, boolean>()
  return products.filter(p => {
    const key = `${p.brand.toLowerCase()}::${p.name.toLowerCase()}`
    if (seen.has(key)) return false
    seen.set(key, true)
    return true
  })
}

function seedToProduct(seed: SeedProduct, index: number): Product {
  return {
    id: `seed-${index}`,
    brand: seed.brand,
    name: seed.name,
    category: seed.category,
    ingredients: [],
    cg_status: seed.cg_status,
    flagged_ingredients: [],
    curlscan_status: null,
    isitcg_status: null,
    status_conflict: false,
    country_availability: ['US'],
    price_range: null,
    protein_free: null,
    fragrance_free: null,
    key_ingredients: [],
    avg_rating: null,
    review_count: 0,
    verified: false,
    submitted_by: null,
    image_url: seed.image_url,
    notes: seed.notes,
    cruelty_free: seed.cruelty_free,
    created_at: '',
    updated_at: '',
  }
}

async function loadSeedProducts(): Promise<Product[]> {
  const { SEED_PRODUCTS } = await import('../data/seedProducts')
  return dedupeProducts(SEED_PRODUCTS.map(seedToProduct))
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data: rawData, error } = await supabase.from('products').select(PRODUCT_SELECT)
        const data = rawData as unknown as Product[] | null
        if (!error && data && data.length > 0) {
          return dedupeProducts(data)
        }
        return await loadSeedProducts()
      } catch {
        return await loadSeedProducts()
      }
    },
  })
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('id', id)
        .single()
      if (error) return null
      return data as unknown as Product
    },
  })
}

export function useUserReviews(userId?: string) {
  return useQuery({
    queryKey: ['reviews', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*, products(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data as ReviewWithProduct[] | null) ?? []
    },
  })
}

export function useUserReviewCount(userId?: string) {
  return useQuery({
    queryKey: ['review-count', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return 0
      const { count, error } = await supabase
        .from('product_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      if (error) throw error
      return count ?? 0
    },
  })
}

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      return data as unknown as Profile
    },
  })
}
