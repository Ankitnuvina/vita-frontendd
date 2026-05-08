import React, { useState } from 'react'
import { z } from 'zod'
import type { WellnessTip } from '@/globals/types'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Field, FORM_INPUT_CLASS as INPUT_CLASS } from '@/features/admin/components/formField'

const formSchema = z.object({
  icon: z.string().min(1, 'Icon is required').max(8),
  title: z.string().min(1, 'Title is required').max(120),
  text: z.string().min(1, 'Text is required').max(500),
  bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use hex color e.g. #F0F7F2'),
  border: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use hex color e.g. #D6EDE0'),
})

export type TipFormValues = z.infer<typeof formSchema>

const EMPTY: TipFormValues = {
  icon: '🌿',
  title: '',
  text: '',
  bg: '#F0F7F2',
  border: '#D6EDE0',
}

interface Props {
  initial?: WellnessTip
  onSubmit: (values: TipFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function TipForm({ initial, onSubmit, onCancel, isSubmitting }: Props): React.ReactNode {
  const [values, setValues] = useState<TipFormValues>(() =>
    initial
      ? {
        icon: initial.icon,
        title: initial.title,
        text: initial.text,
        bg: initial.colors.bg,
        border: initial.colors.border,
      }
      : EMPTY
  )
  const [errors, setErrors] = useState<Partial<Record<keyof TipFormValues, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setField = <K extends keyof TipFormValues>(key: K, value: TipFormValues[K]): void => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormError(null)
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof TipFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as keyof TipFormValues] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    try {
      await onSubmit(parsed.data)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3" noValidate>
      {formError && <ErrorMessage message={formError} />}

      <div className="grid grid-cols-3 gap-3">
        <Field label="Icon" error={errors.icon} required>
          <input
            type="text"
            value={values.icon}
            onChange={(e) => setField('icon', e.target.value)}
            className={INPUT_CLASS}
            maxLength={4}
          />
        </Field>

        <Field label="Bg color" error={errors.bg} required>
          <div className="flex items-center gap-2 w-full border border-border rounded-xl px-3.5 py-1.5 bg-white focus-within:border-green-400 transition-colors">
            <input
              type="color"
              value={values.bg}
              onChange={(e) => setField('bg', e.target.value)}
              className="w-7 h-7 rounded-md cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
            />
            <input
              type="text"
              value={values.bg}
              onChange={(e) => setField('bg', e.target.value)}
              className="flex-1 text-sm text-ink outline-none bg-transparent"
              placeholder="#ffffff"
            />
            <div
              className="w-6 h-6 rounded-md flex-shrink-0 border border-gray-200"
              style={{ backgroundColor: values.bg }}
            />
          </div>
        </Field>

        <Field label="Border color" error={errors.border} required>
          <div className="flex items-center gap-2 w-full border border-border rounded-xl px-3.5 py-1.5 bg-white focus-within:border-green-400 transition-colors">
            <input
              type="color"
              value={values.border}
              onChange={(e) => setField('border', e.target.value)}
              className="w-7 h-7 rounded-md cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
            />
            <input
              type="text"
              value={values.border}
              onChange={(e) => setField('border', e.target.value)}
              className="flex-1 text-sm text-ink outline-none bg-transparent"
              placeholder="#e2e8f0"
            />
            <div
              className="w-6 h-6 rounded-md flex-shrink-0 border border-gray-200"
              style={{ backgroundColor: values.border }}
            />
          </div>
        </Field>

      </div>

      <Field label="Title" error={errors.title} required>
        <input
          type="text"
          value={values.title}
          onChange={(e) => setField('title', e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="Text" error={errors.text} required>
        <textarea
          value={values.text}
          onChange={(e) => setField('text', e.target.value)}
          rows={4}
          className={`${INPUT_CLASS} resize-y`}
        />
      </Field>

      <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs font-semibold text-ink-2 border border-border rounded-full px-4 py-2 hover:border-ink-3 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-xs font-semibold text-white bg-green-500 rounded-full px-4 py-2 hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : initial ? 'Update Tip' : 'Create Tip'}
        </button>
      </div>
    </form>
  )
}
