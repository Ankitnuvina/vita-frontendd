import React, { useState } from 'react'
import { useAdminExperts, useCreateExpert, useDeleteExpert, useUpdateExpert,
  type ExpertInput,
} from '@/features/admin/hooks/useAdminExperts'
import { AdminTableShell, ACTION_BUTTON_CLASS_DELETE, ACTION_BUTTON_CLASS_EDIT, TABLE_CELL_CLASS, TABLE_HEADER_CLASS,} from '@/features/admin/components/AdminTableShell'
import { SlideOver } from '@/features/admin/components/SlideOver'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { ExpertForm, type ExpertFormValues } from '@/features/admin/components/ExpertForm'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Expert } from '@/globals/types'

export function AdminExpertsPage(): React.ReactNode {
  const expertsQuery = useAdminExperts()
  const createMutation = useCreateExpert()
  const updateMutation = useUpdateExpert()
  const deleteMutation = useDeleteExpert()

  const [editing, setEditing] = useState<Expert | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Expert | null>(null)

  const items = expertsQuery.data?.data ?? []

  const closePanel = (): void => {
    setEditing(null)
    setIsCreating(false)
  }

  const handleSubmit = async (values: ExpertFormValues): Promise<void> => {
    const payload: ExpertInput = values
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
        title="Experts"
        description={`Manage all ${expertsQuery.data?.total ?? 0} expert profiles.`}
        isLoading={expertsQuery.isLoading}
        isError={expertsQuery.isError}
        errorMessage={
          expertsQuery.isError ? getUserFriendlyMessage(expertsQuery.error) : undefined
        }
        onRetry={() => void expertsQuery.refetch()}
        isEmpty={items.length === 0}
        emptyLabel="No experts yet."
        onCreate={() => setIsCreating(true)}
        createLabel="New Expert"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TABLE_HEADER_CLASS}>Expert</th>
              <th className={TABLE_HEADER_CLASS}>Role</th>
              <th className={TABLE_HEADER_CLASS}>Credentials</th>
              <th className={TABLE_HEADER_CLASS}>Articles</th>
              <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id} className="hover:bg-paper transition-colors">
                <td className={TABLE_CELL_CLASS}>
                  <div className="flex items-center gap-3">
                    <img
                      src={e.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-green-100"
                    />
                    <p className="font-semibold text-ink">{e.name}</p>
                  </div>
                </td>
                <td className={TABLE_CELL_CLASS}>{e.role}</td>
                <td className={TABLE_CELL_CLASS}>
                  <span className="truncate inline-block max-w-[280px]">{e.credentials}</span>
                </td>
                <td className={TABLE_CELL_CLASS}>📝 {e.articleCount}</td>
                <td className={`${TABLE_CELL_CLASS} text-right`}>
                  <div className="flex gap-1.5 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(e)}
                      className={ACTION_BUTTON_CLASS_EDIT}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(e)}
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
        title={editing ? 'Edit Expert' : 'New Expert'}
        description={editing ? `Editing #${editing.id}` : 'Add a credentialed expert'}
      >
        <ExpertForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closePanel}
          isSubmitting={isSubmitting}
        />
      </SlideOver>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete expert?"
        message={`Are you sure you want to delete ${confirmDelete?.name}'s profile? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
