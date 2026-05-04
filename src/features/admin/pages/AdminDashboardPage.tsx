import React from 'react'
import { useAdminStats } from '@/features/admin/hooks/useAdminStats'
import { useAdminArticles } from '@/features/admin/hooks/useAdminArticles'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { getUserFriendlyMessage } from '@/lib/errors'

const STAT_CARDS = [
  { key: 'articleCount', icon: '📝', label: 'Articles', color: '#4A8DB8' },
  { key: 'podcastCount', icon: '🎧', label: 'Podcasts', color: '#8A6FC7' },
  { key: 'expertCount', icon: '👩‍⚕️', label: 'Experts', color: '#5FA876' },
  { key: 'subscriberCount', icon: '👥', label: 'Subscribers', color: '#C47845' },
] as const

export function AdminDashboardPage(): React.ReactNode {
  const statsQuery = useAdminStats()
  const articlesQuery = useAdminArticles()
  const stats = statsQuery.data
  const recent = articlesQuery.data?.data.slice(0, 5) ?? []

  return (
    <div>
      <h2 className="font-serif text-xl font-black text-ink mb-6">Overview</h2>

      {statsQuery.isError ? (
        <div className="mb-6">
          <ErrorMessage
            message={getUserFriendlyMessage(statsQuery.error)}
            onRetry={() => void statsQuery.refetch()}
          />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STAT_CARDS.map(({ key, icon, label, color }) => {
            const value = stats ? stats[key] : null
            return (
              <div key={key} className="bg-white rounded-xl p-4 border border-border">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-serif text-2xl font-black mb-0.5" style={{ color }}>
                  {statsQuery.isLoading ? '…' : value?.toLocaleString() ?? '–'}
                </p>
                <p className="text-xs text-ink-3">{label}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border border-border p-4">
        <h3 className="text-sm font-bold text-ink mb-3">Recent Articles</h3>
        {articlesQuery.isError ? (
          <ErrorMessage message={getUserFriendlyMessage(articlesQuery.error)} />
        ) : articlesQuery.isLoading ? (
          <p className="text-xs text-ink-3 py-4">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-xs text-ink-3 py-4">No articles yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <img src={a.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">{a.title}</p>
                  <p className="text-[10px] text-ink-4">
                    {a.author} · {a.date}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    a.isPremium
                      ? 'bg-tan-50 text-tan-400 border border-tan-100'
                      : 'bg-green-50 text-green-600 border border-green-100'
                  }`}
                >
                  {a.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
