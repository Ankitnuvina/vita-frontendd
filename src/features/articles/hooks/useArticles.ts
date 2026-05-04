import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { articleSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { Article } from '@/globals/types'

const responseSchema = z.array(articleSchema)

export const ARTICLES_QUERY_KEY = ['articles'] as const

async function fetchArticles(): Promise<Article[]> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.ARTICLES)
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useArticles] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useArticles() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ARTICLES_QUERY_KEY,
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  })
}
