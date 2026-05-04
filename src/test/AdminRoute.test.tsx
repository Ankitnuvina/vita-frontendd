import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('@/lib/axios', () => ({
  apiClient: { post: vi.fn(), get: vi.fn() },
  registerAuthFailureHandler: vi.fn(),
}))

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    adminLogin: vi.fn(),
    adminRegister: vi.fn(),
    logout: vi.fn(),
    fetchMe: vi.fn(),
    refresh: vi.fn(),
  },
}))

import { AdminRoute } from '@/router/AdminRoute'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/globals/enums'

function renderAt(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div>HOME</div>} />
        <Route path="/admin/login" element={<div>ADMIN_LOGIN</div>} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div>ADMIN</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
  })

  it('redirects unauthenticated users to /admin/login', () => {
    renderAt('/admin')
    expect(screen.getByText('ADMIN_LOGIN')).toBeInTheDocument()
    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument()
  })

  it('redirects authenticated non-admin users to /admin/login', () => {
    useAuthStore.setState({
      user: { userId: 'user-1', role: UserRole.USER },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    renderAt('/admin')
    expect(screen.getByText('ADMIN_LOGIN')).toBeInTheDocument()
    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument()
  })

  it('renders admin content for admin users', () => {
    useAuthStore.setState({
      user: { userId: 'admin-1', role: UserRole.ADMIN },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    renderAt('/admin')
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('shows loading skeleton while auth state is loading', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: true, error: null })
    renderAt('/admin')
    expect(screen.queryByText('HOME')).not.toBeInTheDocument()
    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument()
  })
})
