import React, { useDeferredValue, useMemo, useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PodcastCardSkeleton } from '@/components/common/PodcastCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { UnifiedMediaPlayer } from '@/components/media/UnifiedMediaPlayer'
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Podcast } from '@/globals/types'

import { LikeButton } from '@/features/likes/components/common/LikeButton'

interface PodcastCardProps {
  podcast: Podcast
  isExpanded: boolean
  onTogglePlay: () => void
  onOpenDetails: () => void
}

// Podcasts static uper part and rating part
export function PodcastsPage(): React.ReactNode {
  const { data: podcasts, isLoading, isError, error, refetch } = usePodcasts()
  const [expandedPodcastId, setExpandedPodcastId] = useState<number | null>(null)
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null)
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const isSearching = search !== deferredSearch

  const filteredPodcasts = useMemo(() => {
    if (!podcasts) return []
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return podcasts
    return podcasts.filter((podcast) => {
      return (
        podcast.title.toLowerCase().includes(query) ||
        podcast.category.toLowerCase().includes(query) ||
        podcast.episode.toLowerCase().includes(query) ||
        podcast.guest.toLowerCase().includes(query)
      )
    })
  }, [podcasts, deferredSearch])

  return (
    <main id="main-content">
      <section aria-label="Podcasts hero" className="relative bg-neutral-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/40 via-neutral-950 to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-950/30 via-transparent to-transparent" />
        <div className="relative max-w-[1100px] mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-400">
              Video Podcast
            </p>
          </div>
          <h1 className="font-serif text-[clamp(28px,5vw,52px)] font-black mb-4 tracking-tight leading-tight">
            The Vitalize{' '}
            <em className="text-green-400 not-italic">Podcast</em>
          </h1>
          <p className="text-sm text-white/50 max-w-md mx-auto font-light leading-relaxed mb-8">
            Deep-dive conversations with world-leading health scientists, clinicians and coaches.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {['🧠 Mental Health', '🌿 Longevity', '🧘 Mindfulness', '💪 Fitness'].map((p) => (
              <button
                key={p}
                className="text-xs font-semibold text-white/70 bg-white/8 border border-white/10 rounded-full px-4 py-2 hover:bg-white/15 hover:border-white/20 hover:text-white transition-all duration-200"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-5 py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeader eyebrow="Latest Episodes" title="Recent" titleAccent="Shows" />
          <div className="relative w-64 shrink-0">
            <label htmlFor="podcast-search" className="sr-only">Search podcasts</label>
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">🔍</span>
            <input
              id="podcast-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search episodes..."
              className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-800 outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100 placeholder:text-neutral-400"
            />
          </div>
        </div>
        {isLoading || isSearching ? (
          <PodcastCardSkeleton count={4} />
        ) : isError ? (
          <ErrorMessage
            message={getUserFriendlyMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : !podcasts || podcasts.length === 0 ? (
          <EmptyState message="No podcast episodes yet." icon="🎧" />
        ) : filteredPodcasts.length === 0 ? (
          <EmptyState message="No podcasts match your search." icon="🔎" />
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {filteredPodcasts.map((p) => (
              <PodcastCard
                key={p.id}
                podcast={p}
                isExpanded={expandedPodcastId === p.id}
                onTogglePlay={() =>
                  setExpandedPodcastId((curr) => {
                    if (curr === p.id) return null
                    return p.id
                  })
                }
                onOpenDetails={() => setSelectedPodcast(p)}
              />
            ))}
          </div>
        )}
        <div className="mt-14 bg-neutral-950 rounded-3xl p-6 grid grid-cols-4 gap-4 text-center">
          {[
            ['00', 'Episodes'],
            ['0.0★', 'Avg Rating'],
            ['0K', 'Listeners'],
            ['0', 'Categories'],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="font-serif text-2xl font-black text-white">{val}</p>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedPodcast && (
        <PodcastDetailModal podcast={selectedPodcast} onClose={() => setSelectedPodcast(null)} />
      )}
    </main>
  )
}

// Detail modal part 
interface PodcastDetailModalProps {
  podcast: Podcast
  onClose: () => void
}
function PodcastDetailModal({ podcast, onClose }: PodcastDetailModalProps): React.ReactNode {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-2xl rounded-md border border-neutral-100 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-3 px-6 pt-4 pb-4 border-b border-neutral-100">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-green-600">
              {podcast.episode} · {podcast.category}
            </p>
            <h2 className="text-xl font-bold leading-snug text-neutral-900">
              {podcast.title}
              <span className="ml-2 text-[15px] font-medium text-neutral-500">
                with
              </span>
              <span className="ml-1 text-[15px] font-semibold text-neutral-600">
                {podcast.guest}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="font-medium text-neutral-700">
                  EP Duration :
                </span>
                {podcast.duration}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium text-neutral-700">
                  Date :
                </span>
                {podcast.date}
              </span>
              <div>
                <LikeButton
                  contentType="podcast"
                  contentId={podcast.id}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">
          <UnifiedMediaPlayer
            mediaId={`podcast-${podcast.id}-detail`}
            title={podcast.title}
            sourceUrl={podcast.videoUrl}
            kind="video"
          />
        </div>
      </div>
    </div>
  )
}


// Podcast play part
function PodcastCard({
  podcast,
  isExpanded,
  onTogglePlay,
  onOpenDetails,
}: PodcastCardProps): React.ReactNode {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-sm">
      <div className="relative overflow-hidden bg-neutral-950">
        {isExpanded ? (
          <div className="p-2 pb-0">
            <UnifiedMediaPlayer
              mediaId={`podcast-${podcast.id}`}
              title={podcast.title}
              sourceUrl={podcast.videoUrl}
              kind="video"
              className="rounded-2xl overflow-hidden"
            />
          </div>
        ) : (
          <div className="relative h-44">
            <video
              src={podcast.videoUrl}
              className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              playsInline
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-1 left-2">
              <span className="text-[9px] font-black tracking-[0.12em] uppercase text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
                {podcast.episode}
              </span>
            </div>

            <div className="absolute top-1 right-2">
              <span className="text-[9px] font-bold tracking-wide uppercase text-white bg-green-400 backdrop-blur-sm border border-green-500/30 rounded-full px-2.5 py-1">
                {podcast.category}
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={`Play ${podcast.title}`}
                className="w-10 h-10 bg-white active:scale-95 rounded-full flex items-center justify-center text-green-500 shadow-lg shadow-green-500/40 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              >
                <span className="text-sm pl-0.5">▶</span>
              </button>
            </div>

          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {isExpanded && (
          <span className="text-[9px] font-black tracking-[0.12em] uppercase text-green-600 mb-2">
            {podcast.category}
          </span>
        )}
        {/* Title + Like */}
        <div className="flex items-start justify-between gap-3 mb-1">

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-sm font-bold text-neutral-900 leading-snug line-clamp-2 truncate ">
              {podcast.title}
            </h3>

            <p className="mt-1 text-[11px] text-neutral-400 truncate">
              with{' '}
              <span className="text-neutral-600 font-medium">
                {podcast.guest}
              </span>
            </p>
          </div>

          {/* Right Side Like */}
          <div className="shrink-0">
            <LikeButton
              contentType="podcast"
              contentId={podcast.id}
            />
          </div>

        </div>

        {/* Duration + Date */}
        <div className="flex items-center justify-between mb-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
            <span className="text-green-500">▶</span>
            {podcast.duration}
          </span>

          <span className="text-[10px] text-neutral-400 font-medium">
            {podcast.date}
          </span>
        </div>

        <div className="h-px bg-neutral-100 mb-3" />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex-1 text-[12px] font-bold rounded-md py-2 transition-all duration-200 ${isExpanded
              ? 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200'
              : 'text-white bg-green-500 hover:bg-green-600 shadow-sm shadow-green-200'
              }`}
          >
            {isExpanded ? '❚❚ Pause' : '▶ Play'}
          </button>

          <button
            type="button"
            onClick={onOpenDetails}
            className="flex-1 text-[12px] font-bold text-neutral-500 bg-white border border-neutral-200 rounded-md py-2 hover:border-neutral-400 hover:text-neutral-700 transition-all duration-200"
          >
            Details
          </button>
        </div>

      </div>
    </article>
  )
}

