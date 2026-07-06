function Pulse({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 rounded ${className}`} />
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <Pulse className="h-4 w-28 mb-6" />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
        <Pulse className="w-28 h-28 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-3 pt-1">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-6 w-2/3" />
          <Pulse className="h-3 w-40" />
          <Pulse className="h-7 w-28 rounded-full" />
        </div>
      </div>
      <Pulse className="h-11 w-56 rounded-lg mb-6" />
      <Pulse className="h-64 w-full rounded-2xl" />
    </div>
  )
}

export function CardGridSkeleton({
  count = 6,
  className = 'max-w-5xl mx-auto px-4 py-12',
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={`${className} animate-pulse`}>
      <Pulse className="h-8 w-56 mb-2" />
      <Pulse className="h-4 w-72 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Pulse key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function CardListSkeleton({
  count = 4,
  itemClassName = 'h-28',
}: {
  count?: number
  itemClassName?: string
}) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <Pulse key={i} className={`${itemClassName} w-full rounded-2xl`} />
      ))}
    </div>
  )
}

export function OnboardingSkeleton() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 animate-pulse space-y-5">
      <Pulse className="h-2 w-full rounded-full" />
      <Pulse className="h-6 w-2/3" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
