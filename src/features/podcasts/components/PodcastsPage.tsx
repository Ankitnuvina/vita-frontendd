// import React, { useDeferredValue, useMemo, useState } from 'react'
// import { SectionHeader } from '@/components/common/SectionHeader'
// import { PodcastCardSkeleton } from '@/components/common/PodcastCardSkeleton'
// import { ErrorMessage } from '@/components/common/ErrorMessage'
// import { EmptyState } from '@/components/common/EmptyState'
// import { UnifiedMediaPlayer } from '@/components/media/UnifiedMediaPlayer'
// import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
// import { getUserFriendlyMessage } from '@/lib/errors'
// import type { Podcast } from '@/globals/types'

// interface PodcastCardProps {
//   podcast: Podcast
//   isExpanded: boolean
//   onTogglePlay: () => void
//   onOpenDetails: () => void
// }

// function PodcastCard({
//   podcast,
//   isExpanded,
//   onTogglePlay,
//   onOpenDetails,
// }: PodcastCardProps): React.ReactNode {
//   return (
//     <article className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col group">

//       <div className="relative overflow-hidden bg-black">
//         {isExpanded ? (
//           <UnifiedMediaPlayer
//             mediaId={`podcast-${podcast.id}`}
//             title={podcast.title}
//             sourceUrl={podcast.videoUrl}
//             kind="video"
//           />
//         ) : (
//           <div className="relative h-40">
//             <video
//               src={podcast.videoUrl}
//               className="w-full h-full object-cover opacity-80"
//               playsInline
//               muted
//               preload="metadata"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//             <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
//               <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/80 bg-black/30 rounded-full px-2 py-0.5">
//                 {podcast.episode}
//               </span>
//               <button
//                 type="button"
//                 onClick={onTogglePlay}
//                 aria-label={`Play ${podcast.title}`}
//                 className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-400 transition-colors shadow-md"
//               >
//                 ▶
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-4 flex flex-col flex-1">
//         <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-green-600 mb-1.5">
//           {podcast.category}
//         </span>
//         <h3 className="font-serif text-sm font-bold text-ink leading-snug mb-1.5 flex-1">
//           {podcast.title}
//         </h3>
//         <p className="text-[11px] text-ink-3 font-light mb-3">with {podcast.guest}</p>
//         <div className="flex items-center justify-between text-[10px] text-ink-4">
//           <span>🎵 {podcast.duration}</span>
//           <span>{podcast.date}</span>
//         </div>
//         <div className="mt-3 pt-3 border-t border-border flex gap-2">
//           <button
//             type="button"
//             onClick={onTogglePlay}
//             className="flex-1 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 rounded-full py-1.5 hover:bg-green-100 transition-colors"
//           >
//             {isExpanded ? '❚❚ Pause' : '▶ Play'}
//           </button>
//           <button
//             type="button"
//             onClick={onOpenDetails}
//             className="flex-1 text-[10px] font-semibold text-ink-3 bg-none border border-border rounded-full py-1.5 hover:border-ink-3 transition-colors"
//           >
//             View Details
//           </button>
//         </div>
//       </div>
//     </article>
//   )
// }

// interface PodcastDetailModalProps {
//   podcast: Podcast
//   onClose: () => void
// }

// function PodcastDetailModal({ podcast, onClose }: PodcastDetailModalProps): React.ReactNode {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose()
//       }}
//     >
//       <div className="w-full max-w-2xl rounded-2xl border border-border bg-white p-5 shadow-2xl">
//         <div className="mb-4 flex items-start justify-between gap-3">
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-green-600">
//               {podcast.episode}
//             </p>
//             <h2 className="font-serif text-xl font-black text-ink">{podcast.title}</h2>
//             <p className="mt-1 text-xs text-ink-3">
//               with {podcast.guest} · {podcast.duration} · {podcast.date}
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink-3 hover:border-ink-3"
//           >
//             Close
//           </button>
//         </div>

//         <UnifiedMediaPlayer
//           mediaId={`podcast-${podcast.id}-detail`}
//           title={podcast.title}
//           sourceUrl={podcast.videoUrl}
//           kind="video"
//           className="mt-2"
//         />
//       </div>
//     </div>
//   )
// }

// export function PodcastsPage(): React.ReactNode {
//   const { data: podcasts, isLoading, isError, error, refetch } = usePodcasts()
//   const [expandedPodcastId, setExpandedPodcastId] = useState<number | null>(null)
//   const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null)
//   const [search, setSearch] = useState('')
//   const deferredSearch = useDeferredValue(search)
//   const isSearching = search !== deferredSearch

//   const filteredPodcasts = useMemo(() => {
//     if (!podcasts) return []
//     const query = deferredSearch.trim().toLowerCase()
//     if (!query) return podcasts
//     return podcasts.filter((podcast) => {
//       return (
//         podcast.title.toLowerCase().includes(query) ||
//         podcast.category.toLowerCase().includes(query) ||
//         podcast.episode.toLowerCase().includes(query) ||
//         podcast.guest.toLowerCase().includes(query)
//       )
//     })
//   }, [podcasts, deferredSearch])

//   return (
//     <main id="main-content">
//       <section
//         aria-label="Podcasts hero"
//         className="bg-gradient-to-br from-ink to-green-600/80 text-white py-14"
//       >
//         <div className="max-w-[1100px] mx-auto px-5 text-center">
//           <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-300 mb-3">
//             🎧 Audio Content
//           </p>
//           <h1 className="font-serif text-[clamp(24px,4vw,46px)] font-black mb-3 tracking-tight">
//             The Vitalize <em className="text-green-300 not-italic font-light">Podcast</em>
//           </h1>
//           <p className="text-sm text-white/60 max-w-lg mx-auto font-light leading-relaxed">
//             Deep-dive conversations with world-leading health scientists, clinicians and coaches.
//           </p>
//           <div className="flex gap-2.5 justify-center mt-6 flex-wrap">
//             {['🍎 Mental Health', '🎵 Longevity', '▶ Mindfulness', '🎙 Fitness'].map((p) => (
//               <button
//                 key={p}
//                 className="text-xs font-semibold text-white/80 bg-white/10 border border-white/15 rounded-full px-4 py-2 hover:bg-white/15 transition-colors"
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="max-w-[1100px] mx-auto px-5 py-12">
//         <div className="flex items-end justify-between gap-4">
//           <SectionHeader eyebrow="Latest Episodes" title="Recent" titleAccent="Shows" />
//           <div className="relative mb-8 w-64 shrink-0">
//             <label htmlFor="podcast-search" className="sr-only">Search podcasts</label>
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🔍</span>
//             <input
//               id="podcast-search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search podcasts..."
//               className="w-full rounded-full border border-border bg-white py-2 pl-8 pr-4 text-xs text-ink outline-none transition-colors focus:border-green-400"
//             />
//           </div>
//         </div>

//         {isLoading || isSearching ? (
//           <PodcastCardSkeleton count={4} />
//         ) : isError ? (
//           <ErrorMessage
//             message={getUserFriendlyMessage(error)}
//             onRetry={() => void refetch()}
//           />
//         ) : !podcasts || podcasts.length === 0 ? (
//           <EmptyState message="No podcast episodes yet." icon="🎧" />
//         ) : filteredPodcasts.length === 0 ? (
//           <EmptyState message="No podcasts match your search." icon="🔎" />
//         ) : (
//           <div className="grid grid-cols-4 gap-4">
//             {filteredPodcasts.map((p) => (
//               <PodcastCard
//                 key={p.id}
//                 podcast={p}
//                 isExpanded={expandedPodcastId === p.id}
//                 onTogglePlay={() =>
//                   setExpandedPodcastId((curr) => {
//                     if (curr === p.id) return null
//                     return p.id
//                   })
//                 }
//                 onOpenDetails={() => setSelectedPodcast(p)}
//               />
//             ))}
//           </div>
//         )}

//         <div className="mt-12 bg-white rounded-2xl border border-border p-6 grid grid-cols-4 gap-4 text-center">
//           {[
//             ['92', 'Episodes'],
//             ['4.9★', 'Rating'],
//             ['142K', 'Listeners'],
//             ['12', 'Categories'],
//           ].map(([val, label]) => (
//             <div key={label}>
//               <p className="font-serif text-2xl font-black text-ink mb-0.5">{val}</p>
//               <p className="text-xs text-ink-3 font-light">{label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {selectedPodcast && (
//         <PodcastDetailModal podcast={selectedPodcast} onClose={() => setSelectedPodcast(null)} />
//       )}
//     </main>
//   )
// }




import React, { useDeferredValue, useMemo, useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PodcastCardSkeleton } from '@/components/common/PodcastCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { UnifiedMediaPlayer } from '@/components/media/UnifiedMediaPlayer'
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Podcast } from '@/globals/types'

interface PodcastCardProps {
  podcast: Podcast
  isExpanded: boolean
  onTogglePlay: () => void
  onOpenDetails: () => void
}

function PodcastCard({
  podcast,
  isExpanded,
  onTogglePlay,
  onOpenDetails,
}: PodcastCardProps): React.ReactNode {
  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-neutral-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group shadow-sm">

      {/* Thumbnail / Player */}
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
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Top badge */}
            <div className="absolute top-3 left-3">
              <span className="text-[9px] font-black tracking-[0.12em] uppercase text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-1">
                {podcast.episode}
              </span>
            </div>

            {/* Category badge top right */}
            <div className="absolute top-3 right-3">
              <span className="text-[9px] font-bold tracking-wide uppercase text-green-300 bg-green-950/60 backdrop-blur-sm border border-green-500/30 rounded-full px-2.5 py-1">
                {podcast.category}
              </span>
            </div>

            {/* Bottom play button */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-end">
              <button
                type="button"
                onClick={onTogglePlay}
                aria-label={`Play ${podcast.title}`}
                className="w-10 h-10 bg-green-500 hover:bg-green-400 active:scale-95 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/40 transition-all duration-200"
              >
                <span className="text-sm pl-0.5">▶</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category — hidden when expanded since it's in thumbnail */}
        {isExpanded && (
          <span className="text-[9px] font-black tracking-[0.12em] uppercase text-green-600 mb-1.5">
            {podcast.category}
          </span>
        )}

        {/* Title */}
        <h3 className="font-serif text-sm font-bold text-neutral-900 leading-snug mb-1 flex-1 line-clamp-2">
          {podcast.title}
        </h3>

        {/* Guest */}
        <p className="text-[11px] text-neutral-400 font-medium mb-3">
          with <span className="text-neutral-600">{podcast.guest}</span>
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium">
            <span className="text-green-500">▶</span>
            {podcast.duration}
          </span>
          <span className="text-[10px] text-neutral-400 font-medium">{podcast.date}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-100 mb-3" />

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex-1 text-[10px] font-bold rounded-xl py-2 transition-all duration-200 ${
              isExpanded
                ? 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200'
                : 'text-white bg-green-500 hover:bg-green-600 shadow-sm shadow-green-200'
            }`}
          >
            {isExpanded ? '❚❚ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={onOpenDetails}
            className="flex-1 text-[10px] font-bold text-neutral-500 bg-white border border-neutral-200 rounded-xl py-2 hover:border-neutral-400 hover:text-neutral-700 transition-all duration-200"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  )
}

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
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-100 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-neutral-100">
          <div>
            <p className="text-[10px] font-black tracking-[0.14em] uppercase text-green-600 mb-1">
              {podcast.episode} · {podcast.category}
            </p>
            <h2 className="font-serif text-xl font-black text-neutral-900 leading-snug">
              {podcast.title}
            </h2>
            <p className="mt-1.5 text-xs text-neutral-400">
              with <span className="text-neutral-600 font-medium">{podcast.guest}</span>
              <span className="mx-1.5 text-neutral-300">·</span>
              {podcast.duration}
              <span className="mx-1.5 text-neutral-300">·</span>
              {podcast.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Player */}
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

      {/* Hero Section */}
      <section
        aria-label="Podcasts hero"
        className="relative bg-neutral-950 text-white py-16 overflow-hidden"
      >
        {/* Background texture */}
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

          {/* Category pills */}
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

      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto px-5 py-12">

        {/* Header row */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <SectionHeader eyebrow="Latest Episodes" title="Recent" titleAccent="Shows" />

          {/* Search */}
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

        {/* Grid */}
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

        {/* Stats bar */}
        <div className="mt-14 bg-neutral-950 rounded-3xl p-6 grid grid-cols-4 gap-4 text-center">
          {[
            ['92', 'Episodes'],
            ['4.9★', 'Avg Rating'],
            ['142K', 'Listeners'],
            ['12', 'Categories'],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <p className="font-serif text-2xl font-black text-white">{val}</p>
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPodcast && (
        <PodcastDetailModal podcast={selectedPodcast} onClose={() => setSelectedPodcast(null)} />
      )}
    </main>
  )
}