import { Link } from 'react-router-dom'
import { IngredientChecker } from '../components/products/IngredientChecker'
import { useAuth } from '../lib/auth'

export function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 px-4 text-center bg-gradient-to-b from-violet-50 to-white">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ✊ Know your products.
          <br />
          <span className="text-violet-600">Love your curls.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Community-driven, ad-free product recommendations for curly, wavy, and coily hair.
          Find what works for <em>your</em> hair type.
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <Link
            to="/products"
            className="px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 no-underline"
          >
            Browse Products
          </Link>
          {!user && (
            <Link
              to="/login"
              className="px-6 py-3 border border-violet-200 text-violet-600 font-medium rounded-lg hover:bg-violet-50 no-underline"
            >
              Create Account
            </Link>
          )}
        </div>

        {/* Ingredient Checker — hero feature */}
        <IngredientChecker />
      </section>

      {/* Value props */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Check Any Product</h3>
            <p className="text-sm text-gray-600">
              Paste an ingredient list and instantly know if it's Curly Girl approved.
              Cross-referenced with CurlScan & IsItCG.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">👩‍🦱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized For You</h3>
            <p className="text-sm text-gray-600">
              See ratings from people with your exact hair type.
              3B with low porosity? We'll show you what works for them.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-2">No Ads, No Bias</h3>
            <p className="text-sm text-gray-600">
              Community-powered recommendations. No sponsored content,
              no paid influencer reviews. Just real results from real people.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
