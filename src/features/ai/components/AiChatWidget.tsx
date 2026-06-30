import React, { useEffect, useRef, useState } from 'react'
import { useAiChatStore } from '@/features/ai/store/ai-chat.store'
import { AI_DISCLAIMER } from '@/globals/constants'
import { ChatRole } from '@/globals/enums'
import { ArrowUp, Copy, Pencil, Check, Mic, Plus } from 'lucide-react'
import { useToastStore } from '@/store/toast.store'
import { useUserProfile } from '@/features/users/hook/useUserProfile'
import { useAuthStore } from '@/store/auth.store'

const SAMPLE_TOPICS = [
  { icon: '😴', label: 'Sleep', q: 'How can I improve my sleep quality?' },
  { icon: '🧠', label: 'Stress', q: 'What are evidence-based stress reduction techniques?' },
  { icon: '🥗', label: 'Nutrition', q: 'What are the best foods for gut health?' },
  { icon: '💪', label: 'Fitness', q: 'What is Zone 2 cardio and its benefits?' },
  { icon: '🌙', label: 'Recovery', q: 'How do I optimize recovery after workouts?' },
  { icon: '💧', label: 'Hydration', q: 'How much water should I drink daily?' },
  { icon: '❤️', label: 'Heart Health', q: 'What daily habits support heart health?' },
  { icon: '⚡', label: 'Energy', q: 'How can I maintain energy levels throughout the day?' },
]

interface AiChatWidgetProps {
  compact?: boolean
}

export function AiChatWidget({ compact = false }: AiChatWidgetProps): React.ReactNode {
 const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
const { profile } = useUserProfile(isAuthenticated)
  const { messages, isTyping, sendMessage, editMessage } = useAiChatStore()
  const addToast = useToastStore((s) => s.addToast)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [copiedAt, setCopiedAt] = useState<number | null>(null)
  const [editingTimestamp, setEditingTimestamp] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [hasText, setHasText] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);


  const handleSend = (): void => {
    const val = inputRef.current?.value.trim()
    if (!val) return
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
    }
    void sendMessage(val)
    if (inputRef.current) inputRef.current.value = ''
    setHasText(false)
  }

  const handleCopy = async (text: string, timestamp: number): Promise<void> => {
    if (!text.trim()) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAt(timestamp)
      window.setTimeout(() => {
        setCopiedAt((current) => (current === timestamp ? null : current))
      }, 1500)
    } catch {
      addToast({ type: 'error', message: 'Copy failed. Try again.' })
    }
  }

  const handleStartEdit = (timestamp: number, text: string): void => {
    setEditingTimestamp(timestamp)
    setEditDraft(text)
  }

  const handleCancelEdit = (): void => {
    setEditingTimestamp(null)
    setEditDraft('')
  }

  const handleSubmitEdit = async (): Promise<void> => {
    if (!editingTimestamp || !editDraft.trim()) return
    await editMessage(editingTimestamp, editDraft)
    setEditingTimestamp(null)
    setEditDraft('')
  }


  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const maxHeight = compact ? 'max-h-[260px]' : 'max-h-[420px]'


  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // const handleSendRef = useRef(handleSend)
  // useEffect(() => {
  //   handleSendRef.current = handleSend
  // }, [handleSend])

  const committedTextRef = useRef('')

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'

    recognition.onstart = () => {
      setIsListening(true)
      // Session start hone par existing input text save karo
      committedTextRef.current = inputRef.current?.value.trim() ?? ''

      silenceTimerRef.current = setTimeout(() => {
        recognition.stop()
      }, 35000)
    }

    recognition.onresult = (event: any) => {
      // Silence timer reset + restart
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop()
      }, 35000)

      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      if (finalTranscript) {
        // Final — committed text mein append karo
        const prefix = committedTextRef.current
        committedTextRef.current = prefix
          ? `${prefix} ${finalTranscript.trim()}`
          : finalTranscript.trim()

        // Typewriter effect sirf naye final part par
        if (typewriterRef.current) {
          clearInterval(typewriterRef.current)
          typewriterRef.current = null
        }

        const fullText = committedTextRef.current
        const startFrom = prefix ? prefix.length + 1 : 0

        // Input ko prefix tak reset karo
        if (inputRef.current) {
          inputRef.current.value = prefix ? `${prefix} ` : ''
        }

        let i = startFrom
        typewriterRef.current = setInterval(() => {
          if (!inputRef.current) return
          inputRef.current.value = fullText.slice(0, i + 1)
          setHasText(true)
          i++
          if (i >= fullText.length) {
            clearInterval(typewriterRef.current!)
            typewriterRef.current = null
          }
        }, 30)

      } else if (interimTranscript) {
        // Interim — typewriter chal raha ho to interrupt mat karo
        if (typewriterRef.current) return

        if (inputRef.current) {
          const base = committedTextRef.current
          inputRef.current.value = base
            ? `${base} ${interimTranscript}`
            : interimTranscript
          setHasText(true)
        }
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      // committedTextRef reset — next session fresh start
      committedTextRef.current = ''
    }

    recognition.onerror = () => {
      setIsListening(false)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      committedTextRef.current = ''
    }

    recognitionRef.current = recognition

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [])

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      addToast({
        type: 'error',
        message: 'Speech recognition is not supported in this browser.',
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  return (
    <div className="bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-black/10 bg-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
          <span className="text-sm font-semibold tracking-wide text-black">
            Ask Vita — Your Wellness AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {SAMPLE_TOPICS.map(({ icon, label, q }) => (
            <button
              key={label}
              onClick={() => void sendMessage(q)}
              className="flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.06] px-3 py-1.5 text-[11px] font-medium text-black transition-all hover:bg-gray-200"
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-black">
          Non-diagnostic
        </span>
      </div>

      {/* Messages */}
      <div
        className={`msg_scroll_only flex flex-col gap-2.5 overflow-y-auto max-w-[860px] mx-auto pt-10 min-h-[calc(100vh-140px)] ${maxHeight}`}
        role="log"
        ref={scrollContainerRef}
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.timestamp}
            className={`group flex gap-2 items-start  ${msg.role === ChatRole.USER ? 'flex-row-reverse max-w-[50%] ml-auto' : 'flex-row'
              }`}
          >
            <div
              aria-hidden="true"
              className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${msg.role === ChatRole.AI ? '' : 'bg-black/10'
                }`}
            >
              {msg.role === ChatRole.AI ? (
                <img
                  src="/vitalizeLogo/bot.png"
                  alt="Vitalize AI"
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <img
                  src={profile?.avatarUrl || '/vitalizeLogo/defaultUser.png'}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/vitalizeLogo/defaultUser.png'
                  }}
                />
              )}
            </div>


            <div className={`max-w-[100%] flex flex-col gap-1 ${msg.role === ChatRole.USER ? 'items-end' : 'items-start'}`}>
              <div
                className={`text-sm leading-relaxed whitespace-pre-line px-3 py-2 border border-[#ebebeb] ${msg.role === ChatRole.AI
                  ? 'bg-gray-50 text-black rounded-[15px]'
                  : 'bg-gray-100 text-black rounded-[15px]'
                  }`}
              >
                {editingTimestamp === msg.timestamp && msg.role === ChatRole.USER ? (
                  <div className="flex flex-col gap-2 min-w-[260px]">
                    <textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={3}
                      className="w-full resize-y text-sm text-black outline-none focus:border-white/40 border-0 bg-transparent p-0 appearance-none"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-2.5 py-1.5 rounded-full text-xs text-black bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSubmitEdit()}
                        className="px-2.5 py-1.5 rounded-full text-xs text-white bg-black"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              <div className="flex items-center gap-1 ">
                <button
                  type="button"
                  onClick={() => void handleCopy(msg.content, msg.timestamp)}
                  className="px-2 py-1 rounded-md text-[11px] text-black/80 border border-black/10 hover:bg-gray-100 transition-colors inline-flex items-center gap-1"
                  aria-label={`Copy ${msg.role === ChatRole.AI ? 'assistant' : 'user'} message`}
                >
                  {copiedAt === msg.timestamp ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                {msg.role === ChatRole.USER && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(msg.timestamp, msg.content)}
                    className="px-2 py-1 rounded-md text-[11px] text-black/80 border border-black/10 hover:bg-gray-100 transition-colors inline-flex items-center gap-1"
                    aria-label="Edit message"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center">          
            <div className="bg-black/8 rounded-[4px_12px_12px_12px] px-3 py-2.5 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-black/45 rounded-full inline-block animate-bounce-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-1.5 items-center max-w-[860px] mx-auto p-0 border-0 bg-transparent flex-wrap relative">
        <label htmlFor="chat-input" className="sr-only">
          Ask a wellness question
        </label>
        <button
          aria-label="Voice message"
          title='Add files & more'
          className="shrink-0 rounded-full flex items-center justify-center text-black text-sm border-none transition-colors h-[36px] w-[36px] rounded-full bg-transprent absolute top-[7px] left-[8px] hover:bg-gray-100"
        >
          <Plus className='h-5 w-5' />
        </button>

        <textarea
          id="chat-input"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={(e) => setHasText(!!e.target.value.trim())}
          placeholder="Ask about sleep, stress, nutrition…"
          rows={1}
          className="flex-1 resize-none border border-black/10 px-3 py-2 pl-12 pr-[82px] text-sm text-black placeholder:text-black/30 outline-none transition-colors min-h-[50px] content-center rounded-full"
        />
        <div className='absolute right-[7px] top-[7px] flex gap-[4px]'>
          <button
            onClick={handleVoiceInput}
            aria-label="Voice message"
            title={isListening ? 'Stop recording' : 'Dictate'}
            className={`shrink-0 flex items-center justify-center h-[36px] w-[36px] rounded-[5px] transition-all btn_annimations ${isListening
              ? 'bg-green-100 text-green-600 btn_annimations_active '
              : 'hover:bg-gray-100 text-black '
              }`}
          >
            <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={handleSend}
            disabled={!hasText}
            aria-label="Send message"
            title="Send prompt"
            className={`shrink-0 flex items-center justify-center h-[36px] w-[36px] rounded-full transition-all ${hasText
              ? 'bg-black cursor-pointer'
              : 'bg-black/30 cursor-not-allowed'
              }`}
          >
            <ArrowUp className="h-4 w-4 text-white" />
          </button>

        </div>
        <div className="flex items-start justify-between gap-4 backdrop-blur-sm w-full m-0 px-0 pt-[4px] pb-[10px] bg-transparent">
          <p className="shrink-0 text-xs font-medium tracking-wide text-black/50">
            {messages.length - 1} message{messages.length !== 2 ? 's' : ''} in this session
          </p>

          <p className="max-w-md text-right text-[12px] leading-relaxed text-black/60">
            <span className="font-semibold text-green-300">Note:</span>{' '}
            {AI_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  )
}
