import { ScrunchLogo } from '../components/ui/ScrunchLogo'

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <ScrunchLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">About Scrunch</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          The curly hair community deserves better tools. We're building them.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Why Scrunch?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Product info for curly hair is scattered across spreadsheets, Reddit threads, and ingredient checkers that only say yes or no. Scrunch brings it all into one place where you can <strong>search</strong>, <strong>share</strong>, and <strong>track results</strong>.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">🔍 Search & Discover</h3>
              <p className="text-xs text-gray-500">Browse 200+ community-vetted products. Check any ingredient list instantly. Filter by your hair type.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">👩‍🦱 Personalized</h3>
              <p className="text-xs text-gray-500">Create your hair profile — curl pattern, porosity, goals. See what works for people like you.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">📋 Track & Share</h3>
              <p className="text-xs text-gray-500">Log products you've tried, add notes, bookmark ones to try next. Build your curly hair shelf.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">💬 Community</h3>
              <p className="text-xs text-gray-500">Get answers sourced from r/curlyhair (339K) and r/curlygirl (61K).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Built on Community Wisdom</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Scrunch is built on the incredible work of the curly hair community — the{' '}
            <a href="https://docs.google.com/spreadsheets/d/1gn6VnPsRU1H3ziElbWqNVFY5mev6GB1pwKKt_MNpoAY/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">r/curlyhair Holy Grail Product List</a>,
            ingredient tools like{' '}
            <a href="https://curlscan.com/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">CurlScan</a>,{' '}
            <a href="https://www.isitcg.com/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">IsItCG</a>, and{' '}
            <a href="https://www.curlsbot.com/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">CurlsBot</a>,
            and the{' '}
            <a href="https://www.curlyworld.com/cgmethod" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">Curly Girl Method</a> by Lorraine Massey.
          </p>
        </section>

        <div className="bg-violet-50 rounded-lg px-4 py-3 text-sm text-gray-700">
          🚫 No ads, ever. Community-driven recommendations only.
        </div>

        <section className="flex flex-col sm:flex-row items-center gap-3 bg-amber-50 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-700 mb-0">Scrunch is free and ad-free. Support development:</p>
          <a
            href="https://spaltrowitz.github.io/#support"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 transition no-underline"
          >
            🧴 Buy my next curl cream
          </a>
        </section>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Made with 🌀 by the curly hair community, for the curly hair community.
          </p>
        </div>

        <details className="border-t border-gray-200 pt-6" id="credits">
          <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-violet-700 transition">
            Sources & Credits
          </summary>
          <p className="text-xs text-gray-500 mt-2 mb-4">Transparency matters — here's what powers Scrunch.</p>
          <div className="space-y-4 text-xs">
            <SourceGroup title="📦 Product Data" sources={[
              { name: 'r/curlyhair Holy Grail Product List', url: 'https://docs.google.com/spreadsheets/d/1gn6VnPsRU1H3ziElbWqNVFY5mev6GB1pwKKt_MNpoAY/' },
              { name: 'Open Beauty Facts', url: 'https://world.openbeautyfacts.org/' },
              { name: 'CurlScan', url: 'https://curlscan.com/' },
              { name: 'IsItCG', url: 'https://www.isitcg.com/' },
              { name: 'CurlsBot', url: 'https://www.curlsbot.com/' },
            ]} />
            <SourceGroup title="📚 Educational" sources={[
              { name: 'Curly World (Lorraine Massey)', url: 'https://www.curlyworld.com/cgmethod' },
              { name: 'Curl Maven', url: 'https://curlmaven.ie/what-is-the-curly-girl-method/' },
              { name: 'The Everygirl', url: 'https://theeverygirl.com/curly-girl-method/' },
              { name: 'Real Simple', url: 'https://www.realsimple.com/beauty-fashion/hair/hair-care/curly-girl-method-review' },
            ]} />
            <SourceGroup title="💬 Community" sources={[
              { name: 'r/curlyhair', url: 'https://www.reddit.com/r/curlyhair/' },
              { name: 'r/curlygirl', url: 'https://www.reddit.com/r/curlygirl/' },
            ]} />
            <SourceGroup title="✨ Design Inspiration" sources={[
              { name: 'Yuka', url: 'https://yuka.io/' },
              { name: 'Prose', url: 'https://prose.com/' },
            ]} />
          </div>
        </details>
      </div>
    </div>
  )
}

function SourceGroup({ title, sources }: { title: string; sources: { name: string; url: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{title}</h3>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {sources.map(s => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 underline">{s.name}</a>
        ))}
      </div>
    </div>
  )
}
