import React, { useDeferredValue, useMemo, useState } from 'react'
import { ArticleCard } from '@/components/feature/ArticleCard'
import { ArticleDetailModal } from '@/components/feature/ArticleDetailModal'
import { CategoryPills } from '@/components/feature/CategoryPills'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article } from '@/globals/types'

export function ArticlesPage(): React.ReactNode {
  const [selectedCat, setSelectedCat] = useState('All')
  const [search, setSearch] = useState('')
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null)
  const { data: articles, isLoading, isError, error, refetch } = useArticles()
  const deferredSearch = useDeferredValue(search)
  const isSearching = search !== deferredSearch

  const filtered = useMemo(() => {
    if (!articles) return []
    const query = deferredSearch.trim().toLowerCase()
    return articles.filter((a) => {
      const matchCat = selectedCat === 'All' || a.categoryLabel === selectedCat
      const matchSearch =
        !query ||
        a.title.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.categoryLabel.toLowerCase().includes(query) ||
        a.slug.toLowerCase().includes(query) ||
        a.tags?.some((tag) => tag.toLowerCase().includes(query))
      return matchCat && matchSearch
    })
  }, [articles, selectedCat, deferredSearch])

  return (
    <main id="main-content">
      <CategoryPills selected={selectedCat} onSelect={setSelectedCat} sticky />

      <div className="vh-container py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
          <SectionHeader eyebrow="Library" title="All" titleAccent="Articles" />
          <div className="relative w-full sm:w-64 shrink-0">
            <label htmlFor="article-search" className="sr-only">Search articles</label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40" aria-hidden="true">
              🔍
            </span>
            <input
              id="article-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="bg-white border border-border rounded-full pl-8 pr-4 py-2 text-xs text-ink w-full outline-none focus:border-green-400 transition-colors"
            />
          </div>
        </div>

        {isLoading || isSearching ? (
          <ArticleCardSkeleton count={6} />
        ) : isError ? (
          <ErrorMessage
            message={getUserFriendlyMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : !articles || articles.length === 0 ? (
          <EmptyState message="No articles available yet." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
            <p className="font-serif text-lg font-bold text-ink mb-2">No articles found</p>
            <p className="text-sm text-ink-3">Try a different search term or category.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCat('All') }}
              className="mt-4 text-xs font-semibold text-green-600 border border-green-200 rounded-full px-4 py-1.5 hover:bg-green-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-px bg-border rounded-2xl overflow-hidden mb-4">
              <ArticleCard
                article={filtered[0]}
                size="xl"
                onClick={setViewingArticle}
              />
              {filtered.length > 1 && (
                <div className="grid gap-px bg-border">
                  {filtered.slice(1, 3).map((a) => (
                    <ArticleCard
                      key={a.id}
                      article={a}
                      size="lg"
                      onClick={setViewingArticle}
                    />
                  ))}
                </div>
              )}
            </div>

            {filtered.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                {filtered.slice(3).map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    size="md"
                    onClick={setViewingArticle}
                  />
                ))}
              </div>
            )}

            <p className="text-center text-xs text-ink-4 mt-8">
              Showing {filtered.length} of {articles.length} articles
            </p>
          </>
        )}
      </div>

      {/* Article Detail Modal */}
      {viewingArticle && (
        <ArticleDetailModal
          article={viewingArticle}
          onClose={() => setViewingArticle(null)}
        />
      )}
    </main>
  )
}