import React, { useDeferredValue, useMemo, useState } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
import { UnifiedMediaPlayer } from '@/features/podcasts/media/UnifiedMediaPlayer'

const VIDEOS = [
  {
    id: 1,
    title: '7-Min Morning Mobility Flow for Stiff Joints',
    views: '48K views',
    duration: '7:12',
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    instructor: 'Coach Maya Rivera',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 2,
    title: 'Breathwork for Sleep: 4-7-8 Method',
    views: '31K views',
    duration: '10:05',
    category: 'Mindfulness',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
    instructor: 'Dr. Priya Nair',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 3,
    title: 'Anti-Inflammatory Meal Prep — 5 Recipes',
    views: '67K views',
    duration: '22:48',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
    instructor: 'Dr. James Liu',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 4,
    title: 'Zone 2 Cardio: How to Train for Longevity',
    views: '29K views',
    duration: '15:30',
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    instructor: 'Coach Maya Rivera',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: 5,
    title: 'The Gut-Brain Connection Explained',
    views: '55K views',
    duration: '18:22',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
    instructor: 'Dr. Sarah Okafor',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  {
    id: 6,
    title: 'NSDR: Non-Sleep Deep Rest Protocol',
    views: '83K views',
    duration: '12:00',
    category: 'Mindfulness',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=80',
    instructor: 'Dr. Priya Nair',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
]

const CAT_COLORS: Record<string, string> = {
  Fitness: '#5FA876',
  Mindfulness: '#8A6FC7',
  Nutrition: '#C47845',
}

type VideoItem = (typeof VIDEOS)[number]

interface VideoDetailModalProps {
  video: VideoItem
  onClose: () => void
}

function VideoDetailModal({ video, onClose }: VideoDetailModalProps): React.ReactNode {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-pop animate-zoom-in">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-green-600">
              {video.category}
            </p>
            <h2 className="font-serif text-lg sm:text-xl font-black text-ink">{video.title}</h2>
            <p className="mt-1 text-xs text-ink-3">
              {video.instructor} · {video.duration} · {video.views}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video detail"
            className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-ink-3 hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>
        <UnifiedMediaPlayer
          mediaId={`video-${video.id}-detail`}
          title={video.title}
          sourceUrl={video.videoUrl}
          kind="video"
          posterUrl={video.imageUrl}
        />
      </div>
    </div>
  )
}

export function VideosPage(): React.ReactNode {
  const [expandedVideoId, setExpandedVideoId] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const isSearching = search !== deferredSearch

  const filteredVideos = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return VIDEOS
    return VIDEOS.filter((video) => {
      return (
        video.title.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query) ||
        video.instructor.toLowerCase().includes(query)
      )
    })
  }, [deferredSearch])

  return (
    <main id="main-content">
      {/* Hero */}
      <section
        aria-label="Videos hero"
        className="bg-gradient-to-br from-ink-2 to-ink py-12 sm:py-14 text-white text-center"
      >
        <div className="vh-container">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-300 mb-3">
            🎬 Video Library
          </p>
          <h1 className="text-white font-serif text-[clamp(28px,5vw,48px)] font-black mb-3 tracking-tight">
            Health{' '}
            <em className="text-green-300 not-italic font-light">in Motion</em>
          </h1>
          <p className="text-sm sm:text-base text-white/55 max-w-md mx-auto font-light leading-relaxed">
            Expert-led workouts, masterclasses, and guided practices — all grounded in science.
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="vh-container py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <SectionHeader eyebrow="Browse" title="All" titleAccent="Videos" />
          <div className="relative w-full sm:w-64 shrink-0">
            <label htmlFor="video-search" className="sr-only">Search videos</label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">🔍</span>
            <input
              id="video-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos..."
              className="w-full rounded-full border border-border bg-white py-2 pl-8 pr-4 text-xs text-ink outline-none transition-colors focus:border-green-400"
            />
          </div>
        </div>
        {isSearching ? (
          <ArticleCardSkeleton count={3} />
        ) : filteredVideos.length === 0 ? (
          <EmptyState message="No videos match your search." icon="🎬" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredVideos.map((v) => (
              <article
                key={v.id}
                className="vh-card vh-card-hover overflow-hidden cursor-pointer group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={v.imageUrl}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-green-600 text-lg shadow-lg">
                      ▶
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {v.duration}
                  </span>
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold tracking-[0.08em] uppercase text-white bg-black/30 rounded-full px-2 py-0.5"
                    style={{ background: CAT_COLORS[v.category] + 'cc' }}
                  >
                    {v.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="flex-1 font-serif text-sm font-bold text-ink leading-snug mb-1.5 truncate ">
                      {v.title}
                    </h3>
                    <div className="shrink-0 text-base leading-none">
                      💖
                    </div>
                  </div>
                  <p className="text-[11px] text-ink-3 font-light mb-2">{v.instructor}</p>
                  <div className="flex items-center justify-between text-[10px] text-ink-4">
                    <span>👁‍🗨 {v.views}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedVideoId((curr) => {
                          if (curr === v.id) return null
                          return v.id
                        })
                      }
                      className="text-green-600 font-semibold hover:text-green-500 transition-colors"
                    >
                      {expandedVideoId === v.id ? 'Pause' : 'Watch'}
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedVideoId((curr) => {
                          if (curr === v.id) return null
                          return v.id
                        })
                      }
                      className="flex-1 rounded-full border border-green-100 bg-green-50 py-1.5 text-[10px] font-semibold text-green-600"
                    >
                      {expandedVideoId === v.id ? '❚❚ Pause' : '▶ Play'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVideo(v)}
                      className="flex-1 rounded-full border border-border py-1.5 text-[10px] font-semibold text-ink-3"
                    >
                      View Details
                    </button>
                  </div>
                  {expandedVideoId === v.id && (
                    <UnifiedMediaPlayer
                      className="mt-3"
                      mediaId={`video-${v.id}`}
                      title={v.title}
                      sourceUrl={v.videoUrl}
                      kind="video"
                      posterUrl={v.imageUrl}
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Channel stats */}
        <div className="mt-10 sm:mt-12 bg-ink rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-300 mb-2">
            Subscribe for New Content
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-black mb-4">
            Join <em className="text-green-400 not-italic font-light">142,000+</em> learners
          </h2>
          <button className="vh-btn vh-btn-primary text-sm px-6 sm:px-8 py-3">
            Subscribe on YouTube →
          </button>
        </div>
      </div>

      {selectedVideo && <VideoDetailModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </main>
  )
}
