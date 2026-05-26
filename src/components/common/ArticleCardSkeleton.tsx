// import React from 'react'


// export function ArticleCardSkeleton(): React.ReactNode {
//   return (
//     <div
//       className="flex items-center justify-center py-24"
//       aria-busy="true"
//       aria-live="polite"
//     >
//       <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

//       <span className="sr-only">
//         Loading articles...
//       </span>
//     </div>
//   )
// }


import React from 'react'

interface Props {
  count?: number
}

export function ArticleCardSkeleton({ count = 3 }: Props): React.ReactNode {
  return (
    <div className="grid grid-cols-3 gap-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="h-36 bg-border/80" />
          <div className="p-4">
            <div className="h-3 w-20 bg-border rounded mb-2" />
            <div className="h-4 w-full bg-border rounded mb-1.5" />
            <div className="h-4 w-3/4 bg-border rounded mb-3" />
            <div className="flex gap-2">
              <div className="h-3 w-16 bg-border/70 rounded" />
              <div className="h-3 w-12 bg-border/70 rounded" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading articles…</span>
    </div>
  )
}


