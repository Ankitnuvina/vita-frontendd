import React, { useState } from 'react'
import { z } from 'zod'
import type { Podcast } from '@/globals/types'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Field, FORM_INPUT_CLASS as INPUT_CLASS } from '@/features/admin/components/formField'

const formSchema = z.object({
  episode: z.string().min(1, 'Episode is required').max(16),
  category: z.string().min(1, 'Category is required').max(64),
  title: z.string().min(1, 'Title is required').max(200),
  guest: z.string().min(1, 'Guest is required').max(120),
  duration: z.string().min(1, 'Duration is required').max(16),
  date: z.string().min(1, 'Date is required').max(32),
  imageUrl: z.string().url('Must be a valid URL'),
})

export type PodcastFormValues = z.infer<typeof formSchema>

const EMPTY: PodcastFormValues = {
  episode: 'EP 1',
  category: 'Mental Health',
  title: '',
  guest: '',
  duration: '1h 00m',
  date: '',
  imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&q=80',
}

interface Props {
  initial?: Podcast
  onSubmit: (values: PodcastFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function PodcastForm({ initial, onSubmit, onCancel, isSubmitting }: Props): React.ReactNode {
  const [values, setValues] = useState<PodcastFormValues>(() =>
    initial
      ? {
          episode: initial.episode,
          category: initial.category,
          title: initial.title,
          guest: initial.guest,
          duration: initial.duration,
          date: initial.date,
          imageUrl: initial.imageUrl,
        }
      : EMPTY
  )
  const [errors, setErrors] = useState<Partial<Record<keyof PodcastFormValues, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setField = <K extends keyof PodcastFormValues>(key: K, value: PodcastFormValues[K]): void => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormError(null)
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof PodcastFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as keyof PodcastFormValues] = issue.message
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

      <div className="grid grid-cols-2 gap-3">
        <Field label="Episode" error={errors.episode} required>
          <input
            type="text"
            value={values.episode}
            onChange={(e) => setField('episode', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Category" error={errors.category} required>
          <input
            type="text"
            value={values.category}
            onChange={(e) => setField('category', e.target.value)}
            className={INPUT_CLASS}
          />
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

      <Field label="Guest" error={errors.guest} required>
        <input
          type="text"
          value={values.guest}
          onChange={(e) => setField('guest', e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Duration" error={errors.duration} required>
          <input
            type="text"
            value={values.duration}
            onChange={(e) => setField('duration', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Date" error={errors.date} required>
          <input
            type="text"
            value={values.date}
            onChange={(e) => setField('date', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <Field label="Image URL" error={errors.imageUrl} required>
        <input
          type="url"
          value={values.imageUrl}
          onChange={(e) => setField('imageUrl', e.target.value)}
          className={INPUT_CLASS}
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
          {isSubmitting ? 'Saving…' : initial ? 'Update Podcast' : 'Create Podcast'}
        </button>
      </div>
    </form>
  )
}
