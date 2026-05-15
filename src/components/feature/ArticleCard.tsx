import React, { useState } from 'react'
import type { Article } from '@/globals/types'

import { LikeButton } from '@/features/likes/components/common/LikeButton'

type CardSize = 'xl' | 'lg' | 'md'

interface ArticleCardProps {
  article: Article
  size?: CardSize
  onClick?: (article: Article) => void
}

/* Responsive image heights per size */
const IMAGE_HEIGHTS: Record<CardSize, string> = {
  xl: 'h-52 sm:h-64 md:h-72',
  lg: 'h-40 sm:h-32',
  md: 'h-44 sm:h-36',
}

const TITLE_SIZES: Record<CardSize, string> = {
  xl: 'text-lg sm:text-xl md:text-2xl',
  lg: 'text-sm sm:text-base',
  md: 'text-sm',
}

export function ArticleCard({
  article,
  size = 'md',
  onClick,
}: ArticleCardProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(article)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-border transition-all duration-300 ease-out-expo ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isHovered
          ? 'shadow-lifted -translate-y-0.5'
          : 'shadow-soft'
      }`}
    >
      {article.isPremium && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-tan-400 text-white text-[8px] font-bold tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-full shadow-soft">
          Premium
        </div>
      )}

      <div className={`overflow-hidden ${IMAGE_HEIGHTS[size]}`}>
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          width={700}
          height={400}
          className={`w-full object-cover transition-transform duration-500 ease-out-expo ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${IMAGE_HEIGHTS[size]}`}
        />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 gap-3">
          <div
            className="flex items-center text-[10px] font-bold tracking-[0.12em] uppercase min-w-0"
            style={{ color: article.categoryColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 shrink-0"
              style={{ background: article.categoryColor }}
            />
            <span className="truncate">{article.categoryLabel}</span>
          </div>
          <div className="flex items-center shrink-0" onClick={(e) => e.stopPropagation()}>
            <LikeButton contentType="article" contentId={article.id} />
          </div>
        </div>

        <h3
          className={`font-serif font-bold text-ink leading-snug mb-2 line-clamp-3 ${TITLE_SIZES[size]}`}
        >
          {article.title}
        </h3>

        {size === 'xl' && (
          <p className="text-sm text-ink-3 leading-relaxed mb-3 font-light line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-center gap-2 text-[10px] text-ink-4 min-w-0 flex-wrap">
            <span className="font-semibold text-ink-2 truncate">{article.author}</span>
            <span className="w-1 h-1 bg-ink-4 rounded-full shrink-0 hidden xs:block" />
            <span className="shrink-0">{article.readTime}</span>
            <span className="w-1 h-1 bg-ink-4 rounded-full shrink-0 hidden xs:block" />
            <span className="shrink-0 hidden xs:inline">{article.date}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
