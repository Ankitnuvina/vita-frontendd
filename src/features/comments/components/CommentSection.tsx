import React from 'react'
import { useComments, type CommentRecord } from '../hooks/useComments'
import { CommentList } from './CommentList'
import { CommentInput } from './CommentInput'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'

interface CommentSectionProps {
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string | number
  hideInput?: boolean
}


export function CommentSection({
  contentType,
  contentId,
  hideInput = false,
}: CommentSectionProps): React.ReactNode {
  const { user } = useAuthStore()
  const addToast = useToastStore((s) => s.addToast)
  const {
    comments,
    total,
    isLoading,
    isSubmitting,
    addComment,
    editComment,
    deleteComment,
    loadMore,
  } = useComments({ contentType, contentId })

  return (
    <div className="flex flex-col gap-5">
      {!hideInput && (
        user ? (
          <CommentInput
            onSubmit={addComment}
            isSubmitting={isSubmitting}
            placeholder="Share your thoughts…"
          />
        ) : (
          <button
            type="button"
            onClick={() => addToast({ type: 'warning', message: 'Please login to comment.' })}
            className="w-full text-left px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-400 hover:border-[var(--vh-green-300)] hover:bg-white transition-all cursor-text"
          >
            Sign in to join the conversation…
          </button>
        )
      )}

      {!hideInput && total > 0 && <div className="border-t border-gray-100" />}

      <CommentList
        comments={comments as CommentRecord[]}
        total={total}
        isLoading={isLoading}
        onEdit={editComment}
        onDelete={deleteComment}
        onLoadMore={loadMore}
      />
    </div>
  )
}
