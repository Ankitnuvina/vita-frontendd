import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError, getUserFriendlyMessage } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { paginatedSchema, podcastSchema } from '@/globals/schemas'
import { PODCASTS_QUERY_KEY } from '@/features/podcasts/hooks/usePodcasts'
import { ADMIN_STATS_QUERY_KEY } from '@/features/admin/hooks/useAdminStats'
import { useToastStore } from '@/store/toast.store'
import type { Podcast, PaginatedResponse } from '@/globals/types'

const responseSchema = paginatedSchema(podcastSchema)
const itemSchema = podcastSchema

export type PodcastInput = Omit<Podcast, 'id'>

export const ADMIN_PODCASTS_QUERY_KEY = ['admin-podcasts'] as const

async function fetchAdminPodcasts(): Promise<PaginatedResponse<Podcast>> {
  const res = await apiClient.get(API_ENDPOINTS.ADMIN.PODCASTS, { params: { pageSize: 100 } })
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useAdminPodcasts] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useAdminPodcasts() {
  return useQuery({
    queryKey: ADMIN_PODCASTS_QUERY_KEY,
    queryFn: fetchAdminPodcasts,
    staleTime: 1000 * 30,
  })
}

function invalidatePodcastCaches(qc: ReturnType<typeof useQueryClient>): void {
  void qc.invalidateQueries({ queryKey: ADMIN_PODCASTS_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: PODCASTS_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY })
}

export function useCreatePodcast() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (input: PodcastInput): Promise<Podcast> => {
      const res = await apiClient.post(API_ENDPOINTS.ADMIN.PODCASTS, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidatePodcastCaches(qc)
      addToast({ type: 'success', message: 'Podcast created' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useUpdatePodcast() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: Partial<PodcastInput> }): Promise<Podcast> => {
      const res = await apiClient.put(`${API_ENDPOINTS.ADMIN.PODCASTS}/${id}`, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidatePodcastCaches(qc)
      addToast({ type: 'success', message: 'Podcast updated' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useDeletePodcast() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`${API_ENDPOINTS.ADMIN.PODCASTS}/${id}`)
    },
    onSuccess: () => {
      invalidatePodcastCaches(qc)
      addToast({ type: 'success', message: 'Podcast deleted' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}
