import React from 'react'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'

interface Props {
  title: string
  description?: string
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry?: () => void
  isEmpty: boolean
  emptyLabel: string
  onCreate: () => void
  createLabel: string
  children: React.ReactNode
}

export function AdminTableShell({
  title,
  description,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  isEmpty,
  emptyLabel,
  onCreate,
  createLabel,
  children,
}: Props): React.ReactNode {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif text-xl font-black text-ink">{title}</h2>
          {description && <p className="text-xs text-ink-3 mt-1">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="text-xs font-semibold text-white bg-green-500 rounded-full px-4 py-2 hover:bg-green-600 transition-colors"
        >
          + {createLabel}
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center text-sm text-ink-3 animate-pulse">
          Loading…
        </div>
      ) : isError ? (
        <ErrorMessage message={errorMessage ?? 'Failed to load data.'} onRetry={onRetry} />
      ) : isEmpty ? (
        <EmptyState message={emptyLabel} action={{ label: createLabel, onClick: onCreate }} />
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">{children}</div>
      )}
    </div>
  )
}

export const TABLE_HEADER_CLASS =
  'text-[10px] font-bold tracking-[0.08em] uppercase text-ink-4 px-4 py-3 text-left bg-paper border-b border-border'

export const TABLE_CELL_CLASS = 'px-4 py-3 text-xs text-ink-2 border-b border-border last:border-b-0'

export const ACTION_BUTTON_CLASS_EDIT =
  'text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-1 hover:bg-green-100 transition-colors'

export const ACTION_BUTTON_CLASS_DELETE =
  'text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-1 hover:bg-red-100 transition-colors'
