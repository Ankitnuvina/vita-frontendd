import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { wellnessTipSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { WellnessTip } from '@/globals/types'

const responseSchema = z.array(wellnessTipSchema)

export const TIPS_QUERY_KEY = ['tips'] as const

async function fetchTips(): Promise<WellnessTip[]> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.TIPS)
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useWellnessTips] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useWellnessTips() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: TIPS_QUERY_KEY,
    queryFn: fetchTips,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: isAuthenticated,
  })
}
