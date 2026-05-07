import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-2">
        <p className="text-xs text-gray-400">
          Scrunch - Made by curly people, for curly people.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <Link to="/terms" className="hover:text-violet-600 no-underline py-2 min-h-[44px] inline-flex items-center">Terms</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-violet-600 no-underline py-2 min-h-[44px] inline-flex items-center">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
