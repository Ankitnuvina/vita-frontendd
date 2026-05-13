import React, { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Article } from '@/globals/types'

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
      className={`cursor-pointer overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg ${
        compact ? 'flex gap-3 p-3' : ''
      }`}
      onClick={() => onOpen(article.slug)}
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className={compact ? 'h-20 w-24 rounded-xl object-cover' : 'h-44 w-full object-cover'}
      />
      <div className={compact ? 'min-w-0 flex-1' : 'p-4'}>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: article.categoryColor }}>
          {article.categoryLabel}
        </p>
        <h3 className={`font-serif font-bold text-ink ${compact ? 'text-sm' : 'text-base'}`}>{article.title}</h3>
        <p className="mt-1 text-[11px] text-ink-4">
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
      <section className="bg-gradient-to-br from-ink to-green-700 py-14 text-white">
        <div className="mx-auto max-w-[1100px] px-5 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-green-300">
            Healthcare Blogs
          </p>
          <h1 className="font-serif text-[clamp(26px,4vw,46px)] font-black tracking-tight">Vitalize Blog</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Explore expert-backed healthcare articles, practical wellness guides, and science-first insights.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <label htmlFor="blog-search" className="sr-only">Search blogs</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/70">🔍</span>
              <input
                id="blog-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs by title, keyword, author..."
                className="w-full rounded-full border border-white/20 bg-white/10 py-2 pl-8 pr-4 text-xs text-white placeholder:text-white/60 outline-none transition-colors focus:border-green-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-5 py-10">
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
                className="mb-10 cursor-pointer overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-xl"
                onClick={() => openBlog(featured[0].slug)}
              >
                <img src={featured[0].imageUrl} alt={featured[0].title} className="h-72 w-full object-cover" />
                <div className="p-5">
                  <p
                    className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ color: featured[0].categoryColor }}
                  >
                    {featured[0].categoryLabel}
                  </p>
                  <h2 className="font-serif text-2xl font-black text-ink">{featured[0].title}</h2>
                  <p className="mt-2 text-sm text-ink-3">{featured[0].excerpt}</p>
                  <p className="mt-3 text-xs text-ink-4">
                    {featured[0].author} · {featured[0].date}
                  </p>
                </div>
              </article>
            )}

            <SectionHeader eyebrow="Fresh Reads" title="Latest" titleAccent="Blogs" />
            <div className="mb-10 grid grid-cols-2 gap-4">
              {latest.map((article) => (
                <BlogCard key={article.id} article={article} onOpen={openBlog} />
              ))}
            </div>

            <SectionHeader eyebrow="Reader Favorites" title="Popular" titleAccent="Blogs" />
            <div className="mb-10 grid grid-cols-2 gap-4">
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
