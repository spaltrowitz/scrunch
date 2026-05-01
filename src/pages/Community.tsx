import { useState } from 'react'

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
  'really', 'need', 'know', 'think', 'going', 'much', 'way', 'thing',
  'things', 'try', 'trying', 'still', 'even', 'every', 'place',
  'best', 'good', 'bad', 'work', 'works', 'help', 'helps',
  'without', 'often', 'long', 'start', 'stop', 'keep', 'keeps',
  'day', 'days', 'time', 'times', 'hair', 'naturally', 'natural',
  'use', 'used', 'using', 'new', 'old', 'lot', 'many', 'most', 'getting',
  'after', 'before', 'during', 'since', 'while', 'because', 'then',
])

const HAIR_TERMS = new Set([
  'bangs', 'fringe', 'wavy', 'curly', 'curls', 'coily', 'coils', 'straight', 'porosity',
  'dry', 'drying', 'wet',
  'diffuse', 'diffuser', 'plop', 'plopping', 'scrunch', 'scrunching',
  'gel', 'mousse', 'cream', 'oil', 'serum', 'spray', 'butter',
  'co-wash', 'cowash', 'clarify', 'clarifying', 'chelating',
  'protein', 'moisture', 'frizz', 'frizzy', 'definition',
  'refresh', 'styling', 'cgm', 'shrinkage', 'clumping',
  'squish', 'rake', 'praying', 'shingling', 'finger coil',
  'denman', 'microfiber', 'silk', 'satin', 'bonnet', 'pineapple',
  'sulfate', 'silicone', 'shampoo', 'conditioner', 'leave-in',
  'detangle', 'detangling', 'comb', 'brush', 'wet brush',
  'cast', 'sotc', 'crunch', 'volume', 'root', 'roots',
  'layers', 'trim', 'cut', 'haircut', 'deva cut', 'rezo cut',
  'highlights', 'color', 'bleach', 'damage', 'damaged', 'breakage',
  'shedding', 'thinning', 'growth', 'scalp', 'dandruff', 'buildup',
  'humidity', 'heat', 'flat iron', 'blow dry', 'hood dryer',
  'transition', 'routine', 'regimen', 'technique', 'method',
  'fine', 'thick', 'thin', 'dense', 'density', 'elasticity',
  'hydration', 'emollient', 'humectant', 'glycerin', 'flaxseed',
  '2a', '2b', '2c', '3a', '3b', '3c', '4a', '4b', '4c',
])

const COMPOUND_TERMS: [string, string][] = [
  ['air', 'dry'], ['deep', 'condition'], ['deep', 'conditioning'],
  ['low', 'porosity'], ['high', 'porosity'], ['normal', 'porosity'],
  ['curl', 'pattern'], ['wash', 'day'], ['curly', 'girl'],
  ['leave', 'in'], ['co', 'wash'], ['finger', 'coil'],
  ['wet', 'brush'], ['deva', 'cut'], ['rezo', 'cut'],
  ['flat', 'iron'], ['blow', 'dry'], ['hood', 'dryer'],
  ['protein', 'overload'], ['moisture', 'overload'],
  ['rice', 'water'], ['flax', 'seed'], ['aloe', 'vera'],
  ['day', '2'], ['day', '3'], ['day', '4'],
  ['refresh', 'routine'], ['wash', 'routine'],
  ['fine', 'hair'], ['thick', 'hair'], ['thin', 'hair'],
]

function extractSearchTerms(query: string): { primary: string; fallback: string } {
  const lower = query.toLowerCase().replace(/['']/g, "'")
  const normalized = lower.replace(/[^\w\s'-]/g, ' ')
  const words = normalized.split(/\s+/).filter(Boolean)

  // Drop celebrity/pop culture names — they won't match hair posts
  const NOISE_WORDS = new Set([
    'taylor', 'swift', 'beyonce', 'rihanna', 'zendaya', 'ariana', 'grande',
    'kardashian', 'jenner', 'folklore', 'era', 'eras', 'tour', 'album',
    'celebrity', 'celebs', 'instagram', 'tiktok', 'youtube', 'pinterest',
    'photo', 'picture', 'image', 'video',
  ])

  const foundCompounds: string[] = []
  const usedIndices = new Set<number>()

  for (const [a, b] of COMPOUND_TERMS) {
    for (let i = 0; i < words.length - 1; i++) {
      if (usedIndices.has(i) || usedIndices.has(i + 1)) continue
      if (words[i] === a && words[i + 1] === b) {
        foundCompounds.push(`${a} ${b}`)
        usedIndices.add(i)
        usedIndices.add(i + 1)
        break
      }
    }
  }

  const hairTermsFound: string[] = []
  const otherTerms: string[] = []

  for (let i = 0; i < words.length; i++) {
    if (usedIndices.has(i)) continue
    const w = words[i]
    if (w.length < 2 || STOP_WORDS.has(w) || NOISE_WORDS.has(w)) continue
    if (HAIR_TERMS.has(w)) {
      hairTermsFound.push(w)
    } else if (w.length > 2) {
      otherTerms.push(w)
    }
  }

  const seen = new Set<string>()
  const dedup = (arr: string[]) =>
    arr.filter(t => { if (seen.has(t)) return false; seen.add(t); return true })

  const prioritized = dedup([...foundCompounds, ...hairTermsFound])
  const extras = dedup(otherTerms)

  // Primary: domain terms first, pad with other terms up to 5 total
  const primaryTerms = [...prioritized, ...extras].slice(0, 5)
  const primary = primaryTerms.join(' ')

  // Fallback: just the top 2 most important hair terms for a tighter search
  const fallbackTerms = prioritized.length >= 2
    ? prioritized.slice(0, 2)
    : [...prioritized, ...extras].slice(0, 2)
  const fallback = fallbackTerms.join(' ')

  return { primary, fallback }
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
  const { primary, fallback } = extractSearchTerms(query)
  const subreddits = ['curlyhair', 'curlygirl', 'wavyhair']

  const fetchQuery = async (sub: string, q: string): Promise<RedditResult[]> => {
    try {
      const res = await fetch(
        `https://old.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(q)}&restrict_sr=on&sort=relevance&limit=5`,
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
  }

  // Multi-query: run primary and fallback queries across all subreddits
  const fetches = subreddits.flatMap(sub => [
    fetchQuery(sub, primary),
    ...(fallback !== primary ? [fetchQuery(sub, fallback)] : []),
  ])

  const allResults = (await Promise.all(fetches)).flat()

  // Deduplicate by URL
  const seen = new Set<string>()
  const deduped = allResults.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })

  // Filter out 0-comment posts (nobody engaged)
  const withComments = deduped.filter(r => r.num_comments > 0)
  const pool = withComments.length >= 3 ? withComments : deduped

  // Score and rank results
  const searchWords = primary.toLowerCase().split(/\s+/)
  const scored = pool.map(r => {
    const titleLower = r.title.toLowerCase()
    const titleMatches = searchWords.filter(w => titleLower.includes(w)).length
    const boost = titleMatches * 100
    const commentScore = Math.min(r.num_comments, 50) * 2
    return { result: r, rank: boost + commentScore }
  })

  scored.sort((a, b) => b.rank - a.rank)
  const results = scored.map(s => s.result).slice(0, 8)

  if (results.length === 0) {
    const encodedQuery = encodeURIComponent(primary)
    return [
      { title: `Search r/curlyhair for "${primary}"`, url: `https://www.reddit.com/r/curlyhair/search/?q=${encodedQuery}&restrict_sr=1`, subreddit: 'r/curlyhair', score: 0, num_comments: 0, snippet: 'Click to search r/curlyhair directly on Reddit' },
      { title: `Search r/curlygirl for "${primary}"`, url: `https://www.reddit.com/r/curlygirl/search/?q=${encodedQuery}&restrict_sr=1`, subreddit: 'r/curlygirl', score: 0, num_comments: 0, snippet: 'Click to search r/curlygirl directly on Reddit' },
      { title: `Search r/wavyhair for "${primary}"`, url: `https://www.reddit.com/r/wavyhair/search/?q=${encodedQuery}&restrict_sr=1`, subreddit: 'r/wavyhair', score: 0, num_comments: 0, snippet: 'Click to search r/wavyhair directly on Reddit' },
    ]
  }

  return results
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
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<CommunityQuestion[]>([])
  const [showSearchBox, setShowSearchBox] = useState(true)

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
    setShowSearchBox(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
      <p className="text-gray-600 mb-8">
        Ask anything about curly or wavy hair care. We'll search r/curlyhair, r/curlygirl, and r/wavyhair for the best answers.
      </p>

      {/* Ask a question — collapses after first submission */}
      {showSearchBox ? (
        <>
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
                  🔍 Searches r/curlyhair (339K), r/curlygirl (61K), and r/wavyhair (32K)
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

          {/* Suggested questions — only before first search */}
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
        </>
      ) : (
        <div className="mb-6">
          <button
            onClick={() => setShowSearchBox(true)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-violet-600 font-medium hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer transition"
          >
            + Ask another question
          </button>
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
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-[fadeIn_0.3s_ease-out]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Question */}
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100">
              <p className="font-medium text-gray-900">{item.question}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>

            {/* Summary */}
            {item.aiAnswer && (
              <div className="px-6 py-4 border-b border-gray-100">
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
                          <p className="text-sm font-medium text-gray-900 leading-tight">
                            {result.title} <span className="text-gray-400 text-xs" aria-label="opens on Reddit">↗</span>
                          </p>
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

            {/* Did this help? feedback */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-700 mb-2">Did this answer your question?</p>
              <div className="flex flex-wrap items-center gap-2">
                <button className="text-xs px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 cursor-pointer transition">
                  👍 Yes, thanks!
                </button>
                <button
                  onClick={() => { setQuestion(item.question); setShowSearchBox(true); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer transition"
                >
                  🔄 Refine my search
                </button>
                <button className="text-xs px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 cursor-pointer transition">
                  💬 Post to Scrunch community
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">Community posting coming soon</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
