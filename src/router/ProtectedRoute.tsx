import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { PageSkeleton } from '@/components/common/PageSkeleton'

export function ProtectedRoute(): React.ReactNode {
  const isLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isLoading) return <PageSkeleton />
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}
