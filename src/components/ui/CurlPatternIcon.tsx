// SVG curl pattern illustrations for each hair type
// Waves get progressively tighter, curls form loops, coils form zigzags

export function CurlPatternIcon({ pattern, className = 'w-12 h-12' }: { pattern: string; className?: string }) {
  const paths: Record<string, string> = {
    '2A': 'M8,28 Q14,22 20,28 Q26,34 32,28',
    '2B': 'M8,28 Q14,18 20,28 Q26,38 32,28',
    '2C': 'M6,30 Q12,14 18,28 Q24,42 30,28 Q34,18 36,24',
    '3A': 'M10,8 C16,8 20,14 20,20 C20,26 16,32 10,32 C6,32 4,28 6,24',
    '3B': 'M14,6 C18,6 20,10 20,16 C20,22 18,26 14,26 C10,26 8,22 8,16 C8,10 10,6 14,6 M14,26 C18,26 20,30 20,36',
    '3C': 'M16,4 C19,4 20,7 20,10 C20,13 19,16 16,16 C13,16 12,13 12,10 C12,7 13,4 16,4 M16,16 C19,16 20,19 20,22 C20,25 19,28 16,28 C13,28 12,25 12,22 C12,19 13,16 16,16 M16,28 C19,28 20,31 20,34',
    '4A': 'M10,6 C14,6 14,10 12,12 C10,14 10,18 14,18 C18,18 18,22 16,24 C14,26 14,30 18,30 C22,30 22,34 18,36',
    '4B': 'M10,6 L18,12 L10,18 L18,24 L10,30 L18,36',
    '4C': 'M10,4 L16,8 L10,12 L16,16 L10,20 L16,24 L10,28 L16,32 L10,36',
  }

  const colors: Record<string, string> = {
    '2A': '#8B6914', '2B': '#8B6914', '2C': '#8B6914',
    '3A': '#6B4226', '3B': '#6B4226', '3C': '#6B4226',
    '4A': '#3C1F0A', '4B': '#3C1F0A', '4C': '#3C1F0A',
  }

  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#f5f0eb" />
      <path
        d={paths[pattern] || paths['3A']}
        stroke={colors[pattern] || '#6B4226'}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
