import React, { useState } from 'react'
import { z } from 'zod'
import type { Article } from '@/globals/types'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Field, FORM_INPUT_CLASS as INPUT_CLASS } from '@/features/admin/components/formField'
import { X, Image as ImageIcon, ChevronDown, CalendarDays } from 'lucide-react'

import { useAdminExperts } from '../hooks/useAdminExperts'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  author: z.string().min(1, 'Author is required').max(120),
  cat: z.string().min(1).max(8),
  categoryLabel: z.string().min(1, 'Category label is required').max(64),
  categoryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Use hex color e.g'),
  date: z.string().min(1, 'Date is required'),
  readTime: z.string().min(1, 'Read time is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  articleStatus: z.enum(['draft', 'published', 'scheduled']),
  isPremium: z.boolean(),
  slug: z.string().min(1, 'Slug is required').max(120),
  sections: z.array(z.object({ heading: z.string().min(1).max(200), items: z.array(z.string().min(1)).min(1), })).optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().min(1).max(200).optional(),
  seoDescription: z.string().min(1).max(500).optional(),

  expertId: z.number().optional(),
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
  articleStatus: 'draft',
  isPremium: false,
  slug: '',
  sections: [],
  tags: [],
  seoTitle: '',
  seoDescription: '',

  expertId: undefined,
}

export function ArticleForm({ initial, onSubmit, onCancel, isSubmitting }: Props): React.ReactNode {

  const { data: expertsData } = useAdminExperts()
  const experts = expertsData?.data ?? []

  const [isOpen, setIsOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tagInput, setTagInput] = useState('')

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
        articleStatus: initial.articleStatus,
        isPremium: initial.isPremium,
        slug: initial.slug,
        sections: initial.sections ?? [],
        tags: initial.tags ?? [],
        seoTitle: initial.seoTitle ?? '',
        seoDescription: initial.seoDescription ?? '',

        expertId: initial.expertId,
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

      {/* Articles Image with url  */}
      <Field label="Image" error={errors.imageUrl} required>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              id="image-file-picker"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  const formData = new FormData()
                  formData.append('image', file)
                  const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/admin/upload-image`,
                    {
                      method: 'POST',
                      credentials: 'include',
                      body: formData,
                    }
                  )
                  const data = await response.json()
                  setField('imageUrl', data.imageUrl)
                } catch (error) {
                  console.error(error)
                }
              }}
            />
            <label
              htmlFor="image-file-picker"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" />
              Browse
            </label>
            <input
              type="url"
              value={values.imageUrl}
              placeholder="https://..."
              onChange={(e) => setField('imageUrl', e.target.value)}
              className={`${INPUT_CLASS} flex-1 min-w-0`}
            />
          </div>
          {values.imageUrl && (
            <div className="relative w-full h-40 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
              <img
                src={values.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setField('imageUrl', '')}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </Field>

      {/* Articles category code , category label and category color  */}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Category Label" error={errors.categoryLabel} required>
          <input
            type="text"
            value={values.categoryLabel}
            onChange={(e) => setField('categoryLabel', e.target.value)}
            className={INPUT_CLASS}
            maxLength={64}
          />
          <div className="text-right text-xs text-neutral-400">
            {values.categoryLabel.length}/64
          </div>
        </Field>
        <Field label="Color (hex)" error={errors.categoryColor} required>
          <div className="flex items-center gap-2 w-full border border-border rounded-xl px-3.5 py-1.5 bg-white focus-within:border-green-400 transition-colors">
            <input
              type="color"
              value={values.categoryColor}
              onChange={(e) => setField('categoryColor', e.target.value)}
              className="w-5 h-5 rounded-md cursor-pointer border-0 p-0 bg-transparent flex-shrink-0"
              style={{ backgroundColor: values.categoryColor }}
            />
            <input
              type="text"
              value={values.categoryColor}
              onChange={(e) => setField('categoryColor', e.target.value)}
              className="flex-1 text-sm text-ink outline-none bg-transparent"
              placeholder="#4A8DB8"
            />
          </div>
        </Field>
        <Field label="Category Code" error={errors.cat} required>
          <input
            type="text"
            value={values.cat}
            onChange={(e) => setField('cat', e.target.value)}
            className={INPUT_CLASS}
            maxLength={8}
          />
          <div className="text-right text-xs text-neutral-400">
            {values.cat.length}/8
          </div>
        </Field>
      </div>

      {/* Articles Free & Premium  */}
      <label className="flex items-center gap-2 text-sm text-ink-2 mt-1">
        <input
          type="checkbox"
          checked={values.isPremium}
          onChange={(e) => setField('isPremium', e.target.checked)}
        />
        Premium content
      </label>

      {/* Article Status  */}
      <Field label="Article Status">
        <div className="relative">
          <select
            value={values.articleStatus}
            onChange={(e) =>
              setField(
                'articleStatus',
                e.target.value as 'draft' | 'published' | 'scheduled'
              )
            }
            onClick={() => setIsOpen((prev) => !prev)}
            onBlur={() => setIsOpen(false)}
            className={`${INPUT_CLASS} appearance-none cursor-pointer pr-10`}
          >
            <option value="" disabled>
              Select Your Article Status..
            </option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-500">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                }`}
            />
          </div>
        </div>
      </Field>

      {/* Articles Author & Slug  */}
      <div className="grid grid-cols-2 gap-3">
        {/* <Field label="Author" error={errors.author} required>
          <input
            type="text"
            value={values.author}
            onChange={(e) => setField('author', e.target.value)}
            className={INPUT_CLASS}
            maxLength={120}
          />
          <div className="text-right text-xs text-neutral-400">
            {values.author.length}/120
          </div>
        </Field> */}
        <Field label="Author" error={errors.author} required>
          <select
            value={values.expertId ?? 'normal'}
            onChange={(e) => {
              if (e.target.value === 'normal') {
                setField('expertId', undefined)
              } else {
                const expert = experts.find((ex) => ex.id === Number(e.target.value))
                if (expert) {
                  setField('expertId', expert.id)
                  setField('author', expert.name)
                }
              }
            }}
            className={INPUT_CLASS}
          >
            <option value="normal">✍️ Normal (Manual)</option>
            {experts.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} — {ex.role}
              </option>
            ))}
          </select>

          {/* Normal selected — manual input */}
          {!values.expertId && (
            <input
              type="text"
              placeholder="Author name..."
              value={values.author}
              onChange={(e) => setField('author', e.target.value)}
              className={`${INPUT_CLASS} mt-2`}
              maxLength={120}
            />
          )}

          {/* Expert selected — preview card */}
          {values.expertId && (() => {
            const ex = experts.find((e) => e.id === values.expertId)
            return ex ? (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                <img src={ex.imageUrl} alt={ex.name} className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-semibold text-green-800">{ex.name}</p>
                  <p className="text-[10px] text-green-600">{ex.role}</p>
                </div>
              </div>
            ) : null
          })()}

          <div className="text-right text-xs text-neutral-400">
            {values.author.length}/120
          </div>
        </Field>
        <Field label="Slug" error={errors.slug} required>
          <input
            type="text"
            value={values.slug}
            onChange={(e) => setField('slug', e.target.value)}
            className={INPUT_CLASS}
            maxLength={120}
          />
          <div className="text-right text-xs text-neutral-400">
            {values.slug.length}/120
          </div>
        </Field>
      </div>

      {/* Articles Date & Read time  */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Publish Date" error={errors.date} required>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`${INPUT_CLASS} flex items-center justify-between cursor-pointer text-left`}
            >
              <span
                className={
                  values.date
                    ? 'text-neutral-800'
                    : 'text-neutral-400'
                }
              >
                {values.date || 'Select Article Date..'}
              </span>
              <CalendarDays className="w-4 h-4 text-neutral-500" />
            </button>
            {showDatePicker && (
              <div className="absolute z-50 mt-2 w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
                <input
                  type="date"
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value)
                    const formatted = selectedDate.toLocaleDateString(
                      'en-GB',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      }
                    )
                    setField('date', formatted)
                  }}
                  className={`${INPUT_CLASS} w-full`}
                />
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="mt-3 w-full rounded-xl bg-black text-white py-2 text-sm font-medium hover:opacity-90 transition"
                >
                  Set Date
                </button>
              </div>
            )}
          </div>
        </Field>

        <Field label="Read Time" error={errors.readTime} required>
          <input
            type="text"
            placeholder="8 min"
            value={values.readTime}
            onChange={(e) => setField('readTime', e.target.value)}
            className={INPUT_CLASS}
            maxLength={16}
          />
          <div className="text-right text-xs text-neutral-400">
            {values.readTime.length}/16
          </div>
        </Field>
      </div>

      {/* Articles Title */}
      <Field label="Title" error={errors.title} required>
        <div className="space-y-1">
          <input
            type="text"
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            className={INPUT_CLASS}
            placeholder="Enter article title..."
            maxLength={200}
          />
          <div className="text-right text-xs text-neutral-400">
            {values.title.length}/200
          </div>
        </div>
      </Field>

      {/* Articles Excerpt  */}
      <Field label="Excerpt" error={errors.excerpt} required>
        <textarea
          value={values.excerpt}
          onChange={(e) => setField('excerpt', e.target.value)}
          rows={3}
          className={`${INPUT_CLASS} resize-y`}
          maxLength={500}
        />
        <div className="text-right text-xs text-neutral-400">
          {values.excerpt.length}/500
        </div>
      </Field>

      {/* Tags add  */}
      <Field label="Tags">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add tags..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className={INPUT_CLASS}
            />
            <button
              type="button"
              onClick={() => {
                const trimmedTag = tagInput.trim()

                if (!trimmedTag) return

                setField('tags', [
                  ...(values.tags ?? []),
                  trimmedTag,
                ])

                setTagInput('')
              }}
              className="px-4 rounded-xl bg-green-500 text-white text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(values.tags ?? []).map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setField(
                      'tags',
                      values.tags?.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Field>

      {/* SEO part title and des  */}
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-sm">SEO Settings</h3>
        <Field label="SEO Title">
          <input
            type="text"
            placeholder='Enter SEO title...'
            value={values.seoTitle}
            onChange={(e) =>
              setField('seoTitle', e.target.value.slice(0, 200))
            }
            className={INPUT_CLASS}
            maxLength={200}
          />
          <div className="text-right text-xs text-neutral-400">
            {(values.seoTitle ?? '').length}/200
          </div>
        </Field>
        <Field label="SEO Description">
          <textarea
            rows={3}
            value={values.seoDescription}
            onChange={(e) =>
              setField('seoDescription', e.target.value.slice(0, 500))
            }
            className={`${INPUT_CLASS} resize-none`}
            maxLength={500}
          />
          <div className="text-right text-xs text-neutral-400">
            {(values.seoDescription ?? '').length}/500
          </div>
        </Field>
      </div>

      {/* Articles Sections Multiples */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-ink-2">Sections</label>
          <button
            type="button"
            onClick={() => setField('sections', [...(values.sections ?? []), { heading: '', items: [''] }])}
            className="flex items-center gap-1 text-xs font-semibold text-green-500 border border-green-400 rounded-full px-3 py-1 hover:bg-green-50 transition-colors"
          >
            <span className="text-base leading-none">+</span> Add Section
          </button>
        </div>
        {(values.sections ?? []).length === 0 && (
          <p className="text-xs text-ink-3 text-center py-3 border border-dashed border-border rounded-xl">
            No sections yet — click <strong>+ Add Section</strong> to add
          </p>
        )}
        {(values.sections ?? []).map((section, sIdx) => (
          <div key={sIdx} className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 border-b border-border">
              <span className="text-xs font-bold text-ink-2 w-5 text-center">{sIdx + 1}</span>
              <input
                type="text"
                placeholder="Enter Section heading..."
                value={section.heading}
                onChange={(e) =>
                  setField('sections', (values.sections ?? []).map((s, i) =>
                    i === sIdx ? { ...s, heading: e.target.value } : s
                  ))
                }
                className="flex-1 text-sm text-ink bg-transparent outline-none placeholder:text-ink-3"
              />
              <button
                type="button"
                onClick={() =>
                  setField('sections', (values.sections ?? []).filter((_, i) => i !== sIdx))
                }
                className="text-gray-400 hover:text-green-600 text-xs font-bold px-2"
              >
                ✕
              </button>
            </div>
            {/* List Items */}
            <div className="flex flex-col divide-y divide-border">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center gap-2 px-3 py-2">
                  <span className="text-ink-3 text-xs">•</span>
                  <input
                    type="text"
                    placeholder={`Item ${iIdx + 1}...`}
                    value={item}
                    onChange={(e) =>
                      setField('sections', (values.sections ?? []).map((s, i) =>
                        i === sIdx
                          ? { ...s, items: s.items.map((it, j) => (j === iIdx ? e.target.value : it)) }
                          : s
                      ))
                    }
                    className="flex-1 text-sm text-ink bg-transparent outline-none placeholder:text-ink-3"
                  />
                  {section.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setField('sections', (values.sections ?? []).map((s, i) =>
                          i === sIdx
                            ? { ...s, items: s.items.filter((_, j) => j !== iIdx) }
                            : s
                        ))
                      }
                      className="text-gray-400 hover:text-green-500 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* Add Item Button */}
            <div className="px-3 py-2 bg-gray-50 border-t border-border">
              <button
                type="button"
                onClick={() =>
                  setField('sections', (values.sections ?? []).map((s, i) =>
                    i === sIdx ? { ...s, items: [...s.items, ''] } : s
                  ))
                }
                className="text-xs text-green-500 font-semibold hover:text-green-600"
              >
                + Add item
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Preview Button Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPreview(false) }}
        >
          <div className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
            <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                  <span className="text-sm">📄</span>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-neutral-800">Article Preview</p>
                  <p className="text-[11px] text-neutral-400">Live preview of your article</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hero Image */}
            {values.imageUrl && (
              <div className="relative w-full h-56 bg-neutral-100">
                <img
                  src={values.imageUrl}
                  alt={values.title}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            )}

            {/* Badges row — below image */}
            <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-neutral-100">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                style={{
                  color: values.categoryColor,
                  borderColor: values.categoryColor,
                  backgroundColor: `${values.categoryColor}18`,
                }}
              >
                {values.categoryLabel || 'Category'}
              </span>
              {values.isPremium && (
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Premium
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${values.articleStatus === 'published'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : values.articleStatus === 'draft'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
              >
                {values.articleStatus}
              </span>
            </div>

            <div className="px-6 py-2 flex flex-col gap-5">
              <div className="flex items-center gap-3 text-[12px] text-neutral-500 flex-wrap border-b border-neutral-200 pb-4">
                <span className="font-semibold text-neutral-700">
                  {values.author}
                </span>
                <span className="opacity-30">•</span>
                <span>{values.date}</span>
                <span className="opacity-30">•</span>
                <span>{values.readTime}</span>
                <span className="opacity-30">•</span>
                <span className="truncate max-w-[180px] text-neutral-400">
                  {values.slug}
                </span>
              </div>

              {/* Article Title */}
              <div className="flex flex-col gap-2">
                <h1 className="text-[22px] font-bold text-neutral-900 leading-snug tracking-tight">
                  {values.title}
                </h1>
                <div
                  className="w-14 h-[3px] rounded-full"
                  style={{ backgroundColor: values.categoryColor }}
                />
              </div>

              {/* Excerpt */}
              {values.excerpt && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-400">
                    Excerpt
                  </p>

                  <p
                    className="text-[13.5px] text-neutral-500 leading-relaxed italic pl-4 border-l-[3px]"
                    style={{ borderColor: values.categoryColor }}
                  >
                    {values.excerpt}
                  </p>
                </div>
              )}

              {/* Tags */}
              {values.tags && values.tags.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-400">
                    Tags ({values.tags.length})
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {values.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Preview */}
              {(values.seoTitle || values.seoDescription) && (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-400">
                    SEO Preview
                  </p>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex flex-col gap-1.5">

                    {values.seoTitle && (
                      <p className="text-[14px] font-semibold text-black leading-snug">
                        {values.seoTitle}
                      </p>
                    )}

                    {values.seoDescription && (
                      <p className="text-[12px] text-neutral-500 leading-relaxed">
                        {values.seoDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Sections */}
              {values.sections && values.sections.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-neutral-800">
                      💬  About Sections
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Total = {values.sections.length} section
                      {values.sections.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  {values.sections.map((section, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-2xl border border-neutral-200 overflow-hidden bg-white"
                    >
                      {/* Section Header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-100">

                        <div className="w-6 h-6 rounded-md bg-black/50 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {sIdx + 1}
                        </div>
                        <p className="text-[13px] font-semibold text-neutral-800">
                          {section.heading}
                        </p>
                      </div>

                      {/* Section Items */}
                      <div className="flex flex-col divide-y divide-neutral-100">
                        {section.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-start gap-3 px-4 py-2"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black flex-shrink-0" />

                            <p className="text-[13px] text-neutral-600 leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs font-semibold text-ink-2 border border-border rounded-full px-4 py-2 hover:border-ink-3 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        {/* Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="text-xs font-semibold text-green-500 border border-green-400 rounded-full px-4 py-2 hover:bg-green-50 transition-colors"
        >
          Preview
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
