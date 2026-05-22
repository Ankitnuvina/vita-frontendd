import React from 'react'
import { useLike } from '@/features/likes/hooks/useLikeBatch'
import { ThumbsUp } from "lucide-react"

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
        ${size === 'sm' ? 'text-[12px] px-0 py-0' : 'text-xs px-0 py-0'}
        ${liked

        }
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className={`transition-transform duration-200 ${liked ? 'scale-100' : 'scale-100'}`}>
        {/* {liked ? '❤️' : '🤍'} */}
        <ThumbsUp className={`w-4 h-4 ${ liked ? "fill-green-500 text-green-500" : "text-gray-400"}`}/>
      </span>
      <span>{count > 0 ? count : ''}</span>
    </button>
  )
}