import React, { useState } from 'react'

// ─── Static Data ──────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: '🏋️',
    label: 'Strength',
    description: 'Build lean muscle, protect joints, and fuel long-term metabolic health.',
    color: 'from-orange-50 to-red-100',
    accent: 'text-red-700',
    border: 'border-red-200',
  },
  {
    icon: '🤸',
    label: 'Flexibility',
    description: 'Restore range of motion, release chronic tension, and move without pain.',
    color: 'from-sky-50 to-cyan-100',
    accent: 'text-cyan-700',
    border: 'border-cyan-200',
  },
  {
    icon: '🫀',
    label: 'Cardio',
    description: 'Train your heart, sharpen your lungs, and build effortless endurance.',
    color: 'from-rose-50 to-pink-100',
    accent: 'text-rose-700',
    border: 'border-rose-200',
  },
  {
    icon: '🍽️',
    label: 'Nutrition',
    description: 'Eat with precision. Whole foods, optimal timing, and lasting energy.',
    color: 'from-green-50 to-emerald-100',
    accent: 'text-emerald-700',
    border: 'border-emerald-200',
  },
]

const MOVEMENTS = [
  {
    title: 'Morning Mobility Flow',
    duration: '10 min',
    level: 'Beginner',
    tag: 'Flexibility',
    tagColor: 'bg-cyan-100 text-cyan-700',
    icon: '🌅',
    description:
      'Hip circles, cat-cow, thoracic rotations and ankle rolls — wake every joint before the day demands them.',
    muscles: ['Hips', 'Spine', 'Ankles'],
  },
  {
    title: 'Push-Pull Superset',
    duration: '25 min',
    level: 'Intermediate',
    tag: 'Strength',
    tagColor: 'bg-red-100 text-red-700',
    icon: '💪',
    description:
      'Alternate push-ups and inverted rows in 4 rounds. No equipment. Maximum muscle balance.',
    muscles: ['Chest', 'Back', 'Arms'],
  },
  {
    title: 'Zone 2 Walk',
    duration: '30 min',
    level: 'All Levels',
    tag: 'Cardio',
    tagColor: 'bg-rose-100 text-rose-700',
    icon: '🚶',
    description:
      'Brisk enough to hold a conversation with effort. The single best long-term health investment you can make.',
    muscles: ['Heart', 'Legs', 'Lungs'],
  },
  {
    title: 'Deep Hip Opener',
    duration: '12 min',
    level: 'Beginner',
    tag: 'Flexibility',
    tagColor: 'bg-cyan-100 text-cyan-700',
    icon: '🧘',
    description:
      'Pigeon pose, lizard lunge, and figure-four holds. Undoes hours of sitting in minutes.',
    muscles: ['Hip Flexors', 'Glutes', 'Piriformis'],
  },
  {
    title: 'Core Foundations',
    duration: '15 min',
    level: 'Beginner',
    tag: 'Strength',
    tagColor: 'bg-red-100 text-red-700',
    icon: '🎯',
    description:
      'Dead bugs, hollow holds, and bird dogs. Build true core stability — not just abs.',
    muscles: ['Deep Core', 'Obliques', 'Lower Back'],
  },
  {
    title: 'Interval Sprint Protocol',
    duration: '20 min',
    level: 'Advanced',
    tag: 'Cardio',
    tagColor: 'bg-rose-100 text-rose-700',
    icon: '⚡',
    description:
      '8 rounds of 20-sec max effort, 10-sec rest. Releases growth hormone, torches fat, elevates mood for hours.',
    muscles: ['Full Body', 'Heart', 'Metabolism'],
  },
]

const STATS = [
  { value: '150', unit: 'min/wk', label: 'of movement is all you need for longevity', source: 'WHO Guidelines' },
  { value: '30%', unit: '', label: 'injury risk drops with consistent mobility work', source: 'Journal of Sports Med' },
  { value: '2×', unit: '', label: 'better sleep quality from resistance training', source: 'Sleep Medicine Reviews' },
  { value: '12%', unit: '', label: 'muscle gain possible in 8 weeks as a beginner', source: 'ACSM Research' },
]

const NUTRITION_TIPS = [
  {
    icon: '💧',
    title: 'Hydrate First',
    tip: 'Drink 500ml of water within 10 minutes of waking. Rehydrate before you caffeinate.',
    color: 'border-l-cyan-400',
  },
  {
    icon: '🥩',
    title: 'Prioritise Protein',
    tip: 'Aim for 0.8–1g of protein per pound of bodyweight. Spread it across every meal, not just dinner.',
    color: 'border-l-red-400',
  },
  {
    icon: '🌿',
    title: 'Eat the Rainbow',
    tip: 'Five colours of vegetables per day. Each pigment delivers a different class of antioxidants.',
    color: 'border-l-green-400',
  },
  {
    icon: '⏱️',
    title: 'Time Your Carbs',
    tip: 'Eat complex carbs in the 2-hour window around your workout. Let protein and fat anchor the rest of your day.',
    color: 'border-l-amber-400',
  },
]

const WEEKLY_PLAN = [
  { day: 'Mon', focus: 'Strength — Upper', duration: '30 min', intensity: 'High', color: 'bg-red-500' },
  { day: 'Tue', focus: 'Zone 2 Cardio', duration: '30 min', intensity: 'Low', color: 'bg-rose-400' },
  { day: 'Wed', focus: 'Mobility & Stretch', duration: '15 min', intensity: 'Easy', color: 'bg-cyan-400' },
  { day: 'Thu', focus: 'Strength — Lower', duration: '30 min', intensity: 'High', color: 'bg-red-500' },
  { day: 'Fri', focus: 'Core + Intervals', duration: '20 min', intensity: 'Medium', color: 'bg-orange-400' },
  { day: 'Sat', focus: 'Long Walk / Hike', duration: '45 min', intensity: 'Low', color: 'bg-rose-400' },
  { day: 'Sun', focus: 'Active Rest + Foam Roll', duration: '10 min', intensity: 'Recovery', color: 'bg-green-400' },
]

const INTENSITY_BADGE: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-orange-100 text-orange-700',
  Low: 'bg-green-100 text-green-700',
  Easy: 'bg-cyan-100 text-cyan-700',
  Recovery: 'bg-gray-100 text-gray-600',
}

const BODY_FACTS = [
  { stat: '206', label: 'bones in the adult human body' },
  { stat: '600+', label: 'skeletal muscles working every movement' },
  { stat: '11%', label: 'of your body weight is just your skin' },
  { stat: '2.5M', label: 'new red blood cells made every second' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.14em] ${light ? 'text-orange-300' : 'text-orange-600'}`}>
      {children}
    </p>
  )
}

function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-serif text-[clamp(24px,3vw,38px)] font-black tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
      {children}
    </h2>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50 border-b border-border">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-orange-100 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-red-100 opacity-40 blur-2xl" />

      {/* Background body silhouette hint */}
      <div className="pointer-events-none absolute right-12 top-0 bottom-0 hidden lg:flex items-center opacity-[0.04]">
        <span className="text-[240px] leading-none select-none">🏃</span>
      </div>

      <div className="relative max-w-[1100px] mx-auto px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-700">
            Physical Wellness
          </span>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-black leading-[1.05] tracking-tight text-ink">
            Train Your{' '}
            <span className="text-orange-600">Body.</span>
            <br />
            Free Your{' '}
            <span className="text-red-600">Life.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-3 max-w-lg">
            Science-backed movement, recovery, and nutrition protocols built for real people — not elite athletes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-orange-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition-colors"
            >
              Start Moving
            </button>
            <button
              type="button"
              className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-ink-3 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              See Weekly Plan
            </button>
          </div>
        </div>

        {/* Floating muscle-group chips */}
        <div className="absolute right-8 top-16 hidden lg:flex flex-col gap-3">
          {['Mobility 🤸', 'Strength 🏋️', 'Endurance 🫀', 'Recovery 🛌'].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-semibold text-ink-3 shadow-sm"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  return (
    <section className="border-b border-border bg-white">
      <div className="max-w-[1100px] mx-auto px-5 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="text-center">
              <p className="font-serif text-3xl font-black text-orange-600">
                {s.value}
                <span className="text-lg">{s.unit}</span>
              </p>
              <p className="mt-1 text-xs leading-snug text-ink-3">{s.label}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-ink-3/60">{s.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PillarsSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-5 py-14">
      <SectionLabel>Four Pillars</SectionLabel>
      <SectionTitle>The building blocks of a strong body</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        Neglect any one and the others will compensate — and eventually break down. Balance is the game.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div
            key={p.label}
            className={`rounded-2xl border ${p.border} bg-gradient-to-br ${p.color} p-6 hover:shadow-md transition-shadow`}
          >
            <span className="text-3xl">{p.icon}</span>
            <h3 className={`mt-3 font-serif text-lg font-black ${p.accent}`}>{p.label}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-3">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MovementsSection() {
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const filters = ['All', 'Strength', 'Flexibility', 'Cardio']

  const filtered =
    activeFilter === 'All'
      ? MOVEMENTS
      : MOVEMENTS.filter((m) => m.tag === activeFilter)

  return (
    <section className="bg-gradient-to-b from-orange-50/40 to-white border-y border-border py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Movement Library</SectionLabel>
        <SectionTitle>Workouts that actually fit your life</SectionTitle>
        <p className="mt-2 text-sm text-ink-3 max-w-lg">
          Short, effective, and equipment-free. No excuses.
        </p>

        {/* Filter tabs */}
        <div className="mt-7 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                activeFilter === f
                  ? 'bg-orange-600 text-white'
                  : 'border border-border bg-white text-ink-3 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <div
              key={m.title}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:border-orange-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{m.icon}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${m.tagColor}`}>
                  {m.tag}
                </span>
              </div>
              <h3 className="font-serif text-base font-black text-ink">{m.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-3 flex-1">{m.description}</p>

              {/* Muscle tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {m.muscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-ink-3"
                  >
                    {muscle}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-ink-3/60">⏱ {m.duration}</span>
                  <span className="text-[10px] font-bold text-ink-3/60">· {m.level}</span>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-bold text-orange-700 hover:bg-orange-600 hover:text-white transition-colors"
                >
                  Start →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NutritionSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-5 py-14">
      <SectionLabel>Fuel Right</SectionLabel>
      <SectionTitle>Nutrition that powers performance</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        You can't out-train a poor diet. Four principles that change everything.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {NUTRITION_TIPS.map((tip) => (
          <div
            key={tip.title}
            className={`rounded-2xl border-l-4 ${tip.color} border border-border bg-white p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{tip.icon}</span>
              <h3 className="font-serif text-base font-black text-ink">{tip.title}</h3>
            </div>
            <p className="text-xs leading-relaxed text-ink-3">{tip.tip}</p>
          </div>
        ))}
      </div>

      {/* Macro visual */}
      <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-orange-50 to-white p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4">
          Ideal Macro Split (Active Adult)
        </p>
        <div className="flex items-end gap-3 h-28">
          {[
            { label: 'Protein', pct: 30, color: 'bg-red-400' },
            { label: 'Carbs', pct: 45, color: 'bg-orange-400' },
            { label: 'Fats', pct: 25, color: 'bg-amber-300' },
          ].map((macro) => (
            <div key={macro.label} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs font-black text-ink">{macro.pct}%</span>
              <div
                className={`w-full ${macro.color} rounded-t-lg`}
                style={{ height: `${macro.pct * 2.8}px` }}
              />
              <span className="text-[10px] font-semibold text-ink-3">{macro.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-ink-3/60">
          Adjust carbs ±10% based on training volume. Keep protein anchored.
        </p>
      </div>
    </section>
  )
}

function WeeklyPlanSection() {
  return (
    <section className="bg-gradient-to-b from-orange-50/30 to-white border-y border-border py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>7-Day Template</SectionLabel>
        <SectionTitle>A week that builds a body</SectionTitle>
        <p className="mt-2 text-sm text-ink-3 max-w-lg">
          Two rest days baked in. Intensity waves between hard, medium, and easy to prevent burnout.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
          {WEEKLY_PLAN.map((item, i) => (
            <div
              key={item.day}
              className={`flex items-center gap-4 px-6 py-4 ${
                i !== WEEKLY_PLAN.length - 1 ? 'border-b border-border' : ''
              } hover:bg-orange-50/40 transition-colors`}
            >
              {/* Day dot */}
              <div className="flex items-center gap-3 w-28 flex-shrink-0">
                <div className={`h-2.5 w-2.5 rounded-full ${item.color} flex-shrink-0`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-3/60">
                  {item.day}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{item.focus}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${INTENSITY_BADGE[item.intensity]}`}
                >
                  {item.intensity}
                </span>
                <span className="text-[10px] font-bold text-ink-3/60">{item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BodyFactsSection() {
  return (
    <section className="bg-ink py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel light>Incredible Machine</SectionLabel>
        <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-black tracking-tight text-white mb-10">
          Your body is already extraordinary
        </h2>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {BODY_FACTS.map((f) => (
            <div
              key={f.stat}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center hover:bg-white/10 transition-colors"
            >
              <p className="font-serif text-4xl font-black text-orange-400">{f.stat}</p>
              <p className="mt-2 text-xs leading-snug text-white/60">{f.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="font-serif text-xl font-black text-white max-w-2xl mx-auto leading-relaxed">
            "Take care of your body. It's the only place you have to live."
          </p>
          <p className="mt-3 text-xs font-bold text-orange-400">Jim Rohn</p>
          <p className="text-[10px] text-white/40">Author & Motivational Speaker</p>
        </div>
      </div>
    </section>
  )
}

function RecoverySection() {
  const tips = [
    { icon: '😴', title: '7–9 Hours of Sleep', desc: 'The #1 recovery tool available to you. No supplement comes close.' },
    { icon: '🧊', title: 'Cold Exposure', desc: '2–3 min cold shower post-workout reduces inflammation and boosts mood.' },
    { icon: '🫁', title: 'Breathwork', desc: '10 deep diaphragmatic breaths shifts your nervous system into recovery mode.' },
    { icon: '📵', title: 'No Screens 1hr Before Bed', desc: 'Blue light suppresses melatonin. Protect your sleep window fiercely.' },
  ]

  return (
    <section className="max-w-[1100px] mx-auto px-5 py-14">
      <SectionLabel>Recovery Protocol</SectionLabel>
      <SectionTitle>Where gains are actually made</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        You don't grow during training — you grow during recovery. Protect it like it's the workout.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((t) => (
          <div
            key={t.title}
            className="rounded-2xl border border-border bg-white p-6 hover:shadow-md hover:border-orange-200 transition-all text-center"
          >
            <span className="text-3xl">{t.icon}</span>
            <h3 className="mt-3 font-serif text-sm font-black text-ink">{t.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-3">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export function BodyPage(): React.ReactNode {
  return (
    <main id="main-content">
      <HeroSection />
      <StatsBar />
      <PillarsSection />
      <MovementsSection />
      <NutritionSection />
      <WeeklyPlanSection />
      <BodyFactsSection />
      <RecoverySection />    
    </main>
  )
}
