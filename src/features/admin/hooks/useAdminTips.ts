import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError, getUserFriendlyMessage } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { paginatedSchema, wellnessTipSchema } from '@/globals/schemas'
import { TIPS_QUERY_KEY } from '@/features/ai/hooks/useWellnessTips'
import { useToastStore } from '@/store/toast.store'
import type { PaginatedResponse, WellnessTip } from '@/globals/types'

const responseSchema = paginatedSchema(wellnessTipSchema)
const itemSchema = wellnessTipSchema

export type TipInput = Omit<WellnessTip, 'id'>

export const ADMIN_TIPS_QUERY_KEY = ['admin-tips'] as const

async function fetchAdminTips(): Promise<PaginatedResponse<WellnessTip>> {
  const res = await apiClient.get(API_ENDPOINTS.ADMIN.TIPS, { params: { pageSize: 100 } })
  const parsed = responseSchema.safeParse(res.data)
  if (!parsed.success) {
    logger.error('[useAdminTips] Invalid response shape', parsed.error.flatten())
    throw new ApiError('Invalid response shape', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export function useAdminTips() {
  return useQuery({
    queryKey: ADMIN_TIPS_QUERY_KEY,
    queryFn: fetchAdminTips,
    staleTime: 1000 * 30,
  })
}

function invalidateTipCaches(qc: ReturnType<typeof useQueryClient>): void {
  void qc.invalidateQueries({ queryKey: ADMIN_TIPS_QUERY_KEY })
  void qc.invalidateQueries({ queryKey: TIPS_QUERY_KEY })
}

export function useCreateTip() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (input: TipInput): Promise<WellnessTip> => {
      const res = await apiClient.post(API_ENDPOINTS.ADMIN.TIPS, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidateTipCaches(qc)
      addToast({ type: 'success', message: 'Tip created' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useUpdateTip() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: Partial<TipInput> }): Promise<WellnessTip> => {
      const res = await apiClient.put(`${API_ENDPOINTS.ADMIN.TIPS}/${id}`, input)
      const parsed = itemSchema.safeParse(res.data)
      if (!parsed.success) throw new ApiError('Invalid response', 500, 'INVALID_RESPONSE')
      return parsed.data
    },
    onSuccess: () => {
      invalidateTipCaches(qc)
      addToast({ type: 'success', message: 'Tip updated' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}

export function useDeleteTip() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`${API_ENDPOINTS.ADMIN.TIPS}/${id}`)
    },
    onSuccess: () => {
      invalidateTipCaches(qc)
      addToast({ type: 'success', message: 'Tip deleted' })
    },
    onError: (error) => {
      addToast({ type: 'error', message: getUserFriendlyMessage(error) })
    },
  })
}
