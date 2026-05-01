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
  const products = data?.products ?? []
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
          Find your holy grail products, check any ingredient list in seconds, and discover what actually works — backed by 400K+ Reddit members and millions of #HairTok views.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            to="/products"
            className="px-6 py-3 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-sm transition-colors"
          >
            Browse Products →
          </Link>
          <Link
            to="/recommendations"
            className="text-sm text-violet-600 hover:text-violet-800 no-underline font-medium"
          >
            Get Personalized Picks →
          </Link>
        </div>

      </section>

      {/* Features — 2 columns */}
      <section className="py-10 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl border border-gray-200 hover:border-violet-200 transition">
            <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
              Explore 410+ Products
            </h2>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Browse the catalog — from community holy grails to trending #HairTok picks. Filter by curl type, category, or brand.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center w-full md:w-auto text-sm md:text-xs px-4 md:px-3 py-3 md:py-2 min-h-[44px] md:min-h-0 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Browse Products →
            </Link>
          </div>
          <div className="p-5 rounded-xl border border-gray-200 hover:border-violet-200 transition">
            <h2 className="text-sm font-semibold text-gray-900 mb-1.5">
              Your hair goals, your perfect routine
            </h2>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Whether you're building your first wash day routine or fine-tuning your protein-moisture balance — Scrunch matches products to your curl pattern, porosity, and goals.
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center justify-center w-full md:w-auto text-sm md:text-xs px-4 md:px-3 py-3 md:py-2 min-h-[44px] md:min-h-0 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Get Personalized Picks →
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
              410+ curl-safe products — from community holy grails to trending #HairTok picks.
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
                The products going viral on #CurlyHairTikTok — checked for curl safety by Scrunch
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

      {/* Starting your curl journey — discoverable closer */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-violet-50 border border-violet-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-3xl">🌱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Starting your curl journey?</h3>
              <p className="text-sm text-gray-600">
                Whether you just discovered your hair is wavy from a TikTok or you've been deep in Reddit threads — browse our catalog to find products that actually work for your hair type.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm px-4 py-2.5 min-h-[44px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 whitespace-nowrap"
            >
              Browse Products →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
