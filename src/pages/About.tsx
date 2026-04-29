import { ScrunchLogo } from '../components/ui/ScrunchLogo'

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <ScrunchLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">About Scrunch</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          The curly hair community deserves better tools. We're building them.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">The Problem</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have curly, wavy, or coily hair, you know the struggle. There are massive
            Google Spreadsheets with thousands of products, ingredient checkers that only tell you
            yes or no, Reddit threads scattered across multiple subreddits, and YouTube videos that
            may or may not be sponsored. Finding what actually works for <em>your</em> hair type
            means hours of research across fragmented resources.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What Scrunch Does</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Scrunch takes the best of what already exists in the curly hair community and
            modernizes it into one place where you can <strong>search</strong>, <strong>share</strong>,
            and <strong>track results</strong>.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">🔍 Search & Discover</h3>
              <p className="text-xs text-gray-500">Browse 200+ community-vetted products. Check any ingredient list instantly. Filter by your hair type for relevant results.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">👩‍🦱 Personalized</h3>
              <p className="text-xs text-gray-500">Create your hair profile — curl pattern, porosity, goals. See what works for people like you, not generic reviews.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">📋 Track & Share</h3>
              <p className="text-xs text-gray-500">Log products you've tried, add personal notes, bookmark ones to try next. Build your curly hair shelf.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">💬 Community</h3>
              <p className="text-xs text-gray-500">Ask questions and get answers sourced from Reddit's curly hair communities — r/curlyhair (339K) and r/curlygirl (61K).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Built on Community Wisdom</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Scrunch doesn't exist in a vacuum. We're inspired by and built on top of the incredible
            work the curly hair community has already done:
          </p>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="shrink-0">📊</span>
              <span>The <strong>r/curlyhair Holy Grail Product List</strong> — a community-maintained spreadsheet of products loved by hundreds of thousands of curly-haired people. Our initial product database is seeded from this list.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0">🔬</span>
              <span><strong>CurlScan, IsItCG, and CurlsBot</strong> — ingredient analysis tools that pioneered checking products for Curly Girl Method compliance. We cross-reference all three to validate our analysis.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0">📖</span>
              <span>The <strong>Curly Girl Method</strong> by Lorraine Massey — the foundational approach to caring for curly hair that started this entire movement.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0">💬</span>
              <span><strong>r/curlyhair and r/curlygirl</strong> — Reddit communities with 339K+ and 61K+ weekly visitors respectively. The holy grail threads, routine breakdowns, and product reviews are an incredible knowledge base.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0">✍️</span>
              <span>Content creators and bloggers like <strong>Curl Maven, The Everygirl, and Curly World</strong> who have written detailed guides, technique tutorials, and honest product reviews.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Principles</h2>
          <div className="bg-violet-50 rounded-xl p-6 space-y-3">
            <div className="flex gap-3 text-sm">
              <span>🚫</span>
              <div>
                <strong className="text-gray-900">No ads, ever.</strong>
                <p className="text-gray-600">We will never run paid advertising. Our recommendations come from the community, not brands.</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span>🤝</span>
              <div>
                <strong className="text-gray-900">Community-driven.</strong>
                <p className="text-gray-600">Product recommendations come from real people with real results. No sponsored reviews, no paid influencer content.</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span>🔍</span>
              <div>
                <strong className="text-gray-900">Transparent & unbiased.</strong>
                <p className="text-gray-600">We cross-reference multiple sources. We show you the data and let you decide. Our Scrunch Score is based on ingredient science, not brand partnerships.</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <span>🔗</span>
              <div>
                <strong className="text-gray-900">Credit where it's due.</strong>
                <p className="text-gray-600">We link back to every source. We curate and contextualize — we never copy or republish without attribution.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What's Coming</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>🧪 <strong>AI Ingredient Analysis</strong> — Upload a photo of any product and get instant CG analysis</p>
            <p>📸 <strong>AI Curl Type Detection</strong> — Upload a photo of your hair and we'll help identify your curl pattern</p>
            <p>🌍 <strong>Environmental Dashboard</strong> — See how your local UV, humidity, and water hardness affect your hair</p>
            <p>📋 <strong>Routine Builder</strong> — Build and share complete wash day routines</p>
            <p>🤖 <strong>AI Hair Assistant</strong> — Ask questions and get personalized answers powered by community wisdom</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Support Scrunch</h2>
          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <p className="text-3xl mb-3">🧴</p>
            <p className="text-gray-700 mb-4">
              Scrunch is free, ad-free, and community-driven. If you've found it useful, you can
              support ongoing development by buying my next curly hair product.
            </p>
            <a
              href="https://spaltrowitz.github.io/#support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg font-medium text-sm hover:bg-violet-700 transition no-underline"
            >
              🧴 Buy my next curl cream
            </a>
            <p className="text-xs text-gray-400 mt-3">
              100% of your support goes directly to keeping Scrunch running — zero platform fees.
            </p>
          </div>
        </section>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Made with 🌀 by the curly hair community, for the curly hair community.
          </p>
        </div>

        {/* Sources & Credits */}
        <section className="mt-12 pt-8 border-t border-gray-200" id="credits">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sources & Credits</h2>
          <p className="text-sm text-gray-600 mb-6">
            We believe in transparency — here are the sources that power this app.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">📦 Product Data</h3>
              <div className="space-y-2">
                <SourceCard name="r/curlyhair Holy Grail Product List" url="https://docs.google.com/spreadsheets/d/1gn6VnPsRU1H3ziElbWqNVFY5mev6GB1pwKKt_MNpoAY/" description="Community-curated spreadsheet of CG-approved products. Our initial database is seeded from this list." />
                <SourceCard name="Open Beauty Facts" url="https://world.openbeautyfacts.org/" description="Open-source cosmetics database. We use their API for product images." />
                <SourceCard name="CurlScan" url="https://curlscan.com/" description="CG-approved product search and barcode scanner. We cross-reference CG status." />
                <SourceCard name="IsItCG" url="https://www.isitcg.com/" description="Ingredient checker for CGM compliance. We cross-reference their analysis rules." />
                <SourceCard name="CurlsBot" url="https://www.curlsbot.com/" description="Ingredient analysis tool. Additional cross-reference for our analyzer." />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">📚 Educational Resources</h3>
              <div className="space-y-2">
                <SourceCard name="Curly World (Lorraine Massey)" url="https://www.curlyworld.com/cgmethod" description="The original Curly Girl Method — the foundational guide." />
                <SourceCard name="Curl Maven" url="https://curlmaven.ie/what-is-the-curly-girl-method/" description="Deep CGM guides, technique tutorials, European product focus." />
                <SourceCard name="The Everygirl" url="https://theeverygirl.com/curly-girl-method/" description="Accessible beginner guides with real routine breakdowns." />
                <SourceCard name="Real Simple" url="https://www.realsimple.com/beauty-fashion/hair/hair-care/curly-girl-method-review" description="Expert-backed editorial CGM reviews." />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">💬 Community</h3>
              <div className="space-y-2">
                <SourceCard name="r/curlyhair" url="https://www.reddit.com/r/curlyhair/" description="339K weekly visitors. Holy grail threads, routine megathreads, technique discussions." />
                <SourceCard name="r/curlygirl" url="https://www.reddit.com/r/curlygirl/" description="61K weekly visitors. Focused on CGM with beginner guides." />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">✨ Design Inspirations</h3>
              <div className="space-y-2">
                <SourceCard name="Yuka" url="https://yuka.io/" description="Product scanning UX inspiration. Color-coded health ratings inspired our Scrunch Score." />
                <SourceCard name="Prose" url="https://prose.com/" description="Onboarding quiz flow inspiration for hair profile creation." />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function SourceCard({ name, url, description }: { name: string; url: string; description: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
    >
      <h4 className="font-medium text-gray-900 text-sm">{name}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </a>
  )
}
