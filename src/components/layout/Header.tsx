import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export function Header() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const isActive = (path: string) =>
    location.pathname === path ? 'text-violet-600 font-semibold' : 'text-gray-600 hover:text-violet-600'

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">✊</span>
          <span className="text-xl font-bold text-gray-900">Scrunch</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/products" className={`no-underline ${isActive('/products')}`}>Products</Link>
          <Link to="/ingredient-checker" className={`no-underline ${isActive('/ingredient-checker')}`}>Ingredient Checker</Link>
          {user && (
            <>
              <Link to="/my-products" className={`no-underline ${isActive('/my-products')}`}>My Products</Link>
              <Link to="/dashboard" className={`no-underline ${isActive('/dashboard')}`}>Dashboard</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-gray-600 hover:text-violet-600 no-underline">
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg bg-violet-600 text-white no-underline hover:bg-violet-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
