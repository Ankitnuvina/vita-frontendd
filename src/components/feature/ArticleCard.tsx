import React, { useState } from 'react'
import type { Article } from '@/globals/types'
import { Send, User, Calendar, Clock } from 'lucide-react'
import { LikeButton } from '@/features/likes/components/common/LikeButton'
import { CommentButton } from '@/features/comments/components/CommentButton'
import { CommentModal } from '@/features/comments/components/CommentModal'

type CardSize = 'xl' | 'lg' | 'md'

interface ArticleCardProps {
  article: Article
  size?: CardSize
  onClick?: (article: Article) => void
}

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
  const [openComments, setOpenComments] = useState(false)

  return (
    <>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick?.(article)}
        className={`group relative bg-white rounded-2xl overflow-hidden border border-border transition-all duration-300 ease-out-expo ${onClick ? 'cursor-pointer' : ''
          } ${isHovered
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
            className={`w-full object-cover transition-transform duration-500 ease-out-expo ${isHovered ? 'scale-105' : 'scale-100'
              } ${IMAGE_HEIGHTS[size]}`}
          />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2 gap-3">
            <div
              className="flex items-center text-[12px] font-bold tracking-[0.12em] uppercase min-w-0"
              style={{ color: article.categoryColor }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block mr-1.5 shrink-0"
                style={{ background: article.categoryColor }}
              />
              <span className="truncate">{article.categoryLabel}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-ink-3 text-sm" onClick={(e) => e.stopPropagation()}>
              <LikeButton contentType="article" contentId={article.id} />
              <div className="flex items-center gap-1 hover:text-green-600 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer">
                <CommentButton contentType="article" contentId={article.id} onClick={() => setOpenComments(true)} />
              </div>
              <div className="flex items-center gap-1 hover:text-green-600 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer">
                <Send className="h-4 w-4" />
              </div>
            </div>
          </div>

          <h3 className={`font-serif font-bold text-ink leading-snug mb-2 line-clamp-3 truncate ${TITLE_SIZES[size]}`}>
            {article.title}
          </h3>

          {size === 'xl' && (
            <p className="text-sm text-ink-3 leading-relaxed mb-3 font-light line-clamp-3">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-start justify-between mt-0 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-neutral-700" />
              </div>
              <span className="text-sm font-semibold text-ink-3 truncate">
                {article.author}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px] text-ink-4 shrink-0">
              <div className="flex items-center gap-1 px-2 py-1">
                <Clock size={11} className="text-ink-3" />
                <span className="leading-none">{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1">
                <Calendar size={11} className="text-ink-3" />
                <span className="leading-none">{article.date}</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {openComments && (
        <div
          className="border-t border-border bg-neutral-50 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <CommentModal
            contentType="article"
            contentId={article.id}
            total={0}
            onClose={() => setOpenComments(false)}
          />
        </div>
      )}
    </>

  )
}
