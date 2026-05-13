import { Link } from 'react-router-dom'
import { ProductImage } from '../hooks/useProductImage'
import { useHomeProducts } from '../hooks/useHomeProducts'
import { useProductCount } from '../hooks/useProducts'

// Tag stored in `products.notes` text to mark a product as currently trending on HairTok.
// Lower-cased substring match. Centralized here so curation isn't hidden in component code.
const HAIRTOK_TAG = 'hairtok'

// Fallback product-name keywords used only if no Supabase product carries the HAIRTOK_TAG.
// Useful for seed-data demos and when the Supabase fetch falls back to bundled seeds.
const HAIRTOK_FALLBACK_NAMES = ['K18', 'Olaplex', 'Rosemary Oil'] as const

const FEATURED_CREATORS = [
  { name: 'Manes by Mell', handle: 'manesbymell', description: 'Curl science & product reviews' },
  { name: 'Ali Noskowiak', handle: 'wavycurly', description: 'Wavy/curly routines' },
  { name: 'BiancaReneeToday', handle: 'biancareneetoday', description: 'Product battles & comparisons' },
] as const

function roundedCount(n: number): string {
  if (n < 50) return `${n}`
  return `${Math.floor(n / 10) * 10}+`
}

export function Home() {
  const { data } = useHomeProducts()
  const products = data?.products ?? []
  const { data: productCount } = useProductCount()
  const countLabel = roundedCount(productCount ?? 0)

  const byNotes = products.filter(p => p.notes?.toLowerCase().includes(HAIRTOK_TAG))
  const hairtokProducts = byNotes.length > 0
    ? byNotes.slice(0, 6)
    : products
        .filter(p => HAIRTOK_FALLBACK_NAMES.some(name => p.name.toLowerCase().includes(name.toLowerCase())))
        .slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-2xl">
          Find curly hair products that actually work.
        </h1>

        <p className="text-sm md:text-base text-gray-500 mb-8 max-w-lg leading-relaxed">
          {countLabel} products checked for CG approval. Personalized recommendations based on your hair type. No ads, no hype.
        </p>

        <Link
          to="/products"
          className="px-6 py-3 min-h-[44px] flex items-center rounded-full bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-sm transition-colors shadow-sm"
        >
          Browse Products
        </Link>
      </section>

      {/* How Scrunch works + why it's different */}
      <section id="how-it-works" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            How Scrunch works
          </h2>
          <p className="text-sm text-gray-500 mb-8 text-center max-w-xl mx-auto">
            Ingredient-checked, ad-free, built by a curly. Three steps from browsing to a personalized shelf.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-100 bg-white text-center shadow-sm hover:shadow-md transition-shadow">
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Browse</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {countLabel} curly hair products, every ingredient list reviewed for sulfates, silicones, and drying alcohols.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-white text-center shadow-sm hover:shadow-md transition-shadow">
              <p className="text-3xl mb-3">⭐</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Rate</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tap "Tried it?" on what you've used. No ads, no affiliate links — just your honest takes.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-white text-center shadow-sm hover:shadow-md transition-shadow">
              <p className="text-3xl mb-3">✨</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Get matched</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Personalized picks based on your curl pattern, porosity, and what you've loved so far.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending on #HairTok */}
      {hairtokProducts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                🎵 Trending on #HairTok
              </h2>
              <p className="text-gray-600">
                Popular products from #CurlyHairTikTok - ingredient-checked by Scrunch.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {hairtokProducts.map((product, i) => (
                <Link
                  key={product.id || `${product.brand}-${product.name}-${i}`}
                  to={product.id ? `/products/${product.id}` : '/products'}
                  className="flex flex-col gap-2 p-3 rounded-2xl border border-gray-100 bg-white hover:border-violet-300 hover:shadow-md transition-all no-underline group shadow-sm"
                >
                  <ProductImage
                    brand={product.brand}
                    name={product.name}
                    seedImageUrl={product.image_url}
                    className="w-full h-20 sm:h-24 object-cover"
                  />
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-700">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                </Link>
              ))}
            </div>

            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Featured Creators</h3>
              <p className="text-sm text-gray-500">Curl creators worth following on TikTok</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURED_CREATORS.map(creator => (
                <div
                  key={creator.handle}
                  className="flex flex-col gap-1.5 p-4 rounded-2xl border border-gray-100 bg-white hover:border-violet-300 hover:shadow-md transition-all shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {creator.name}{' '}
                    <span className="font-normal text-gray-500">@{creator.handle}</span>
                  </p>
                  <p className="text-xs text-gray-600">{creator.description}</p>
                  <a
                    href={`https://tiktok.com/@${creator.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:text-violet-800 font-medium no-underline mt-1"
                  >
                    View on TikTok ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
