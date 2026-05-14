import React from 'react'
import { AiChatWidget } from '@/features/ai/components/AiChatWidget'
import { useAiChatStore } from '@/features/ai/store/ai-chat.store'

const SAMPLE_TOPICS = [
  { icon: '😴', label: 'Sleep', q: 'How can I improve my sleep quality?' },
  { icon: '🧠', label: 'Stress', q: 'What are evidence-based stress reduction techniques?' },
  { icon: '🥗', label: 'Nutrition', q: 'What are the best foods for gut health?' },
  { icon: '💪', label: 'Fitness', q: 'What is Zone 2 cardio and its benefits?' },
  { icon: '🧐', label: 'Breathwork', q: 'Teach me box breathing technique' },
  { icon: '🌙', label: 'Recovery', q: 'How do I optimize recovery after workouts?' },
]

export function AiPage(): React.ReactNode {
  const { sendMessage, resetChat, messages } = useAiChatStore()

  return (
    <main id="main-content" className="min-h-screen bg-ink">
      <div className="max-w-[900px] mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-bold text-green-300 tracking-[0.1em] uppercase mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot shrink-0" />
            Live AI · Non-Diagnostic
          </div>
          <h1 className="font-serif text-[clamp(24px,4vw,44px)] font-black text-white tracking-tight mb-3">
            Ask <em className="text-green-400 not-italic font-light">Vita</em> — Your Wellness AI
          </h1>
          <p className="text-sm text-white/45 font-light">
            Evidence-based answers on sleep, stress, nutrition, fitness and more.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {SAMPLE_TOPICS.map(({ icon, label, q }) => (
            <button
              key={label}
              onClick={() => void sendMessage(q)}
              className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 rounded-full px-3.5 py-2 text-xs text-white/65 hover:bg-white/10 hover:text-white transition-all"
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <AiChatWidget />
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

          {/* Note */}
          <div className="text-[12px] leading-relaxed text-white/85">
            <span className="font-semibold text-green-300">
              ⚠️Note :
            </span>{' '}
            This response is AI-generated and not provided by a medical expert.
          </div>

          {/* Bottom Section */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">

            {/* Message Count */}
            <p className="text-[11px] font-medium text-white/40">
              {messages.length - 1} message
              {messages.length !== 2 ? 's' : ''} in this session
            </p>

            {/* Reset Button */}
            <button
              onClick={resetChat}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-white/50 transition-all hover:bg-white/10 hover:text-white"
            >
              ↺ New conversation
            </button>

          </div>
        </div>
        <div className="mt-8 bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 text-center">
          <p className="text-[11px] text-white/30 leading-relaxed">
            ⚠️ Vita AI provides general wellness information based on peer-reviewed research.
            It is{' '}
            <strong className="text-white/50">not a substitute for professional medical advice</strong>
            . Always consult a qualified healthcare provider for personal health concerns.
          </p>
        </div>
      </div>
    </main>
  )
}
