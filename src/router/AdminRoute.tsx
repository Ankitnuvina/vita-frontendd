import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/globals/enums'
import { PageSkeleton } from '@/components/common/PageSkeleton'

export function AdminRoute(): React.ReactNode {
  const isLoading = useAuthStore((state) => state.isLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  if (isLoading) return <PageSkeleton />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (user?.role !== UserRole.ADMIN) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
