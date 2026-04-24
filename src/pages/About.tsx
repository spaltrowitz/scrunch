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

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Made with 🌀 by the curly hair community, for the curly hair community.
          </p>
          <a href="#/credits" className="text-sm text-violet-600 hover:underline mt-2 inline-block">
            View all sources & credits →
          </a>
        </div>
      </div>
    </div>
  )
}
