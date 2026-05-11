import { ScrunchLogo } from '../components/ui/ScrunchLogo'
import { Link } from 'react-router-dom'

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-12">
      <ScrunchLogo className="w-12 h-12 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Privacy Policy</h1>
      <p className="text-sm text-gray-500 text-center mb-8">Last updated: May 2026</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Overview</h2>
          <p>
            Scrunch is a free, open-source curly hair product discovery tool. We collect
            minimal data, we don't sell anything, and we don't run ads. Your privacy matters to us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What We Collect</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-800">If you use Scrunch without an account:</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Product ratings and hair profile data are stored <strong>locally in your browser</strong> only</li>
                <li>We do not track you, set cookies, or collect analytics</li>
                <li>No personal information leaves your device</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">If you create an account:</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Email address</strong> — for authentication only</li>
                <li><strong>Hair profile</strong> — curl pattern, porosity, density, and other hair characteristics you choose to provide</li>
                <li><strong>Product reviews & ratings</strong> — your ratings and review text</li>
                <li><strong>Community posts</strong> — questions and answers you submit</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">We also collect first-party usage analytics:</h3>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Page views (path and referrer, no personal identifiers)</li>
                <li>Product interactions — ratings submitted, recommendations shown and engaged with, filters applied</li>
                <li>Search shape only — query length and word count, <strong>never the query text itself</strong></li>
                <li>Onboarding step completion to find where users get stuck</li>
                <li>All events stored on our own Supabase backend — never sent to Google Analytics, Meta, or any third party</li>
                <li>Aggregate analytics are retained for up to 90 days, then deleted</li>
                <li>You can opt out at any time from your Profile page</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personalized recommendations:</strong> Your hair profile helps us suggest products that work for people with similar hair</li>
            <li><strong>Community features:</strong> Your reviews help other users discover products</li>
            <li><strong>Product improvement:</strong> Aggregate, anonymized usage data helps us improve Scrunch</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What We Don't Do</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-5">
            <ul className="space-y-2">
              <li>❌ We <strong>never sell</strong> your data to third parties</li>
              <li>❌ We <strong>don't run ads</strong> or share data with advertisers</li>
              <li>❌ We <strong>don't use tracking cookies</strong> or third-party analytics that follow you across the web</li>
              <li>❌ We <strong>don't share your email</strong> with anyone</li>
              <li>❌ We <strong>don't send marketing emails</strong></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Storage & Security</h2>
          <p>
            Account data is stored in <strong>Supabase</strong> (hosted on AWS). Supabase provides
            row-level security, encrypted connections (TLS), and encrypted data at rest.
            Your password is never stored in plain text — authentication is handled entirely
            by Supabase Auth.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Profile Visibility</h2>
          <p>
            By default, your profile is <strong>private</strong>. If you opt in to a public profile,
            only your display name, hair characteristics, and product reviews are visible.
            Your email address is <strong>never</strong> shown publicly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Rights</h2>
          <p>You can at any time:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>View your data</strong> — everything is visible in your profile and reviews</li>
            <li><strong>Edit your data</strong> — update your profile or reviews at any time</li>
            <li><strong>Delete your account</strong> — contact us and we'll delete all your data permanently</li>
            <li><strong>Export your data</strong> — contact us for a full export of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 pr-4 font-medium text-gray-800">Service</th>
                  <th className="py-2 pr-4 font-medium text-gray-800">Purpose</th>
                  <th className="py-2 font-medium text-gray-800">Data shared</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Supabase</td>
                  <td className="py-2 pr-4">Authentication & database</td>
                  <td className="py-2">Email, profile, reviews</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">Google OAuth</td>
                  <td className="py-2 pr-4">Optional sign-in</td>
                  <td className="py-2">Email & name (if you choose Google login)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">GitHub Pages</td>
                  <td className="py-2 pr-4">Site hosting</td>
                  <td className="py-2">Standard web server logs (IP, user agent)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Children's Privacy</h2>
          <p>
            Scrunch is not directed at children under 13. We do not knowingly collect
            personal information from children under 13. If you believe a child has
            provided us with personal data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be reflected
            on this page with an updated "Last updated" date. Continued use of Scrunch after
            changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            Questions about your privacy? Tap the 💬 feedback button in the header to reach us.
          </p>
        </section>

        <div className="text-center pt-4 text-xs text-gray-400">
          <p>
            Also see our <Link to="/terms" className="text-violet-500 hover:underline">Terms of Use</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
