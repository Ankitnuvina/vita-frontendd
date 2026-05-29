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
          <h2 className="font-serif text-2xl font-black text-ink leading-tight">{title}</h2>
          {description && <p className="text-xs text-ink-3 mt-1.5">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-green-500 rounded-full px-4 py-2.5 hover:bg-green-600 transition-colors shadow-soft"
        >
          <i className="fa-solid fa-plus text-[11px]" aria-hidden="true" />
          {createLabel}
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-border shadow-soft p-10 text-center text-sm text-ink-3 animate-pulse">
          Loading…
        </div>
      ) : isError ? (
        <ErrorMessage message={errorMessage ?? 'Failed to load data.'} onRetry={onRetry} />
      ) : isEmpty ? (
        <EmptyState message={emptyLabel} action={{ label: createLabel, onClick: onCreate }} />
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">{children}</div>
        </div>
      )}
    </div>
  )
}

export const TABLE_HEADER_CLASS =
  'text-[15px] font-bold text-[#194b2b] px-6 py-3.5 text-left bg-[rgb(33_75_42_/_16%)] border-b border-border whitespace-nowrap '

export const TABLE_CELL_CLASS =
  'px-6 py-4 text-[13px] text-ink-2 border-b border-border align-middle'

export const ACTION_BUTTON_CLASS_EDIT =
  'inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-3 py-1 hover:bg-green-100 hover:border-green-200 transition-colors'

export const ACTION_BUTTON_CLASS_DELETE =
  'inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1 hover:bg-red-100 hover:border-red-200 transition-colors'

export const STATUS_PILL_BASE =
  'inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 border whitespace-nowrap'

export const STATUS_PILL_SUCCESS =
  `${STATUS_PILL_BASE} bg-green-50 text-green-700 border-green-100`

export const STATUS_PILL_WARNING =
  `${STATUS_PILL_BASE} bg-yellow-50 text-yellow-700 border-yellow-200`

export const STATUS_PILL_DANGER =
  `${STATUS_PILL_BASE} bg-red-50 text-red-600 border-red-100`

export const STATUS_PILL_NEUTRAL =
  `${STATUS_PILL_BASE} bg-paper text-ink-3 border-border`
