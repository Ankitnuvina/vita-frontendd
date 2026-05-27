import React from 'react'
import { Loader2, ChevronDown, MessageSquareDashed } from 'lucide-react'
import { CommentItem } from './CommentItem'
import type { CommentRecord } from '../hooks/useComments'

interface CommentListProps {
  comments: CommentRecord[]
  total: number
  isLoading: boolean
  onEdit: (commentId: string, text: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  onLoadMore: () => void
}

function CommentSkeleton(): React.ReactNode {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-9 h-9 rounded-full vh-skeleton shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="vh-skeleton h-[42px] w-[80%] rounded-2xl" />
        <div className="vh-skeleton h-3 w-16 rounded-full" />
      </div>
    </div>
  )
}

function EmptyState(): React.ReactNode {
  return (
    <div className="flex flex-col items-center text-center py-12 px-4 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-[var(--vh-green-100)] rounded-full blur-2xl opacity-60" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--vh-green-50)] to-[var(--vh-green-100)] border border-[var(--vh-green-100)] flex items-center justify-center">
          <MessageSquareDashed className="w-7 h-7 text-[var(--vh-green-500)]" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-gray-800">
        No comments yet
      </h3>     
    </div>
  )
}

export function CommentList({
  comments,
  total,
  isLoading,
  onEdit,
  onDelete,
  onLoadMore,
}: CommentListProps): React.ReactNode {
  const hasMore = comments.length < total
  const isInitialLoading = isLoading && comments.length === 0

  if (isInitialLoading) {
    return (
      <div className="flex flex-col gap-6 py-2">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    )
  }

  if (!isLoading && comments.length === 0) return <EmptyState />

  const remaining = total - comments.length

  return (
    <div className="flex flex-col gap-5">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onEdit={onEdit} onDelete={onDelete} />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          className="self-center mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--vh-green-600)] hover:text-[var(--vh-green-700)] bg-[var(--vh-green-50)] hover:bg-[var(--vh-green-100)] border border-[var(--vh-green-100)] rounded-full px-4 py-1.5 transition-all duration-200 disabled:opacity-60"
        >
          {isLoading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <ChevronDown className="w-3.5 h-3.5" />
          }
          {isLoading ? 'Loading…' : `View ${remaining} more ${remaining === 1 ? 'comment' : 'comments'}`}
        </button>
      )}
    </div>
  )
}
