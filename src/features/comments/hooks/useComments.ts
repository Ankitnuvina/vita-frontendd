import { useState, useEffect, useCallback } from 'react'
import { useToastStore } from '@/store/toast.store'
import { useAuthStore } from '@/store/auth.store'
import { setCachedCommentCount } from './useCommentCount'

const API = import.meta.env.VITE_API_BASE_URL

export interface CommentRecord {
  id: string
  userId: string
  userName: string
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string
  text: string
  createdAt: string
  updatedAt?: string
}

interface UseCommentsReturn {
  comments: CommentRecord[]
  total: number
  isLoading: boolean
  isSubmitting: boolean
  addComment: (text: string) => Promise<void>
  editComment: (commentId: string, text: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  loadMore: () => void
}

export function useComments({
  contentType,
  contentId,
}: {
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string | number
}): UseCommentsReturn {
  const id = String(contentId)
  const { user } = useAuthStore()
  const addToast = useToastStore((s) => s.addToast)

  const [comments, setComments] = useState<CommentRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchComments = useCallback(
    async (pageNum: number, replace: boolean) => {
      setIsLoading(true)
      try {
        const res = await fetch(
          `${API}/api/comments/${contentType}/${id}?page=${pageNum}&pageSize=20`,
          { credentials: 'include' }
        )
        if (!res.ok) throw new Error('Failed')
        const data = await res.json() as {
          comments: CommentRecord[]
          total: number
        }
        setComments((prev) => (replace ? data.comments : [...prev, ...data.comments]))
        setTotal(data.total)
        setCachedCommentCount(contentType, id, data.total, user?.userId)
      } catch {
        addToast({ type: 'error', message: 'Comments load error.' })
      } finally {
        setIsLoading(false)
      }
    },
    [contentType, id, addToast, user?.userId]
  )

  useEffect(() => {
    setComments([])
    setPage(1)
    void fetchComments(1, true)
  }, [contentType, id, fetchComments])

  const addComment = useCallback(
    async (text: string) => {
      if (!user) {
        addToast({ type: 'warning', message: 'Login to first' })
        return
      }
      setIsSubmitting(true)
      try {
        const res = await fetch(`${API}/api/comments/${contentType}/${id}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (!res.ok) throw new Error('Failed')
        const newComment = await res.json() as CommentRecord
        setComments((prev) => [newComment, ...prev])
        setTotal((t) => {
          const next = t + 1
          setCachedCommentCount(contentType, id, next, user.userId)
          return next
        })
      } catch {
        addToast({ type: 'error', message: 'Comment post fail.' })
      } finally {
        setIsSubmitting(false)
      }
    },
    [user, contentType, id, addToast]
  )

  const editComment = useCallback(
    async (commentId: string, text: string) => {
      try {
        const res = await fetch(`${API}/api/comments/${commentId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (!res.ok) throw new Error('Failed')
        const updated = await res.json() as CommentRecord
        setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)))
      } catch {
        addToast({ type: 'error', message: 'Update fail' })
      }
    },
    [addToast]
  )

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const res = await fetch(`${API}/api/comments/${commentId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed')
        setComments((prev) => prev.filter((c) => c.id !== commentId))
        setTotal((t) => {
          const next = Math.max(0, t - 1)
          setCachedCommentCount(contentType, id, next, user?.userId)
          return next
        })
      } catch {
        addToast({ type: 'error', message: 'Delete fail' })
      }
    },
    [addToast, contentType, id, user?.userId]
  )

  const loadMore = useCallback(() => {
    const next = page + 1
    setPage(next)
    void fetchComments(next, false)
  }, [page, fetchComments])

  return {
    comments,
    total,
    isLoading,
    isSubmitting,
    addComment,
    editComment,
    deleteComment,
    loadMore,
  }
}