/**
 * Tip jar matching the design on https://spaltrowitz.github.io/#support
 * Drops two Venmo deep links — one preset $5, one open-amount.
 *
 * Note: Venmo deep links open the mobile app if installed and fall back
 * to the web flow otherwise. No PII or analytics fires on click — these
 * are plain anchor tags.
 */

const VENMO_HANDLE = 'shari-paltrowitz'
const NOTE = 'Support%20Scrunch'

const TIP_BUTTON_BASE =
  'flex flex-col items-center justify-center gap-1 px-5 py-4 rounded-xl border-2 transition-all min-w-[120px] no-underline'

export function TipJar({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="support"
      className={`bg-gradient-to-br from-pink-50 to-violet-50 border border-pink-100 rounded-xl ${
        compact ? 'px-4 py-5' : 'px-6 py-7'
      } text-center`}
    >
      {!compact && (
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          💜 Support Scrunch
        </h2>
      )}
      <p className={`text-sm text-gray-700 ${compact ? 'mb-3' : 'mb-5 max-w-md mx-auto'}`}>
        Scrunch is free and ad-free. If it's been useful, tips help me keep
        building and cover the (modest) hosting bills.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={`https://venmo.com/${VENMO_HANDLE}?txn=pay&amount=5&note=${NOTE}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${TIP_BUTTON_BASE} bg-white border-pink-200 hover:border-pink-400 hover:shadow-md`}
        >
          <span className="text-2xl" aria-hidden="true">🍵</span>
          <span className="text-base font-semibold text-gray-900">$5</span>
          <span className="text-xs text-gray-500">Buy me a matcha</span>
        </a>
        <a
          href={`https://venmo.com/${VENMO_HANDLE}?txn=pay&note=${NOTE}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${TIP_BUTTON_BASE} bg-violet-600 border-violet-600 text-white hover:bg-violet-700 hover:border-violet-700 hover:shadow-md`}
        >
          <span className="text-2xl" aria-hidden="true">✨</span>
          <span className="text-base font-semibold">Any</span>
          <span className="text-xs opacity-90">Whatever you feel like</span>
        </a>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Opens Venmo · @{VENMO_HANDLE}
      </p>
    </section>
  )
}
