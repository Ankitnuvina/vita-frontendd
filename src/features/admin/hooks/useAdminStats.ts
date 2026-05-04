import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { adminStatsSchema } from '@/globals/schemas'
import type { AdminStats } from '@/globals/types'

async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get(API_ENDPOINTS.ADMIN.STATS)
  const parsed = adminStatsSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useAdminStats] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export const ADMIN_STATS_QUERY_KEY = ['admin-stats'] as const

export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_STATS_QUERY_KEY,
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60,
  })
}
