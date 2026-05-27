import React, { useState, useEffect, useRef } from 'react'
import { MoreHorizontal, Pencil, Trash2} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { CommentInput } from './CommentInput'
import type { CommentRecord } from '../hooks/useComments'

interface CommentItemProps {
  comment: CommentRecord
  onEdit: (commentId: string, text: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

const AVATAR_PALETTE = [
  'from-violet-400 to-purple-500',
  'from-sky-400 to-indigo-500',
  'from-emerald-400 to-green-600',
  'from-orange-400 to-amber-500',
  'from-pink-400 to-rose-500',
  'from-teal-400 to-cyan-500',
  'from-fuchsia-400 to-pink-500',
  'from-yellow-400 to-orange-500',
]

function hashSeed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function fullTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CommentItem({ comment, onEdit, onDelete }: CommentItemProps): React.ReactNode {
  const { user } = useAuthStore()
  const isOwner = user?.userId === comment.userId
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const avatarColor = AVATAR_PALETTE[hashSeed(comment.userId || comment.userName) % AVATAR_PALETTE.length]
  const initial = comment.userName?.[0]?.toUpperCase() ?? 'U'

  const handleEdit = async (text: string) => {
    setIsSubmitting(true)
    try { await onEdit(comment.id, text) } finally {
      setIsSubmitting(false)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try { await onDelete(comment.id) } catch { setIsDeleting(false) }
  }

  return (
    <div className="group flex gap-3 items-start animate-fade-in">
      {/* Avatar */}
      <div
        className={`relative w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm ring-2 ring-white`}
        aria-hidden
      >
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <CommentInput
            onSubmit={handleEdit}
            isSubmitting={isSubmitting}
            defaultValue={comment.text}
            submitLabel="Save"
            autoFocus
            hideAvatar
            compact
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="inline-block max-w-full bg-gray-100 rounded-2xl rounded-tl-md px-3.5 py-2 transition-colors hover:bg-gray-100/80">
              <p className="text-[14px] text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-1 px-1 text-[11px] text-gray-400">
              <time
                title={fullTimestamp(comment.createdAt)}
                className="font-medium tabular-nums"
              >
                {timeAgo(comment.createdAt)}
              </time>
              {comment.updatedAt && (
                <span className="italic" title={`Edited ${fullTimestamp(comment.updatedAt)}`}>
                  edited
                </span>
              )}
            </div>

            {/* Inline delete confirm */}
            {confirmDelete && (
              <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                <span className="text-[12px] text-red-700 font-medium flex-1">
                  Delete this comment ?
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                  className="bg-white text-[11px] font-semibold px-2.5 py-1 rounded-full text-gray-600 hover:bg-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isDeleting}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 3-dot menu (owner only) */}
      {isOwner && !isEditing && !confirmDelete && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Comment actions"
            aria-expanded={menuOpen}
            className={[
              'p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all',
              menuOpen ? 'opacity-100 bg-gray-100 text-gray-700' : 'opacity-0 group-hover:opacity-100 focus:opacity-100',
            ].join(' ')}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-9 z-30 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[140px] animate-zoom-in origin-top-right"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => { setIsEditing(true); setMenuOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => { setMenuOpen(false); setConfirmDelete(true) }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
