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

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'into', 'about', 'that', 'this', 'it',
  'they', 'them', 'their', 'what', 'which', 'who', 'when', 'where', 'how',
  'can', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'have',
  'has', 'had', 'not', 'no', 'so', 'just', 'than', 'too', 'very', 'all',
  'also', 'like', 'want', 'make', 'right', 'now', 'well', 'her', 'she', 'he',
  'his', 'get', 'got', 'some', 'any', 'up', 'out', 'over', 'look',
])

function extractSearchTerms(query: string): string {
  const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  // Dedupe while preserving order
  const seen = new Set<string>()
  const unique = words.filter(w => {
    if (seen.has(w)) return false
    seen.add(w)
    return true
  })

  // Reddit search works best with 4-6 key terms
  return unique.slice(0, 6).join(' ')
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
    .replace(/\*([^*]+)\*/g, '$1')        // *italic*
    .replace(/__([^_]+)__/g, '$1')        // __bold__
    .replace(/_([^_]+)_/g, '$1')          // _italic_
    .replace(/~~([^~]+)~~/g, '$1')        // ~~strikethrough~~
    .replace(/^#{1,6}\s+/gm, '')          // # headings
    .replace(/^>\s?/gm, '')               // > blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url)
    .replace(/`([^`]+)`/g, '$1')          // `code`
    .replace(/\n{3,}/g, '\n\n')           // excess newlines
    .trim()
}

async function searchReddit(query: string): Promise<RedditResult[]> {
  const searchTerms = extractSearchTerms(query)
  const subreddits = ['curlyhair', 'curlygirl', 'wavyhair']
  const fetches = subreddits.map(async (sub) => {
    try {
      const res = await fetch(
        `https://old.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(searchTerms)}&restrict_sr=on&sort=relevance&limit=5`,
        { headers: { 'Accept': 'application/json' } }
      )
      if (!res.ok) return []
      const data = await res.json()
      const posts = data?.data?.children || []
      return posts.map((post: { data: { title: string; permalink: string; score: number; num_comments: number; selftext?: string } }) => {
        const d = post.data
        return {
          title: d.title,
          url: `https://reddit.com${d.permalink}`,
          subreddit: `r/${sub}`,
          score: d.score,
          num_comments: d.num_comments,
          snippet: stripMarkdown((d.selftext || '').slice(0, 300)).slice(0, 200),
        } as RedditResult
      })
    } catch {
      return []
    }
  })
  const results: RedditResult[] = (await Promise.all(fetches)).flat()

  // If CORS blocked all results, provide direct search links instead
  if (results.length === 0) {
    const encodedQuery = encodeURIComponent(searchTerms)
    results.push(
      { title: `Search r/curlyhair for "${searchTerms}"`, url: `https://www.reddit.com/r/curlyhair/search/?q=${encodedQuery}&restrict_sr=1`, subreddit: 'r/curlyhair', score: 0, num_comments: 0, snippet: 'Click to search r/curlyhair directly on Reddit' },
      { title: `Search r/curlygirl for "${searchTerms}"`, url: `https://www.reddit.com/r/curlygirl/search/?q=${encodedQuery}&restrict_sr=1`, subreddit: 'r/curlygirl', score: 0, num_comments: 0, snippet: 'Click to search r/curlygirl directly on Reddit' },
      { title: `Search r/wavyhair for "${searchTerms}"`, url: `https://www.reddit.com/r/wavyhair/search/?q=${encodedQuery}&restrict_sr=1`, subreddit: 'r/wavyhair', score: 0, num_comments: 0, snippet: 'Click to search r/wavyhair directly on Reddit' },
    )
  }

  // Keep Reddit's relevance order — do NOT re-sort by score
  return results.slice(0, 8)
}

function generateSummary(_question: string, redditResults: RedditResult[]): string {
  const hasRealResults = redditResults.some(r => r.score > 0)

  if (!hasRealResults) {
    return `No matching discussions found via API. Click the links below to search Reddit's curly hair communities directly.`
  }

  const count = redditResults.length
  const subs = [...new Set(redditResults.map(r => r.subreddit))].join(', ')
  return `Found ${count} related discussions across ${subs}. Browse the threads below for community advice and tips.`
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
    const aiAnswer = generateSummary(q, redditResults)

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
        Ask anything about curly or wavy hair care. We'll search r/curlyhair, r/curlygirl, and r/wavyhair for the best answers.
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
              🔍 Searches r/curlyhair (339K), r/curlygirl (61K), and r/wavyhair
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
                  <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">📋 Community Results</span>
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
