export class ApiError extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class AuthError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'AuthError'
    Object.setPrototypeOf(this, AuthError.prototype)
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return 'Your session has expired. Please sign in again.'
    if (error.statusCode === 403) return 'You do not have permission to perform this action.'
    if (error.statusCode === 404) return 'The requested resource was not found.'
    if (error.statusCode >= 500) return 'A server error occurred. Please try again later.'
  }
  if (error instanceof NetworkError) return 'Unable to connect. Please check your internet connection.'
  if (error instanceof ValidationError) return error.message
  return 'Something went wrong. Please try again.'
}
