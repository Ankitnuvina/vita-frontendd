import React from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'

const VIDEOS = [
  {
    id: 1,
    title: '7-Min Morning Mobility Flow for Stiff Joints',
    views: '48K views',
    duration: '7:12',
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80',
    instructor: 'Coach Maya Rivera',
  },
  {
    id: 2,
    title: 'Breathwork for Sleep: 4-7-8 Method',
    views: '31K views',
    duration: '10:05',
    category: 'Mindfulness',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80',
    instructor: 'Dr. Priya Nair',
  },
  {
    id: 3,
    title: 'Anti-Inflammatory Meal Prep — 5 Recipes',
    views: '67K views',
    duration: '22:48',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
    instructor: 'Dr. James Liu',
  },
  {
    id: 4,
    title: 'Zone 2 Cardio: How to Train for Longevity',
    views: '29K views',
    duration: '15:30',
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
    instructor: 'Coach Maya Rivera',
  },
  {
    id: 5,
    title: 'The Gut-Brain Connection Explained',
    views: '55K views',
    duration: '18:22',
    category: 'Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
    instructor: 'Dr. Sarah Okafor',
  },
  {
    id: 6,
    title: 'NSDR: Non-Sleep Deep Rest Protocol',
    views: '83K views',
    duration: '12:00',
    category: 'Mindfulness',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=80',
    instructor: 'Dr. Priya Nair',
  },
]

const CAT_COLORS: Record<string, string> = {
  Fitness: '#5FA876',
  Mindfulness: '#8A6FC7',
  Nutrition: '#C47845',
}

export function VideosPage(): React.ReactNode {
  return (
    <main id="main-content">
      {/* Hero */}
      <section
        aria-label="Videos hero"
        className="bg-gradient-to-br from-ink-2 to-ink py-14 text-white text-center"
      >
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-300 mb-3">
          🎬 Video Library
        </p>
        <h1 className="font-serif text-[clamp(24px,4vw,46px)] font-black mb-3 tracking-tight">
          Health{' '}
          <em className="text-green-300 not-italic font-light">in Motion</em>
        </h1>
        <p className="text-sm text-white/55 max-w-md mx-auto font-light">
          Expert-led workouts, masterclasses, and guided practices — all grounded in science.
        </p>
      </section>

      {/* Grid */}
      <div className="max-w-[1100px] mx-auto px-5 py-12">
        <SectionHeader eyebrow="Browse" title="All" titleAccent="Videos" />
        <div className="grid grid-cols-3 gap-5">
          {VIDEOS.map((v) => (
            <article
              key={v.id}
              className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer group"
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
                <h3 className="font-serif text-sm font-bold text-ink leading-snug mb-1.5">
                  {v.title}
                </h3>
                <p className="text-[11px] text-ink-3 font-light mb-2">{v.instructor}</p>
                <div className="flex items-center justify-between text-[10px] text-ink-4">
                  <span>👁 {v.views}</span>
                  <button className="text-green-600 font-semibold hover:text-green-500 transition-colors">
                    Watch →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Channel stats */}
        <div className="mt-12 bg-ink rounded-2xl p-8 text-white text-center">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-300 mb-2">
            Subscribe for New Content
          </p>
          <h2 className="font-serif text-2xl font-black mb-4">
            Join <em className="text-green-400 not-italic font-light">142,000+</em> learners
          </h2>
          <button className="bg-green-500 text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-green-400 transition-colors">
            Subscribe on YouTube →
          </button>
        </div>
      </div>
    </main>
  )
}
