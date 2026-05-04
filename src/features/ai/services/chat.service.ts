import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS, AI_SYSTEM_PROMPT } from '@/globals'
import { logger } from '@/lib/logger'
import { getUserFriendlyMessage } from '@/lib/errors'
import { z } from 'zod'

const chatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    })
  ),
})

export async function sendChatMessage(userMessage: string): Promise<string> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CHAT, {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 400,
      temperature: 0.7,
    })

    const parsed = chatResponseSchema.safeParse(response.data)
    if (!parsed.success) {
      logger.error('[ChatService] Invalid response shape', parsed.error)
      return 'Sorry, received an unexpected response. Please try again.'
    }

    return parsed.data.choices[0]?.message.content ?? 'No response received.'
  } catch (error) {
    logger.error('[ChatService] Error sending message', error)
    return getUserFriendlyMessage(error)
  }
}
