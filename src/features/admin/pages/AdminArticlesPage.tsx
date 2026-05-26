import React, { useState, useMemo } from 'react'
import { useAdminArticles, useCreateArticle, useDeleteArticle, useUpdateArticle, type ArticleInput,} from '@/features/admin/hooks/useAdminArticles'
import { AdminTableShell, ACTION_BUTTON_CLASS_DELETE, ACTION_BUTTON_CLASS_EDIT, TABLE_CELL_CLASS, TABLE_HEADER_CLASS,} from '@/features/admin/components/AdminTableShell'
import { SlideOver } from '@/features/admin/components/SlideOver'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { ArticleForm, type ArticleFormValues } from '@/features/admin/components/ArticleForm'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article } from '@/globals/types'
import { X } from 'lucide-react'

export function AdminArticlesPage(): React.ReactNode {
  const [viewing, setViewing] = useState<Article | null>(null)

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

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const ARTICLES_PER_PAGE = 10

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter((a) =>
      a.title?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q) ||
      a.categoryLabel?.toLowerCase().includes(q) ||
      a.articleStatus?.toLowerCase().includes(q) ||
      (a.isPremium ? 'premium' : 'free').includes(q)
    )
  }, [items, search])

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE)

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
        <div className="px-6 py-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4 text-[12px]" />
            <input
              type="text"
              placeholder="Search by title, author, category, status, access…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-paper text-[12px] outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1) }}
              className="text-[11px] text-ink-3 hover:text-ink transition-colors flex items-center gap-1"
            >
              <i className="fa-solid fa-xmark" /> Clear
            </button>
          )}
          {search && (
            <p className="text-[11px] text-ink-3">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className={TABLE_HEADER_CLASS}>Article</th>
              <th className={TABLE_HEADER_CLASS}>Author</th>
              <th className={TABLE_HEADER_CLASS}>Category</th>
              <th className={TABLE_HEADER_CLASS}>SEO</th>
              <th className={TABLE_HEADER_CLASS}>Articles Status</th>
              <th className={TABLE_HEADER_CLASS}>Access</th>
              <th className={TABLE_HEADER_CLASS}>Publisted Date</th>
              <th className={TABLE_HEADER_CLASS}>Sections</th>
              <th className={TABLE_HEADER_CLASS}>Tags</th>
              <th className={`${TABLE_HEADER_CLASS} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a) => (
              <React.Fragment key={a.id}>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className={TABLE_CELL_CLASS}>
                    <div className="flex items-center gap-3">
                      <img
                        src={a.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate max-w-[150px]">{a.title}</p>
                        <p className="text-gray-500 truncate max-w-[150px]">{a.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Table for Author  */}
                  <td className={TABLE_CELL_CLASS}>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate max-w-[110px]">{a.author}</p>
                    </div>
                  </td>

                  {/* Table for category color and label  */}
                  <td className={TABLE_CELL_CLASS}>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.06em] "
                      style={{ color: a.categoryColor }}
                    >
                      <p className='truncate max-w-[110px]'>  {a.categoryLabel}</p>
                    </span>
                  </td>

                  {/* Table for SEO title and Desp.  */}
                  <td className={TABLE_CELL_CLASS}>
                    {a.seoTitle || a.seoDescription ? (
                      <div className="flex flex-col gap-0.5 max-w-[90px]">
                        {a.seoTitle && (
                          <p className="text-[11px] font-medium text-blue-600 truncate">
                            {a.seoTitle}
                          </p>
                        )}
                        {a.seoDescription && (
                          <p className="text-[10px] text-neutral-400 truncate">
                            {a.seoDescription}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-ink-4 text-xs">—</span>
                    )}
                  </td>

                  {/* Table for article status  */}
                  <td className={TABLE_CELL_CLASS}>
                    {a.articleStatus ? (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${a.articleStatus === 'published'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : a.articleStatus === 'draft'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                      >
                        {a.articleStatus}
                      </span>
                    ) : (
                      <span className="text-ink-4 text-xs">-</span>
                    )}
                  </td>

                  {/* Table for Premium / Free Access */}
                  <td className={TABLE_CELL_CLASS}>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${a.isPremium
                        ? 'bg-[#f6c418]/10 text-[#f6c418] border-[#f6c418]/20'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}
                    >
                      {a.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>

                  {/* Table for Date  */}
                  <td className={TABLE_CELL_CLASS}>
                    <p className='truncate max-w-[80px]'>{a.date}</p>
                  </td>

                  {/* Table for Sections Count */}
                  <td className={TABLE_CELL_CLASS}>
                    {a.sections && a.sections.length > 0 ? (
                      <span className="text-[10px] font-semibold text-ink-2 bg-paper border border-border rounded-full px-2 py-0.5">
                        {a.sections.length} {a.sections.length > 1 ? '' : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-ink-2 bg-paper border border-border rounded-full px-2 py-0.5">0</span>
                    )}
                  </td>

                  {/* Table for tags count  */}
                  <td className={TABLE_CELL_CLASS}>
                    {a.tags && a.tags.length > 0 ? (
                      <span className="text-[10px] font-semibold text-ink-2 bg-paper border border-border rounded-full px-2 py-0.5">
                        {a.tags.length} {a.tags.length > 1 ? '' : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-ink-2 bg-paper border border-border rounded-full px-2 py-0.5">0</span>
                    )}
                  </td>


                  {/* Table for action buttons edit and delete  */}
                  <td className={`${TABLE_CELL_CLASS} text-right`}>
                    <div className="flex gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => setViewing(a)}
                        className="text-xs text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-full px-3 py-1 transition-colors"
                      >
                        View
                      </button>
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
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between flex-wrap gap-3">
            <p className="text-[12px] text-ink-3">
              Showing {Math.min((page - 1) * ARTICLES_PER_PAGE + 1, filtered.length)}–
              {Math.min(page * ARTICLES_PER_PAGE, filtered.length)} of {filtered.length} articles
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-border bg-paper text-ink-3 flex items-center justify-center hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fa-solid fa-chevron-left text-[11px]" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-[12px] font-semibold transition-all ${p === page
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-border bg-paper text-ink-3 hover:border-green-400 hover:text-green-600'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-border bg-paper text-ink-3 flex items-center justify-center hover:border-green-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fa-solid fa-chevron-right text-[11px]" />
              </button>
            </div>
          </div>
        )}
      </AdminTableShell>

      {viewing && (
        <ArticleViewModal article={viewing} onClose={() => setViewing(null)} />
      )}

      <SlideOver
        open={isPanelOpen}
        onClose={closePanel}
        title={editing ? 'Edit Article' : 'Create Article'}
        description={editing ? `Editing #${editing.id}` : 'Build and publish your article'}
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

// View button for admin 
function ArticleViewModal({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl border border-neutral-200">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-sm">📜</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-neutral-800">Article Details</p>
              <p className="text-[11px] text-neutral-400"># Article Number [id] : {article.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-green-400 hover:text-neutral-700 hover:bg-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image */}
        {article.imageUrl && (
          <div className="relative w-full h-52 bg-neutral-100">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            {/* Overlaid badges on image */}
            <div className="flex flex-wrap items-center gap-2 px-3 py-3 bg-white border-neutral-200 rounded-b-2xl left-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-sm"
                style={{
                  color: article.categoryColor,
                  borderColor: article.categoryColor,
                  backgroundColor: `${article.categoryColor}22`,
                }}
              >
                {article.categoryLabel}
              </span>
              {article.isPremium && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-[#f6c418]/10 text-[#f6c418] border-[#f6c418]/20">
                  Premium
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm capitalize ${article.articleStatus === 'published'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : article.articleStatus === 'draft'
                    ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}
              >
                {article.articleStatus}
              </span>
            </div>
          </div>
        )}

        <div className="px-6 py-12 flex flex-col gap-5">
          <div className="flex items-center gap-3 text-[12px] text-neutral-500 flex-wrap border-b border-neutral-200 pb-4">
            <span className="font-semibold text-neutral-700">
              {article.author}
            </span>
            <span className="opacity-30">•</span>
            <span>{article.date}</span>
            <span className="opacity-30">•</span>
            <span>{article.readTime}</span>
            <span className="opacity-30">•</span>
            <span className="truncate max-w-[180px] text-neutral-400">
              {article.slug}
            </span>
          </div>

          {/* Article Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[22px] font-bold text-neutral-900 leading-snug tracking-tight">
              {article.title}
            </h1>
            <div
              className="w-14 h-[3px] rounded-full"
              style={{ backgroundColor: article.categoryColor }}
            />
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-400">
                Excerpt
              </p>

              <p
                className="text-[13.5px] text-neutral-500 leading-relaxed italic pl-4 border-l-[3px]"
                style={{ borderColor: article.categoryColor }}
              >
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-400">
                Tags ({article.tags.length})
              </p>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
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
          {(article.seoTitle || article.seoDescription) && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-400">
                SEO Preview
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex flex-col gap-1.5">

                {article.seoTitle && (
                  <p className="text-[14px] font-semibold text-black leading-snug">
                    {article.seoTitle}
                  </p>
                )}

                {article.seoDescription && (
                  <p className="text-[12px] text-neutral-500 leading-relaxed">
                    {article.seoDescription}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sections */}
          {article.sections && article.sections.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-800">
                  💬  About Sections
                </h2>
                <p className="text-xs text-neutral-400">
                  Total = {article.sections.length} section
                  {article.sections.length > 1 ? 's' : ''}
                </p>
              </div>
              {article.sections.map((section, sIdx) => (
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
  )
}
