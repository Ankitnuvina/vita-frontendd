import React from 'react'
import { MessageCircleMore } from 'lucide-react'
import { useCommentCount } from '../hooks/useCommentCount'

interface CommentButtonProps {
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string | number
  onClick?: () => void
}

function formatCount(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  if (n < 1_000_000) return `${Math.floor(n / 1000)}k`
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

export function CommentButton({
  contentType,
  contentId,
  onClick,
}: CommentButtonProps): React.ReactNode {
  const { count } = useCommentCount({ contentType, contentId })

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      aria-label={`Open comments (${count})`}
      className="group inline-flex items-center gap-1.5 text-gray-500 hover:text-[var(--vh-green-500)] transition-colors duration-200"
    >
      <span className="relative inline-flex items-center justify-center">
        <MessageCircleMore
          className="w-[18px] h-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-90"
          strokeWidth={2}
        />
      </span>

      <span className="text-xs font-semibold tabular-nums tracking-tight">
        {count > 0 ? formatCount(count) : ''}
      </span>
    </button>
  )
}