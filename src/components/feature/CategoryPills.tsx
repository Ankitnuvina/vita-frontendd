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
      className={`bg-white border-b border-border py-2.5 ${
        sticky ? 'sticky top-[58px] z-[98]' : ''
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-5 flex gap-1.5 overflow-x-auto pb-0.5">
        {ARTICLE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full border-[1.5px] shrink-0 mr-1.5 transition-all ${
              selected === cat
                ? 'bg-green-600 text-white border-green-600'
                : 'border-border text-ink-3 bg-none hover:border-green-200 hover:text-green-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
