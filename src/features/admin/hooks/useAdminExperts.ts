import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError, getUserFriendlyMessage } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { expertSchema, paginatedSchema } from '@/globals/schemas'
import { EXPERTS_QUERY_KEY } from '@/features/experts/hooks/useExperts'
import { ADMIN_STATS_QUERY_KEY } from '@/features/admin/hooks/useAdminStats'
import { useToastStore } from '@/store/toast.store'
import type { Expert, PaginatedResponse } from '@/globals/types'

const responseSchema = paginatedSchema(expertSchema)
const itemSchema = expertSchema

export type ExpertInput = Omit<Expert, 'id'>

export const ADMIN_EXPERTS_QUERY_KEY = ['admin-experts'] as const

async function fetchAdminExperts(): Promise<PaginatedResponse<Expert>> {
  const res = await apiClient.get(API_ENDPOINTS.ADMIN.EXPERTS, { params: { pageSize: 100 } })
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useAdminExperts] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useAdminExperts() {
  return useQuery({
    queryKey: ADMIN_EXPERTS_QUERY_KEY,
    queryFn: fetchAdminExperts,
    staleTime: 1000 * 30,
  })
}

function invalidateExpertCaches(qc: ReturnType<typeof useQueryClient>): void {
  void qc.invalidateQueries({ queryKey: ADMIN_EXPERTS_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: EXPERTS_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: ADMIN_STATS_QUERY_KEY })
}

export function useCreateExpert() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (input: ExpertInput): Promise<Expert> => {
      const res = await apiClient.post(API_ENDPOINTS.ADMIN.EXPERTS, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidateExpertCaches(qc)
      addToast({ type: 'success', message: 'Expert created' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useUpdateExpert() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: Partial<ExpertInput> }): Promise<Expert> => {
      const res = await apiClient.put(`${API_ENDPOINTS.ADMIN.EXPERTS}/${id}`, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidateExpertCaches(qc)
      addToast({ type: 'success', message: 'Expert updated' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useDeleteExpert() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`${API_ENDPOINTS.ADMIN.EXPERTS}/${id}`)
    },
    onSuccess: () => {
      invalidateExpertCaches(qc)
      addToast({ type: 'success', message: 'Expert deleted' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}
