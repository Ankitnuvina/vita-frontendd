import React, { useEffect } from 'react'
import { useToastStore, type Toast } from '@/store/toast.store'
import { CircleCheckBig, TriangleAlert, CircleX, BadgeCheck } from 'lucide-react'

const TYPE_STYLES: Record<Toast['type'], { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: <CircleCheckBig className="w-4 h-4" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: <CircleX className="w-4 h-4"/>,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: <BadgeCheck className="w-4 h-4"/>,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: <TriangleAlert className="w-4 h-4" />,
  },
}

function ToastItem({ toast }: { toast: Toast }): React.ReactNode {
  const removeToast = useToastStore((s) => s.removeToast)
  const styles = TYPE_STYLES[toast.type] ?? TYPE_STYLES.info

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => removeToast(toast.id), toast.duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [toast.id, toast.duration, removeToast])

  return (
    <div
      role="status"
      className={`${styles.bg} ${styles.border} ${styles.text} border rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 min-w-[280px] max-w-sm transition-all animate-toast-in`}
    >
      <span aria-hidden="true" className="text-base leading-none mt-0.5">
        {styles.icon}
      </span>
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className={`${styles.text} text-base leading-none opacity-60 hover:opacity-100 transition-opacity`}
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer(): React.ReactNode {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
