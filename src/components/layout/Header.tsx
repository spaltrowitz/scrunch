import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { ScrunchLogo } from '../ui/ScrunchLogo'

export function Header() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) =>
    location.pathname === path ? 'text-violet-600 font-semibold' : 'text-gray-600 hover:text-violet-600'

  const navLinks = (
    <>
      <Link to="/about" className={`no-underline ${isActive('/about')}`} onClick={() => setMobileMenuOpen(false)}>About</Link>
      <Link to="/products" className={`no-underline ${isActive('/products')}`} onClick={() => setMobileMenuOpen(false)}>Browse</Link>
      <Link to="/ingredient-checker" className={`no-underline ${isActive('/ingredient-checker')}`} onClick={() => setMobileMenuOpen(false)}>Ingredient Checker</Link>
      {user && (
        <Link to="/recommendations" className={`no-underline ${isActive('/recommendations')}`} onClick={() => setMobileMenuOpen(false)}>For You</Link>
      )}
      <Link to="/community" className={`no-underline ${isActive('/community')}`} onClick={() => setMobileMenuOpen(false)}>Community</Link>
    </>
  )

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <ScrunchLogo className="w-8 h-8" />
          <span className="text-xl font-bold text-gray-900">Scrunch</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-gray-600 hover:text-violet-600 no-underline hidden sm:inline">
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-violet-600 cursor-pointer p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          {navLinks}
          {user && (
            <Link to="/profile" className={`no-underline ${isActive('/profile')}`} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
          )}
        </nav>
      )}
    </header>
  )
}
