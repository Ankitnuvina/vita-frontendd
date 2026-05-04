import React, { useState } from 'react'
import {
  useAdminArticles,
  useCreateArticle,
  useDeleteArticle,
  useUpdateArticle,
  type ArticleInput,
} from '@/features/admin/hooks/useAdminArticles'
import {
  AdminTableShell,
  ACTION_BUTTON_CLASS_DELETE,
  ACTION_BUTTON_CLASS_EDIT,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from '@/features/admin/components/AdminTableShell'
import { SlideOver } from '@/features/admin/components/SlideOver'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { ArticleForm, type ArticleFormValues } from '@/features/admin/components/ArticleForm'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article } from '@/globals/types'

export function AdminArticlesPage(): React.ReactNode {
  const articlesQuery = useAdminArticles()
  const createMutation = useCreateArticle()
  const updateMutation = useUpdateArticle()
  const deleteMutation = useDeleteArticle()

  const [editing, setEditing] = useState<Article | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Article | null>(null)

  const items = articlesQuery.data?.data ?? []

  const closePanel = (): void => {
    setEditing(null)
    setIsCreating(false)
  }

  const handleSubmit = async (values: ArticleFormValues): Promise<void> => {
    const payload: ArticleInput = values
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, input: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    closePanel()
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!confirmDelete) return
    await deleteMutation.mutateAsync(confirmDelete.id)
    setConfirmDelete(null)
  }

  const isPanelOpen = isCreating || editing !== null
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <AdminTableShell
        title="Articles"
        description={`Manage all ${articlesQuery.data?.total ?? 0} articles in the library.`}
        isLoading={articlesQuery.isLoading}
        isError={articlesQuery.isError}
        errorMessage={
          articlesQuery.isError ? getUserFriendlyMessage(articlesQuery.error) : undefined
        }
        onRetry={() => void articlesQuery.refetch()}
        isEmpty={items.length === 0}
        emptyLabel="No articles yet."
        onCreate={() => setIsCreating(true)}
        createLabel="New Article"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TABLE_HEADER_CLASS}>Article</th>
              <th className={TABLE_HEADER_CLASS}>Author</th>
              <th className={TABLE_HEADER_CLASS}>Category</th>
              <th className={TABLE_HEADER_CLASS}>Status</th>
              <th className={TABLE_HEADER_CLASS}>Date</th>
              <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-paper transition-colors">
                <td className={TABLE_CELL_CLASS}>
                  <div className="flex items-center gap-3">
                    <img
                      src={a.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate max-w-[280px]">{a.title}</p>
                      <p className="text-[10px] text-ink-4">{a.slug}</p>
                    </div>
                  </div>
                </td>
                <td className={TABLE_CELL_CLASS}>{a.author}</td>
                <td className={TABLE_CELL_CLASS}>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: a.categoryColor }}
                  >
                    {a.categoryLabel}
                  </span>
                </td>
                <td className={TABLE_CELL_CLASS}>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      a.isPremium
                        ? 'bg-tan-50 text-tan-400 border border-tan-100'
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}
                  >
                    {a.isPremium ? 'Premium' : 'Free'}
                  </span>
                </td>
                <td className={TABLE_CELL_CLASS}>{a.date}</td>
                <td className={`${TABLE_CELL_CLASS} text-right`}>
                  <div className="flex gap-1.5 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(a)}
                      className={ACTION_BUTTON_CLASS_EDIT}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(a)}
                      className={ACTION_BUTTON_CLASS_DELETE}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <SlideOver
        open={isPanelOpen}
        onClose={closePanel}
        title={editing ? 'Edit Article' : 'New Article'}
        description={editing ? `Editing #${editing.id}` : 'Create a new article'}
      >
        <ArticleForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closePanel}
          isSubmitting={isSubmitting}
        />
      </SlideOver>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete article?"
        message={`Are you sure you want to delete "${confirmDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
