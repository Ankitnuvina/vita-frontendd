import React from 'react'

export const FORM_INPUT_CLASS =
  'w-full border border-border rounded-xl px-3.5 py-2 text-sm text-ink outline-none bg-white focus:border-green-400 transition-colors'

interface FieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function Field({ label, error, required, children }: FieldProps): React.ReactNode {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-2 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[11px] text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
