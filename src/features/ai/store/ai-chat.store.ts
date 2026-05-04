import { create } from 'zustand'
import type { ChatMessage } from '@/globals/types'
import { ChatRole } from '@/globals/enums'
import { sendChatMessage } from '@/features/ai/services/chat.service'
import { logger } from '@/lib/logger'

const INITIAL_MESSAGE: ChatMessage = {
  role: ChatRole.AI,
  content:
    'Hi! I\'m Vita 🌿 — your AI wellness guide.\n\nAsk about sleep, stress, nutrition, or fitness for evidence-based answers.\n\n⚠️ General wellness info only — not medical advice.',
  timestamp: Date.now(),
}

interface AiChatState {
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (text: string) => Promise<void>
  resetChat: () => void
}

export const useAiChatStore = create<AiChatState>((set) => ({
  messages: [INITIAL_MESSAGE],
  isTyping: false,

  sendMessage: async (text: string) => {
    if (!text.trim()) return
    const userMessage: ChatMessage = { role: ChatRole.USER, content: text, timestamp: Date.now() }
    set((state) => ({ messages: [...state.messages, userMessage], isTyping: true }))

    logger.debug('[AiChat] Sending message', { length: text.length })

    const reply = await sendChatMessage(text)
    const aiMessage: ChatMessage = { role: ChatRole.AI, content: reply, timestamp: Date.now() }

    set((state) => ({
      messages: [...state.messages, aiMessage],
      isTyping: false,
    }))
  },

  resetChat: () => set({ messages: [INITIAL_MESSAGE], isTyping: false }),
}))
