import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleCard } from '@/components/feature/ArticleCard'
import { CategoryPills } from '@/components/feature/CategoryPills'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { AiChatWidget } from '@/features/ai/components/AiChatWidget'
import { SubscriptionSection } from '@/features/subscription/components/SubscriptionSection'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { useExperts } from '@/features/experts/hooks/useExperts'
import { useWellnessTips } from '@/features/ai/hooks/useWellnessTips'
import { useUserStats } from '@/features/dashboard/hooks/useUserStats'
import { getUserFriendlyMessage } from '@/lib/errors'

const TRUST_ITEMS = [
  { icon: '🏥', label: 'Physician-reviewed' },
  { icon: '📚', label: 'Peer-reviewed' },
  { icon: '🔬', label: 'Evidence-based' },
  { icon: '🛡️', label: 'HIPAA-aware' },
  { icon: '⭐', label: '4.92/5 · 52K readers' },
]

const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'Sa', 'Su']

export function HomePage(): React.ReactNode {
  const [selectedCat, setSelectedCat] = useState('All')
  const navigate = useNavigate()
  const articlesQuery = useArticles()
  const expertsQuery = useExperts()
  const tipsQuery = useWellnessTips()
  const statsQuery = useUserStats()

  const articles = articlesQuery.data ?? []
  const experts = expertsQuery.data ?? []
  const tips = tipsQuery.data ?? []
  const streak = statsQuery.data?.streakCount ?? 0

  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section
        aria-label="Hero"
        className="bg-gradient-to-br from-green-50 via-paper to-tan-50 pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden"
      >
        <div className="vh-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white border border-green-100 rounded-full px-3 py-1.5 text-[11px] font-bold text-green-600 tracking-[0.06em] uppercase mb-4 animate-fade-in">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot shrink-0" />
                🌿 Evidence-based · Expert-verified
              </div>

              <h1 className="font-serif text-[clamp(28px,6vw,56px)] font-black leading-[1.08] text-ink tracking-[-0.04em] mb-4 animate-fade-up">
                Science-backed
                <br />
                <em className="text-green-500 font-light not-italic">health wisdom</em>
                <br />
                for modern life
              </h1>

              <p className="text-sm sm:text-base text-ink-3 leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0 font-light">
                Expert-verified articles, AI-powered insights, and curated podcasts — designed to
                help you live healthier, not just longer.
              </p>

              <div className="flex items-center bg-white border-2 border-border rounded-full py-1.5 pl-4 pr-1.5 shadow-card max-w-[520px] mx-auto lg:mx-0 mb-3">
                <span className="text-sm mr-2 opacity-45" aria-hidden="true">🔍</span>
                <label htmlFor="hero-search" className="sr-only">Search health topics</label>
                <input
                  id="hero-search"
                  placeholder='Ask: "how to improve sleep"'
                  className="flex-1 border-none bg-transparent text-sm text-ink min-w-0 py-1 outline-none placeholder:text-ink-4"
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/ai')}
                />
                <button
                  onClick={() => navigate('/ai')}
                  className="vh-btn vh-btn-primary text-xs shrink-0"
                >
                  Ask Vita AI
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5 justify-center lg:justify-start">
                {['Sleep', 'Stress', 'Nutrition', 'Gut Health', 'Zone 2'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate('/ai')}
                    className="text-[11px] font-medium text-ink-3 bg-white border border-border rounded-full px-2.5 py-0.5 hover:border-green-300 hover:text-green-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
                {TRUST_ITEMS.slice(0, 4).map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-ink-3">
                    <div className="w-5 h-5 bg-green-50 border border-green-100 rounded-md flex items-center justify-center text-[11px] shrink-0">
                      {icon}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual cluster (hidden on small to avoid clutter, shown sm+) */}
            <div
              className="relative h-[340px] sm:h-[400px] hidden sm:block"
              aria-hidden="true"
            >
              <div className="absolute top-0 left-0 right-6 sm:right-10 bg-white rounded-2xl overflow-hidden shadow-pop border border-border">
                <img
                  src={
                    articles[0]?.imageUrl ??
                    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80'
                  }
                  alt=""
                  className="h-[150px] sm:h-[170px] w-full object-cover"
                />
                <div className="p-4">
                  <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 inline-block mb-2">
                    Featured
                  </span>
                  <p className="font-serif text-sm font-bold text-ink leading-snug mb-1.5 line-clamp-2">
                    {articles[0]?.title ?? 'Loading featured article…'}
                  </p>
                  <p className="text-[11px] text-ink-4">
                    {articles[0] ? `${articles[0].author} · ${articles[0].readTime} read` : '—'}
                  </p>
                </div>
              </div>

              <div className="absolute top-3 right-0 bg-green-600 text-white rounded-xl p-3 shadow-pop w-[150px] sm:w-[158px] animate-float">
                <p className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/55 mb-1">
                  🤖 Vita AI
                </p>
                <p className="text-[11px] font-medium leading-snug mb-1.5">
                  "What helps with chronic stress?"
                </p>
                <p className="text-[10px] text-white/65 leading-relaxed line-clamp-3">
                  Box breathing activates your parasympathetic system in under 2 minutes…
                </p>
              </div>

              {streak > 0 && (
                <div className="absolute bottom-5 right-0 bg-white rounded-xl p-3 shadow-lifted border border-border w-[140px] sm:w-[150px] animate-float-delayed">
                  <p className="text-[9px] font-bold tracking-[0.08em] uppercase text-tan-400 mb-1">
                    🔥 Streak
                  </p>
                  <p className="font-serif text-2xl sm:text-[26px] font-black text-tan-600 leading-none">
                    {streak}
                  </p>
                  <p className="text-[10px] text-ink-3 mt-0.5">Days in a row!</p>
                  <div className="flex gap-0.5 mt-2">
                    {STREAK_DAYS.map((d, i) => (
                      <div
                        key={i}
                        className="w-[15px] sm:w-[17px] h-[15px] sm:h-[17px] rounded-full text-[7px] font-bold flex items-center justify-center"
                        style={{
                          background: i < 5 ? '#C47845' : i === 5 ? '#FDF3EE' : '#eee',
                          color: i < 5 ? '#fff' : i === 5 ? '#C47845' : '#bbb',
                          border: i === 5 ? '2px solid #C47845' : 'none',
                        }}
                      >
                        {i < 5 ? '✓' : i === 5 ? '🔥' : d}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <div
        className="bg-white border-t border-b border-border py-3"
        role="region"
        aria-label="Trust indicators"
      >
        <div className="vh-container flex gap-3 sm:gap-5 items-center justify-start sm:justify-center flex-nowrap sm:flex-wrap overflow-x-auto scroll-x-clean">
          {TRUST_ITEMS.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[11px] text-ink-3 shrink-0">
              <div className="w-5 h-5 bg-green-50 border border-green-100 rounded-md flex items-center justify-center text-[11px] shrink-0">
                {icon}
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>

      <CategoryPills selected={selectedCat} onSelect={setSelectedCat} sticky />

      {/* ── Articles Section ── */}
      <section className="py-12 sm:py-16 bg-paper" aria-label="Latest articles">
        <div className="vh-container">
          <SectionHeader
            eyebrow="Latest & Trending"
            title="Expert"
            titleAccent="Insights"
            onSeeAll={() => navigate('/articles')}
          />
          {articlesQuery.isLoading ? (
            <ArticleCardSkeleton count={3} />
          ) : articlesQuery.isError ? (
            <ErrorMessage
              message={getUserFriendlyMessage(articlesQuery.error)}
              onRetry={() => void articlesQuery.refetch()}
            />
          ) : articles.length === 0 ? (
            <EmptyState message="No articles available yet." />
          ) : (
            <>
              <div
                className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-px mb-3.5 rounded-2xl overflow-hidden bg-border"
              >
                <ArticleCard article={articles[0]} size="xl" />
                {(articles[1] || articles[2]) && (
                  <div className="grid gap-px bg-border">
                    {articles[1] && <ArticleCard article={articles[1]} size="lg" />}
                    {articles[2] && <ArticleCard article={articles[2]} size="lg" />}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {articles.slice(2, 5).map((a) => (
                  <ArticleCard key={a.id} article={a} size="md" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── AI Section ── */}
      <section
        className="bg-ink py-12 sm:py-16 relative overflow-hidden"
        aria-label="AI Health Assistant"
      >
        <div className="vh-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-green-300 mb-2.5 flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-green-400 rounded inline-block" />
                AI Health Assistant
              </p>
              <h2 className="font-serif text-[clamp(24px,4vw,40px)] font-black text-white tracking-tight leading-tight mb-3.5">
                Meet <em className="text-green-400 font-light not-italic">Vita</em> — your personal
                wellness intelligence
              </h2>
              <p className="text-sm text-white/55 leading-relaxed mb-5 font-light max-w-xl">
                Instant, evidence-based answers from 1,200+ expert-reviewed articles and the latest
                peer-reviewed research.
              </p>
              <div className="mb-6 space-y-3">
                {[
                  ['🧬', 'Evidence-based only', 'Every response references peer-reviewed research.'],
                  ['🔗', 'Smart content linking', 'Connects your question to relevant articles and podcasts.'],
                  ['🛡️', 'Safe & responsible', 'Non-diagnostic. Recommends professional help when needed.'],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div className="w-9 h-9 shrink-0 bg-green-500/14 border border-green-500/24 rounded-xl flex items-center justify-center text-base">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                      <p className="text-[11px] text-white/50 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5 flex-wrap">
                <button
                  onClick={() => navigate('/ai')}
                  className="vh-btn vh-btn-primary text-xs"
                >
                  Open Full AI Chat →
                </button>
                <button className="vh-btn text-xs bg-white/[0.07] border border-white/14 text-white hover:bg-white/15">
                  View Sample Answers
                </button>
              </div>
            </div>
            <AiChatWidget compact />
          </div>
        </div>
      </section>

      {/* ── Daily Tips ── */}
      <section
        className="py-12 sm:py-16 bg-gradient-to-br from-green-50 via-paper to-tan-50"
        aria-label="Daily wellness tips"
      >
        <div className="vh-container">
          <SectionHeader
            eyebrow="AI-Curated Daily"
            title="Today's Wellness"
            titleAccent="Tips"
            subtitle="Refreshed daily from 1,200+ peer-reviewed articles."
            center
          />
          {tipsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="vh-card p-5 animate-pulse">
                  <div className="w-[42px] h-[42px] rounded-xl bg-border mb-3" />
                  <div className="h-4 w-3/4 bg-border rounded mb-2" />
                  <div className="h-3 w-full bg-border/70 rounded mb-1.5" />
                  <div className="h-3 w-5/6 bg-border/70 rounded" />
                </div>
              ))}
            </div>
          ) : tipsQuery.isError ? (
            <ErrorMessage message={getUserFriendlyMessage(tipsQuery.error)} />
          ) : tips.length === 0 ? (
            <EmptyState message="No wellness tips today." icon="🌿" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className="vh-card vh-card-hover p-5 cursor-pointer"
                >
                  <div
                    className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[21px] mb-3"
                    style={{ background: tip.colors.bg, border: `1px solid ${tip.colors.border}` }}
                  >
                    {tip.icon}
                  </div>
                  <h3 className="font-serif text-sm font-bold text-ink mb-1.5">{tip.title}</h3>
                  <p className="text-xs text-ink-3 leading-relaxed font-light line-clamp-3">{tip.text}</p>
                  <div className="mt-2.5 inline-flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                    ✨ AI Curated
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Experts ── */}
      <section
        className="py-12 sm:py-16 bg-green-50 border-t border-b border-green-100"
        aria-label="Expert authors"
      >
        <div className="vh-container">
          <SectionHeader
            eyebrow="Built on Trust"
            title="Meet Our"
            titleAccent="Experts"
            subtitle="Every article authored or reviewed by credentialed health professionals."
          />
          {expertsQuery.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="vh-card p-5 animate-pulse">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2.5 bg-border" />
                  <div className="h-3 w-2/3 bg-border rounded mx-auto mb-2" />
                  <div className="h-3 w-1/2 bg-border/70 rounded mx-auto mb-1.5" />
                  <div className="h-3 w-3/4 bg-border/70 rounded mx-auto" />
                </div>
              ))}
            </div>
          ) : expertsQuery.isError ? (
            <ErrorMessage message={getUserFriendlyMessage(expertsQuery.error)} />
          ) : experts.length === 0 ? (
            <EmptyState message="No experts to show." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  onClick={() => navigate(`/experts/${expert.id}`)}
                  className="vh-card vh-card-hover p-5 text-center cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-2.5 overflow-hidden border-2 border-green-100">
                    <img
                      src={expert.imageUrl}
                      alt={expert.name}
                      className="h-16 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 text-[9px] font-bold text-green-600 mb-2">
                    ✓ Verified
                  </div>
                  <br />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/experts/${expert.id}`)
                    }}
                    className="font-serif text-sm font-bold text-ink mb-0.5 hover:text-green-600 transition-colors"
                  >
                    {expert.name}
                  </button>
                  <p className="text-[11px] font-semibold text-green-500 mb-1">{expert.role}</p>
                  <p className="text-[10px] text-ink-3 leading-relaxed mb-2 font-light line-clamp-2">
                    {expert.credentials}
                  </p>
                  <p className="text-[11px] font-semibold text-ink-3">
                    📝 {expert.articleCount} articles
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SubscriptionSection preview />
    </main>
  )
}
