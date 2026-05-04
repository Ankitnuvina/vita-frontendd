import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { featureFlagsSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { FeatureFlags } from '@/globals/types'

const DEFAULT_FLAGS: FeatureFlags = {
  aiEnabled: true,
  podcastsEnabled: true,
  videosEnabled: true,
}

async function fetchFeatureFlags(): Promise<FeatureFlags> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.FEATURE_FLAGS)
  const parsed = featureFlagsSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useFeatureFlags] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useFeatureFlags() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const query = useQuery({
    queryKey: ['feature-flags'],
    queryFn: fetchFeatureFlags,
    staleTime: 1000 * 60 * 10,
    enabled: isAuthenticated,
  })
  return { ...query, flags: query.data ?? DEFAULT_FLAGS }
}
