import React from 'react'
interface SectionHeaderProps {
  eyebrow: string
  title: string
  titleAccent?: string
  subtitle?: string
  onSeeAll?: () => void
  center?: boolean
}

export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  onSeeAll,
  center = false,
}: SectionHeaderProps): React.ReactNode {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <div
        className={`flex items-end gap-4 ${
          center ? 'justify-center' : 'justify-between'
        }`}
      >
        <div>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-green-500 mb-1.5">
            {eyebrow}
          </p>
          <h2 className="font-serif text-[clamp(22px,3vw,34px)] font-black text-ink leading-tight tracking-tight">
            {title}{' '}
            {titleAccent && (
              <em className="text-green-500 font-normal not-italic">{titleAccent}</em>
            )}
          </h2>
          {subtitle && (
            <p className="text-sm text-ink-3 mt-2 font-light">{subtitle}</p>
          )}
        </div>
        {onSeeAll && !center && (
          <button
            onClick={onSeeAll}
            className="text-xs font-semibold text-green-600 px-3.5 py-1.5 border-[1.5px] border-green-100 rounded-full bg-none hover:bg-green-50 transition-colors shrink-0 whitespace-nowrap"
          >
            View All →
          </button>
        )}
      </div>
    </div>
  )
}
