import React from 'react'

interface Props {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: Props): React.ReactNode {
  return (
    <div
      role="alert"
      className="border border-red-100 bg-red-50 text-red-700 rounded-2xl px-5 py-4 flex items-start gap-3"
    >
      <span aria-hidden="true" className="text-lg leading-none">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Something went wrong</p>
        <p className="text-xs mt-0.5 text-red-600/85">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-semibold text-red-700 border border-red-200 rounded-full px-3 py-1 hover:bg-red-100 transition-colors shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  )
}
