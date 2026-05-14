import React, { useState } from 'react'
import type { Article } from '@/globals/types'

import { LikeButton } from '@/features/likes/components/common/LikeButton'

type CardSize = 'xl' | 'lg' | 'md'

interface ArticleCardProps {
  article: Article
  size?: CardSize
  onClick?: (article: Article) => void
}

const IMAGE_HEIGHTS: Record<CardSize, string> = {
  xl: 'h-64',
  lg: 'h-32',
  md: 'h-36',
}

const TITLE_SIZES: Record<CardSize, string> = {
  xl: 'text-xl',
  lg: 'text-base',
  md: 'text-sm',
}

export function ArticleCard({ article, size = 'md', onClick }: ArticleCardProps): React.ReactNode {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(article)}
      className={`relative bg-white rounded-2xl overflow-hidden border border-border cursor-pointer transition-all duration-300 ${isHovered
        ? 'shadow-[0_8px_28px_rgba(19,25,23,0.1)] -translate-y-0.5'
        : 'shadow-[0_1px_4px_rgba(19,25,23,0.05)]'
        }`}
    >
      {article.isPremium && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-tan-400 text-white text-[8px] font-bold tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-full">
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
          className={`w-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'
            } ${IMAGE_HEIGHTS[size]}`}
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center text-[10px] font-bold tracking-[0.12em] uppercase"
            style={{ color: article.categoryColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 shrink-0"
              style={{ background: article.categoryColor }}
            />
            <span className="truncate">
              {article.categoryLabel}
            </span>
          </div>
          <div className="flex items-center shrink-0 ml-3">
            <LikeButton
              contentType="article"
              contentId={article.id}
            />
          </div>
        </div>
        <h3 className={`font-serif font-bold text-ink leading-snug mb-2 ${TITLE_SIZES[size]}`}>
          {article.title}
        </h3>

        {size === 'xl' && (
          <p className="text-sm text-ink-3 leading-relaxed mb-3 font-light">{article.excerpt}</p>
        )}


        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-[10px] text-ink-4">
            <span className="font-semibold text-ink-2">{article.author}</span>
            <span className="w-1 h-1 bg-ink-4 rounded-full" />
            <span>{article.readTime}</span>
            <span className="w-1 h-1 bg-ink-4 rounded-full" />
            <span>{article.date}</span>
          </div>

        </div>
      </div>


    </article>
  )
}