import { describe, it, expect, beforeEach, vi } from 'vitest'

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

vi.mock('@/lib/axios', () => ({
  apiClient: { post: vi.fn(), get: vi.fn() },
  registerAuthFailureHandler: vi.fn(),
}))

import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/features/auth/services/auth.service'
import { UserRole } from '@/globals/enums'
import { ApiError } from '@/lib/errors'

const mockedLogin = authService.login as unknown as ReturnType<typeof vi.fn>
const mockedRegister = authService.register as unknown as ReturnType<typeof vi.fn>
const mockedAdminLogin = authService.adminLogin as unknown as ReturnType<typeof vi.fn>
const mockedAdminRegister = authService.adminRegister as unknown as ReturnType<typeof vi.fn>
const mockedLogout = authService.logout as unknown as ReturnType<typeof vi.fn>
const mockedFetchMe = authService.fetchMe as unknown as ReturnType<typeof vi.fn>

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    mockedLogin.mockReset()
    mockedRegister.mockReset()
    mockedAdminLogin.mockReset()
    mockedAdminRegister.mockReset()
    mockedLogout.mockReset()
    mockedFetchMe.mockReset()
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('sets user and authenticates on successful login', async () => {
    mockedLogin.mockResolvedValue({ userId: 'admin-1', role: UserRole.ADMIN })
    await useAuthStore.getState().login('admin', 'pw')
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual({ userId: 'admin-1', role: UserRole.ADMIN })
    expect(state.error).toBeNull()
    expect(state.isLoading).toBe(false)
  })

  it('sets a friendly error on failed login', async () => {
    mockedLogin.mockRejectedValue(new ApiError('Bad credentials', 401, 'HTTP_401'))
    await useAuthStore.getState().login('admin', 'wrong')
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBeTruthy()
    expect(state.isLoading).toBe(false)
  })

  it('clears error via clearError()', async () => {
    mockedLogin.mockRejectedValue(new ApiError('Bad creds', 401, 'HTTP_401'))
    await useAuthStore.getState().login('admin', 'wrong')
    expect(useAuthStore.getState().error).toBeTruthy()
    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('logout clears user state and calls service', async () => {
    useAuthStore.setState({
      user: { userId: 'admin-1', role: UserRole.ADMIN },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
    mockedLogout.mockResolvedValue(undefined)
    await useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(mockedLogout).toHaveBeenCalled()
  })

  it('fetchMe restores user when service returns one', async () => {
    mockedFetchMe.mockResolvedValue({ userId: 'user-1', role: UserRole.USER })
    await useAuthStore.getState().fetchMe()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual({ userId: 'user-1', role: UserRole.USER })
    expect(state.isLoading).toBe(false)
  })

  it('fetchMe leaves user null when service returns null (401)', async () => {
    mockedFetchMe.mockResolvedValue(null)
    await useAuthStore.getState().fetchMe()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.isLoading).toBe(false)
  })

  it('register signs the user in on success', async () => {
    mockedRegister.mockResolvedValue({ userId: 'user-9', role: UserRole.USER })
    const result = await useAuthStore.getState().register('newuser',  'newuser@example.com', 'secret123')
    const state = useAuthStore.getState()
    expect(result).toEqual({ userId: 'user-9', role: UserRole.USER })
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual({ userId: 'user-9', role: UserRole.USER })
  })

  it('register surfaces a friendly error and returns null on conflict', async () => {
    mockedRegister.mockRejectedValue(new ApiError('Username is already taken', 409, 'HTTP_409'))
    const result = await useAuthStore.getState().register('newuser',  'newuser@example.com', 'secret123')
    const state = useAuthStore.getState()
    expect(result).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBeTruthy()
  })

  it('adminLogin authenticates as admin', async () => {
    mockedAdminLogin.mockResolvedValue({ userId: 'admin-2', role: UserRole.ADMIN })
    const result = await useAuthStore.getState().adminLogin('admin', 'pw')
    expect(result?.role).toBe(UserRole.ADMIN)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('adminLogin returns null and sets error when role is rejected', async () => {
    mockedAdminLogin.mockRejectedValue(
      new ApiError('This account does not have admin access', 403, 'HTTP_403')
    )
    const result = await useAuthStore.getState().adminLogin('reader', 'pw')
    expect(result).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().error).toBeTruthy()
  })

  it('adminRegister creates an admin session on success', async () => {
    mockedAdminRegister.mockResolvedValue({ userId: 'admin-9', role: UserRole.ADMIN })
    const result = await useAuthStore
      .getState()
      .adminRegister('newadmin',  'newuser@example.com', 'secret123', 'invite')
    // expect(result?.role).toBe(UserRole.ADMIN)
    expect(result).toBe(true)
    expect(useAuthStore.getState().user?.userId).toBe('admin-9')
  })

  it('adminRegister surfaces an error on bad invite code', async () => {
    mockedAdminRegister.mockRejectedValue(
      new ApiError('Invalid admin invite code', 403, 'HTTP_403')
    )
    const result = await useAuthStore
      .getState()
      .adminRegister('newadmin',  'newuser@example.com', 'secret123', 'wrong')
    expect(result).toBeNull()
    expect(useAuthStore.getState().error).toBeTruthy()
  })
})
