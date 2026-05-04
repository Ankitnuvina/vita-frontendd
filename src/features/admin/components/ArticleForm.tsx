import React, { useState } from 'react'
import { z } from 'zod'
import type { Article } from '@/globals/types'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Field, FORM_INPUT_CLASS as INPUT_CLASS } from '@/features/admin/components/formField'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  author: z.string().min(1, 'Author is required').max(120),
  cat: z.string().min(1).max(8),
  categoryLabel: z.string().min(1, 'Category label is required').max(64),
  categoryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use hex color e.g. #4A8DB8'),
  date: z.string().min(1, 'Date is required'),
  readTime: z.string().min(1, 'Read time is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  isPremium: z.boolean(),
  slug: z.string().min(1, 'Slug is required').max(120),
})

export type ArticleFormValues = z.infer<typeof formSchema>

interface Props {
  initial?: Article
  onSubmit: (values: ArticleFormValues) => Promise<void> | void
  onCancel: () => void
  isSubmitting?: boolean
}

const EMPTY: ArticleFormValues = {
  title: '',
  author: '',
  cat: 'm',
  categoryLabel: 'Mental Health',
  categoryColor: '#4A8DB8',
  date: '',
  readTime: '5 min',
  imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80',
  excerpt: '',
  isPremium: false,
  slug: '',
}

export function ArticleForm({ initial, onSubmit, onCancel, isSubmitting }: Props): React.ReactNode {
  const [values, setValues] = useState<ArticleFormValues>(() =>
    initial
      ? {
          title: initial.title,
          author: initial.author,
          cat: initial.cat,
          categoryLabel: initial.categoryLabel,
          categoryColor: initial.categoryColor,
          date: initial.date,
          readTime: initial.readTime,
          imageUrl: initial.imageUrl,
          excerpt: initial.excerpt,
          isPremium: initial.isPremium,
          slug: initial.slug,
        }
      : EMPTY
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ArticleFormValues, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const setField = <K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]): void => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setFormError(null)
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ArticleFormValues, string>> = {}
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof ArticleFormValues
        fieldErrors[path] = issue.message
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

      <Field label="Title" error={errors.title} required>
        <input
          type="text"
          value={values.title}
          onChange={(e) => setField('title', e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Author" error={errors.author} required>
          <input
            type="text"
            value={values.author}
            onChange={(e) => setField('author', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Slug" error={errors.slug} required>
          <input
            type="text"
            value={values.slug}
            onChange={(e) => setField('slug', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Category Code" error={errors.cat} required>
          <input
            type="text"
            value={values.cat}
            onChange={(e) => setField('cat', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Category Label" error={errors.categoryLabel} required>
          <input
            type="text"
            value={values.categoryLabel}
            onChange={(e) => setField('categoryLabel', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Color (hex)" error={errors.categoryColor} required>
          <input
            type="text"
            value={values.categoryColor}
            onChange={(e) => setField('categoryColor', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Date" error={errors.date} required>
          <input
            type="text"
            placeholder="Apr 19"
            value={values.date}
            onChange={(e) => setField('date', e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Read Time" error={errors.readTime} required>
          <input
            type="text"
            placeholder="8 min"
            value={values.readTime}
            onChange={(e) => setField('readTime', e.target.value)}
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

      <Field label="Excerpt" error={errors.excerpt} required>
        <textarea
          value={values.excerpt}
          onChange={(e) => setField('excerpt', e.target.value)}
          rows={3}
          className={`${INPUT_CLASS} resize-y`}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink-2 mt-1">
        <input
          type="checkbox"
          checked={values.isPremium}
          onChange={(e) => setField('isPremium', e.target.checked)}
        />
        Premium content
      </label>

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
          {isSubmitting ? 'Saving…' : initial ? 'Update Article' : 'Create Article'}
        </button>
      </div>

    </form>
  )
}
