import { Link } from 'react-router-dom'
import { FeedbackButton } from '../FeedbackButton'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 py-8 mt-auto bg-white">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-600">
          <Link to="/about" className="hover:text-violet-600 no-underline py-2 min-h-[44px] inline-flex items-center">About</Link>
          <Link to="/community" className="hover:text-violet-600 no-underline py-2 min-h-[44px] inline-flex items-center">Community</Link>
          <Link to="/ingredient-checker" className="hover:text-violet-600 no-underline py-2 min-h-[44px] inline-flex items-center">Ingredient Checker</Link>
          <a
            href="https://github.com/spaltrowitz/scrunch"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-violet-600 no-underline py-2 min-h-[44px] inline-flex items-center"
          >
            GitHub ↗
          </a>
          <FeedbackButton inline />
        </nav>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-400">
          <Link to="/terms" className="hover:text-violet-600 no-underline">Terms</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="hover:text-violet-600 no-underline">Privacy</Link>
          <span aria-hidden="true">·</span>
          <span>© {year} Scrunch · Made with 💜 by Shari</span>
        </div>
      </div>
    </footer>
  )
}
