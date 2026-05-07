import { Link } from 'react-router-dom'
import { ProductImage } from '../hooks/useProductImage'
import { useHomeProducts } from '../hooks/useHomeProducts'

// Fallback product names for HairTok section. Auto-bypassed when Supabase products have 'hairtok' in notes.
const HAIRTOK_PRODUCT_NAMES = ['K18', 'Olaplex', 'Rosemary Oil']

const FEATURED_CREATORS = [
  { name: 'Manes by Mell', handle: 'manesbymell', description: 'Curl science & product reviews' },
  { name: 'Ali Noskowiak', handle: 'wavycurly', description: 'Wavy/curly routines' },
  { name: 'BiancaReneeToday', handle: 'biancareneetoday', description: 'Product battles & comparisons' },
] as const

export function Home() {
  const { data } = useHomeProducts()
  const products = data?.products ?? []

  const byNotes = products.filter(p => p.notes?.toLowerCase().includes('hairtok'))
  const hairtokProducts = byNotes.length > 0
    ? byNotes.slice(0, 6)
    : products
        .filter(p => HAIRTOK_PRODUCT_NAMES.some(name => p.name.toLowerCase().includes(name.toLowerCase())))
        .slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-2xl">
          Finally, one place for curly hair that actually works.
        </h1>

        <p className="text-sm md:text-base text-gray-600 mb-4 max-w-xl leading-relaxed">
          Find products that actually work for your curls.
        </p>

        <p className="text-xs md:text-sm text-gray-500 mb-6 max-w-lg leading-relaxed">
          Get personalized recommendations based on your hair type. No ads, no hype, just science.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            to="/products"
            className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-sm transition-colors"
          >
            Browse Products →
          </Link>
          <a
            href="#how-it-works"
            className="text-xs text-gray-500 hover:text-violet-600 no-underline transition-colors min-h-[44px] flex items-center"
          >
            See how it works ↓
          </a>
        </div>

      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How Scrunch Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-gray-200 bg-white text-center">
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Browse</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore 400+ curly hair products by category, brand, or ingredients.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-white text-center">
              <p className="text-3xl mb-3">⭐</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Rate</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rate products you've tried. We learn what works for your hair.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-white text-center">
              <p className="text-3xl mb-3">✨</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                See personalized picks based on your ratings and hair profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Scrunch */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Scrunch?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-gray-200 bg-white text-center">
              <p className="text-3xl mb-3">🧪</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Ingredient-Checked</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every product reviewed for curly hair friendliness. Spot sulfates, silicones, and drying alcohols instantly.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-white text-center">
              <p className="text-3xl mb-3">💚</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Ad-Free & Independent</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                No sponsored placements or affiliate links. Just honest, community-driven recommendations.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-white text-center">
              <p className="text-3xl mb-3">💁‍♀️</p>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Built by Someone Like You</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Created by a curly-haired person who was tired of guessing which products would work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending on #HairTok */}
      {hairtokProducts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
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
                  className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all no-underline group"
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
                  className="flex flex-col gap-1.5 p-4 rounded-lg border border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all"
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
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium no-underline mt-1"
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
