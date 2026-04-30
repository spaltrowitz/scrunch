import { ScrunchLogo } from '../components/ui/ScrunchLogo'

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ScrunchLogo className="w-12 h-12 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Terms of Use & Disclaimers</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Last updated: April 2026</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">⚠️ Important Disclaimers</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
            <p>
              <strong>Scrunch is not a medical or dermatological service.</strong> All product
              recommendations, ingredient analyses, and hair care suggestions on this platform
              are for <strong>informational and educational purposes only</strong>. They are not
              a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              <strong>Always patch test new products.</strong> Before using any product for the
              first time, perform a patch test to check for allergic reactions. If you experience
              irritation, redness, swelling, or any adverse reaction, discontinue use immediately
              and consult a healthcare professional.
            </p>
            <p>
              <strong>Individual results vary.</strong> Product recommendations are based on
              aggregated community data from users with similar hair profiles. What works for
              someone with similar hair characteristics may not work for you. Hair care is highly
              individual and affected by many factors including genetics, water quality, climate,
              health, and medications.
            </p>
            <p>
              <strong>Check your allergens.</strong> Always review the full ingredient list on
              the product packaging before use. Product formulations can change without notice.
              If you have known allergies or sensitivities, verify ingredients directly on the
              product — do not rely solely on Scrunch's ingredient analysis.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What Scrunch Is</h2>
          <p>
            Scrunch is a community-driven product discovery and tracking platform for curly,
            wavy, and coily hair. We aggregate product information, community reviews, and
            publicly available data to help users discover products that may work for their
            hair type. We are:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>A <strong>product information aggregator</strong> — we curate and organize data from public sources</li>
            <li>A <strong>community review platform</strong> — users share their experiences with products</li>
            <li>An <strong>educational resource</strong> — we explain ingredients and hair science concepts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What Scrunch Is Not</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We are <strong>not a retailer</strong> — we do not sell, manufacture, or distribute any products</li>
            <li>We are <strong>not medical professionals</strong> — our content is not medical advice</li>
            <li>We are <strong>not affiliated with any brands</strong> — we accept no paid sponsorships or advertising</li>
            <li>We do <strong>not guarantee product safety</strong> — ingredient analysis is educational, not a safety certification</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Ingredient Analysis & Scrunch Score</h2>
          <p>
            Our ingredient checker and Scrunch Score are based on publicly available information
            about the Curly Girl Method and general ingredient science. They indicate whether a
            product's ingredients align with CGM guidelines — <strong>they do not indicate
            product safety, efficacy, or suitability for any individual</strong>.
          </p>
          <p className="mt-2">
            Product formulations change. Manufacturers may update ingredients without notice.
            The ingredient data in our database may become outdated. Always verify ingredients
            on the actual product packaging.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h2>
          <p>
            Product recommendations are generated based on:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your self-reported hair profile (curl pattern, porosity, etc.)</li>
            <li>Ratings from other users with similar hair profiles</li>
            <li>Product ingredient analysis</li>
          </ul>
          <p className="mt-2">
            These recommendations are <strong>suggestions based on community data</strong>, not
            professional assessments. Scrunch is not liable for any adverse effects, allergic
            reactions, or unsatisfactory results from using recommended products.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Scrunch and its creators shall not be
            liable for any direct, indirect, incidental, consequential, or special damages
            arising from your use of this platform or any products discovered through it.
            This includes, but is not limited to, allergic reactions, hair damage, skin
            irritation, or any other adverse effects.
          </p>
          <p className="mt-2">
            You use Scrunch and act on its information <strong>at your own risk</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">User-Generated Content</h2>
          <p>
            Product reviews, ratings, and notes submitted by users represent individual
            opinions and experiences. Scrunch does not verify, endorse, or guarantee the
            accuracy of user-submitted content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Sources</h2>
          <p>
            Product data is sourced from publicly available resources including community
            spreadsheets, public APIs (Open Beauty Facts), retail websites, and user
            submissions. We credit all sources on our{' '}
            <a href="#/about" className="text-violet-600 hover:underline">About page</a>.
            We do not claim ownership of third-party data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Privacy</h2>
          <p>
            Your hair profile data is used to provide personalized recommendations. By default,
            your profile is private. If you opt in to sharing, your anonymized hair characteristics
            (curl pattern, porosity, etc.) may be used to help recommend products to other users
            with similar hair. Your email and personal identity are never shared.
          </p>
        </section>

        <div className="text-center pt-4 text-xs text-gray-400">
          <p>By using Scrunch, you acknowledge and agree to these terms.</p>
          <p className="mt-1">Questions? Reach us via the feedback button or GitHub.</p>
        </div>
      </div>
    </div>
  )
}
