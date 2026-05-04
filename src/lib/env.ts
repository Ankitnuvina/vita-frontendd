import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Vitalize Health'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3005'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
})

function parseEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(import.meta.env)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    throw new Error(`[env] Invalid environment variables:\n${JSON.stringify(errors, null, 2)}`)
  }
  return result.data
}

export const env = parseEnv()
