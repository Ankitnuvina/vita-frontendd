import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PodcastCardSkeleton } from '@/components/common/PodcastCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Podcast } from '@/globals/types'
import { PodcastDetailModal } from './PodcastDetailModal'
import { LikeButton } from '@/features/likes/components/common/LikeButton'
import { CommentButton } from '@/features/comments/components/CommentButton'
import { CommentModal } from '@/features/comments/components/CommentModal'
import { UnifiedMediaPlayer } from '@/features/podcasts/media/UnifiedMediaPlayer'
import { ChevronDown, Filter, Search, Send } from 'lucide-react'

interface PodcastCardProps {
  podcast: Podcast
  isExpanded: boolean
  onTogglePlay: () => void
  onOpenDetails: () => void
}

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

  const [showCategories, setShowCategories] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <main id="main-content">
        <div className="vh-container py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <SectionHeader
              eyebrow="Latest Episodes"
              title="Recent"
              titleAccent="Shows"
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <label htmlFor="podcast-search" className="sr-only">
                  Search podcasts
                </label>

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>

                <input
                  id="podcast-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search episodes..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none shadow-sm transition-all focus:border-green-500
                  focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div ref={filterRef} className="relative">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedCat}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {showCategories && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b bg-slate-50">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Categories
                      </p>
                    </div>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCat(cat)
                          setShowCategories(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-green-500 font-semibold                
                ${selectedCat === cat
                            ? 'bg-green-50 text-green-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                          }
              `}>
                        {cat}
                        {selectedCat === cat && (
                          <span className="w-2 h-2 rounded-full bg-green-500 " />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
            <EmptyState message="Please log in to view our podcasts" icon="🎧" />
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

      </main>
      {selectedPodcast && (
        <PodcastDetailModal podcast={selectedPodcast} onClose={() => setSelectedPodcast(null)} />
      )}
    </>
  )
}

// Podcast play part
function PodcastCard({
  podcast,
  isExpanded,
  onTogglePlay,
  onOpenDetails,
}: PodcastCardProps): React.ReactNode {
  const [openComments, setOpenComments] = useState(false)
  return (
    <>
      <article className="bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-sm">
        <div className="relative overflow-hidden bg-neutral-950">
          {isExpanded ? (
            <div className="p-0 pb-0">
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
                className="w-full h-[176px] object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
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
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[15px] font-bold text-neutral-900 leading-snug line-clamp-2 truncate">{podcast.title}</h3>
              <p className="mt-1.5 text-[11px] text-neutral-400 truncate">with{' '}<span className="text-neutral-700 font-semibold">{podcast.guest}</span></p>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-neutral-500 text-xs">
              <LikeButton contentType="podcast" contentId={podcast.id} />
              <div className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer">
                <CommentButton contentType="podcast" contentId={podcast.id} onClick={() => setOpenComments(true)} />
              </div>
              <div className="flex items-center gap-1 hover:text-green-600 transition-colors cursor-pointer">
                <Send className="w-4 h-4" />
              </div>
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
            <button
              type="button"
              onClick={onOpenDetails}
              className="flex-1 text-[12px] font-bold text-white bg-green-500 border border-neutral-200 rounded-md py-2 hover:border-neutral-400 hover:text-white-700 transition-all duration-200"
            >
              Details
            </button>
          </div>
        </div>

      </article>
      {openComments && (
        <div
          className="border-t border-border bg-neutral-50 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <CommentModal
            contentType="podcast"
            contentId={podcast.id}
            total={0}
            onClose={() => setOpenComments(false)}
          />
        </div>
      )}
    </>
  )
}

