import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-2">
        <p className="text-xs text-gray-400">
          Scrunch — Made by curly people, for curly people.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <Link to="/about" className="hover:text-violet-600 no-underline">About</Link>
          <span>·</span>
          <Link to="/products" className="hover:text-violet-600 no-underline">Products</Link>
          <span>·</span>
          <Link to="/community" className="hover:text-violet-600 no-underline">Community</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-violet-600 no-underline">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
