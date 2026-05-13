import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { getUserFriendlyMessage } from '@/lib/errors'

function buildShareUrl(platform: 'facebook' | 'twitter' | 'linkedin', href: string): string {
  const encodedHref = encodeURIComponent(href)
  if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedHref}`
  if (platform === 'twitter') return `https://twitter.com/intent/tweet?url=${encodedHref}`
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedHref}`
}

export function BlogDetailPage(): React.ReactNode {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: articles, isLoading, isError, error, refetch } = useArticles()

  const blog = useMemo(() => articles?.find((article) => article.slug === slug) ?? null, [articles, slug])

  const onShare = async (platform?: 'facebook' | 'twitter' | 'linkedin') => {
    const currentUrl = window.location.href
    if (!platform && navigator.share && blog) {
      await navigator.share({ title: blog.title, text: blog.excerpt, url: currentUrl })
      return
    }
    if (!platform) return
    window.open(buildShareUrl(platform, currentUrl), '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <main id="main-content" className="mx-auto max-w-[1100px] px-5 py-10">
        <ArticleCardSkeleton count={3} />
      </main>
    )
  }

  if (isError) {
    return (
      <main id="main-content" className="mx-auto max-w-[1100px] px-5 py-10">
        <ErrorMessage message={getUserFriendlyMessage(error)} onRetry={() => void refetch()} />
      </main>
    )
  }

  if (!blog) {
    return (
      <main id="main-content" className="mx-auto max-w-[1100px] px-5 py-10">
        <EmptyState message="Blog not found." icon="📄" />
      </main>
    )
  }

  return (
    <main id="main-content">
      <div className="mx-auto max-w-[1100px] px-5 py-8">
        <button
          type="button"
          onClick={() => navigate('/blogs')}
          className="mb-4 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
        >
          ← Back to Blogs
        </button>

        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <img src={blog.imageUrl} alt={blog.title} className="h-[340px] w-full object-cover" />
          <div className="p-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: blog.categoryColor }}>
              {blog.categoryLabel}
            </p>
            <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-black leading-tight text-ink">{blog.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-4">
              <span className="font-semibold text-ink-2">{blog.author}</span>
              <span>•</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-ink-3">{blog.excerpt}</p>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-4">Share this blog</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void onShare()}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
                >
                  Native Share
                </button>
                <button
                  type="button"
                  onClick={() => void onShare('facebook')}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => void onShare('twitter')}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
                >
                  X / Twitter
                </button>
                <button
                  type="button"
                  onClick={() => void onShare('linkedin')}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
                >
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
