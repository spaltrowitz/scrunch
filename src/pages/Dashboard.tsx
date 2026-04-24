import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'
import { IngredientChecker } from '../components/products/IngredientChecker'

export function Dashboard() {
  const { user } = useAuth()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'friend'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hey {firstName} 👋
        </h1>
        <p className="text-gray-600 mt-1">What are you working on today?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Link to="/products" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-1">Browse & Log</h3>
          <p className="text-xs text-gray-500">Find products, check ingredients, mark what you've tried</p>
        </Link>

        <Link to="/my-products" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-gray-900 mb-1">My Shelf</h3>
          <p className="text-xs text-gray-500">Your tried, liked, and saved products with notes</p>
        </Link>

        <Link to="/community" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">💬</div>
          <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
          <p className="text-xs text-gray-500">Ask questions, get answers from Reddit & the community</p>
        </Link>
      </div>

      {/* Inline ingredient checker */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Ingredient Check</h2>
        <IngredientChecker />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/profile" className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 transition no-underline">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">👤 My Hair Profile</h3>
          <p className="text-xs text-gray-500">Update your curl pattern, porosity, goals & preferences</p>
        </Link>
        <Link to="/about" className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-violet-300 transition no-underline">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">🌀 About Scrunch</h3>
          <p className="text-xs text-gray-500">How we work, our sources, and what's coming next</p>
        </Link>
      </div>
    </div>
  )
}
