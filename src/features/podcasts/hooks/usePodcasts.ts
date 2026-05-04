import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { podcastSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { Podcast } from '@/globals/types'

const responseSchema = z.array(podcastSchema)

export const PODCASTS_QUERY_KEY = ['podcasts'] as const

async function fetchPodcasts(): Promise<Podcast[]> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.PODCASTS)
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[usePodcasts] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function usePodcasts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: PODCASTS_QUERY_KEY,
    queryFn: fetchPodcasts,
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  })
}
