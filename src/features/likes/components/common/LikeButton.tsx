import React from 'react'
import { useLike } from '@/features/likes/hooks/useLikeBatch'

interface LikeButtonProps {
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string | number
  size?: 'sm' | 'md'
}

export function LikeButton({
  contentType,
  contentId,
  size = 'sm',
}: LikeButtonProps): React.ReactNode {
  const { liked, count, toggle, isLoading } = useLike({ contentType, contentId })

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); void toggle() }}
      disabled={isLoading}
      className={`flex items-center gap-1 rounded-full border transition-all duration-200 font-semibold
        ${size === 'sm' ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3 py-1.5'}
        ${liked
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
          : 'bg-white border-neutral-200 text-neutral-400 hover:border-red-200 hover:text-red-400'
        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className={`transition-transform duration-200 ${liked ? 'scale-125' : 'scale-100'}`}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{count > 0 ? count : ''}</span>
    </button>
  )
}