import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import { ApiError, NetworkError } from '@/lib/errors'

interface RequestMetadata {
  startTime: number
  retried?: boolean
}

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: RequestMetadata
  }
}

const REFRESH_PATH = '/api/auth/refresh'
const LOGIN_PATH = '/api/auth/login'
const ME_PATH = '/api/auth/me'

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.metadata = { ...(config.metadata ?? {}), startTime: Date.now() }
    logger.debug(`[API] → ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error: unknown) => {
    logger.error('[API] Request setup failed', error)
    return Promise.reject(error)
  }
)

let refreshPromise: Promise<boolean> | null = null
let onAuthFailure: (() => void) | null = null

export function registerAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler
}

async function performRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        await apiClient.post(REFRESH_PATH)
        logger.info('[API] Access token refreshed')
        return true
      } catch (error) {
        logger.warn('[API] Token refresh failed', {
          message: error instanceof Error ? error.message : 'unknown',
        })
        return false
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime ?? 0)
    logger.info(
      `[API] ← ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status} (${duration}ms)`
    )
    return response
  },
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const url = error.config?.url ?? 'unknown'
      const status = error.response?.status ?? 0
      const config = error.config as (InternalAxiosRequestConfig & { metadata?: RequestMetadata }) | undefined

      logger.error(`[API] Error: ${url}`, { status, message: error.message })

      if (!error.response) {
        return Promise.reject(new NetworkError())
      }

      if (
        status === 401 &&
        config &&
        !config.metadata?.retried &&
        !url.includes(LOGIN_PATH) &&
        !url.includes(ME_PATH) &&
        !url.includes(REFRESH_PATH)
      ) {
        logger.info('[API] Got 401 — attempting refresh')
        const ok = await performRefresh()
        if (ok) {
          config.metadata = {
            ...(config.metadata ?? { startTime: Date.now() }),
            retried: true,
          }
          logger.info(`[API] Retrying request after refresh: ${config.method?.toUpperCase()} ${url}`)
          return apiClient.request(config)
        }
        if (onAuthFailure) {
          logger.info('[API] Refresh failed — invoking auth failure handler')
          onAuthFailure()
        }
      }

      const message =
        (error.response.data as { error?: string; message?: string })?.error ??
        (error.response.data as { message?: string })?.message ??
        error.message

      return Promise.reject(new ApiError(message, status, `HTTP_${status}`))
    }
    return Promise.reject(error as AxiosError)
  }
)
