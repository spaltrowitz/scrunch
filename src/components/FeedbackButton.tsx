import { useState } from 'react'
import { supabase } from '../lib/supabase'

const FUNCTION_NAME = 'submit-feedback'

type FeedbackType = 'bug' | 'idea' | 'love'

const PLACEHOLDERS: Record<FeedbackType, string> = {
  bug: "What happened? What did you expect to happen?\n\nSteps to reproduce:\n1. \n2. \n3. ",
  idea: "Describe your idea.\n\nHow would this help your curl journey?",
  love: "What do you love about Scrunch? We'd love to hear!",
}

export function FeedbackButton({ inline }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('love')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke(FUNCTION_NAME, {
        body: { type, title: title.trim(), body: body.trim(), website },
      })
      if (fnError) throw fnError
      if (!data?.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch (err) {
      console.error('Feedback submission failed:', err)
      setError("Couldn't send right now. Please try again in a moment.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setSubmitted(false)
    setTitle('')
    setBody('')
    setWebsite('')
    setType('love')
    setError(null)
  }

  return (
    <>
      {inline ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm text-gray-600 hover:text-violet-600 cursor-pointer"
        >
          Feedback
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 cursor-pointer flex items-center justify-center text-xl z-50 transition-transform hover:scale-110"
          title="Send feedback"
        >
          💬
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {submitted ? (
              <div className="p-6 text-center">
                <div className="text-3xl mb-3">🎉</div>
                <h3 className="font-semibold text-gray-900 mb-1">Thanks for your feedback!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  We've logged it — you'll see your idea or fix show up in a future update.
                </p>
                <button onClick={handleClose} className="text-sm text-violet-600 hover:underline cursor-pointer">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Send Feedback</h3>
                  <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg min-h-[44px] min-w-[44px] flex items-center justify-center">✕</button>
                </div>

                {/* Type selector */}
                <div className="flex gap-2 mb-4">
                  {([
                    ['bug', '🐛 Bug'],
                    ['idea', '💡 Idea'],
                    ['love', '💜 Love it'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { setType(value); setBody('') }}
                      className={`text-xs px-3 py-1.5 min-h-[44px] rounded-full border cursor-pointer transition ${
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
                      {type === 'bug' ? 'What went wrong?' : type === 'idea' ? 'Your idea' : 'What do you love?'}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={type === 'bug' ? 'e.g., Sign-in button not working' : type === 'idea' ? 'e.g., Filter products by protein-free' : 'e.g., The ingredient checker is amazing!'}
                      className="w-full px-3 py-2 min-h-[44px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                  className="w-full mt-4 py-2.5 min-h-[44px] bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {/* Honeypot — hidden from real users, attractive to bots */}
                <label className="hidden" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>

                <p className="text-xs text-gray-400 text-center mt-3">
                  No account needed — we'll route this to the team.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
