import React from 'react'

interface Props {
  count?: number
}

export function PodcastCardSkeleton({ count = 4 }: Props): React.ReactNode {
  return (
    <div className="grid grid-cols-4 gap-4" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="h-40 bg-border/80" />
          <div className="p-4">
            <div className="h-3 w-16 bg-border rounded mb-2" />
            <div className="h-4 w-full bg-border rounded mb-1.5" />
            <div className="h-4 w-2/3 bg-border rounded mb-3" />
            <div className="h-3 w-1/2 bg-border/70 rounded mb-3" />
            <div className="flex gap-2 pt-3 border-t border-border">
              <div className="h-6 flex-1 bg-border/70 rounded-full" />
              <div className="h-6 flex-1 bg-border/70 rounded-full" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading podcasts…</span>
    </div>
  )
}
