import { useState } from 'react'

const GITHUB_REPO = 'spaltrowitz/scrunch'

type FeedbackType = 'bug' | 'feature' | 'feedback'

const LABELS: Record<FeedbackType, string> = {
  bug: 'bug',
  feature: 'enhancement',
  feedback: 'feedback',
}

const PLACEHOLDERS: Record<FeedbackType, string> = {
  bug: "What happened? What did you expect to happen?\n\nSteps to reproduce:\n1. \n2. \n3. ",
  feature: "Describe the feature you'd like to see.\n\nWhy would this be useful?",
  feedback: "Share your thoughts — what's working, what isn't, what could be better?",
}

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('feedback')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    setError(null)

    const issueBody = [
      `**Type:** ${type}`,
      `**Submitted from:** Scrunch app`,
      '',
      body,
      '',
      '---',
      `*Submitted via in-app feedback on ${new Date().toISOString()}*`,
    ].join('\n')

    // Create GitHub issue via the public API (no auth needed for public repos)
    const url = `https://api.github.com/repos/${GITHUB_REPO}/issues`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          title: `[${type}] ${title}`,
          body: issueBody,
          labels: [LABELS[type], 'from-app'],
          assignees: ['copilot'],
        }),
      })

      if (res.status === 401 || res.status === 403) {
        // Fallback: open GitHub issue in new tab (pre-filled)
        const params = new URLSearchParams({
          title: `[${type}] ${title}`,
          body: issueBody,
          labels: `${LABELS[type]},from-app`,
          assignees: 'copilot',
        })
        window.open(`https://github.com/${GITHUB_REPO}/issues/new?${params}`, '_blank')
        setSubmitted(true)
        return
      }

      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
      setSubmitted(true)
    } catch {
      // Fallback: open in GitHub directly
      const params = new URLSearchParams({
        title: `[${type}] ${title}`,
        body: issueBody,
        labels: `${LABELS[type]},from-app`,
      })
      window.open(`https://github.com/${GITHUB_REPO}/issues/new?${params}`, '_blank')
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSubmitted(false)
    setTitle('')
    setBody('')
    setType('feedback')
    setError(null)
  }

  return (
    <>
      {/* Floating feedback button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 cursor-pointer flex items-center justify-center text-xl z-50 transition-transform hover:scale-110"
        title="Send feedback"
      >
        💬
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {submitted ? (
              <div className="p-6 text-center">
                <div className="text-3xl mb-3">🎉</div>
                <h3 className="font-semibold text-gray-900 mb-1">Thanks for your feedback!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  A GitHub issue has been created and assigned to Copilot for triage.
                </p>
                <button onClick={handleClose} className="text-sm text-violet-600 hover:underline cursor-pointer">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Send Feedback</h3>
                  <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
                </div>

                {/* Type selector */}
                <div className="flex gap-2 mb-4">
                  {([
                    ['bug', '🐛 Bug'],
                    ['feature', '✨ Feature Request'],
                    ['feedback', '💭 Feedback'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setType(value); setBody('') }}
                      className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer transition ${
                        type === value
                          ? 'bg-violet-100 border-violet-300 text-violet-700 font-medium'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg mb-3">{error}</div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">
                      {type === 'bug' ? 'What went wrong?' : type === 'feature' ? 'Feature name' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={type === 'bug' ? 'e.g., Sign-in button not working' : type === 'feature' ? 'e.g., Filter products by protein-free' : 'e.g., Love the ingredient checker!'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 block mb-1">Details</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={PLACEHOLDERS[type]}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="w-full mt-4 py-2.5 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Creates a GitHub issue assigned to Copilot for automatic triage
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
