import React, { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article } from '@/globals/types'

// import { LikeButton } from '@/features/likes/components/common/LikeButton'

function BlogCard({
  article,
  onOpen,
  compact = false,
}: {
  article: Article
  onOpen: (slug: string) => void
  compact?: boolean
}): React.ReactNode {
  return (
    <article
      className={`vh-card vh-card-hover cursor-pointer overflow-hidden ${
        compact ? 'flex flex-col xs:flex-row gap-3 p-3' : ''
      }`}
      onClick={() => onOpen(article.slug)}
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        loading="lazy"
        className={
          compact
            ? 'h-32 xs:h-20 w-full xs:w-24 rounded-xl object-cover shrink-0'
            : 'h-44 sm:h-48 w-full object-cover'
        }
      />
      <div className={compact ? 'min-w-0 flex-1' : 'p-4 sm:p-5'}>
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.1em] truncate"
            style={{ color: article.categoryColor }}
          >
            {article.categoryLabel}
          </p>
          <div className="shrink-0">💖</div>
        </div>
        <h3
          className={`font-serif font-bold text-ink leading-snug mt-1 ${
            compact ? 'text-sm line-clamp-2' : 'text-base sm:text-lg line-clamp-2'
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-2 text-[11px] text-ink-4">
          {article.author} · {article.date}
        </p>
      </div>
    </article>
  )
}

export function BlogsPage(): React.ReactNode {
  const navigate = useNavigate()
  const { data: articles, isLoading, isError, error, refetch } = useArticles()
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const isSearching = search !== deferredSearch

  const filteredArticles = useMemo(() => {
    if (!articles) return []
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return articles
    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.categoryLabel.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    })
  }, [articles, deferredSearch])

  const categories = useMemo(() => {
    return Array.from(new Set(filteredArticles.map((a) => a.categoryLabel)))
  }, [filteredArticles])

  const featured = useMemo(() => filteredArticles.slice(0, 1), [filteredArticles])
  const latest = useMemo(() => filteredArticles.slice(1, 5), [filteredArticles])
  const popular = useMemo(() => filteredArticles.slice(5, 9), [filteredArticles])

  const openBlog = (slug: string) => navigate(`/blogs/${slug}`)

  return (
    <main id="main-content">
      <section className="bg-gradient-to-br from-ink to-green-700 py-12 sm:py-16 text-white">
        <div className="vh-container text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-green-300">
            Healthcare Blogs
          </p>
          <h1 className="font-serif text-[clamp(28px,5vw,48px)] font-black tracking-tight text-white">
            Vitalize Blog
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
            Explore expert-backed healthcare articles, practical wellness guides, and science-first insights.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <label htmlFor="blog-search" className="sr-only">
              Search blogs
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/70">
                🔍
              </span>
              <input
                id="blog-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs by title, keyword, author..."
                className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/60 outline-none transition-all focus:border-green-300 focus:bg-white/15"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="vh-container py-10 sm:py-12">
        {isLoading || isSearching ? (
          <ArticleCardSkeleton count={6} />
        ) : isError ? (
          <ErrorMessage message={getUserFriendlyMessage(error)} onRetry={() => void refetch()} />
        ) : !articles || articles.length === 0 ? (
          <EmptyState message="No blog posts available yet." icon="📝" />
        ) : filteredArticles.length === 0 ? (
          <EmptyState message="No blogs match your search." icon="🔎" />
        ) : (
          <>
            <SectionHeader eyebrow="Top Pick" title="Featured" titleAccent="Blog" />
            {featured[0] && (
              <article
                className="vh-card vh-card-hover mb-10 cursor-pointer overflow-hidden"
                onClick={() => openBlog(featured[0].slug)}
              >
                <img
                  src={featured[0].imageUrl}
                  alt={featured[0].title}
                  className="h-56 sm:h-72 lg:h-80 w-full object-cover"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.12em]"
                      style={{ color: featured[0].categoryColor }}
                    >
                      {featured[0].categoryLabel}
                    </p>
                    <p className="shrink-0 text-lg leading-none">💖</p>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black text-ink leading-snug">
                    {featured[0].title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-3 line-clamp-3">
                    {featured[0].excerpt}
                  </p>
                  <p className="mt-4 text-xs font-medium text-ink-4">
                    {featured[0].author} · {featured[0].date}
                  </p>
                </div>
              </article>
            )}

            <SectionHeader eyebrow="Fresh Reads" title="Latest" titleAccent="Blogs" />
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latest.map((article) => (
                <BlogCard key={article.id} article={article} onOpen={openBlog} />
              ))}
            </div>

            <SectionHeader eyebrow="Reader Favorites" title="Popular" titleAccent="Blogs" />
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popular.map((article) => (
                <BlogCard key={article.id} article={article} onOpen={openBlog} compact />
              ))}
            </div>

            <SectionHeader eyebrow="Discover Topics" title="Blog" titleAccent="Categories" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
