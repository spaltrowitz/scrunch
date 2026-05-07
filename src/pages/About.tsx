import { ScrunchLogo } from '../components/ui/ScrunchLogo'

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <ScrunchLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">About Scrunch</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          From Reddit deep-dives to TikTok holy grails - one place for curly hair that actually works.
        </p>
      </div>

      <div className="space-y-8">
        <section className="relative bg-violet-50/70 rounded-xl px-4 sm:px-6 py-6">
          <span className="absolute top-3 left-4 text-5xl leading-none text-violet-300 font-serif select-none" aria-hidden="true">"</span>
          <div className="pl-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">The Story Behind Scrunch</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              I grew up thinking straight hair was the beauty standard - so I straightened mine for years. It wasn't until college, when friends told me how much they loved my natural curls, that something clicked. I started embracing my texture and dove headfirst into figuring out what products actually work for curly hair.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              That journey - the Reddit rabbit holes, the ingredient decoding, the trial and error - is something so many of us with curls and waves share. I built Scrunch because I wanted one place where our community's collective wisdom lives together, not scattered across a dozen tabs.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              This app is my way of giving back. Whether you're just discovering your natural texture or you're deep into your curl journey, I hope Scrunch makes it a little easier - and a lot more fun.
            </p>
            <p className="text-xs text-gray-500 mt-3">- Shari, founder of Scrunch</p>
          </div>
        </section>

        <section className="bg-violet-50 rounded-lg px-4 py-3 text-center">
          <p className="text-sm text-gray-700">
            Scrunch is free and ad-free.{' '}
            <a
              href="https://spaltrowitz.github.io/#support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:text-violet-700 font-medium underline"
            >
              Support the project →
            </a>
          </p>
        </section>

        <section className="md:hidden bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">📱 Add Scrunch to Your Home Screen</h2>
          <p className="text-sm text-gray-500 mb-4">
            Use Scrunch like a real app - no app store needed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">iPhone / iPad</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Open Scrunch in <span className="font-medium">Safari</span></li>
                <li>Tap the <span className="font-medium">Share</span> button (↑)</li>
                <li>Scroll down and tap <span className="font-medium">"Add to Home Screen"</span></li>
              </ol>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Android</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Open Scrunch in <span className="font-medium">Chrome</span></li>
                <li>Tap the <span className="font-medium">menu</span> (⋮)</li>
                <li>Tap <span className="font-medium">"Add to Home Screen"</span></li>
              </ol>
            </div>
          </div>
        </section>

        <details className="border-t border-gray-200 pt-6" id="credits">
          <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-violet-700 transition">
            Sources & Credits
          </summary>
          <p className="text-xs text-gray-500 mt-2 mb-4">Transparency matters - here's what powers Scrunch.</p>
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
              { name: 'r/wavyhair', url: 'https://www.reddit.com/r/wavyhair/' },
              { name: '#HairTok', url: 'https://www.tiktok.com/tag/hairtok' },
              { name: '#CurlyHairTikTok', url: 'https://www.tiktok.com/tag/curlyhair' },
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
