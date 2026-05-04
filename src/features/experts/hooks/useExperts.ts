import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { expertSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { Expert } from '@/globals/types'

const responseSchema = z.array(expertSchema)

export const EXPERTS_QUERY_KEY = ['experts'] as const

async function fetchExperts(): Promise<Expert[]> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.EXPERTS)
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useExperts] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useExperts() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: EXPERTS_QUERY_KEY,
    queryFn: fetchExperts,
    staleTime: 1000 * 60 * 30,
    enabled: isAuthenticated,
  })
}
