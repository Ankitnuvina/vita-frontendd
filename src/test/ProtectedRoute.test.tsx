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

import { ProtectedRoute } from '@/router/ProtectedRoute'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/globals/enums'

function renderAt(path: string): void {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div>HOME</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/secret" element={<div>SECRET</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
  })

  it('redirects unauthenticated users to /', () => {
    renderAt('/secret')
    expect(screen.getByText('HOME')).toBeInTheDocument()
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument()
  })

  it('shows skeleton while auth state is loading', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: true, error: null })
    renderAt('/secret')
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument()
    expect(screen.queryByText('HOME')).not.toBeInTheDocument()
  })

  it('renders protected content when authenticated', () => {
    useAuthStore.setState({
      user: { userId: 'user-1', role: UserRole.USER },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    renderAt('/secret')
    expect(screen.getByText('SECRET')).toBeInTheDocument()
  })
})
