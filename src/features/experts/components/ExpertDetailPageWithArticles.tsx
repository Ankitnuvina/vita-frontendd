import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticleCard } from '@/components/feature/ArticleCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { useExperts } from '@/features/experts/hooks/useExperts'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { getUserFriendlyMessage } from '@/lib/errors'

export function ExpertDetailPageWithArticles(): React.ReactNode {
  const { expertId } = useParams<{ expertId: string }>()
  const navigate = useNavigate()
  const expertsQuery = useExperts()
  const articlesQuery = useArticles()

  const expertNumericId = Number(expertId)

  const expert = useMemo(
    () => expertsQuery.data?.find((item) => item.id === expertNumericId) ?? null,
    [expertsQuery.data, expertNumericId]
  )

  const expertArticles = useMemo(() => {
    if (!articlesQuery.data || !expert) return []
    return articlesQuery.data.filter((article) => article.author === expert.name)
  }, [articlesQuery.data, expert])

  if (expertsQuery.isLoading || articlesQuery.isLoading) {
    return (
      <main id="main-content" className="max-w-[1100px] mx-auto px-5 py-12">
        <ArticleCardSkeleton count={3} />
      </main>
    )
  }

  if (expertsQuery.isError || articlesQuery.isError) {
    return (
      <main id="main-content" className="max-w-[1100px] mx-auto px-5 py-12">
        <ErrorMessage
          message={getUserFriendlyMessage(expertsQuery.error ?? articlesQuery.error)}
          onRetry={() => {
            void expertsQuery.refetch()
            void articlesQuery.refetch()
          }}
        />
      </main>
    )
  }

  if (!expert) {
    return (
      <main id="main-content" className="max-w-[1100px] mx-auto px-5 py-12">
        <EmptyState message="Expert profile not found." icon="🧑‍⚕️" />
      </main>
    )
  }

  return (
    <main id="main-content">
      <section className="bg-gradient-to-br from-green-50 via-paper to-tan-50 border-b border-border py-10">
        <div className="max-w-[1100px] mx-auto px-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
          >
            Back
          </button>
          <div className="grid grid-cols-[220px_1fr] items-center gap-8">
            <div className="h-[220px] w-[220px] overflow-hidden rounded-2xl border border-green-100 bg-white">
              <img src={expert.imageUrl} alt={expert.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-green-600">
                Expert Profile
              </p>
              <h1 className="font-serif text-[clamp(28px,4vw,44px)] font-black tracking-tight text-ink">
                {expert.name}
              </h1>
              <p className="mt-1 text-sm font-semibold text-green-600">{expert.role}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-3">{expert.credentials}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-5 py-12">
        <SectionHeader eyebrow="Written by Expert" title={expert.name} titleAccent="Articles" />

        {expertArticles.length === 0 ? (
          <EmptyState message="No articles from this expert yet." icon="📝" />
        ) : (
          <div className="grid grid-cols-3 gap-3 mt-8">
            {expertArticles.map((article) => (
              <ArticleCard key={article.id} article={article} size="md" />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
