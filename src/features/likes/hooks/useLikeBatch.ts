import { useState, useEffect, useCallback } from 'react'
import { useToastStore } from '@/store/toast.store'
import { useAuthStore } from '@/store/auth.store'

const API = import.meta.env.VITE_API_BASE_URL

interface LikeState {
  liked: boolean
  count: number
}

// Global cache — page reload tak persist karta hai
const cache = new Map<string, LikeState>()
// Pending IDs — batch call ke liye queue
let pendingIds: string[] = []
let pendingType = ''
let batchTimer: ReturnType<typeof setTimeout> | null = null
let resolvers = new Map<string, ((state: LikeState) => void)[]>()

// Debounced batch fetch — 50ms mein saare IDs collect karke ek call
function scheduleBatch(contentType: string, contentId: string): Promise<LikeState> {
  return new Promise((resolve) => {
    pendingType = contentType
    if (!pendingIds.includes(contentId)) pendingIds.push(contentId)

    // Resolver register karo
    const existing = resolvers.get(contentId) ?? []
    resolvers.set(contentId, [...existing, resolve])

    // Timer reset karo
    if (batchTimer) clearTimeout(batchTimer)
    batchTimer = setTimeout(async () => {
      const ids = [...pendingIds]
      const type = pendingType
      const currentResolvers = new Map(resolvers)

      // Reset
      pendingIds = []
      resolvers = new Map()
      batchTimer = null

      try {
        const res = await fetch(`${API}/api/likes/batch`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType: type, contentIds: ids }),
        })

        if (res.ok) {
          const data = await res.json() as {
            counts: Record<string, number>
            liked: Record<string, boolean>
          }

          // Har ID ka resolver resolve karo
          for (const id of ids) {
            const state: LikeState = {
              count: data.counts[id] ?? 0,
              liked: data.liked[id] ?? false,
            }
            cache.set(`${type}:${id}`, state)
            currentResolvers.get(id)?.forEach((r) => r(state))
          }
        }
      } catch {
        // Fallback — 0 count
        for (const id of ids) {
          const state: LikeState = { count: 0, liked: false }
          currentResolvers.get(id)?.forEach((r) => r(state))
        }
      }
    }, 50)
  })
}



export function useLike({
  contentType,
  contentId,
}: {
  contentType: 'article' | 'podcast' | 'blog' | 'video'
  contentId: string | number
}) {
  const id = String(contentId)
  const cacheKey = `${contentType}:${id}`
  const { user } = useAuthStore()
   const addToast = useToastStore((s) => s.addToast)

  const [liked, setLiked] = useState(() => cache.get(cacheKey)?.liked ?? false)
  const [count, setCount] = useState(() => cache.get(cacheKey)?.count ?? 0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (cache.has(cacheKey)) return
    void scheduleBatch(contentType, id).then((state) => {
      setLiked(state.liked)
      setCount(state.count)
    })
  }, [cacheKey, contentType, id])

  const toggle = useCallback(async () => {
   
   if (!user) {
      addToast({ type: 'warning', message: 'You need to log in first.' })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API}/api/likes/${contentType}/${id}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json() as { liked: boolean; count: number }
        setLiked(data.liked)
        setCount(data.count)
        cache.set(cacheKey, { liked: data.liked, count: data.count })
      }
    } catch { /* ignore */ }
    finally { setIsLoading(false) }
  }, [contentType, id, cacheKey, user])

  return { liked, count, toggle, isLoading }
}