import React, { useEffect, useRef } from 'react'
import { useAiChatStore } from '@/features/ai/store/ai-chat.store'
import { AI_DISCLAIMER } from '@/globals/constants'
import { ChatRole } from '@/globals/enums'

const QUICK_CHIPS = [
  'How to manage stress?',
  'Best sleep tips',
  'Gut health basics',
  'Zone 2 cardio',
]

interface AiChatWidgetProps {
  compact?: boolean
}

export function AiChatWidget({ compact = false }: AiChatWidgetProps): React.ReactNode {
  const { messages, isTyping, sendMessage } = useAiChatStore()
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (): void => {
    const val = inputRef.current?.value.trim()
    if (!val) return
    void sendMessage(val)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend()
  }

  const maxHeight = compact ? 'max-h-[260px]' : 'max-h-[420px]'

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-white/[0.07] flex items-center gap-2 bg-white/[0.04]">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot shrink-0" />
        <span className="text-[13px] font-semibold text-white">Vita — Wellness AI</span>
        <span className="text-[10px] text-white/30 ml-auto">Non-diagnostic</span>
      </div>

      {/* Messages */}
      <div
        className={`p-3 flex flex-col gap-2.5 overflow-y-auto ${maxHeight}`}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.timestamp}
            className={`flex gap-2 items-start ${
              msg.role === ChatRole.USER ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              aria-hidden="true"
              className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                msg.role === ChatRole.AI ? 'bg-green-500' : 'bg-white/15'
              }`}
            >
              {msg.role === ChatRole.AI ? '🌿' : 'U'}
            </div>
            <div
              className={`text-xs leading-relaxed whitespace-pre-line max-w-[80%] px-3 py-2.5 ${
                msg.role === ChatRole.AI
                  ? 'bg-white/8 text-white rounded-[4px_12px_12px_12px]'
                  : 'bg-green-500 text-white rounded-[12px_4px_12px_12px]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">
              🌿
            </div>
            <div className="bg-white/8 rounded-[4px_12px_12px_12px] px-3 py-2.5 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-white/45 rounded-full inline-block animate-bounce-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick chips */}
      <div className="px-2.5 py-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => void sendMessage(chip)}
            className="bg-white/[0.06] border border-white/10 rounded-full px-2.5 py-1 text-[10px] text-white hover:bg-white/10 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-2.5 py-2.5 border-t border-white/[0.07] flex gap-1.5 items-center bg-white/[0.03]">
        <label htmlFor="chat-input" className="sr-only">
          Ask a wellness question
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          placeholder="Ask about sleep, stress, nutrition…"
          className="flex-1 bg-white/[0.07] border border-white/10 rounded-full px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-green-500/50 transition-colors"
        />
        <button
          onClick={handleSend}
          aria-label="Send message"
          className="w-8 h-8 shrink-0 bg-green-500 rounded-full flex items-center justify-center text-white text-sm border-none hover:bg-green-400 transition-colors"
        >
          ↑
        </button>
      </div>

      {/* Disclaimer */}
      <p className="px-3 py-1.5 text-center text-[10px] text-white italic border-t border-white/[0.06]">
        {AI_DISCLAIMER}
      </p>
    </div>
  )
}
