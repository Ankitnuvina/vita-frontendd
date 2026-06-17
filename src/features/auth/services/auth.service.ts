// import { apiClient } from '@/lib/axios'
// import { logger } from '@/lib/logger'
// import { ApiError } from '@/lib/errors'
// import { API_ENDPOINTS } from '@/globals/api-endpoints'
// import { authUserSchema } from '@/globals/schemas'
// import type { AuthUser } from '@/globals/auth.types'

// function parseUser(data: unknown, source: string): AuthUser {
//   const parsed = authUserSchema.safeParse(data)
//   if (!parsed.success) {
//     logger.error(`[AuthService] ${source} response validation failed`, parsed.error.flatten())
//     throw new ApiError('Unexpected response from server', 500, 'INVALID_RESPONSE')
//   }
//   return parsed.data
// }

// export const authService = {
//   async login(username: string, password: string): Promise<AuthUser> {
//     const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { username, password })
//     return parseUser(res.data, 'login')
//   },

//   async register(username: string, password: string): Promise<AuthUser> {
//     const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, { username, password })
//     return parseUser(res.data, 'register')
//   },

//   async adminLogin(username: string, password: string): Promise<AuthUser> {
//     const res = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, { username, password })
//     return parseUser(res.data, 'adminLogin')
//   },

//   async adminRegister(
//     username: string,
//     password: string,
//     inviteCode: string
//   ): Promise<AuthUser> {
//     const res = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_REGISTER, {
//       username,
//       password,
//       inviteCode,
//     })
//     return parseUser(res.data, 'adminRegister')
//   },

//   async logout(): Promise<void> {
//     try {
//       await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
//     } catch (error) {
//       logger.warn('[AuthService] Logout request failed; clearing local state anyway', {
//         message: error instanceof Error ? error.message : 'unknown',
//       })
//     }
//   },

//   async fetchMe(): Promise<AuthUser | null> {
//     try {
//       const res = await apiClient.get(API_ENDPOINTS.AUTH.ME)
//       const parsed = authUserSchema.safeParse(res.data)
//       if (!parsed.success) {
//         logger.error('[AuthService] /me response validation failed', parsed.error.flatten())
//         return null
//       }
//       return parsed.data
//     } catch (error) {
//       if (error instanceof ApiError && error.statusCode === 401) {
//         return null
//       }
//       logger.error('[AuthService] fetchMe failed', {
//         message: error instanceof Error ? error.message : 'unknown',
//       })
//       return null
//     }
//   },

//   async refresh(): Promise<AuthUser | null> {
//     try {
//       const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH)
//       const parsed = authUserSchema.safeParse(res.data)
//       return parsed.success ? parsed.data : null
//     } catch (error) {
//       logger.warn('[AuthService] Refresh failed', {
//         message: error instanceof Error ? error.message : 'unknown',
//       })
//       return null
//     }
//   },
// }


import { apiClient } from '@/lib/axios'
import { logger } from '@/lib/logger'
import { ApiError } from '@/lib/errors'
import { API_ENDPOINTS } from '@/globals/api-endpoints'
import { authUserSchema, registerResponseSchema } from '@/globals/schemas'
import type { AuthUser } from '@/globals/auth.types'

function parseUser(data: unknown, source: string): AuthUser {
  const parsed = authUserSchema.safeParse(data)
  if (!parsed.success) {
    logger.error(`[AuthService] ${source} response validation failed`, parsed.error.flatten())
    throw new ApiError('Unexpected response from server', 500, 'INVALID_RESPONSE')
  }
  return parsed.data
}

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
    return parseUser(res.data, 'login')
  },

  // register ab message return karta hai, AuthUser nahi
  async register(username: string, email: string, password: string): Promise<string> {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      username,
      email,
      password,
    })
    const parsed = registerResponseSchema.safeParse(res.data)
    return parsed.success ? parsed.data.message : 'Registration successful.'
  },

  async adminLogin(email: string, password: string): Promise<AuthUser> {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, { email, password })
    return parseUser(res.data, 'adminLogin')
  },

  async adminRegister(
    username: string,
    email: string,
    password: string,
    inviteCode: string
  ): Promise<string> {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_REGISTER, {
      username,
      email,
      password,
      inviteCode,
    })
    const parsed = registerResponseSchema.safeParse(res.data)
    return parsed.success ? parsed.data.message : 'Admin registration successful.'
  },

  async resendVerification(email: string): Promise<string> {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
    return (res.data as { message?: string })?.message ?? 'Verification email sent.'
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      logger.warn('[AuthService] Logout request failed; clearing local state anyway', {
        message: error instanceof Error ? error.message : 'unknown',
      })
    }
  },

  async fetchMe(): Promise<AuthUser | null> {
    try {
      const res = await apiClient.get(API_ENDPOINTS.AUTH.ME)
      const parsed = authUserSchema.safeParse(res.data)
      if (!parsed.success) return null
      return parsed.data
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) return null
      return null
    }
  },

  async refresh(): Promise<AuthUser | null> {
    try {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH)
      const parsed = authUserSchema.safeParse(res.data)
      return parsed.success ? parsed.data : null
    } catch {
      return null
    }
  },
}