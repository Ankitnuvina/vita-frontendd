import React, { useEffect } from 'react'
import { X, MessageCircleMore, LogIn } from 'lucide-react'
import { useComments } from '../hooks/useComments'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import { CommentList } from './CommentList'
import { CommentInput } from './CommentInput'

interface CommentModalProps {
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string | number
  total: number
  onClose: () => void
}

export function CommentModal({
  contentType,
  contentId,
  total: initialTotal,
  onClose,
}: CommentModalProps): React.ReactNode {
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

  const displayTotal = Math.max(total, initialTotal)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const body = document.body
    const html = document.documentElement
    const scrollbarWidth = window.innerWidth - html.clientWidth

    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Comments"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ willChange: 'transform' }}
        className={[
          'relative z-10 w-full sm:max-w-xl bg-white shadow-2xl flex flex-col ',
          'overflow-hidden rounded-md',
          'h-[88vh] sm:h-auto sm:max-h-[60vh]',
          'animate-fade-up sm:animate-zoom-in',
          'border border-gray-100',
        ].join(' ')}
      >
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header — solid white, no backdrop-blur */}
        <header className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 shrink-0 bg-white sticky top-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--vh-green-50)] border border-[var(--vh-green-100)] flex items-center justify-center">
              <MessageCircleMore className="w-4 h-4 text-[var(--vh-green-500)]" strokeWidth={2.25} />
            </div>
            <div className="flex flex-col leading-tight">
              <h2 className="text-[15px] font-bold text-gray-900">Comments</h2>
              <span className="text-[11px] text-gray-500 tabular-nums">
                {displayTotal === 0
                  ? 'No comments yet'
                  : `${displayTotal.toLocaleString('en-IN')} ${displayTotal === 1 ? 'comment' : 'comments'}`}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-green-400 hover:text-neutral-700 hover:bg-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
        </header>

        {/* Scrollable comments body */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5 h-[150]">
          <CommentList
            comments={comments}
            total={total}
            isLoading={isLoading}
            onEdit={editComment}
            onDelete={deleteComment}
            onLoadMore={loadMore}
          />
        </div>

        {/* Sticky input footer — solid white, no backdrop-blur */}
        <footer className="shrink-0 border-t border-gray-100 bg-white px-4 sm:px-6 py-3 sm:py-4 rounded-md">
          {user ? (
            <CommentInput
              onSubmit={addComment}
              isSubmitting={isSubmitting}
              placeholder="Add a comment…"
            />
          ) : (
            <button
              type="button"
              onClick={() => addToast({ type: 'warning', message: 'You need to log in first.' })}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-[13px] font-medium text-gray-500 hover:border-[var(--vh-green-300)] hover:text-[var(--vh-green-600)] hover:bg-white transition-all"
            >
              <LogIn className="w-4 h-4" />
              Join the conversation
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
