import React from 'react'

export function PageSkeleton(): React.ReactNode {
  return (
    <main className="min-h-screen bg-paper" aria-busy="true" aria-live="polite">
      <div className="max-w-[1100px] mx-auto px-5 py-12">
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-border rounded mb-3" />
          <div className="h-10 w-2/3 bg-border rounded mb-4" />
          <div className="h-4 w-full bg-border/70 rounded mb-2" />
          <div className="h-4 w-5/6 bg-border/70 rounded mb-8" />

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="h-36 bg-border/80" />
                <div className="p-4">
                  <div className="h-3 w-16 bg-border rounded mb-2" />
                  <div className="h-4 w-full bg-border rounded mb-1.5" />
                  <div className="h-4 w-3/4 bg-border rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </main>
  )
}
