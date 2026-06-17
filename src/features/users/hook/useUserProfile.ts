import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/globals/api-endpoints'

export interface UserProfile {
  userId: string
  username: string
  email: string
  role: string
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
}

export function useUserProfile(enabled: boolean) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = () => {
    if (!enabled) return
    setLoading(true)
    apiClient.get<UserProfile>(API_ENDPOINTS.USER.PROFILE)
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProfile()
  }, [enabled])

  const updateProfile = async (data: { username?: string; email?: string }) => {
    const res = await apiClient.patch<UserProfile>(API_ENDPOINTS.USER.PROFILE, data)
    setProfile(res.data)
    return res.data
  }

  const uploadAvatar = async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await apiClient.post<{ avatarUrl: string }>(
      API_ENDPOINTS.USER.AVATAR,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    setProfile((prev) => prev ? { ...prev, avatarUrl: res.data.avatarUrl } : prev)
    return res.data.avatarUrl
  }

  const deleteAccount = async () => {
    await apiClient.delete(API_ENDPOINTS.USER.DELETE)
  }

  return { profile, loading, fetchProfile, updateProfile, uploadAvatar, deleteAccount }
}