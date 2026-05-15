import { useQuery } from '@tanstack/react-query'
import { getLikesAnalytics } from './adminLikes'

export function useLikesAnalytics(filters?: {
  user?: string
  contentType?: string
}) {
  return useQuery({
    queryKey: ['likes-analytics', filters],
    queryFn: () => getLikesAnalytics(filters),
  })
}