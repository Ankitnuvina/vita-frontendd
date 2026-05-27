import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>
  isSubmitting: boolean
  placeholder?: string
  autoFocus?: boolean
  defaultValue?: string
  submitLabel?: string
  onCancel?: () => void
  hideAvatar?: boolean
  compact?: boolean
}

const AVATAR_PALETTE = [
  'from-violet-400 to-purple-500',
  'from-sky-400 to-indigo-500',
  'from-emerald-400 to-green-600',
  'from-orange-400 to-amber-500',
  'from-pink-400 to-rose-500',
  'from-teal-400 to-cyan-500',
]

function avatarColor(seed: string): string {
  const code = seed.charCodeAt(0) || 0
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length]
}

export function CommentInput({
  onSubmit,
  isSubmitting,
  placeholder = 'Add a comment…',
  autoFocus = false,
  defaultValue = '',
  submitLabel = 'Post',
  onCancel,
  hideAvatar = false,
  compact = false,
}: CommentInputProps): React.ReactNode {
  const [text, setText] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [text])

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed || isSubmitting) return
    await onSubmit(trimmed)
    setText('')
  }

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    void handleSubmit()
  }
  if (e.key === 'Escape') {
    onCancel?.()
  }
}

  const isEmpty = text.trim().length === 0
  const canPost = !isEmpty && !isSubmitting

  const seed = user?.userId ?? 'guest'
  const initial = (user?.userId ?? 'U')[0]?.toUpperCase() ?? 'U'

  return (
    <div className="flex gap-2.5 items-start w-full">
      {!hideAvatar && (
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(seed)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm ring-2 ring-white`}
          aria-hidden
        >
          {initial}
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div
          className={[
            'comments_text_main relative',
            '',
            
          ].join(' ')}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isSubmitting}
            aria-label="Comment text"
            className={[
              'comments_text w-full bg-transparent resize-none outline-none',
              'pl-4 pr-24 py-3 text-[14px] leading-relaxed text-gray-800 placeholder:text-gray-400',
              'max-h-40 overflow-y-auto rounded-2xl disabled:opacity-50',
              compact ? 'min-h-[42px]' : 'min-h-[52px]',
            ].join(' ')}
          />

          <div className="absolute bottom-4 right-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canPost}
              aria-label={submitLabel}
              className={[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-2',
                'text-xs font-semibold transition-all duration-200',
                canPost
                  ? 'bg-[var(--vh-green-500)] text-white hover:bg-[var(--vh-green-600)] active:scale-95 shadow-sm'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed',
              ].join(' ')}
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
