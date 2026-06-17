import { apiClient } from '@/lib/axios'
import { API_ENDPOINTS } from '@/globals'
import { logger } from '@/lib/logger'
import { getUserFriendlyMessage } from '@/lib/errors'
import { ChatRole } from '@/globals/enums'
import type { ChatMessage } from '@/globals/types'
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

export async function sendChatMessage(
  userMessage: string,
  history: ChatMessage[],
  sessionId: string        // ADD
): Promise<string> {
  try {
    const messages = [
      ...history
        .filter((m) => m.role !== ChatRole.AI || m.content !== history[0]?.content)
        .map((m) => ({
          role: m.role === ChatRole.AI ? 'assistant' : 'user',
          content: m.content,
        })),
      { role: 'user', content: userMessage },
    ]

    const response = await apiClient.post(API_ENDPOINTS.CHAT, {
      messages,
      sessionId,             // ADD
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