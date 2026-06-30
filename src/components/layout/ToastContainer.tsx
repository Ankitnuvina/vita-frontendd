import React, { useEffect, useState } from 'react'
import { useToastStore, type Toast } from '@/store/toast.store'
import { CircleCheckBig, TriangleAlert, CircleX, BadgeCheck, X } from 'lucide-react'

const TYPE_CONFIG: Record<Toast['type'], {
  icon: React.ReactNode
  bar: string
  iconColor: string
  title: string
}> = {
  success: {
    icon: <CircleCheckBig className="w-6 h-6" />,
    bar: '#22c55e',
    iconColor: '#16a34a',
    title: 'Success',
  },
  error: {
    icon: <CircleX className="w-6 h-6" />,
    bar: '#ef4444',
    iconColor: '#dc2626',
    title: 'Error',
  },
  info: {
    icon: <BadgeCheck className="w-6 h-6" />,
    bar: '#3b82f6',
    iconColor: '#2563eb',
    title: 'Info',
  },
  warning: {
    icon: <TriangleAlert className="w-6 h-6" />,
    bar: '#f59e0b',
    iconColor: '#d97706',
    title: 'Warning',
  },
}

function ToastItem({ toast }: { toast: Toast }): React.ReactNode {
  const removeToast = useToastStore((s) => s.removeToast)
  const cfg = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info
  const duration = toast.duration ?? 4000
  const [progress, setProgress] = useState(100)
  const [leaving, setLeaving] = useState(false)

  const dismiss = () => {
    setLeaving(true)
    setTimeout(() => removeToast(toast.id), 300)
  }

  useEffect(() => {
    if (duration <= 0) return
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct === 0) clearInterval(interval)
    }, 16)
    const timer = setTimeout(() => dismiss(), duration)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [toast.id, duration])

  return (
    <div
      role="status"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        minWidth: 300,
        maxWidth: 380,
        overflow: 'hidden',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateX(20px)' : 'translateX(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        animation: leaving ? 'none' : 'toastSlideIn 0.3s ease',
      }}
    >
      {/* Main content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px 12px', }}>
        {/* Icon */}
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          color: cfg.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {cfg.icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
            {cfg.title}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
            {toast.message}
          </p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            width: 26,
            height: 26,
            borderRadius: 10,
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#9ca3af'
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div style={{ height: 3, background: '#f3f4f6' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: cfg.bar,
            borderRadius: '0 2px 2px 0',
            transition: 'width 0.016s linear',
          }} />
        </div>
      )}

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export function ToastContainer(): React.ReactNode {
  const toasts = useToastStore((s) => s.toasts)
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 2,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}