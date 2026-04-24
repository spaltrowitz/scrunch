import { useState } from 'react'
import { useAuth } from '../lib/auth'

interface RedditResult {
  title: string
  url: string
  subreddit: string
  score: number
  num_comments: number
  snippet: string
}

interface CommunityQuestion {
  id: string
  question: string
  aiAnswer: string | null
  redditResults: RedditResult[]
  timestamp: string
}

async function searchReddit(query: string): Promise<RedditResult[]> {
  const results: RedditResult[] = []

  for (const sub of ['curlyhair', 'curlygirl']) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=relevance&limit=5`,
        { headers: { 'Accept': 'application/json' } }
      )
      if (!res.ok) continue
      const data = await res.json()
      const posts = data?.data?.children || []
      for (const post of posts) {
        const d = post.data
        results.push({
          title: d.title,
          url: `https://reddit.com${d.permalink}`,
          subreddit: `r/${sub}`,
          score: d.score,
          num_comments: d.num_comments,
          snippet: (d.selftext || '').slice(0, 200),
        })
      }
    } catch {
      // Reddit API can be flaky, continue
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 8)
}

function generateAiAnswer(question: string, redditResults: RedditResult[]): string {
  // In Phase 2, this will call a real LLM via Supabase Edge Function
  // For now, generate a helpful response based on Reddit results
  if (redditResults.length === 0) {
    return `Great question! I don't have specific Reddit discussions to reference for "${question}" right now, but here are some general tips:\n\n` +
      `• Check the r/curlyhair wiki for beginner guides\n` +
      `• The curly girl method subreddit r/curlygirl has technique breakdowns\n` +
      `• Try searching with different keywords\n\n` +
      `Once we connect our AI assistant (coming soon!), I'll be able to give you personalized answers based on your hair profile and community wisdom.`
  }

  const topPost = redditResults[0]
  return `Based on discussions from the curly hair community, here's what I found:\n\n` +
    `**Most relevant thread:** "${topPost.title}" (${topPost.subreddit}, ${topPost.score} upvotes, ${topPost.num_comments} comments)\n\n` +
    (topPost.snippet ? `> ${topPost.snippet}...\n\n` : '') +
    `I found ${redditResults.length} related discussions across r/curlyhair and r/curlygirl. Check the threads below for detailed answers from the community.\n\n` +
    `_Note: AI-powered personalized answers coming soon! For now, I'm surfacing the best community discussions._`
}

export function Community() {
  const { user } = useAuth()
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<CommunityQuestion[]>([])

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    const q = question.trim()
    setQuestion('')

    const redditResults = await searchReddit(q)
    const aiAnswer = generateAiAnswer(q, redditResults)

    const newQ: CommunityQuestion = {
      id: Date.now().toString(),
      question: q,
      aiAnswer,
      redditResults,
      timestamp: new Date().toISOString(),
    }

    setHistory(prev => [newQ, ...prev])
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
      <p className="text-gray-600 mb-8">
        Ask anything about curly hair care. We'll search r/curlyhair and r/curlygirl for the best answers.
      </p>

      {/* Ask a question */}
      <form onSubmit={handleAsk} className="mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question... e.g., 'Best gel for 3B low porosity hair?' or 'How often should I deep condition?'"
            className="w-full h-24 border-0 resize-none text-sm focus:outline-none placeholder-gray-400"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              🔍 Searches r/curlyhair (339K) and r/curlygirl (61K)
            </p>
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-5 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Searching...' : 'Ask'}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested questions */}
      {history.length === 0 && !loading && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular questions</h3>
          <div className="grid gap-2">
            {[
              'Best gel for fine curly hair?',
              'How to fix protein overload?',
              'Curly girl method for beginners — where to start?',
              'Low porosity hair — what products actually work?',
              'How to refresh day 2 curls?',
              'Sulfate-free shampoo recommendations?',
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => { setQuestion(q); }}
                className="text-left text-sm px-4 py-2.5 bg-white rounded-lg border border-gray-200 hover:border-violet-300 text-gray-700 cursor-pointer transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-2xl mb-2">🔍</div>
          <p className="text-sm text-gray-500">Searching the curly hair community...</p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Question */}
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100">
              <p className="font-medium text-gray-900">{item.question}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>

            {/* AI Answer */}
            {item.aiAnswer && (
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">🤖 AI Summary</span>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {item.aiAnswer}
                </div>
              </div>
            )}

            {/* Reddit Results */}
            {item.redditResults.length > 0 && (
              <div className="px-6 py-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Community Discussions ({item.redditResults.length})
                </h4>
                <div className="space-y-3">
                  {item.redditResults.map((result, i) => (
                    <a
                      key={i}
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition no-underline"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xs text-gray-400 text-center shrink-0 mt-0.5">
                          <div className="font-semibold text-gray-600">▲ {result.score}</div>
                          <div>{result.num_comments} 💬</div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-tight">{result.title}</p>
                          <p className="text-xs text-violet-500 mt-0.5">{result.subreddit}</p>
                          {result.snippet && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{result.snippet}</p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Post to community CTA */}
            {user && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Not satisfied with these results?{' '}
                  <button className="text-violet-600 hover:underline cursor-pointer">
                    Post to the Scrunch community →
                  </button>
                  <span className="text-gray-400"> (coming soon)</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
