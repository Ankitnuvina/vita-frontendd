import { useAdminStats } from '@/features/admin/hooks/useAdminStats'
import { useAdminArticles } from '@/features/admin/hooks/useAdminArticles'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { getUserFriendlyMessage } from '@/lib/errors'

import React, { useMemo, useState } from 'react'
import { useLikesAnalytics } from './useLikesAnalytics'

const STAT_CARDS = [
  { key: 'articleCount', icon: '📝', label: 'Articles', color: '#4A8DB8' },
  { key: 'podcastCount', icon: '🎧', label: 'Podcasts', color: '#8A6FC7' },
  { key: 'expertCount', icon: '👩‍⚕️', label: 'Experts', color: '#5FA876' },
  { key: 'subscriberCount', icon: '👥', label: 'Subscribers', color: '#C47845' },
] as const


export function AdminDashboardPage(): React.ReactNode {

  const [searchUser, setSearchUser] = useState('')
  const [contentType, setContentType] = useState('all')

  const likesQuery = useLikesAnalytics({
    user: searchUser,
    contentType,
  })

const likes = useMemo(() => {
  return likesQuery.data ?? []
}, [likesQuery.data])


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
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${a.isPremium
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



      <div className="space-y-6 mt-4">

        {/* Page Heading */}
        <div>
          <h2 className="font-serif text-2xl font-black text-ink">
            User Likes Analytics
          </h2>
          <p className="text-sm text-ink-3 mt-1">
            Track user likes for articles, podcasts, videos and blogs.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="flex flex-wrap gap-3">

            {/* Search User */}
            <input
              type="text"
              placeholder="Search by user..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-neutral-50 text-sm outline-none focus:border-green-500 flex-1 min-w-[220px]"
            />

            {/* Filter Type */}
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-neutral-50 text-sm outline-none focus:border-green-500 min-w-[180px]"
            >
              <option value="all">All Content</option>
              <option value="article">Articles</option>
              <option value="podcast">Podcasts</option>
              <option value="video">Videos</option>
              <option value="blog">Blogs</option>
            </select>
          </div>
        </div>

        {/* Analytics Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-5 py-4 bg-neutral-50 border-b border-border">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
              User
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
              Content
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
              Type
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
              Liked At
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3 text-right">
              Total Likes
            </p>
          </div>

          {/* Table Body */}
         <div>
  {likesQuery.isError ? (
    <div className="p-4">
      <ErrorMessage
        message={getUserFriendlyMessage(likesQuery.error)}
      />
    </div>
  ) : likesQuery.isLoading ? (
    <div className="py-10 text-center text-sm text-ink-3">
      Loading analytics...
    </div>
  ) : likes.length === 0 ? (
    <div className="py-10 text-center text-sm text-ink-3">
      No likes found.
    </div>
  ) : (
    likes.map((item:any) => (
      <div
        key={`${item.userName}-${item.contentId}`}
        className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-border hover:bg-neutral-50 transition-colors"
      >
        <p className="text-sm font-medium text-ink">
          {item.userName}
        </p>

        <p className="text-sm text-ink-2 truncate">
          {item.contentId}
        </p>

        <p className="text-sm capitalize text-ink-3">
          {item.contentType}
        </p>

        <p className="text-sm text-ink-3">
          {new Date(item.likedAt).toLocaleDateString()}
        </p>

        <p className="text-right text-sm font-bold text-pink-500">
          ❤️ {item.totalLikes}
        </p>
      </div>
    ))
  )}
</div>
        </div>
      </div>



    </div>
  )
}
