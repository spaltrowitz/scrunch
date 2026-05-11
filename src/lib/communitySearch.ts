// Pure utilities for Community.tsx Reddit search pipeline.
// Extracted to keep page-level UI under control and make these testable.

export interface RedditResult {
  title: string
  url: string
  subreddit: string
  score: number
  num_comments: number
  snippet: string
}

export type SearchStatus = 'ok' | 'no_results' | 'error'

export interface SearchResponse {
  results: RedditResult[]
  status: SearchStatus
  searchTerms: string
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

const NOISE_WORDS = new Set([
  'taylor', 'swift', 'beyonce', 'rihanna', 'zendaya', 'ariana', 'grande',
  'kardashian', 'jenner', 'folklore', 'era', 'eras', 'tour', 'album',
  'celebrity', 'celebs', 'instagram', 'tiktok', 'youtube', 'pinterest',
  'photo', 'picture', 'image', 'video',
])

const STEM_PROTECTED = new Set([
  'curly', 'oily', 'daily', 'frizzy', 'early', 'only', 'apply', 'supply',
  'jelly', 'belly', 'lovely', 'wavy',
])

export function simpleStem(word: string): string {
  if (word.length <= 3) return word
  if (STEM_PROTECTED.has(word)) return word
  return word
    .replace(/(?:ing|tion|ness|ment|able|ible|ful|less|ous|ive|ize|ise|ify|ated?|er|est|ly|ed|es|s)$/, '')
    || word
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function extractSearchTerms(query: string): { primary: string; fallback: string } {
  const lower = query.toLowerCase().replace(/['']/g, "'")
  const normalized = lower.replace(/[^\w\s'-]/g, ' ')
  const words = normalized.split(/\s+/).filter(Boolean)

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

  const primaryTerms = [...prioritized, ...extras].slice(0, 5)
  const primary = primaryTerms.join(' ')

  const fallbackTerms = prioritized.length >= 2
    ? prioritized.slice(0, 2)
    : [...prioritized, ...extras].slice(0, 2)
  const fallback = fallbackTerms.join(' ')

  return { primary, fallback }
}

export function highlightTerms(text: string, terms: string[]): Array<string | { highlighted: string }> {
  if (!terms.length) return [text]
  const stems = terms.map(t => simpleStem(t.toLowerCase())).filter(s => s.length >= 2)
  if (!stems.length) return [text]

  const pattern = stems.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const regex = new RegExp(`(\\b(?:${pattern})\\w*)`, 'gi')
  const parts: Array<string | { highlighted: string }> = []
  let lastIndex = 0

  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx))
    parts.push({ highlighted: match[0] })
    lastIndex = idx + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

export async function searchReddit(query: string): Promise<SearchResponse> {
  const { primary, fallback } = extractSearchTerms(query)
  const subreddits = ['curlyhair', 'curlygirl', 'wavyhair']
  let hadError = false

  const fetchQuery = async (sub: string, q: string): Promise<RedditResult[]> => {
    try {
      const res = await fetch(
        `https://old.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(q)}&restrict_sr=on&sort=relevance&limit=5`,
        { headers: { 'Accept': 'application/json' } }
      )
      if (!res.ok) { hadError = true; return [] }
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
      hadError = true
      return []
    }
  }

  const fetches = subreddits.flatMap(sub => [
    fetchQuery(sub, primary),
    ...(fallback !== primary ? [fetchQuery(sub, fallback)] : []),
  ])

  const allResults = (await Promise.all(fetches)).flat()

  const seen = new Set<string>()
  const deduped = allResults.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })

  const withComments = deduped.filter(r => r.num_comments > 0)
  const pool = withComments.length >= 3 ? withComments : deduped

  const searchWords = primary.toLowerCase().split(/\s+/)
  const searchStems = searchWords.map(w => simpleStem(w)).filter(s => s.length >= 2)
  const scored = pool.map(r => {
    const titleLower = r.title.toLowerCase()
    const titleWords = titleLower.split(/\s+/)
    const titleStems = titleWords.map(w => simpleStem(w))

    const exactMatches = searchWords.filter(w => titleLower.includes(w)).length
    const stemMatches = searchStems.filter(s => titleStems.some(ts => ts === s || ts.startsWith(s))).length
    const snippetStems = r.snippet.toLowerCase().split(/\s+/).map(w => simpleStem(w))
    const snippetMatches = searchStems.filter(s => snippetStems.some(ss => ss === s || ss.startsWith(s))).length

    const boost = exactMatches * 100 + stemMatches * 50 + snippetMatches * 10
    const commentScore = Math.min(r.num_comments, 50) * 2
    return { result: r, rank: boost + commentScore }
  })

  scored.sort((a, b) => b.rank - a.rank)
  const results = scored.map(s => s.result).slice(0, 8)

  if (results.length === 0 && hadError) {
    return { results: [], status: 'error', searchTerms: primary }
  }
  if (results.length === 0) {
    return { results: [], status: 'no_results', searchTerms: primary }
  }
  return { results, status: 'ok', searchTerms: primary }
}

export function generateRedditSummary(redditResults: RedditResult[]): string {
  const count = redditResults.length
  const subs = [...new Set(redditResults.map(r => r.subreddit))].join(', ')
  return `Found ${count} related discussions across ${subs}. Browse the threads below for community advice and tips.`
}
