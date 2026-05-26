import React from 'react'


export function ArticleCardSkeleton(): React.ReactNode {
  return (
    <div
      className="flex items-center justify-center py-24"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />

      <span className="sr-only">
        Loading articles...
      </span>
    </div>
  )
}