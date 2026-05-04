import React, { useState } from 'react'
import {
  useAdminTips,
  useCreateTip,
  useDeleteTip,
  useUpdateTip,
  type TipInput,
} from '@/features/admin/hooks/useAdminTips'
import {
  AdminTableShell,
  ACTION_BUTTON_CLASS_DELETE,
  ACTION_BUTTON_CLASS_EDIT,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from '@/features/admin/components/AdminTableShell'
import { SlideOver } from '@/features/admin/components/SlideOver'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { TipForm, type TipFormValues } from '@/features/admin/components/TipForm'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { WellnessTip } from '@/globals/types'

function toInput(values: TipFormValues): TipInput {
  return {
    icon: values.icon,
    title: values.title,
    text: values.text,
    colors: { bg: values.bg, border: values.border },
  }
}

export function AdminTipsPage(): React.ReactNode {
  const tipsQuery = useAdminTips()
  const createMutation = useCreateTip()
  const updateMutation = useUpdateTip()
  const deleteMutation = useDeleteTip()

  const [editing, setEditing] = useState<WellnessTip | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<WellnessTip | null>(null)

  const items = tipsQuery.data?.data ?? []

  const closePanel = (): void => {
    setEditing(null)
    setIsCreating(false)
  }

  const handleSubmit = async (values: TipFormValues): Promise<void> => {
    const payload = toInput(values)
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
        title="Wellness Tips"
        description={`Manage all ${tipsQuery.data?.total ?? 0} tips shown on the homepage.`}
        isLoading={tipsQuery.isLoading}
        isError={tipsQuery.isError}
        errorMessage={tipsQuery.isError ? getUserFriendlyMessage(tipsQuery.error) : undefined}
        onRetry={() => void tipsQuery.refetch()}
        isEmpty={items.length === 0}
        emptyLabel="No tips yet."
        onCreate={() => setIsCreating(true)}
        createLabel="New Tip"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TABLE_HEADER_CLASS}>Tip</th>
              <th className={TABLE_HEADER_CLASS}>Title</th>
              <th className={TABLE_HEADER_CLASS}>Text</th>
              <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-paper transition-colors">
                <td className={TABLE_CELL_CLASS}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: t.colors.bg, border: `1px solid ${t.colors.border}` }}
                  >
                    {t.icon}
                  </div>
                </td>
                <td className={TABLE_CELL_CLASS}>
                  <p className="font-semibold text-ink">{t.title}</p>
                </td>
                <td className={TABLE_CELL_CLASS}>
                  <p className="text-ink-3 truncate max-w-[420px]">{t.text}</p>
                </td>
                <td className={`${TABLE_CELL_CLASS} text-right`}>
                  <div className="flex gap-1.5 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(t)}
                      className={ACTION_BUTTON_CLASS_EDIT}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(t)}
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
        title={editing ? 'Edit Tip' : 'New Tip'}
        description={editing ? `Editing #${editing.id}` : 'Create a new wellness tip'}
      >
        <TipForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closePanel}
          isSubmitting={isSubmitting}
        />
      </SlideOver>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete tip?"
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
