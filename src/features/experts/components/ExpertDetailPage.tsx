import React, { useMemo, useState } from 'react'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { useExperts } from '@/features/experts/hooks/useExperts'
import { useAuthStore } from '@/store/auth.store'
import { ArticleCard } from '@/components/feature/ArticleCard'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article, Expert } from '@/globals/types'
import { Search } from 'lucide-react'
import { ArticleDetailModal } from '@/components/feature/ArticleDetailModal'

interface ArticleModalProps {
  expert: Expert
  onClose: () => void
}

export function ExpertDetailPage(): React.ReactNode {

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const expertsQuery = useExperts()
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)

  const [search, setSearch] = useState('')

  const experts = expertsQuery.data ?? []

  const filteredExperts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return experts
    return experts.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.credentials.toLowerCase().includes(q)
    )
  }, [experts, search])

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



  return (
    <>
      <main id="main-content">
        {/* Page header */}
        <section className="bg-gradient-to-br from-green-50 via-paper to-tan-50 border-b border-border py-10">
          <div className="max-w-[1100px] mx-auto px-5">
            <div>
              <div>
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

             <div>

            <div className="relative w-full sm:w-64 shrink-0">
              <label htmlFor="expert-search" className="sr-only">Search Experts</label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40" aria-hidden="true">
                <Search className='w-4 h-4' />
              </span>
              <input
                id="expert-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search experts..."
                className="bg-white border border-gray-300 rounded-full pl-8 pr-4 py-2 text-xs text-ink w-full outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>
            </div>

          </div>
         
        </section>

        {/* Expert grid */}
        <section className="max-w-[1100px] mx-auto px-5 py-12">
          {filteredExperts.length === 0 ? (
            <EmptyState message={search ? `No experts match "${search}"` : 'No experts found.'} />
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {filteredExperts.map((expert) => (
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

interface ExpertCardProps {
  expert: Expert
  onViewArticles: (expert: Expert) => void
}

function ExpertCard({ expert, onViewArticles }: ExpertCardProps): React.ReactNode {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
      <div className="h-24 w-24 overflow-hidden rounded-full border border-green-100 bg-gray-50 mb-4">
        <img src={expert.imageUrl} alt={expert.name} className="h-full w-full object-cover" />
      </div>
      <h3 className="font-serif text-lg font-black text-ink">{expert.name}</h3>
      <p className="mt-1 text-xs font-semibold text-green-600">{expert.role}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-3 line-clamp-3">{expert.credentials}</p>

      {/* <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1">
        <span className="text-green-500 font-bold">{expert.articleCount}</span>
        <span>{expert.articleCount === 1 ? 'article' : 'articles'}</span>
      </div> */}

      <button
        type="button"
        onClick={() => onViewArticles(expert)}
        className="mt-4 w-full text-[12px] font-bold text-white bg-green-500 border border-neutral-200 rounded-md py-2 hover:border-neutral-400 hover:text-white-700 transition-all duration-200"
      >
        View Articles          {expert.articleCount}
      </button>
    </div>
  )
}

function ArticleModal({ expert, onClose }: ArticleModalProps): React.ReactNode {
  const articlesQuery = useArticles()
  const [search, setSearch] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const expertArticles = useMemo(() => {
    if (!articlesQuery.data) return []
    return articlesQuery.data.filter((a) => a.author === expert.name)
  }, [articlesQuery.data, expert.name])

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return expertArticles
    return expertArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.categoryLabel?.toLowerCase().includes(q) ||
        a.excerpt?.toLowerCase().includes(q)
    )
  }, [expertArticles, search])

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-md bg-white shadow-2xl scrollbar-none"
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

            {/* ← Dynamic search */}
            <div className="relative w-full sm:w-56 shrink-0">
              <label htmlFor="article-search" className="sr-only">Search articles</label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                id="article-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="bg-white border border-gray-200 rounded-full pl-8 pr-4 py-2 text-xs text-ink w-full outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-green-400 hover:text-neutral-700 hover:bg-green-100 transition-colors shrink-0 absolute right-0 top-0"
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
              <EmptyState message="No articles from this expert yet." />
            )}

            {/* ← Search empty state */}
            {!articlesQuery.isLoading && expertArticles.length > 0 && filteredArticles.length === 0 && (
              <EmptyState message={`No articles match "${search}"`} />
            )}

            {filteredArticles.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="cursor-pointer"
                  >
                    <ArticleCard article={article} size="md" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ← Article detail modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </>
  )
}