import { UserRole } from '@/globals/enums'

export interface AuthUser {
  userId: string
  role: UserRole
}

export interface JwtPayload {
  userId: string
  role: UserRole
  iat: number
  exp: number
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
