// import { useState, useEffect } from 'react'
// import { useAuthStore } from '@/store/auth.store'

// const API = import.meta.env.VITE_API_BASE_URL
// const cache = new Map<string, number>()

// function keyOf(userId: string | undefined, contentType: string, id: string): string {
//   return `${userId ?? 'guest'}:${contentType}:${id}`
// }

// const COUNT_EVENT = 'vh-comment-count:update'

// interface CountBroadcast {
//   contentType: string
//   contentId: string
//   count: number
// }

// export function setCachedCommentCount(
//   contentType: string,
//   contentId: string | number,
//   count: number,
//   userId?: string,
// ): void {
//   const id = String(contentId)
//   cache.set(keyOf(userId, contentType, id), count)
//   window.dispatchEvent(
//     new CustomEvent<CountBroadcast>(COUNT_EVENT, {
//       detail: { contentType, contentId: id, count },
//     }),
//   )
// }

// export function useCommentCount({
//   contentType,
//   contentId,
// }: {
//   contentType: string
//   contentId: string | number
// }): { count: number } {
//   const userId = useAuthStore((s) => s.user?.userId)
//   const id = String(contentId)
//   const key = keyOf(userId, contentType, id)

//   const [count, setCount] = useState<number>(() => cache.get(key) ?? 0)

//   useEffect(() => {
//     let cancelled = false

//     const cached = cache.get(key)
//     if (cached !== undefined) setCount(cached)

//     void fetch(`${API}/api/comments/${contentType}/${id}/count`, {
//       credentials: 'include',
//     })
//       .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
//       .then((data: { count: number }) => {
//         if (cancelled) return
//         if (typeof data?.count !== 'number') return
//         cache.set(key, data.count)
//         setCount(data.count)
//       })
//       .catch(() => {
//       })

//     const onBroadcast = (e: Event) => {
//       const detail = (e as CustomEvent<CountBroadcast>).detail
//       if (!detail) return
//       if (detail.contentType !== contentType) return
//       if (detail.contentId !== id) return
//       cache.set(key, detail.count)
//       setCount(detail.count)
//     }

//     window.addEventListener(COUNT_EVENT, onBroadcast)
//     return () => {
//       cancelled = true
//       window.removeEventListener(COUNT_EVENT, onBroadcast)
//     }
//   }, [key, contentType, id])

//   return { count }
// }






import { useState, useEffect } from 'react'
// import { useAuthStore } from '@/store/auth.store'

const API = import.meta.env.VITE_API_BASE_URL
const cache = new Map<string, number>()

let pendingIds: string[] = []
let pendingType = ''
let batchTimer: ReturnType<typeof setTimeout> | null = null
let resolvers = new Map<string, ((count: number) => void)[]>()

function scheduleBatch(contentType: string, contentId: string): Promise<number> {
  return new Promise((resolve) => {
    pendingType = contentType
    if (!pendingIds.includes(contentId)) pendingIds.push(contentId)

    const existing = resolvers.get(contentId) ?? []
    resolvers.set(contentId, [...existing, resolve])

    if (batchTimer) clearTimeout(batchTimer)
    batchTimer = setTimeout(async () => {
      const ids = [...pendingIds]
      const type = pendingType
      const currentResolvers = new Map(resolvers)

      pendingIds = []
      resolvers = new Map()
      batchTimer = null

      try {
        const res = await fetch(`${API}/api/comments/batch-comments`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType: type, contentIds: ids }),
        })

        if (res.ok) {
          const data = await res.json() as { counts: Record<string, number> }
          for (const id of ids) {
            const count = data.counts[id] ?? 0
            cache.set(`${type}:${id}`, count)
            currentResolvers.get(id)?.forEach((r) => r(count))
          }
        }
      } catch {
        for (const id of ids) {
          currentResolvers.get(id)?.forEach((r) => r(0))
        }
      }
    }, 50)
  })
}

const COUNT_EVENT = 'vh-comment-count:update'

interface CountBroadcast {
  contentType: string
  contentId: string
  count: number
}

export function setCachedCommentCount(
  contentType: string,
  contentId: string | number,
  count: number,
  _userId?: string,
): void {
  const id = String(contentId)
  cache.set(`${contentType}:${id}`, count)
  window.dispatchEvent(
    new CustomEvent<CountBroadcast>(COUNT_EVENT, {
      detail: { contentType, contentId: id, count },
    }),
  )
}

export function useCommentCount({
  contentType,
  contentId,
}: {
  contentType: string
  contentId: string | number
}): { count: number } {
  // const userId = useAuthStore((s) => s.user?.userId)
  const id = String(contentId)
  const cacheKey = `${contentType}:${id}`

  const [count, setCount] = useState<number>(() => cache.get(cacheKey) ?? 0)

  useEffect(() => {
    let cancelled = false

    if (cache.has(cacheKey)) {
      setCount(cache.get(cacheKey)!)
    } else {
      void scheduleBatch(contentType, id).then((c) => {
        if (!cancelled) setCount(c)
      })
    }

    const onBroadcast = (e: Event) => {
      const detail = (e as CustomEvent<CountBroadcast>).detail
      if (!detail) return
      if (detail.contentType !== contentType || detail.contentId !== id) return
      cache.set(cacheKey, detail.count)
      setCount(detail.count)
    }

    window.addEventListener(COUNT_EVENT, onBroadcast)
    return () => {
      cancelled = true
      window.removeEventListener(COUNT_EVENT, onBroadcast)
    }
  }, [cacheKey, contentType, id])

  return { count }
}