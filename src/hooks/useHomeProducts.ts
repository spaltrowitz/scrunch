import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/database.types'
import { SEED_PRODUCTS } from '../data/seedProducts'
import { seedToProduct } from './useProducts'

// Lightweight select — only columns needed for homepage product cards
const HOME_PRODUCT_SELECT = 'id,brand,name,category,cg_status,image_url,cruelty_free'

// Pre-computed placeholder from bundled seed data (renders instantly, no async)
const seedPlaceholder: { products: Product[]; isFallback: boolean } = {
  products: SEED_PRODUCTS.slice(0, 20).map(seedToProduct),
  isFallback: true,
}

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Map<string, boolean>()
  return products.filter(p => {
    const key = `${p.brand.toLowerCase()}::${p.name.toLowerCase()}`
    if (seen.has(key)) return false
    seen.set(key, true)
    return true
  })
}

/**
 * Homepage-specific product hook: fewer columns, limited rows, instant placeholder.
 * Full product data is fetched by useProducts() on the Products page.
 */
export function useHomeProducts() {
  return useQuery({
    queryKey: ['products', 'home'],
    queryFn: async (): Promise<{ products: Product[]; isFallback: boolean }> => {
      try {
        const { data: rawData, error } = await supabase
          .from('products')
          .select(HOME_PRODUCT_SELECT)
          .order('review_count', { ascending: false })
          .limit(20)
        const data = rawData as unknown as Product[] | null
        if (!error && data && data.length > 0) {
          return { products: dedupeProducts(data), isFallback: false }
        }
        return { products: seedPlaceholder.products, isFallback: true }
      } catch {
        return { products: seedPlaceholder.products, isFallback: true }
      }
    },
    placeholderData: seedPlaceholder,
  })
}
