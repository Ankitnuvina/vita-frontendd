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
import { Search, ChevronRight, ChevronLeft } from 'lucide-react'

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

  const [page, setPage] = useState(1)
  const ARTICLES_PER_PAGE = 9
  const totalPages = Math.ceil(
    filtered.length / ARTICLES_PER_PAGE
  )

  const paginatedArticles = filtered.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  )

  return (
    <main id="main-content">
      <CategoryPills
        selected={selectedCat}
        onSelect={(cat) => {
          setSelectedCat(cat)
          setPage(1)
        }}
        sticky
      />

      <div className="vh-container py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
          <SectionHeader eyebrow="Library" title="All" titleAccent="Articles" />
          <div className="relative w-full sm:w-64 shrink-0">
            <label htmlFor="article-search" className="sr-only">Search articles</label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40" aria-hidden="true">
              <Search className='w-4 h-4' />
            </span>
            <input
              id="article-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search articles…"
              className="bg-white border border-border rounded-full pl-8 pr-4 py-2 text-xs text-ink w-full outline-none focus:border-green-400 transition-colors"
            />
          </div>
        </div>

        {isLoading || isSearching ? (
          <ArticleCardSkeleton count={3}/>
        ) : isError ? (
          <ErrorMessage
            message={getUserFriendlyMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : !articles || articles.length === 0 ? (
          <EmptyState message="No articles available yet." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3 text-center" aria-hidden="true"><Search className='m-auto w-8 h-8' /></p>
            <p className="font-serif text-lg font-bold text-ink mb-2">No articles found</p>
            <p className="text-sm text-ink-3">Try a different search term or category.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCat('All') }}
              className="mt-4 text-xs font-semibold text-green-600 border border-green-200 rounded-full px-4 py-1.5 bg-[#c7e6d5] hover:bg-green-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-[16px]  rounded-2xl overflow-hidden mb-4">
              <ArticleCard
                article={paginatedArticles[0]}
                size="xl"
                onClick={setViewingArticle}
              />
              {paginatedArticles.length > 1 && (
                <div className="grid gap-[16px]">
                  {paginatedArticles.slice(1, 3).map((a) => (
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

            {paginatedArticles.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                {paginatedArticles.slice(3).map((a) => (
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
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() =>
                    setPage((p) => Math.max(p - 1, 1))
                  }
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-md border border-border text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPage(1)}
                  className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${page === 1
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-border text-ink'
                    }`}
                >
                  1
                </button>

                {/* Middle Pages */}
                {page > 3 && (
                  <span className="px-1 text-ink-4">
                    ...
                  </span>
                )}

                {Array.from({ length: totalPages })
                  .map((_, i) => i + 1)
                  .filter(
                    (p) =>
                      p !== 1 &&
                      p !== totalPages &&
                      p >= page - 1 &&
                      p <= page + 1
                  )
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${page === p
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-border text-ink'
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                {/* Right Dots */}
                {page < totalPages - 2 && (
                  <span className="px-1 text-ink-4">
                    ...
                  </span>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${page === totalPages
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-border text-ink'
                      }`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(p + 1, totalPages)
                    )
                  }
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-md border border-border text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
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