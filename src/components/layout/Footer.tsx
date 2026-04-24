export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
        <p className="mb-2">
          🌀 Scrunch — Community-driven, ad-free, and unbiased.
        </p>
        <p className="mb-3">
          Built with data from the curly hair community. Not affiliated with any brand.
        </p>
        <a href="#/credits" className="text-violet-500 hover:text-violet-700 text-xs">
          Credits & Sources
        </a>
        <span className="text-gray-300 mx-2">·</span>
        <a href="#/about" className="text-violet-500 hover:text-violet-700 text-xs">
          About Scrunch
        </a>
      </div>
    </footer>
  )
}
