import React, { useMemo, useState } from 'react'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { useExperts } from '@/features/experts/hooks/useExperts'
import { useAuthStore } from '@/store/auth.store'
import { ArticleCard } from '@/components/feature/ArticleCard'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Expert } from '@/globals/types'

// ─── Article Modal ────────────────────────────────────────────────────────────

interface ArticleModalProps {
  expert: Expert
  onClose: () => void
}

function ArticleModal({ expert, onClose }: ArticleModalProps): React.ReactNode {
  const articlesQuery = useArticles()

  const expertArticles = useMemo(() => {
    if (!articlesQuery.data) return []
    return articlesQuery.data.filter((a) => a.author === expert.name)
  }, [articlesQuery.data, expert.name])

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      {/* Modal panel — stop click bubbling so backdrop click works */}
      <div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={expert.imageUrl}
              alt={expert.name}
              className="h-10 w-10 rounded-full object-cover border border-green-100"
            />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">
                Articles by
              </p>
              <h2 className="font-serif text-lg font-black text-ink">{expert.name}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-3 hover:bg-gray-100 hover:text-ink transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {articlesQuery.isLoading && <ArticleCardSkeleton count={3} />}

          {articlesQuery.isError && (
            <ErrorMessage
              message={getUserFriendlyMessage(articlesQuery.error)}
              onRetry={() => void articlesQuery.refetch()}
            />
          )}

          {!articlesQuery.isLoading && !articlesQuery.isError && expertArticles.length === 0 && (
            <EmptyState message="No articles from this expert yet." icon="📝" />
          )}

          {expertArticles.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {expertArticles.map((article) => (
                <ArticleCard key={article.id} article={article} size="md" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Expert Card ──────────────────────────────────────────────────────────────

interface ExpertCardProps {
  expert: Expert
  onViewArticles: (expert: Expert) => void
}

function ExpertCard({ expert, onViewArticles }: ExpertCardProps): React.ReactNode {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
      <div className="h-24 w-24 overflow-hidden rounded-full border border-green-100 bg-gray-50 mb-4">
        <img
          src={expert.imageUrl}
          alt={expert.name}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="font-serif text-lg font-black text-ink">{expert.name}</h3>
      <p className="mt-1 text-xs font-semibold text-green-600">{expert.role}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-3 line-clamp-3">{expert.credentials}</p>
      <button
        type="button"
        onClick={() => onViewArticles(expert)}
        className="mt-5 w-full rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors"
      >
        View Articles
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ExpertDetailPage(): React.ReactNode {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const expertsQuery = useExperts()
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)

  // Not logged in — show nothing (gate)
  if (!isAuthenticated) {
    return (
      <main id="main-content" className="max-w-[1100px] mx-auto px-5 py-12">
        <EmptyState
          message="Please log in to view our expert profiles."
          icon="🔒"
        />
      </main>
    )
  }

  if (expertsQuery.isLoading) {
    return (
      <main id="main-content" className="max-w-[1100px] mx-auto px-5 py-12">
        <ArticleCardSkeleton count={6} />
      </main>
    )
  }

  if (expertsQuery.isError) {
    return (
      <main id="main-content" className="max-w-[1100px] mx-auto px-5 py-12">
        <ErrorMessage
          message={getUserFriendlyMessage(expertsQuery.error)}
          onRetry={() => void expertsQuery.refetch()}
        />
      </main>
    )
  }

  const experts = expertsQuery.data ?? []

  return (
    <>
      <main id="main-content">
        {/* Page header */}
        <section className="bg-gradient-to-br from-green-50 via-paper to-tan-50 border-b border-border py-10">
          <div className="max-w-[1100px] mx-auto px-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-green-600">
              Meet the Team
            </p>
            <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-black tracking-tight text-ink">
              Our Experts
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-3">
              Science-backed health wisdom from doctors, nutritionists, and wellness specialists.
            </p>
          </div>
        </section>

        {/* Expert grid */}
        <section className="max-w-[1100px] mx-auto px-5 py-12">
          {experts.length === 0 ? (
            <EmptyState message="No experts found." icon="🧑‍⚕️" />
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {experts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  onViewArticles={setSelectedExpert}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Article modal */}
      {selectedExpert && (
        <ArticleModal
          expert={selectedExpert}  
          onClose={() => setSelectedExpert(null)}
        />
      )}
    </>
  )
}