import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { ArticleCard } from '@/components/feature/ArticleCard'
import { ArticleDetailModal } from '@/components/feature/ArticleDetailModal'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article } from '@/globals/types'
import { Search, ChevronRight, ChevronLeft, Filter, ChevronDown } from 'lucide-react'
import { ARTICLE_CATEGORIES } from '@/globals/constants'

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

  const [showCategories, setShowCategories] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <main id="main-content">
      <div className="vh-container py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <SectionHeader
            eyebrow="Library"
            title="All"
            titleAccent="Articles"
          />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="article-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search articles..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none shadow-sm transition-all focus:border-green-500
                focus:ring-4 focus:ring-green-100"/>
            </div>

            <div ref={filterRef} className="relative shrink-0">
              <button
                onClick={() => setShowCategories((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-sm transition-all
          ${selectedCat !== 'All'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-slate-200 hover:border-green-300 hover:bg-green-50'
                  }
        `}>
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {selectedCat}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {showCategories && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Categories
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCat(cat)
                          setPage(1)
                          setShowCategories(false)
                        }}
                        className={`
                  w-full
                  flex items-center justify-between
                  px-4 py-3
                  text-sm
                  transition-colors
                  ${selectedCat === cat
                            ? 'text-green-500 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                          }
                `}>
                        <span>{cat}</span>
                        {selectedCat === cat && (
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading || isSearching ? (
          <ArticleCardSkeleton count={3} />
        ) : isError ? (
          <ErrorMessage
            message={getUserFriendlyMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : !articles || articles.length === 0 ? (
          <EmptyState message="Please log in to view our articles" />
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