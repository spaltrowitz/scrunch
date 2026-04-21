import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's your curly hair dashboard.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/products" className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-1">Browse Products</h3>
          <p className="text-sm text-gray-500">Search our database of CG-approved products</p>
        </Link>

        <Link to="/ingredient-checker" className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">🧪</div>
          <h3 className="font-semibold text-gray-900 mb-1">Check Ingredients</h3>
          <p className="text-sm text-gray-500">Paste an ingredient list to check CG approval</p>
        </Link>

        <Link to="/my-products" className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="font-semibold text-gray-900 mb-1">My Products</h3>
          <p className="text-sm text-gray-500">View products you've logged and reviewed</p>
        </Link>

        <Link to="/profile" className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-sm transition no-underline">
          <div className="text-2xl mb-2">👤</div>
          <h3 className="font-semibold text-gray-900 mb-1">My Profile</h3>
          <p className="text-sm text-gray-500">Update your hair profile and preferences</p>
        </Link>
      </div>
    </div>
  )
}
