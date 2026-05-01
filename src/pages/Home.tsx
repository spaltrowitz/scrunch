import { Link } from 'react-router-dom'
import { ProductImage } from '../hooks/useProductImage'
import { useHomeProducts } from '../hooks/useHomeProducts'

export function Home() {
  const { data } = useHomeProducts()
  const products = data?.products ?? []
  const isFallback = data?.isFallback ?? false
  const featuredProducts = products.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-3xl">
          Your curly hair deserves better than a Google spreadsheet.
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
          Scrunch is your personal curly hair assistant. Instantly check if any product is curl-safe, discover what works for YOUR hair type, and learn from 400K+ community members. All in one place.
        </p>

        <Link
          to="/products"
          className="px-8 py-4 min-h-[48px] flex items-center rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium text-lg transition-colors"
        >
          Explore Products →
        </Link>

        <p className="text-xs md:text-sm text-gray-500 mt-12 max-w-2xl">
          Built on data from r/curlyhair (339K members) · Powered by CurlScan, IsItCG, and CurlsBot
        </p>
      </section>

      {/* Fallback banner */}
      {isFallback && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 text-center">
          📡 Showing cached products — live database temporarily unavailable
        </div>
      )}

      {/* Feature 1 — Check Ingredients */}
      <section className="py-20 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Check any ingredient list in seconds
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Paste or upload a product label. Scrunch instantly tells you if it's curl-safe — backed by r/curlyhair community standards. No more guessing in the aisle.
            </p>
            <Link
              to="/ingredient-checker"
              className="inline-flex items-center px-6 py-3 min-h-[44px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Try Ingredient Checker →
            </Link>
          </div>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-6xl">
            🔬
          </div>
        </div>
      </section>

      {/* Feature 2 — Community (alternating layout) */}
      <section className="py-20 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-6xl md:order-1 order-2">
            💬
          </div>
          <div className="md:order-2 order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn from 400K+ curly heads
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Stuck choosing between two products? Got a weird hair day? Ask in Community Q&A and get real answers from people who've been there.
            </p>
            <Link
              to="/community"
              className="inline-flex items-center px-6 py-3 min-h-[44px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Visit Community Q&A →
            </Link>
          </div>
        </div>
      </section>

      {/* Feature 3 — Recommendations */}
      <section className="py-20 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Personalized product picks based on YOUR hair
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Not all curly hair is the same. Tell us about your waves, curls, or coils — Scrunch finds products that match your hair profile.
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center px-6 py-3 min-h-[44px] rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700 font-medium transition-colors"
            >
              Get Recommendations →
            </Link>
          </div>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-6xl">
            🎯
          </div>
        </div>
      </section>

      {/* Popular Products Teaser */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Popular Products
            </h2>
            <p className="text-gray-600">
              Discover products loved by the community. Browse 200+ more on our full catalog.
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
