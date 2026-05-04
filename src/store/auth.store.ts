import { create } from 'zustand'
import { authService } from '@/features/auth/services/auth.service'
import { logger } from '@/lib/logger'
import { getUserFriendlyMessage } from '@/lib/errors'
import { registerAuthFailureHandler } from '@/lib/axios'
import type { AuthState, AuthUser } from '@/globals/auth.types'

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<AuthUser | null>
  register: (username: string, password: string) => Promise<AuthUser | null>
  adminLogin: (username: string, password: string) => Promise<AuthUser | null>
  adminRegister: (
    username: string,
    password: string,
    inviteCode: string
  ) => Promise<AuthUser | null>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  clearError: () => void
}

async function runAuthAction(
  set: (s: Partial<AuthState>) => void,
  label: string,
  action: () => Promise<AuthUser>
): Promise<AuthUser | null> {
  set({ isLoading: true, error: null })
  try {
    const user = await action()
    logger.info(`[AuthStore] ${label} succeeded for userId: ${user.userId}`)
    set({ user, isAuthenticated: true, isLoading: false, error: null })
    return user
  } catch (error) {
    const message = getUserFriendlyMessage(error)
    logger.warn(`[AuthStore] ${label} failed`, { message })
    set({ user: null, isAuthenticated: false, isLoading: false, error: message })
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: (username, password) =>
    runAuthAction(set, 'Login', () => authService.login(username, password)),

  register: (username, password) =>
    runAuthAction(set, 'Register', () => authService.register(username, password)),

  adminLogin: (username, password) =>
    runAuthAction(set, 'AdminLogin', () => authService.adminLogin(username, password)),

  adminRegister: (username, password, inviteCode) =>
    runAuthAction(set, 'AdminRegister', () =>
      authService.adminRegister(username, password, inviteCode)
    ),

  logout: async () => {
    const previousUserId = useAuthStore.getState().user?.userId ?? 'unknown'
    set({ isLoading: true })
    await authService.logout()
    logger.info(`[AuthStore] Logged out userId: ${previousUserId}`)
    set({ user: null, isAuthenticated: false, isLoading: false, error: null })
  },

  fetchMe: async () => {
    set({ isLoading: true })
    const user = await authService.fetchMe()
    if (user) {
      logger.info(`[AuthStore] Session restored for userId: ${user.userId}`)
      set({ user, isAuthenticated: true, isLoading: false, error: null })
    } else {
      logger.debug('[AuthStore] No active session')
      set({ user: null, isAuthenticated: false, isLoading: false, error: null })
    }
  },

  clearError: () => set({ error: null }),
}))

registerAuthFailureHandler(() => {
  logger.info('[AuthStore] Auth failure handler triggered — clearing session')
  useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
})
