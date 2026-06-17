import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useArticles } from '@/features/articles/hooks/useArticles'
import { useUserStats } from '@/features/dashboard/hooks/useUserStats'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { getUserFriendlyMessage } from '@/lib/errors'

const WEEK_DATA = [65, 72, 55, 80, 78, 90, 85]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_BAR = Math.max(...WEEK_DATA)

const HEALTH_METRICS = [
  { label: 'Sleep Quality', value: 82, unit: '%', icon: '😴', color: '#8A6FC7' },
  { label: 'Stress Level', value: 34, unit: '%', icon: '🧠', color: '#C47845' },
  { label: 'Activity', value: 71, unit: '%', icon: '💪', color: '#5FA876' },
  { label: 'Nutrition Score', value: 88, unit: '%', icon: '🥗', color: '#4A8DB8' },
]

export function DashboardPage(): React.ReactNode {
  const user = useAuthStore((s) => s.user)
  const articlesQuery = useArticles()
  const statsQuery = useUserStats()
  const stats = statsQuery.data
  const articles = articlesQuery.data ?? []

  return (
    <main id="main-content" className="bg-paper min-h-screen">
      <div className="max-w-[1100px] mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-green-500 mb-1">
              My Dashboard
            </p>
            <h1 className="font-serif text-[clamp(20px,3vw,32px)] font-black text-ink">
              Welcome back,{' '}
              <em className="text-green-500 not-italic font-light">
                {user?.userId ?? 'Reader'}
              </em>
            </h1>
          </div>
          <div className="flex gap-2.5">          
            <Link
              to="/subscription"
              className="text-xs font-semibold text-white bg-green-500 rounded-full px-4 py-2 hover:bg-green-600 transition-colors border-none">
              Upgrade Plan
            </Link>
          </div>
        </div>

        {statsQuery.isLoading ? (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-border animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-border mb-3" />
                <div className="h-7 w-16 bg-border rounded mb-1" />
                <div className="h-3 w-24 bg-border/70 rounded mb-1" />
                <div className="h-3 w-20 bg-border/70 rounded" />
              </div>
            ))}
          </div>
        ) : statsQuery.isError ? (
          <div className="mb-6">
            <ErrorMessage
              message={getUserFriendlyMessage(statsQuery.error)}
              onRetry={() => void statsQuery.refetch()}
            />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { icon: '🔥', val: `${stats.streakCount}`, label: 'Day Streak', sub: 'Consistency wins', color: '#C47845', bg: '#FDF3EE' },
              { icon: '📚', val: `${stats.articlesRead}`, label: 'Articles Read', sub: 'All time', color: '#4A8DB8', bg: '#EFF6FB' },
              { icon: '🎧', val: `${stats.podcastsListened}`, label: 'Podcasts', sub: 'Episodes finished', color: '#8A6FC7', bg: '#F5F0FF' },
              { icon: '💬', val: `${stats.aiQueries}`, label: 'AI Queries', sub: 'This month', color: '#5FA876', bg: '#F0F7F2' },
            ].map(({ icon, val, label, sub, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: bg }}>
                  {icon}
                </div>
                <p className="font-serif text-2xl font-black mb-0.5" style={{ color }}>
                  {val}
                </p>
                <p className="text-xs font-semibold text-ink mb-0.5">{label}</p>
                <p className="text-[10px] text-ink-4 font-light">{sub}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-border">
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-green-500 mb-1">
              Weekly Overview
            </p>
            <h2 className="font-serif text-lg font-bold text-ink mb-4">Wellness Score</h2>
            <div className="flex items-end gap-2 h-28">
              {WEEK_DATA.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[9px] text-ink-4">{val}</span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(val / MAX_BAR) * 88}px`,
                      background: i === 6 ? '#3D8F5A' : '#D6EDE0',
                    }}
                    role="img"
                    aria-label={`${DAYS[i]}: ${val}`}
                  />
                  <span className={`text-[9px] ${i === 6 ? 'font-bold text-green-600' : 'text-ink-4'}`}>
                    {DAYS[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border">
            <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-tan-400 mb-1">
              Reading Streak
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif text-3xl font-black text-tan-600">
                🔥 {stats?.streakCount ?? 0}
              </span>
              <span className="text-xs text-ink-3">days</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }, (_, i) => {
                const streakCount = stats?.streakCount ?? 0
                return (
                  <div
                    key={i}
                    className="w-full aspect-square rounded"
                    style={{
                      background:
                        streakCount > 0 && i < streakCount
                          ? `rgba(61,143,90,${0.3 + (i / streakCount) * 0.7})`
                          : '#F0F0ED',
                    }}
                    aria-hidden="true"
                  />
                )
              })}
            </div>
            <p className="text-[10px] text-ink-4 mt-3 text-center font-light">
              Last 28 days activity
            </p>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl p-5 border border-border">
          <h2 className="font-serif text-base font-bold text-ink mb-4">Health Metrics</h2>
          <div className="grid grid-cols-4 gap-5">
            {HEALTH_METRICS.map(({ label, value, icon, color, unit }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-ink-2">
                    {icon} {label}
                  </span>
                  <span className="text-xs font-bold" style={{ color }}>
                    {value}
                    {unit}
                  </span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base font-bold text-ink">Your Reading List</h2>
            <Link
              to="/articles"
              className="text-xs font-semibold text-green-600 hover:text-green-500 transition-colors"
            >
              Explore More →
            </Link>
          </div>

          {articlesQuery.isLoading ? (
            <ArticleCardSkeleton count={3} />
          ) : articlesQuery.isError ? (
            <ErrorMessage message={getUserFriendlyMessage(articlesQuery.error)} />
          ) : articles.length === 0 ? (
            <EmptyState message="Nothing in your reading list yet." />
          ) : (
            <div className="flex flex-col gap-3">
              {articles.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="flex gap-3 items-center p-3 rounded-xl hover:bg-paper transition-colors cursor-pointer"
                >
                  <img src={a.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.08em]"
                      style={{ color: a.categoryColor }}
                    >
                      {a.categoryLabel}
                    </span>
                    <p className="text-sm font-serif font-bold text-ink truncate">{a.title}</p>
                    <p className="text-[10px] text-ink-4">
                      {a.author} · {a.readTime} read
                    </p>
                  </div>
                  {a.isPremium && (
                    <span className="text-[9px] font-bold text-tan-400 bg-tan-50 border border-tan-100 rounded-full px-2 py-0.5 shrink-0">
                      Premium
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
