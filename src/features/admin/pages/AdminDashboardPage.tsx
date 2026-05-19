import { useAdminStats } from '@/features/admin/hooks/useAdminStats'
import { useAdminArticles } from '@/features/admin/hooks/useAdminArticles'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { getUserFriendlyMessage } from '@/lib/errors'
import {
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from '@/features/admin/components/AdminTableShell'

import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLikesAnalytics } from './useLikesAnalytics'

const STAT_CARDS = [
  { key: 'articleCount', icon: 'fa-solid fa-newspaper', label: 'Articles', color: '#4A8DB8' },
  { key: 'podcastCount', icon: 'fa-solid fa-podcast', label: 'Podcasts', color: '#8A6FC7' },
  { key: 'expertCount', icon: 'fa-solid fa-user-doctor', label: 'Experts', color: '#5FA876' },
  { key: 'subscriberCount', icon: 'fa-solid fa-users', label: 'Subscribers', color: '#C47845' },
] as const


export function AdminDashboardPage(): React.ReactNode {

  const [searchUser, setSearchUser] = useState('')
  const [contentType, setContentType] = useState('all')

  const likesQuery = useLikesAnalytics({
    user: searchUser,
    contentType,
  })

type Like = {
  id: number
  name: string
}

const likes = useMemo<Like[]>(() => {
  return (likesQuery.data as Like[]) ?? []
}, [likesQuery.data])


  const statsQuery = useAdminStats()
  const articlesQuery = useAdminArticles()
  const stats = statsQuery.data
  const recent = articlesQuery.data?.data.slice(0, 5) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-black text-ink leading-tight">Overview</h2>
        <p className="text-xs text-ink-3 mt-1.5">A snapshot of your library.</p>
      </div>

      {/* ───── STAT CARDS ───── */}
      {statsQuery.isError ? (
        <ErrorMessage
          message={getUserFriendlyMessage(statsQuery.error)}
          onRetry={() => void statsQuery.refetch()}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ key, icon, label, color }) => {
            const value = stats ? stats[key] : null
            return (
              <div
                key={key}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow:
                    '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
                }}
              >
                {/* Subtle color bloom (top-right) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(120% 80% at 100% 0%, ${color}14 0%, transparent 60%)`,
                  }}
                />
                {/* Top accent line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-5 right-5 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                  }}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-medium text-ink-3 tracking-tight">
                      {label}
                    </p>
                    <p className="font-sans text-[28px] font-black text-ink mt-2.5 leading-none truncate tracking-tight">
                      {statsQuery.isLoading
                        ? '…'
                        : (value?.toLocaleString() ?? '–')}
                    </p>
                  </div>

                  {/* Icon tile */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${color}1F 0%, ${color}33 100%)`,
                      color,
                      borderColor: `${color}26`,
                    }}
                  >
                    <i className={`${icon} text-base`} aria-hidden="true" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ───── RECENT ARTICLES TABLE ───── */}
      <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between">
          <h3 className="font-serif text-xl font-black text-ink leading-tight">
            Recent Articles
          </h3>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-2 bg-green-50 border border-green-100 rounded-full px-4 py-2 hover:bg-green-100 hover:border-green-200 transition-colors"
          >
            View All
            <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
          </Link>
        </div>

        {articlesQuery.isError ? (
          <div className="p-5">
            <ErrorMessage message={getUserFriendlyMessage(articlesQuery.error)} />
          </div>
        ) : articlesQuery.isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-ink-3 animate-pulse">
            Loading…
          </div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-ink-3">
            No articles yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={TABLE_HEADER_CLASS}>Title</th>
                  <th className={TABLE_HEADER_CLASS}>Author</th>
                  <th className={TABLE_HEADER_CLASS}>Date</th>
                  <th className={`${TABLE_HEADER_CLASS} text-right`}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id} className="hover:bg-paper transition-colors">
                    <td className={TABLE_CELL_CLASS}>
                      <div className="flex items-center gap-3">
                        <img
                          src={a.imageUrl}
                          alt=""
                          className="w-11 h-11 rounded-lg object-cover shrink-0 border border-border"
                        />
                        <p className="font-bold text-[15px] text-ink truncate max-w-[280px]">
                          {a.title}
                        </p>
                      </div>
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <span className="text-[14px] font-semibold text-ink-2">
                        {a.author}
                      </span>
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <span className="text-[14px] font-semibold text-ink-2">
                        {a.date}
                      </span>
                    </td>
                    <td className={`${TABLE_CELL_CLASS} text-right`}>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[13px] font-bold rounded-full px-3 py-1.5 border ${a.isPremium
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-green-50 text-green-700 border-green-100'
                          }`}
                      >
                        <i
                          className={`${a.isPremium ? 'fa-solid fa-crown' : 'fa-solid fa-circle-check'} text-[12px]`}
                          aria-hidden="true"
                        />
                        {a.isPremium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ───── LIKES ANALYTICS ───── */}
      <div className="bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
        {/* Card Header: title + filters */}
        <div className="px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-serif text-xl font-black text-ink leading-tight">
              User Likes Analytics
            </h3>
            <p className="text-[12px] text-ink-3 mt-1">
              Track user likes for articles, podcasts, videos and blogs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <i
                className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4 text-[12px]"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by user..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="h-10 pl-9 pr-3.5 rounded-full border border-border bg-paper text-[12px] w-[220px] outline-none focus:border-green-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="relative">
              <i
                className="fa-solid fa-filter absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4 text-[11px] pointer-events-none"
                aria-hidden="true"
              />
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="h-10 pl-9 pr-9 rounded-full border border-border bg-paper text-[12px] font-medium text-ink-2 outline-none focus:border-green-500 focus:bg-white transition-colors appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="all">All Content</option>
                <option value="article">Articles</option>
                <option value="podcast">Podcasts</option>
                <option value="video">Videos</option>
                <option value="blog">Blogs</option>
              </select>
              <i
                className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-4 text-[10px] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {likesQuery.isError ? (
          <div className="px-6 py-5 border-t border-border">
            <ErrorMessage message={getUserFriendlyMessage(likesQuery.error)} />
          </div>
        ) : likesQuery.isLoading ? (
          <div className="py-12 text-center text-sm text-ink-3 animate-pulse border-t border-border">
            Loading analytics...
          </div>
        ) : likes.length === 0 ? (
          <div className="py-12 text-center border-t border-border">
            <div className="w-12 h-12 mx-auto rounded-full bg-paper border border-border flex items-center justify-center mb-3">
              <i
                className="fa-regular fa-heart text-lg text-ink-4"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-semibold text-ink-2">No likes found</p>
            <p className="text-xs text-ink-3 mt-1">
              Try adjusting your filters above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className={TABLE_HEADER_CLASS}>User</th>
                  <th className={TABLE_HEADER_CLASS}>Content</th>
                  <th className={TABLE_HEADER_CLASS}>Type</th>
                  <th className={TABLE_HEADER_CLASS}>Liked At</th>
                  <th className={`${TABLE_HEADER_CLASS} text-right`}>
                    Total Likes
                  </th>
                </tr>
              </thead>
              <tbody>
                {likes.map((item: any) => (
                  <tr
                    key={`${item.userName}-${item.contentId}`}
                    className="hover:bg-paper transition-colors"
                  >
                    <td className={TABLE_CELL_CLASS}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-700 flex items-center justify-center font-bold text-[15px] shrink-0 border border-green-200/60">
                          {(item.userName ?? '').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-[15px] text-ink truncate max-w-[200px]">
                          {item.userName}
                        </span>
                      </div>
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <span className="font-mono text-[14px] font-semibold text-ink-2 truncate max-w-[220px] inline-block">
                        {item.contentId}
                      </span>
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-2 bg-paper border border-border rounded-full px-3 py-1.5 capitalize">
                        <i
                          className={`text-[12px] ${item.contentType === 'article'
                              ? 'fa-solid fa-newspaper'
                              : item.contentType === 'podcast'
                                ? 'fa-solid fa-podcast'
                                : item.contentType === 'video'
                                  ? 'fa-solid fa-video'
                                  : item.contentType === 'blog'
                                    ? 'fa-solid fa-blog'
                                    : 'fa-solid fa-circle-dot'
                            }`}
                          aria-hidden="true"
                        />
                        {item.contentType}
                      </span>
                    </td>
                    <td className={TABLE_CELL_CLASS}>
                      <span className="text-[14px] font-semibold text-ink-2">
                        <p className="text-sm text-ink-3">
                          {new Date(item.likedAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </span>
                    </td>
                    <td className={`${TABLE_CELL_CLASS} text-right`}>
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-pink-600 bg-pink-50 border border-pink-100 rounded-full px-3 py-1.5">
                        <i
                          className="fa-solid fa-heart text-[12px]"
                          aria-hidden="true"
                        />
                        {item.totalLikes}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
