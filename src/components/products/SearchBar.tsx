import { useRef, useState, useEffect } from 'react'

interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  suggestions: string[]
}

export function SearchBar({ search, onSearchChange, suggestions }: SearchBarProps) {
  const searchRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [])

  return (
    <div ref={searchRef} className="relative mb-5">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          aria-label="Search products"
          placeholder="Search by brand or product name..."
          value={search}
          onChange={(e) => { onSearchChange(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-4 py-3.5 min-h-[44px] border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm placeholder:text-gray-400 transition"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[50vh] overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { onSearchChange(s); setShowSuggestions(false) }}
              className="w-full text-left px-3 py-2.5 min-h-[44px] text-sm hover:bg-violet-50 cursor-pointer border-b border-gray-50 last:border-0"
            >
              <span className="text-gray-400">🔍 </span>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
