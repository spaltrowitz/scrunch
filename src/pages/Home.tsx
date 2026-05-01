import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ProductImage } from '../hooks/useProductImage'
import { useHomeProducts } from '../hooks/useHomeProducts'

// TODO: Remove hardcoded list once Danny adds '#HairTok' to product notes in Supabase
const HAIRTOK_PRODUCT_NAMES = ['K18', 'Olaplex', 'Rosemary Oil']

const FEATURED_CREATORS = [
  { name: 'Manes by Mell', handle: 'manesbymell', description: 'Curl science & product reviews' },
  { name: 'Ali Noskowiak', handle: 'wavycurly', description: 'Wavy/curly routines' },
  { name: 'BiancaReneeToday', handle: 'biancareneetoday', description: 'Product battles & comparisons' },
] as const

export function Home() {
  const { data } = useHomeProducts()
  const products = data?.products ?? []
  const isFallback = data?.isFallback ?? false
  const featuredProducts = products.slice(0, 6)

  // TODO: Switch to notes-based filter once Danny adds '#HairTok' tags
  const hairtokProducts = useMemo(() => {
    const byNotes = products.filter(p => p.notes?.toLowerCase().includes('hairtok'))
    if (byNotes.length > 0) return byNotes.slice(0, 6)
    return products
      .filter(p => HAIRTOK_PRODUCT_NAMES.some(name => p.name.toLowerCase().includes(name.toLowerCase())))
      .slice(0, 6)
  }, [products])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-2xl">
          Finally, one place for curly hair that actually works.
        </h1>

        <p className="text-sm md:text-base text-gray-600 mb-6 max-w-xl leading-relaxed">
          Instantly check if any product is curl-safe, discover what works for YOUR hair type, and learn from 400K+ community members.
        </p>

        <Link
          to="/products"
          className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-sm transition-colors"
        >
          Explore Products →
        </Link>

      </section>

      {/* Fallback banner */}
      {isFallback && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 text-center">
          📡 Showing cached products — live database temporarily unavailable
        </div>
      )}

      {/* Features — 3 columns side by side */}
      <section className="py-10 px-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-gray-200 hover:border-violet-200 transition">
            <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
              Check any ingredient list in seconds
            </h2>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Paste a product label. Scrunch instantly tells you if it's curl-safe — backed by community standards.
            </p>
            <Link
              to="/ingredient-checker"
              className="inline-flex items-center justify-center w-full md:w-auto text-sm md:text-xs px-4 md:px-3 py-3 md:py-2 min-h-[44px] md:min-h-0 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Try Ingredient Checker →
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-gray-200 hover:border-violet-200 transition">
            <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
              Learn from 400K+ curly heads
            </h2>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Ask any question and get real answers from r/curlyhair, r/curlygirl, and r/wavyhair community members.
            </p>
            <Link
              to="/community"
              className="inline-flex items-center justify-center w-full md:w-auto text-sm md:text-xs px-4 md:px-3 py-3 md:py-2 min-h-[44px] md:min-h-0 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Visit Community Q&A →
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-gray-200 hover:border-violet-200 transition">
            <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
              Personalized picks based on YOUR hair
            </h2>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Tell us about your waves, curls, or coils — Scrunch finds products that match your hair profile.
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center justify-center w-full md:w-auto text-sm md:text-xs px-4 md:px-3 py-3 md:py-2 min-h-[44px] md:min-h-0 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Get Recommendations →
            </Link>
          </div>
        </div>
      </section>

      {/* Products Teaser */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Explore Products
            </h2>
            <p className="text-gray-600">
              410+ curl-safe products from the community's most trusted brands.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {featuredProducts.map((product, i) => (
              <Link
                key={product.id || `${product.brand}-${product.name}-${i}`}
                to={product.id ? `/products/${product.id}` : '/products'}
                className="flex flex-col gap-2 p-3 rounded-lg border border-gray-200 bg-white hover:border-violet-300 hover:shadow-sm transition-all no-underline group"
              >
                <ProductImage
                  brand={product.brand}
                  name={product.name}
                  seedImageUrl={product.image_url}
                  className="w-full h-24 object-cover"
                />
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-700">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{product.brand}</p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/products"
              className="text-violet-600 hover:text-violet-800 font-medium no-underline"
            >
              See All Products →
            </Link>
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
                Products the curly community is talking about on TikTok
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
                    className="w-full h-24 object-cover"
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

      {/* New to curly hair — discoverable closer */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-violet-50 border border-violet-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-3xl">🌱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">New to curly hair care?</h3>
              <p className="text-sm text-gray-600">
                Not sure where to start? Check our ingredient checker to see if your current products are curl-friendly.
              </p>
            </div>
            <Link
              to="/ingredient-checker"
              className="text-sm px-4 py-2.5 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 whitespace-nowrap"
            >
              Check Ingredients
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
