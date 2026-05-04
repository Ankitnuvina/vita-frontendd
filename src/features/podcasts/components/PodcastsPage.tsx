import React from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { PodcastCardSkeleton } from '@/components/common/PodcastCardSkeleton'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
import { getUserFriendlyMessage } from '@/lib/errors'
import type { Podcast } from '@/globals/types'

function PodcastCard({ podcast }: { podcast: Podcast }): React.ReactNode {
  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow flex flex-col cursor-pointer group">
      <div className="relative overflow-hidden h-40">
        <img
          src={podcast.imageUrl}
          alt={podcast.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/80 bg-black/30 rounded-full px-2 py-0.5">
            {podcast.episode}
          </span>
          <button
            aria-label={`Play ${podcast.title}`}
            className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white border-none hover:bg-green-400 transition-colors shadow-md"
          >
            ▶
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-green-600 mb-1.5">
          {podcast.category}
        </span>
        <h3 className="font-serif text-sm font-bold text-ink leading-snug mb-1.5 flex-1">
          {podcast.title}
        </h3>
        <p className="text-[11px] text-ink-3 font-light mb-3">with {podcast.guest}</p>
        <div className="flex items-center justify-between text-[10px] text-ink-4">
          <span>🎵 {podcast.duration}</span>
          <span>{podcast.date}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex gap-2">
          <button className="flex-1 text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 rounded-full py-1.5 hover:bg-green-100 transition-colors">
            ▶ Play
          </button>
          <button className="flex-1 text-[10px] font-semibold text-ink-3 bg-none border border-border rounded-full py-1.5 hover:border-ink-3 transition-colors">
            + Save
          </button>
        </div>
      </div>
    </article>
  )
}

export function PodcastsPage(): React.ReactNode {
  const { data: podcasts, isLoading, isError, error, refetch } = usePodcasts()

  return (
    <main id="main-content">
      <section
        aria-label="Podcasts hero"
        className="bg-gradient-to-br from-ink to-green-600/80 text-white py-14"
      >
        <div className="max-w-[1100px] mx-auto px-5 text-center">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-300 mb-3">
            🎧 Audio Content
          </p>
          <h1 className="font-serif text-[clamp(24px,4vw,46px)] font-black mb-3 tracking-tight">
            The Vitalize <em className="text-green-300 not-italic font-light">Podcast</em>
          </h1>
          <p className="text-sm text-white/60 max-w-lg mx-auto font-light leading-relaxed">
            Deep-dive conversations with world-leading health scientists, clinicians and coaches.
          </p>
          <div className="flex gap-2.5 justify-center mt-6 flex-wrap">
            {['🍎 Apple Podcasts', '🎵 Spotify', '▶ YouTube', '🎙 RSS'].map((p) => (
              <button
                key={p}
                className="text-xs font-semibold text-white/80 bg-white/10 border border-white/15 rounded-full px-4 py-2 hover:bg-white/15 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-5 py-12">
        <SectionHeader eyebrow="Latest Episodes" title="Recent" titleAccent="Shows" />

        {isLoading ? (
          <PodcastCardSkeleton count={4} />
        ) : isError ? (
          <ErrorMessage
            message={getUserFriendlyMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : !podcasts || podcasts.length === 0 ? (
          <EmptyState message="No podcast episodes yet." icon="🎧" />
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {podcasts.map((p) => (
              <PodcastCard key={p.id} podcast={p} />
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl border border-border p-6 grid grid-cols-4 gap-4 text-center">
          {[
            ['92', 'Episodes'],
            ['4.9★', 'Rating'],
            ['142K', 'Listeners'],
            ['12', 'Categories'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="font-serif text-2xl font-black text-ink mb-0.5">{val}</p>
              <p className="text-xs text-ink-3 font-light">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
