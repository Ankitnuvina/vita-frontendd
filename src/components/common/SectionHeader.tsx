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
    <div className={` ${center ? 'text-center' : ''}`}>
      <div
        className={`flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 ${center ? 'sm:justify-center' : 'sm:justify-between'
          }`}
      >
        <div className={center ? 'mx-auto' : ''}>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-green-500 mb-1.5">
            {eyebrow}
          </p>
          <h2 className="font-serif text-[clamp(22px,4vw,36px)] font-black text-ink leading-tight tracking-tight">
            {title}{' '}
            {titleAccent && (
              <em className="text-green-500 font-normal not-italic">{titleAccent}</em>
            )}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-ink-3 mt-2 font-light max-w-xl">{subtitle}</p>
          )}
        </div>
        {onSeeAll && !center && (
          <button
            onClick={onSeeAll}
            className="self-start sm:self-end text-xs font-semibold text-green-600 px-3.5 py-1.5 border-[1.5px] border-green-100 rounded-full bg-white hover:bg-green-50 hover:border-green-300 transition-colors shrink-0 whitespace-nowrap"
          >
            View All →
          </button>
        )}
      </div>
    </div>
  )
}
