import React from 'react'

// ─── Static Data ──────────────────────────────────────────────────────────────

const HERO = {
  eyebrow: 'Mental Wellness',
  title: 'Nourish Your Mind',
  subtitle:
    'Evidence-based tools, guided practices, and expert insights to help you think clearly, feel deeply, and live with intention.',
}

const PILLARS = [
  {
    icon: '🧘',
    label: 'Mindfulness',
    description: 'Anchor yourself in the present moment through breath and body awareness.',
    color: 'from-green-50 to-emerald-100',
    accent: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  {
    icon: '😴',
    label: 'Sleep',
    description: 'Deep, restorative sleep is the cornerstone of every healthy mind.',
    color: 'from-indigo-50 to-violet-100',
    accent: 'text-violet-700',
    border: 'border-violet-200',
  },
  {
    icon: '💭',
    label: 'Cognitive Health',
    description: 'Sharpen focus, enhance memory, and build lasting mental resilience.',
    color: 'from-amber-50 to-yellow-100',
    accent: 'text-amber-700',
    border: 'border-amber-200',
  },
  {
    icon: '❤️',
    label: 'Emotional Balance',
    description: 'Understand your inner world and cultivate meaningful connections.',
    color: 'from-rose-50 to-pink-100',
    accent: 'text-rose-700',
    border: 'border-rose-200',
  },
]

const PRACTICES = [
  {
    duration: '5 min',
    title: 'Morning Breath Reset',
    description:
      'Start your day with box breathing — four counts in, hold, out, hold — to calm the nervous system before the world rushes in.',
    tag: 'Breathwork',
    tagColor: 'bg-green-100 text-green-700',
    icon: '🌅',
  },
  {
    duration: '10 min',
    title: 'Body Scan Meditation',
    description:
      'A slow, deliberate sweep from crown to sole. Notice sensation without judgment. Return to breath whenever the mind wanders.',
    tag: 'Meditation',
    tagColor: 'bg-violet-100 text-violet-700',
    icon: '🌊',
  },
  {
    duration: '3 min',
    title: 'Gratitude Journaling',
    description:
      'Three specific things. Not "my family" — but the exact moment your child laughed at breakfast. Specificity rewires the brain.',
    tag: 'Journaling',
    tagColor: 'bg-amber-100 text-amber-700',
    icon: '✍️',
  },
  {
    duration: '15 min',
    title: 'Evening Wind-Down Walk',
    description:'No headphones. No destination. Just the quiet rhythm of your steps and the gradual release of the day',
    tag: 'Movement',
    tagColor: 'bg-rose-100 text-rose-700',
    icon: '🌙',
  },
  {
    duration: '2 min',
    title: '5-4-3-2-1 Grounding',
    description:
      'Five things you see, four you can touch, three you hear, two you smell, one you taste. Instant anxiety anchor.',
    tag: 'Grounding',
    tagColor: 'bg-teal-100 text-teal-700',
    icon: '⚓',
  },
  {
    duration: '8 min',
    title: 'Loving-Kindness Practice',
    description:
      'Silently offer warmth — first to yourself, then outward to loved ones, strangers, and finally those who challenge you.',
    tag: 'Meditation',
    tagColor: 'bg-violet-100 text-violet-700',
    icon: '🕊️',
  },
]

const STATS = [
  { value: '47%', label: 'of adults report high daily stress', source: 'APA, 2024' },
  { value: '8 wks', label: 'of mindfulness practice to reshape the brain', source: 'Harvard Medical' },
  { value: '23%', label: 'productivity gain from a consistent sleep schedule', source: 'Sleep Foundation' },
  { value: '40%', label: 'of anxiety is reducible through daily breathwork', source: 'NIH Review' },
]

const INSIGHTS = [
  {
    quote: 'You can\'t stop the waves, but you can learn to surf.',
    author: 'Jon Kabat-Zinn',
    role: 'Founder of MBSR',
  },
  {
    quote: 'The mind is everything. What you think, you become.',
    author: 'Attributed to the Buddha',
    role: 'Ancient Wisdom',
  },
  {
    quote: 'Between stimulus and response there is a space. In that space is our power to choose.',
    author: 'Viktor Frankl',
    role: 'Psychiatrist & Author',
  },
]

const WEEKLY_PLAN = [
  { day: 'Mon', practice: 'Morning Breathwork', duration: '5 min', done: false },
  { day: 'Tue', practice: 'Body Scan', duration: '10 min', done: false },
  { day: 'Wed', practice: 'Gratitude Journal', duration: '3 min', done: false },
  { day: 'Thu', practice: 'Evening Walk', duration: '15 min', done: false },
  { day: 'Fri', practice: '5-4-3-2-1 Grounding', duration: '2 min', done: false },
  { day: 'Sat', practice: 'Loving-Kindness', duration: '8 min', done: false },
  { day: 'Sun', practice: 'Free Rest', duration: 'Open', done: false },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-green-600">
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-black tracking-tight text-ink">
      {children}
    </h2>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 border-b border-border">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-green-100 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-200 opacity-30 blur-2xl" />

      <div className="relative max-w-[1100px] mx-auto px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-green-700">
            {HERO.eyebrow}
          </span>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-black leading-[1.05] tracking-tight text-ink">
            {HERO.title.split(' ')[0]}{' '}
            <span className="text-green-600">{HERO.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-3 max-w-lg">{HERO.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors"
            >
              Start a Practice
            </button>
            <button
              type="button"
              className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-ink-3 hover:border-green-300 hover:text-green-600 transition-colors"
            >
              Explore Articles
            </button>
          </div>
        </div>

        {/* Floating mood chips */}
        <div className="absolute right-8 top-16 hidden lg:flex flex-col gap-3">
          {['Calm 😌', 'Focused 🎯', 'Rested 💤', 'Grateful 🙏'].map((mood) => (
            <span
              key={mood}
              className="rounded-full border border-border bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-semibold text-ink-3 shadow-sm"
            >
              {mood}
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
              <p className="font-serif text-3xl font-black text-green-600">{s.value}</p>
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
      <SectionTitle>The foundations of mental wellness</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        Each pillar reinforces the others. Tend to all four and you build an unshakeable inner foundation.
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

function PracticesSection() {
  return (
    <section className="bg-gradient-to-b from-green-50/40 to-white border-y border-border py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Daily Practices</SectionLabel>
        <SectionTitle>Simple rituals, profound results</SectionTitle>
        <p className="mt-2 text-sm text-ink-3 max-w-lg">
          Consistency beats intensity. Pick one practice, do it daily for 21 days.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICES.map((pr) => (
            <div
              key={pr.title}
              className="group flex flex-col rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:border-green-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{pr.icon}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${pr.tagColor}`}>
                  {pr.tag}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="font-serif text-base font-black text-ink">{pr.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-ink-3 flex-1">{pr.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-ink-3/60 uppercase tracking-widest">
                  ⏱ {pr.duration}
                </span>
                <button
                  type="button"
                  className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700 hover:bg-green-600 hover:text-white transition-colors"
                >
                  Try It →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WeeklyPlanSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-5 py-14">
      <SectionLabel>7-Day Plan</SectionLabel>
      <SectionTitle>Your week, intentionally designed</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        A gentle starter plan. Each session fits inside a coffee break.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
        {WEEKLY_PLAN.map((item, i) => (
          <div
            key={item.day}
            className={`flex items-center gap-4 px-6 py-4 ${
              i !== WEEKLY_PLAN.length - 1 ? 'border-b border-border' : ''
            } hover:bg-green-50/40 transition-colors`}
          >
            <div className="w-10 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-3/60">
                {item.day}
              </span>
            </div>
            <div
              className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                item.done
                  ? 'bg-green-500 border-green-500'
                  : 'border-green-300'
              }`}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{item.practice}</p>
            </div>
            <span className="text-[10px] font-bold text-ink-3/60">{item.duration}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function InsightsSection() {
  return (
    <section className="bg-ink py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>
          <span className="text-green-400">Words to carry</span>
        </SectionLabel>
        <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-black tracking-tight text-white mb-10">
          Wisdom from those who walked this path
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {INSIGHTS.map((ins) => (
            <div
              key={ins.author}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur hover:bg-white/10 transition-colors"
            >
              <p className="text-2xl text-white/20 font-serif leading-none mb-3">"</p>
              <p className="text-sm leading-relaxed text-white/80 italic">{ins.quote}</p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-bold text-green-400">{ins.author}</p>
                <p className="text-[10px] text-white/40">{ins.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export function MindPage(): React.ReactNode {
  return (
    <main id="main-content">
      <HeroSection />
      <StatsBar />
      <PillarsSection />
      <PracticesSection />
      <WeeklyPlanSection />
      <InsightsSection />
    </main>
  )
}
