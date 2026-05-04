import React, { useState } from 'react'
import { z } from 'zod'
import type { Expert } from '@/globals/types'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Field, FORM_INPUT_CLASS as INPUT_CLASS } from '@/features/admin/components/formField'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  role: z.string().min(1, 'Role is required').max(120),
  credentials: z.string().min(1, 'Credentials are required').max(200),
  articleCount: z.number().int().min(0).max(10000),
  imageUrl: z.string().url('Must be a valid URL'),
})

export type ExpertFormValues = z.infer<typeof formSchema>

const EMPTY: ExpertFormValues = {
  name: '',
  role: '',
  credentials: '',
  articleCount: 0,
  imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=80',
}

interface Props {
  initial?: Expert
  onSubmit: (values: ExpertFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ExpertForm({ initial, onSubmit, onCancel, isSubmitting }: Props): React.ReactNode {
  const [values, setValues] = useState<ExpertFormValues>(() =>
    initial
      ? {
          name: initial.name,
          role: initial.role,
          credentials: initial.credentials,
          articleCount: initial.articleCount,
          imageUrl: initial.imageUrl,
        }
      : EMPTY
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ExpertFormValues, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setField = <K extends keyof ExpertFormValues>(key: K, value: ExpertFormValues[K]): void => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormError(null)
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ExpertFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as keyof ExpertFormValues] = issue.message
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

      <Field label="Name" error={errors.name} required>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setField('name', e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="Role" error={errors.role} required>
        <input
          type="text"
          value={values.role}
          onChange={(e) => setField('role', e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <Field label="Credentials" error={errors.credentials} required>
        <input
          type="text"
          value={values.credentials}
          onChange={(e) => setField('credentials', e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Article Count" error={errors.articleCount} required>
          <input
            type="number"
            min={0}
            value={values.articleCount}
            onChange={(e) => setField('articleCount', Number(e.target.value))}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Image URL" error={errors.imageUrl} required>
          <input
            type="url"
            value={values.imageUrl}
            onChange={(e) => setField('imageUrl', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

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
          {isSubmitting ? 'Saving…' : initial ? 'Update Expert' : 'Create Expert'}
        </button>
      </div>
    </form>
  )
}
