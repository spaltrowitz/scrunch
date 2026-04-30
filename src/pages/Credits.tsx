export function Credits() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Credits & Sources</h1>
      <p className="text-gray-600 mb-8">
        Scrunch is built on the shoulders of an incredible curly hair community.
        We believe in transparency — here are the sources that power this app.
      </p>

      {/* Product Data Sources */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Product Data</h2>
        <div className="space-y-3">
          <SourceCard
            name="r/curlyhair Holy Grail Product List"
            url="https://docs.google.com/spreadsheets/d/1gn6VnPsRU1H3ziElbWqNVFY5mev6GB1pwKKt_MNpoAY/"
            description="Community-curated spreadsheet of CG-approved products loved by r/curlyhair users. Our initial product database is seeded from this list."
          />
          <SourceCard
            name="Open Beauty Facts"
            url="https://world.openbeautyfacts.org/"
            description="Open-source database of cosmetic products. We use their API to fetch product images. Open data, community-maintained."
          />
          <SourceCard
            name="CurlScan"
            url="https://curlscan.com/"
            description="Curly Girl Method approved product search and barcode scanner. We cross-reference CG approval status with their database."
          />
          <SourceCard
            name="IsItCG"
            url="https://www.isitcg.com/"
            description="Ingredient checker for Curly Girl Method compliance. We cross-reference their analysis rules with ours."
          />
          <SourceCard
            name="CurlsBot"
            url="https://www.curlsbot.com/"
            description="Ingredient analysis tool and curly hair guide. Used as an additional cross-reference for our ingredient analysis engine."
          />
        </div>
      </section>

      {/* Educational Content */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📚 Educational Resources</h2>
        <div className="space-y-3">
          <SourceCard
            name="Curly World (Lorraine Massey)"
            url="https://www.curlyworld.com/cgmethod"
            description="The original Curly Girl Method, created by Lorraine Massey. The foundational guide that started it all."
          />
          <SourceCard
            name="Curl Maven"
            url="https://curlmaven.ie/what-is-the-curly-girl-method/"
            description="Deep CGM guides, technique tutorials, and European product focus. Excellent resource for understanding the method."
          />
          <SourceCard
            name="The Everygirl"
            url="https://theeverygirl.com/curly-girl-method/"
            description="Accessible beginner guides with real routine breakdowns and honest results."
          />
          <SourceCard
            name="Real Simple"
            url="https://www.realsimple.com/beauty-fashion/hair/hair-care/curly-girl-method-review"
            description="Expert-backed editorial reviews of the Curly Girl Method with practical advice."
          />
        </div>
      </section>

      {/* Community Sources */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">💬 Community</h2>
        <div className="space-y-3">
          <SourceCard
            name="r/curlyhair"
            url="https://www.reddit.com/r/curlyhair/"
            description="339K weekly visitors. The largest curly hair community on Reddit — holy grail product threads, routine megathreads, and technique discussions."
          />
          <SourceCard
            name="r/curlygirl"
            url="https://www.reddit.com/r/curlygirl/"
            description="61K weekly visitors. Focused on the Curly Girl Method with beginner guides and community support."
          />
        </div>
      </section>

      {/* Design Inspirations */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">✨ Design Inspirations</h2>
        <div className="space-y-3">
          <SourceCard
            name="Yuka"
            url="https://yuka.io/"
            description="Product scanning UX inspiration. Their clean, color-coded health ratings inspired our ingredient checker design."
          />
          <SourceCard
            name="Prose"
            url="https://prose.com/"
            description="Onboarding quiz inspiration. Their guided hair profile questionnaire informed our profile creation flow."
          />
        </div>
      </section>

      {/* Principles */}
      <div className="p-6 bg-violet-50 rounded-xl border border-violet-100">
        <h3 className="font-semibold text-violet-900 mb-2">Our Principles</h3>
        <ul className="text-sm text-violet-800 space-y-1.5">
          <li>🚫 <strong>No paid advertising.</strong> We will never run ads.</li>
          <li>🤝 <strong>Community-driven.</strong> Recommendations come from real people, not brands.</li>
          <li>🔍 <strong>Unbiased data.</strong> We cross-reference multiple sources, never relying on one authority.</li>
          <li>🔗 <strong>Transparent sources.</strong> We always link back to original content — we curate, not copy.</li>
          <li>🐰 <strong>No sponsored content.</strong> YouTube and Reddit content is filtered for genuine reviews only.</li>
        </ul>
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
      className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-violet-300 transition no-underline"
    >
      <h3 className="font-medium text-gray-900 text-sm mb-1">{name}</h3>
      <p className="text-xs text-gray-500">{description}</p>
      <p className="text-xs text-violet-500 mt-1">{url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>
    </a>
  )
}
