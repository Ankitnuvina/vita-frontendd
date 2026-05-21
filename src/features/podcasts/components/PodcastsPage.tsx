import React, { useDeferredValue, useMemo, useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PodcastCardSkeleton } from '@/components/common/PodcastCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Podcast } from '@/globals/types'

import { LikeButton } from '@/features/likes/components/common/LikeButton'
import { UnifiedMediaPlayer } from '@/features/podcasts/media/UnifiedMediaPlayer'
import { Search } from 'lucide-react'

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
  const [selectedCat, setSelectedCat] = useState('All')
  const deferredSearch = useDeferredValue(search)
  const isSearching = search !== deferredSearch

  const CATEGORIES = useMemo(
    () => ['All', ...Array.from(new Set((podcasts ?? []).map((p) => p.category)))],
    [podcasts]
  )

  const filteredPodcasts = useMemo(() => {
    if (!podcasts) return []
    const query = deferredSearch.trim().toLowerCase()
    return podcasts.filter((podcast) => {
      const matchCat = selectedCat === 'All' || podcast.category === selectedCat
      const matchSearch =
        !query ||
        podcast.title.toLowerCase().includes(query) ||
        podcast.category.toLowerCase().includes(query) ||
        podcast.episode.toLowerCase().includes(query) ||
        podcast.guest.toLowerCase().includes(query)
      return matchCat && matchSearch
    })
  }, [podcasts, deferredSearch, selectedCat])

  return (
    <main id="main-content">
      {/* ── Sticky category tabs (same style as Articles / Blogs page) ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-border py-3 sticky top-14 sm:top-16 z-[98]">
        <div className="vh-container flex justify-center gap-2 overflow-x-auto scroll-x-clean pb-1 -mb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border-[1.5px] shrink-0 transition-all duration-200 ${
                selectedCat === cat
                  ? 'bg-green-600 text-white border-green-600 shadow-soft'
                  : 'border-border text-ink-3 bg-white hover:border-green-200 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="vh-container py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <SectionHeader eyebrow="Latest Episodes" title="Recent" titleAccent="Shows" />
          <div className="relative w-full sm:w-64 shrink-0">
            <label htmlFor="podcast-search" className="sr-only">Search podcasts</label>
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400"> <Search className="w-4 h-4" /> </span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
        <div className="mt-12 sm:mt-14 bg-neutral-950 rounded-3xl p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            ['00', 'Episodes'],
            ['0.0★', 'Avg Rating'],
            ['0K', 'Listeners'],
            ['0', 'Categories'],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="font-serif text-2xl sm:text-3xl font-black text-white">{val}</p>
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
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-100 bg-white shadow-2xl animate-zoom-in">
        <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 pb-4 border-b border-neutral-100">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-green-600">
              {podcast.episode} · {podcast.category}
            </p>
            <h2 className="text-lg sm:text-xl font-bold leading-snug text-neutral-900">
              {podcast.title}
              <span className="ml-2 text-sm font-medium text-neutral-500">
                with
              </span>
              <span className="ml-1 text-sm font-semibold text-neutral-600">
                {podcast.guest}
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-neutral-500">
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
            aria-label="Close podcast detail"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>
        <div className="px-4 sm:px-6 py-5">
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
              autoPlay
            />
          </div>
        ) : (
          <div className="relative h-44">
            <video
              src={podcast.videoUrl}
              className="w-full h-[50vh] object-contain opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
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
                className="w-10 h-10 bg-white active:scale-95 rounded-full flex items-center justify-center text-green-500 shadow-lg shadow-green-500/40 transition-all duration-200"
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
          <div className="shrink-0">
            <LikeButton
              contentType="podcast"
              contentId={podcast.id}
            />
          </div>
        </div>

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
          {/* <button
            type="button"
            onClick={onTogglePlay}
            className={`flex-1 text-[12px] font-bold rounded-md py-2 transition-all duration-200 ${isExpanded
              ? 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200'
              : 'text-white bg-green-500 hover:bg-green-600 shadow-sm shadow-green-200'
              }`}
          >
            {isExpanded ? '❚❚ Pause' : '▶ Play'}
          </button> */}

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

