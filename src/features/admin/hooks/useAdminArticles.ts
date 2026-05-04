import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError, getUserFriendlyMessage } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { articleSchema, paginatedSchema } from '@/globals/schemas'
import { ARTICLES_QUERY_KEY } from '@/features/articles/hooks/useArticles'
import { ADMIN_STATS_QUERY_KEY } from '@/features/admin/hooks/useAdminStats'
import { useToastStore } from '@/store/toast.store'
import type { Article, PaginatedResponse } from '@/globals/types'

const responseSchema = paginatedSchema(articleSchema)
const itemSchema = articleSchema

export type ArticleInput = Omit<Article, 'id'>

export const ADMIN_ARTICLES_QUERY_KEY = ['admin-articles'] as const

async function fetchAdminArticles(): Promise<PaginatedResponse<Article>> {
  const res = await apiClient.get(API_ENDPOINTS.ADMIN.ARTICLES, {
    params: { pageSize: 100 },
  })
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useAdminArticles] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useAdminArticles() {
  return useQuery({
    queryKey: ADMIN_ARTICLES_QUERY_KEY,
    queryFn: fetchAdminArticles,
    staleTime: 1000 * 30,
  })
}

function invalidateArticleCaches(qc: ReturnType<typeof useQueryClient>): void {
  void qc.invalidateQueries({ queryKey: ADMIN_ARTICLES_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: ARTICLES_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY })
}

export function useCreateArticle() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (input: ArticleInput): Promise<Article> => {
      const res = await apiClient.post(API_ENDPOINTS.ADMIN.ARTICLES, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidateArticleCaches(qc)
      addToast({ type: 'success', message: 'Article created' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useUpdateArticle() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: Partial<ArticleInput> }): Promise<Article> => {
      const res = await apiClient.put(`${API_ENDPOINTS.ADMIN.ARTICLES}/${id}`, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidateArticleCaches(qc)
      addToast({ type: 'success', message: 'Article updated' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useDeleteArticle() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`${API_ENDPOINTS.ADMIN.ARTICLES}/${id}`)
    },
    onSuccess: () => {
      invalidateArticleCaches(qc)
      addToast({ type: 'success', message: 'Article deleted' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}
