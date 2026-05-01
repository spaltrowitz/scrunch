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
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={searchRef} className="relative mb-4">
      <input
        type="text"
        placeholder="Search by brand or product name..."
        value={search}
        onChange={(e) => { onSearchChange(e.target.value); setShowSuggestions(true) }}
        onFocus={() => setShowSuggestions(true)}
        className="w-full px-3 py-3 min-h-[44px] border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
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
