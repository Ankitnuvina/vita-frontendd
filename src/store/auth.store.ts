import { create } from 'zustand'
import { authService } from '@/features/auth/services/auth.service'
import { logger } from '@/lib/logger'
import { getUserFriendlyMessage } from '@/lib/errors'
import { registerAuthFailureHandler } from '@/lib/axios'
import type { AuthState, AuthUser } from '@/globals/auth.types'

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser | null>
  register: (username: string, email: string, password: string) => Promise<boolean>
  adminLogin: (email: string, password: string) => Promise<AuthUser | null>
  adminRegister: (username: string, email: string, password: string, inviteCode: string) => Promise<boolean>
  resendVerification: (email: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  clearError: () => void
  clearSuccess: () => void
}

async function runAuthAction(
  set: (s: Partial<AuthState>) => void,
  label: string,
  action: () => Promise<AuthUser>
): Promise<AuthUser | null> {
  set({ isLoading: true, error: null, successMessage: null })
  try {
    const user = await action()
    logger.info(`[AuthStore] ${label} succeeded for userId: ${user.userId}`)
    set({ user, isAuthenticated: true, isLoading: false, error: null })
    return user
  } catch (error) {
    const message = getUserFriendlyMessage(error)
    set({ user: null, isAuthenticated: false, isLoading: false, error: message })
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  successMessage: null,

  login: (email, password) =>
    runAuthAction(set, 'Login', () => authService.login(email, password)),

  register: async (username, email, password) => {
    set({ isLoading: true, error: null, successMessage: null })
    try {
      const message = await authService.register(username, email, password)
      set({ isLoading: false, successMessage: message })
      return true
    } catch (error) {
      const message = getUserFriendlyMessage(error)
      set({ isLoading: false, error: message })
      return false
    }
  },

  adminLogin: (email, password) =>
    runAuthAction(set, 'AdminLogin', () => authService.adminLogin(email, password)),

  adminRegister: async (username, email, password, inviteCode) => {
    set({ isLoading: true, error: null, successMessage: null })
    try {
      const message = await authService.adminRegister(username, email, password, inviteCode)
      set({ isLoading: false, successMessage: message })
      return true
    } catch (error) {
      const message = getUserFriendlyMessage(error)
      set({ isLoading: false, error: message })
      return false
    }
  },

  resendVerification: async (email) => {
    set({ isLoading: true, error: null, successMessage: null })
    try {
      const message = await authService.resendVerification(email)
      set({ isLoading: false, successMessage: message })
    } catch (error) {
      const message = getUserFriendlyMessage(error)
      set({ isLoading: false, error: message })
    }
  },

  logout: async () => {
    const previousUserId = useAuthStore.getState().user?.userId ?? 'unknown'
    set({ isLoading: true })
    await authService.logout()
    logger.info(`[AuthStore] Logged out userId: ${previousUserId}`)
    set({ user: null, isAuthenticated: false, isLoading: false, error: null, successMessage: null })
  },

  fetchMe: async () => {
    set({ isLoading: true })
    const user = await authService.fetchMe()
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false, error: null })
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null })
    }
  },

  clearError: () => set({ error: null }),
  clearSuccess: () => set({ successMessage: null }),
}))

registerAuthFailureHandler(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
})