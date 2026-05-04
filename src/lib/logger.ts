import loglevel from 'loglevel'
import { env } from '@/lib/env'

const logger = loglevel.getLogger('vitalize')

if (env.VITE_APP_ENV === 'production') {
  logger.setLevel('warn')
} else if (env.VITE_APP_ENV === 'staging') {
  logger.setLevel('info')
} else {
  logger.setLevel('debug')
}

const originalFactory = logger.methodFactory
logger.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName)
  return (...args: unknown[]) => {
    const timestamp = new Date().toISOString()
    rawMethod(`[${timestamp}] [${methodName.toUpperCase()}]`, ...args)
  }
}
logger.rebuild()

export { logger }
