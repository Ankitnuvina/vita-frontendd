import React from 'react'

interface Props {
  message: string
  icon?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ message, icon = '🌿', action }: Props): React.ReactNode {
  return (
    <div className="text-center py-16">
      <div aria-hidden="true" className="text-4xl mb-3">
        {icon}
      </div>
      <p className="font-serif text-lg font-bold text-ink mb-1.5">{message}</p>
      <p className="text-sm text-ink-3 font-light">Check back soon.</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 text-xs font-semibold text-green-600 border border-green-200 rounded-full px-4 py-1.5 hover:bg-green-50 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
