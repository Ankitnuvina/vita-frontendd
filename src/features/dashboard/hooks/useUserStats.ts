import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { userStatsSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { UserStats } from '@/globals/types'

export const USER_STATS_QUERY_KEY = ['user-stats'] as const

async function fetchUserStats(): Promise<UserStats> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.USER_STATS)
  const parsed = userStatsSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useUserStats] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

interface UseUserStatsOptions {
  enabled?: boolean
}

export function useUserStats(options: UseUserStatsOptions = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const enabled = options.enabled ?? true
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: fetchUserStats,
    staleTime: 1000 * 60,
    enabled: enabled && isAuthenticated,
  })
}
