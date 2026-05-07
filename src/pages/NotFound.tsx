import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-6xl font-bold text-violet-600 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          Go home
        </Link>
        <Link
          to="/products"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Browse products
        </Link>
      </div>
    </div>
  )
}
