import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-3 text-xs text-gray-400">
        <span>© {new Date().getFullYear()} Scrunch</span>
        <span>·</span>
        <Link to="/about" className="hover:text-violet-600 no-underline">About</Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-violet-600 no-underline">Terms</Link>
      </div>
    </footer>
  )
}
