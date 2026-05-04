import React, { useState } from 'react'
import {
  useAdminPodcasts,
  useCreatePodcast,
  useDeletePodcast,
  useUpdatePodcast,
  type PodcastInput,
} from '@/features/admin/hooks/useAdminPodcasts'
import {
  AdminTableShell,
  ACTION_BUTTON_CLASS_DELETE,
  ACTION_BUTTON_CLASS_EDIT,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from '@/features/admin/components/AdminTableShell'
import { SlideOver } from '@/features/admin/components/SlideOver'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { PodcastForm, type PodcastFormValues } from '@/features/admin/components/PodcastForm'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Podcast } from '@/globals/types'

export function AdminPodcastsPage(): React.ReactNode {
  const podcastsQuery = useAdminPodcasts()
  const createMutation = useCreatePodcast()
  const updateMutation = useUpdatePodcast()
  const deleteMutation = useDeletePodcast()

  const [editing, setEditing] = useState<Podcast | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Podcast | null>(null)

  const items = podcastsQuery.data?.data ?? []

  const closePanel = (): void => {
    setEditing(null)
    setIsCreating(false)
  }

  const handleSubmit = async (values: PodcastFormValues): Promise<void> => {
    const payload: PodcastInput = values
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
        title="Podcasts"
        description={`Manage all ${podcastsQuery.data?.total ?? 0} podcast episodes.`}
        isLoading={podcastsQuery.isLoading}
        isError={podcastsQuery.isError}
        errorMessage={
          podcastsQuery.isError ? getUserFriendlyMessage(podcastsQuery.error) : undefined
        }
        onRetry={() => void podcastsQuery.refetch()}
        isEmpty={items.length === 0}
        emptyLabel="No podcast episodes yet."
        onCreate={() => setIsCreating(true)}
        createLabel="New Episode"
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TABLE_HEADER_CLASS}>Episode</th>
              <th className={TABLE_HEADER_CLASS}>Title</th>
              <th className={TABLE_HEADER_CLASS}>Guest</th>
              <th className={TABLE_HEADER_CLASS}>Duration</th>
              <th className={TABLE_HEADER_CLASS}>Date</th>
              <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-paper transition-colors">
                <td className={TABLE_CELL_CLASS}>
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-ink">{p.episode}</p>
                      <p className="text-[10px] text-ink-4">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className={TABLE_CELL_CLASS}>
                  <p className="font-semibold text-ink truncate max-w-[260px]">{p.title}</p>
                </td>
                <td className={TABLE_CELL_CLASS}>{p.guest}</td>
                <td className={TABLE_CELL_CLASS}>{p.duration}</td>
                <td className={TABLE_CELL_CLASS}>{p.date}</td>
                <td className={`${TABLE_CELL_CLASS} text-right`}>
                  <div className="flex gap-1.5 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className={ACTION_BUTTON_CLASS_EDIT}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(p)}
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
        title={editing ? 'Edit Episode' : 'New Episode'}
        description={editing ? `Editing #${editing.id}` : 'Create a new podcast episode'}
      >
        <PodcastForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closePanel}
          isSubmitting={isSubmitting}
        />
      </SlideOver>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Delete episode?"
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
