import React from 'react'
import { ARTICLE_CATEGORIES } from '@/globals/constants'

interface CategoryPillsProps {
  selected: string
  onSelect: (cat: string) => void
  sticky?: boolean
}

export function CategoryPills({
  selected,
  onSelect,
  sticky = false,
}: CategoryPillsProps): React.ReactNode {
  return (
    <div
      className={`bg-white/95 backdrop-blur-md border-b border-border py-3 ${
        sticky ? 'sticky top-14 sm:top-16 z-[98]' : ''
      }`}
    >
      <div className="vh-container flex gap-2 overflow-x-auto scroll-x-clean pb-1 -mb-1">
        {ARTICLE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border-[1.5px] shrink-0 transition-all duration-200 ${
              selected === cat
                ? 'bg-green-600 text-white border-green-600 shadow-soft'
                : 'border-border text-ink-3 bg-white hover:border-green-200 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
