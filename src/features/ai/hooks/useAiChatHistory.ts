import { useEffect, useState, useCallback } from 'react'
import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import type { ChatSession } from '@/globals'

export function useAiChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(() => {
    setLoading(true)
    apiClient.get<ChatSession[]>(API_ENDPOINTS.CHAT_HISTORY)
      .then((res) => setSessions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const renameSession = useCallback(async (sessionId: string, newTitle: string) => {
    await apiClient.patch(API_ENDPOINTS.CHAT_RENAME(sessionId), { title: newTitle })
    setSessions((prev) =>
      prev.map((s) => s.sessionId === sessionId ? { ...s, title: newTitle } : s)
    )
  }, [])

  const deleteSession = useCallback(async (sessionId: string) => {
    await apiClient.delete(API_ENDPOINTS.CHAT_DELETE(sessionId))
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId))
  }, [])

  const pinSession = useCallback(async (sessionId: string, pin: boolean) => {
  await apiClient.patch(API_ENDPOINTS.CHAT_PIN(sessionId), { pin })
  setSessions((prev) =>
    prev.map((s) =>
      s.sessionId === sessionId
        ? { ...s, pinnedAt: pin ? new Date().toISOString() : null }
        : s
    )
  )
}, [])

  return { sessions, loading, fetchSessions, renameSession, deleteSession, pinSession }
}