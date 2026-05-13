import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import {
  searchReddit,
  generateRedditSummary,
  highlightTerms,
  type RedditResult,
  type SearchStatus,
} from '../lib/communitySearch'
import { trackSearchPerformed } from '../lib/analytics'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.utils'
import { ShareRoutineForm } from '../components/community/ShareRoutineForm'
import { RoutineCard } from '../components/community/RoutineCard'

interface CommunityQuestion {
  id: string
  question: string
  aiAnswer: string | null
  redditResults: RedditResult[]
  searchStatus: SearchStatus
  searchTerms: string
  timestamp: string
}

const SUBREDDIT_LINKS = [
  { name: 'r/curlyhair', url: 'https://www.reddit.com/r/curlyhair/', members: '339K' },
  { name: 'r/curlygirl', url: 'https://www.reddit.com/r/curlygirl/', members: '61K' },
  { name: 'r/wavyhair', url: 'https://www.reddit.com/r/wavyhair/', members: '32K' },
]

const BROWSE_CATEGORIES = [
  { label: '🧴 Products', terms: 'best product recommendations' },
  { label: '💆 Techniques', terms: 'styling technique method' },
  { label: '🧬 Ingredients', terms: 'protein moisture ingredients' },
  { label: '✂️ Haircuts', terms: 'haircut layers deva cut rezo' },
  { label: '🌀 Curl Types', terms: 'curl pattern type 2a 2b 3a 3b 3c' },
  { label: '💧 Porosity', terms: 'low porosity high porosity' },
  { label: '🔄 Routine', terms: 'wash day routine refresh' },
  { label: '🌡️ Weather', terms: 'humidity frizz weather' },
  { label: '🆕 Transitioning', terms: 'transitioning natural curly girl method beginner' },
  { label: '🩺 Scalp Care', terms: 'scalp dandruff buildup clarifying' },
] as const

const TRENDING_TOPICS = [
  'rice water rinse results',
  'bond repair vs protein treatment',
  'best diffuser technique for volume',
  'low porosity deep conditioning tips',
  'CGM for wavy hair - modified routine',
  'flaxseed gel DIY recipe',
] as const

function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  const parts = useMemo(() => highlightTerms(text, terms), [text, terms])
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string'
          ? <span key={i}>{part}</span>
          : <mark key={i} className="bg-violet-100 text-violet-900 rounded-sm px-0.5">{part.highlighted}</mark>
      )}
    </>
  )
}


function SubredditLinks({ searchTerms }: { searchTerms: string }) {
  const encoded = encodeURIComponent(searchTerms)
  return (
    <div className="mb-4">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Browse communities directly</h4>
      <div className="grid gap-2">
        {SUBREDDIT_LINKS.map(sub => (
          <a
            key={sub.name}
            href={`${sub.url}search/?q=${encoded}&restrict_sr=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 min-h-[44px] rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50/30 transition no-underline"
          >
            <div>
              <span className="text-sm font-medium text-violet-600">{sub.name}</span>
              <span className="text-xs text-gray-400 ml-2">{sub.members} members</span>
            </div>
            <span className="text-xs text-gray-400">Search →</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function AskCommunityPrompt() {
  return (
    <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
      <p className="text-sm text-violet-800">
        💬 Can't find what you're looking for? <span className="font-medium">Ask the community directly.</span>
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {SUBREDDIT_LINKS.map(sub => (
          <a
            key={sub.name}
            href={`${sub.url}submit`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-2 min-h-[44px] rounded-full bg-white text-violet-600 border border-violet-200 hover:bg-violet-100 no-underline transition"
          >
            Post to {sub.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export function Community() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'search' | 'routines'>('search')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<CommunityQuestion[]>([])
  const [showSearchBox, setShowSearchBox] = useState(true)
  const [thankedIds, setThankedIds] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)
  const mountedRef = useRef(true)

  // Routines state
  const [routines, setRoutines] = useState<any[]>([])
  const [routinesLoading, setRoutinesLoading] = useState(false)
  const [showRoutineForm, setShowRoutineForm] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Load routines when tab is active
  useEffect(() => {
    if (activeTab !== 'routines') return
    loadRoutines()
  }, [activeTab])

  async function loadRoutines() {
    setRoutinesLoading(true)
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*, profiles(display_name, curl_pattern, porosity)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50)
      if (!error && data && mountedRef.current) setRoutines(data)
    } catch {
      // silently fail — routines are supplemental
    } finally {
      if (mountedRef.current) setRoutinesLoading(false)
    }
  }

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    const myId = ++requestIdRef.current
    setLoading(true)
    setQuestion('')

    const { results: redditResults, status, searchTerms } = await searchReddit(q)

    // Drop stale responses: another search started after this one, or component unmounted.
    if (!mountedRef.current || myId !== requestIdRef.current) return

    const aiAnswer = status === 'ok' ? generateRedditSummary(redditResults) : null

    const newQ: CommunityQuestion = {
      id: Date.now().toString(),
      question: q.trim(),
      aiAnswer,
      redditResults,
      searchStatus: status,
      searchTerms,
      timestamp: new Date().toISOString(),
    }

    setHistory(prev => [newQ, ...prev])
    setLoading(false)
    setShowSearchBox(false)

    const trimmed = q.trim()
    trackSearchPerformed({
      source: 'community',
      query_length: trimmed.length,
      word_count: trimmed.split(/\s+/).length,
      results_count: redditResults.length,
    })
  }, [])

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    runSearch(question)
  }

  // Debounced auto-search: fire after 1.2s of inactivity (long enough to avoid mid-typing hits)
  const handleInputChange = useCallback((value: string) => {
    setQuestion(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length >= 10) {
      debounceRef.current = setTimeout(() => runSearch(value), 1200)
    }
  }, [runSearch])

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  const totalResults = history.reduce((sum, h) => sum + h.redditResults.length, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
      <p className="text-gray-600 mb-6">
        Ask questions, browse real answers, and share your routine.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2.5 min-h-[44px] text-sm font-medium rounded-md cursor-pointer transition ${
            activeTab === 'search'
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔍 Ask & Search
        </button>
        <button
          onClick={() => setActiveTab('routines')}
          className={`flex-1 py-2.5 min-h-[44px] text-sm font-medium rounded-md cursor-pointer transition ${
            activeTab === 'routines'
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🌀 Routines
        </button>
      </div>

      {activeTab === 'routines' ? (
        <div>
          {/* Share routine CTA */}
          {!showRoutineForm ? (
            <div className="mb-6 p-5 bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 rounded-xl">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Share your hair routine 🌀</h3>
              <p className="text-xs text-gray-500 mb-3">
                Like r/curlyhair — all posts require a routine. Include shampoo, conditioner, treatments, styling products, application method, and how you dry and protect your hair.
              </p>
              <button
                onClick={() => setShowRoutineForm(true)}
                className="px-5 py-2.5 min-h-[44px] bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 cursor-pointer transition"
              >
                + Share My Routine
              </button>
            </div>
          ) : (
            <div className="mb-6">
              <ShareRoutineForm
                onClose={() => setShowRoutineForm(false)}
                onSuccess={() => { setShowRoutineForm(false); loadRoutines() }}
              />
            </div>
          )}

          {/* Routines list */}
          {routinesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : routines.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🌀</div>
              <h3 className="font-semibold text-gray-900 mb-2">No routines shared yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Be the first to share your routine! Help others with similar hair find products that work.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {routines.map(routine => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Search tab content */}

      {/* Ask a question - collapses after first submission */}
      {showSearchBox ? (
        <>
          <form onSubmit={handleAsk} className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <textarea
                value={question}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Ask a question... e.g., 'Best gel for 3B low porosity hair?' or 'How often should I deep condition?'"
                className="w-full h-20 sm:h-24 border-0 resize-none text-sm focus:outline-none placeholder-gray-400"
              />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-2 gap-2">
                <p className="text-xs text-gray-400">
                  🔍 Searches r/curlyhair (339K), r/curlygirl (61K), and r/wavyhair (32K)
                </p>
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="px-5 py-2.5 min-h-[44px] bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Searching...' : 'Ask'}
                </button>
              </div>
            </div>
          </form>

          {/* Default browsing state - categories, trending, popular questions */}
          {history.length === 0 && !loading && (
            <>
              {/* Browse by category */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Browse by topic</h3>
                <div className="flex flex-wrap gap-2">
                  {BROWSE_CATEGORIES.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => runSearch(cat.terms)}
                      className="text-sm px-3 py-2 min-h-[44px] bg-white rounded-full border border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700 cursor-pointer transition"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending topics */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">🔥 Trending topics</h3>
                <div className="grid gap-2">
                  {TRENDING_TOPICS.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => { setQuestion(topic); runSearch(topic); }}
                      className="text-left text-sm px-4 py-3 min-h-[44px] bg-gradient-to-r from-violet-50 to-pink-50 rounded-lg border border-violet-100 hover:border-violet-300 text-gray-700 cursor-pointer transition"
                    >
                      🔥 {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular questions */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Popular questions</h3>
                <div className="grid gap-2">
                  {[
                    'Best gel for fine curly hair?',
                    'How to fix protein overload?',
                    'Curly girl method for beginners - where to start?',
                    'Low porosity hair - what products actually work?',
                    'How to refresh day 2 curls?',
                    'Sulfate-free shampoo recommendations?',
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setQuestion(q); runSearch(q); }}
                      className="text-left text-sm px-4 py-3 min-h-[44px] bg-white rounded-lg border border-gray-200 hover:border-violet-300 text-gray-700 cursor-pointer transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="mb-6">
          <button
            onClick={() => setShowSearchBox(true)}
            className="px-4 py-2.5 min-h-[44px] bg-white border border-gray-200 rounded-lg text-sm text-violet-600 font-medium hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer transition"
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
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Question */}
            <div className="px-6 py-4 bg-violet-50 border-b border-violet-100">
              <p className="font-medium text-gray-900">{item.question}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>

            {/* Error state */}
            {item.searchStatus === 'error' && (
              <div className="px-6 py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-red-800 mb-1">😕 Couldn't reach Reddit right now</p>
                  <p className="text-sm text-red-700">The search didn't go through - Reddit may be temporarily unavailable. You can try again or browse the communities directly.</p>
                </div>
                <button
                  onClick={() => { setQuestion(item.question); setShowSearchBox(true); }}
                  className="mb-4 px-4 py-2.5 min-h-[44px] bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 cursor-pointer transition"
                >
                  🔄 Try again
                </button>
                <SubredditLinks searchTerms={item.searchTerms} />
                <AskCommunityPrompt />
              </div>
            )}

            {/* No results state */}
            {item.searchStatus === 'no_results' && (
              <div className="px-6 py-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-amber-800 mb-1">🔍 No results found for "{item.question}"</p>
                  <p className="text-sm text-amber-700 mb-2">We searched across all three curly hair communities but didn't find matching discussions.</p>
                  <ul className="text-sm text-amber-700 list-disc list-inside space-y-0.5">
                    <li>Try different keywords (e.g., "frizz" instead of "frizzy hair problems")</li>
                    <li>Check spelling of product or ingredient names</li>
                    <li>Use shorter, more specific terms</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Try a related topic</p>
                  <div className="flex flex-wrap gap-2">
                    {BROWSE_CATEGORIES.slice(0, 5).map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => runSearch(cat.terms)}
                        className="text-xs px-3 py-2 min-h-[44px] rounded-full bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 cursor-pointer transition"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <SubredditLinks searchTerms={item.searchTerms} />
                <AskCommunityPrompt />
              </div>
            )}

            {/* Success state - Summary */}
            {item.searchStatus === 'ok' && item.aiAnswer && (
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {item.aiAnswer}
                </div>
              </div>
            )}

            {/* Success state - Reddit Results */}
            {item.searchStatus === 'ok' && item.redditResults.length > 0 && (
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
                            <HighlightedText text={result.title} terms={item.searchTerms.split(/\s+/)} /> <span className="text-gray-400 text-xs" aria-label="opens on Reddit">↗</span>
                          </p>
                          <p className="text-xs text-violet-500 mt-0.5">{result.subreddit}</p>
                          {result.snippet && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              <HighlightedText text={result.snippet} terms={item.searchTerms.split(/\s+/)} />
                            </p>
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
              {thankedIds.has(item.id) ? (
                <p className="text-sm text-green-700">Thanks for the feedback!</p>
              ) : (
              <>
              <p className="text-sm text-gray-700 mb-2">Did this answer your question?</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setThankedIds(prev => new Set(prev).add(item.id))}
                  className="text-xs px-3 py-2 min-h-[44px] rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 cursor-pointer transition"
                >
                  👍 Yes, thanks!
                </button>
                <button
                  onClick={() => { setQuestion(item.question); setShowSearchBox(true); }}
                  className="text-xs px-3 py-2 min-h-[44px] rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer transition"
                >
                  🔄 Refine my search
                </button>
              </div>
              </>
              )}
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  )
}
