import React, { useEffect } from 'react'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
}: SlideOverProps): React.ReactNode {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="slideover-title" className="fixed inset-0 z-[205]">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 bottom-0 w-[480px] max-w-[95vw] bg-white shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3">
          <div>
            <h2 id="slideover-title" className="font-serif text-lg font-black text-ink">
              {title}
            </h2>
            {description && <p className="text-xs text-ink-3 mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-ink-3 hover:bg-border transition-colors border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
