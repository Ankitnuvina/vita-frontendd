import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage } from '@/globals/types'
import { ChatRole } from '@/globals/enums'
import { sendChatMessage } from '@/features/ai/services/chat.service'
import { logger } from '@/lib/logger'
import type { ChatSession } from '@/globals/types'

// nanoid fallback — no extra dependency needed
const genId = () => crypto.randomUUID()

const makeInitialMessage = (): ChatMessage => ({
  role: ChatRole.AI,
  content: "Hi I'm Vitalize your AI wellness guide.",
  timestamp: Date.now(),
})

interface AiChatState {
  sessionId: string
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (text: string) => Promise<void>
  editMessage: (timestamp: number, text: string) => Promise<void>
  resetChat: () => void
  loadSession: (session: ChatSession) => void
}

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set, get) => ({
      sessionId: genId(),
      messages: [makeInitialMessage()],
      isTyping: false,

      sendMessage: async (text: string) => {
        if (!text.trim()) return

        const { sessionId, messages: historyBeforeUser } = get()

        const userMessage: ChatMessage = {
          role: ChatRole.USER,
          content: text,
          timestamp: Date.now(),
        }

        set((state) => ({
          messages: [...state.messages, userMessage],
          isTyping: true,
        }))

        logger.debug('[AiChat] Sending message', { length: text.length })

        const reply = await sendChatMessage(text, historyBeforeUser, sessionId)

        const aiMessage: ChatMessage = {
          role: ChatRole.AI,
          content: reply,
          timestamp: Date.now(),
        }

        set((state) => ({
          messages: [...state.messages, aiMessage],
          isTyping: false,
        }))
      },

      editMessage: async (timestamp: number, text: string) => {
        const editedText = text.trim()
        if (!editedText) return

        const { sessionId, messages } = get()
        const editIndex = messages.findIndex(
          (msg) => msg.role === ChatRole.USER && msg.timestamp === timestamp
        )
        if (editIndex === -1) return

        const baseHistory = messages.slice(0, editIndex)
        const editedUserMessage: ChatMessage = {
          role: ChatRole.USER,
          content: editedText,
          timestamp: Date.now(),
        }

        set({
          messages: [...baseHistory, editedUserMessage],
          isTyping: true,
        })

        logger.debug('[AiChat] Editing message and regenerating response', { timestamp })

        const reply = await sendChatMessage(editedText, baseHistory, sessionId)

        const aiMessage: ChatMessage = {
          role: ChatRole.AI,
          content: reply,
          timestamp: Date.now(),
        }

        set((current) => ({
          messages: [...current.messages, aiMessage],
          isTyping: false,
        }))
      },

      resetChat: () =>
        set({
          sessionId: genId(),             // new session
          messages: [makeInitialMessage()],
          isTyping: false,
        }),

      loadSession: (session: ChatSession) => {
        const msgs: ChatMessage[] = [makeInitialMessage()]
        for (const m of session.messages) {
          const ts = new Date(m.createdAt).getTime()
          msgs.push({ role: ChatRole.USER, content: m.question, timestamp: ts })
          msgs.push({ role: ChatRole.AI, content: m.answer, timestamp: ts + 1 })
        }
        set({ sessionId: session.sessionId, messages: msgs })
      },
    }),
    {
      name: 'ai-chat-store',
      // sessionId aur messages persist karo, isTyping nahi
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
      }),
    }
  )
)