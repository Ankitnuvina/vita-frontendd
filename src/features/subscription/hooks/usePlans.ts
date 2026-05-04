import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { subscriptionPlanSchema } from '@/globals/schemas'
import { useAuthStore } from '@/store/auth.store'
import type { SubscriptionPlan } from '@/globals/types'

const responseSchema = z.array(subscriptionPlanSchema)

export const PLANS_QUERY_KEY = ['plans'] as const

async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const res = await apiClient.get(API_ENDPOINTS.CONTENT.PLANS)
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[usePlans] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function usePlans() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: PLANS_QUERY_KEY,
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 10,
    enabled: isAuthenticated,
  })
}
