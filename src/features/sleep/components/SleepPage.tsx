import React, { useState } from 'react'

// ─── Static Data ──────────────────────────────────────────────────────────────

const SLEEP_STAGES = [
  {
    stage: 'N1',
    name: 'Light Sleep',
    duration: '5–10 min',
    pct: 5,
    color: 'bg-indigo-300',
    textColor: 'text-indigo-300',
    description: 'The drowsy doorway. Muscle activity slows, eyes flutter. Easily woken.',
  },
  {
    stage: 'N2',
    name: 'Core Sleep',
    duration: '20–30 min',
    pct: 45,
    color: 'bg-violet-400',
    textColor: 'text-violet-400',
    description: 'Heart rate drops, body temperature falls. Sleep spindles protect your memory consolidation.',
  },
  {
    stage: 'N3',
    name: 'Deep Sleep',
    duration: '20–40 min',
    pct: 25,
    color: 'bg-purple-500',
    textColor: 'text-purple-400',
    description: 'Glymphatic system flushes brain toxins. Tissue repair, immune strengthening, growth hormone release.',
  },
  {
    stage: 'REM',
    name: 'REM Sleep',
    duration: '20–25 min',
    pct: 25,
    color: 'bg-fuchsia-400',
    textColor: 'text-fuchsia-400',
    description: 'Emotional processing, creativity, vivid dreaming. Grows with each cycle across the night.',
  },
]

const PILLARS = [
  {
    icon: '🕙',
    label: 'Consistency',
    description: 'Same bedtime and wake time every day — weekends included. Your circadian rhythm is not negotiable.',
    color: 'from-indigo-900/40 to-violet-900/40',
    accent: 'text-violet-300',
    border: 'border-violet-800/50',
  },
  {
    icon: '🌡️',
    label: 'Temperature',
    description: 'Core body temperature must drop 1–3°C to initiate sleep. Cool room (16–19°C) is non-negotiable.',
    color: 'from-blue-900/40 to-cyan-900/40',
    accent: 'text-cyan-300',
    border: 'border-cyan-800/50',
  },
  {
    icon: '🌑',
    label: 'Darkness',
    description: 'Even low light through closed eyelids suppresses melatonin. Blackout curtains are a biohack.',
    color: 'from-slate-800/60 to-gray-900/60',
    accent: 'text-slate-300',
    border: 'border-slate-700/50',
  },
  {
    icon: '🔇',
    label: 'Silence',
    description: 'Sound above 40dB fragments sleep architecture even without waking you. White noise is a valid shield.',
    color: 'from-violet-900/40 to-purple-900/40',
    accent: 'text-purple-300',
    border: 'border-purple-800/50',
  },
]

const STATS = [
  { value: '1 in 3', label: 'adults are chronically sleep deprived', source: 'CDC, 2023' },
  { value: '26%', label: 'higher dementia risk from poor sleep', source: 'Nature Comms, 2021' },
  { value: '90 min', label: 'per full sleep cycle — aim for 5 per night', source: 'Walker, Why We Sleep' },
  { value: '400%', label: 'more likely to catch a cold on 5hrs vs 8hrs', source: 'UCSF Sleep Study' },
]

type WindDownCategory = 'All' | 'Evening' | 'Bedroom' | 'Morning'

const RITUALS: {
  title: string
  category: WindDownCategory
  time: string
  icon: string
  description: string
  benefit: string
}[] = [
  {
    title: 'Dim the Lights at 9pm',
    category: 'Evening',
    time: '2 hrs before bed',
    icon: '🕯️',
    description: 'Switch to warm, low lighting in the evening. Overhead white lights are melatonin suppressors.',
    benefit: 'Melatonin onset',
  },
  {
    title: 'Phone in Another Room',
    category: 'Evening',
    time: '1 hr before bed',
    icon: '📵',
    description: 'The phone is a slot machine. Even face-down, its presence raises cortisol and fragments the mind.',
    benefit: 'Cortisol reduction',
  },
  {
    title: 'Magnesium Glycinate',
    category: 'Evening',
    time: '30–60 min before bed',
    icon: '💊',
    description: '300–400mg of magnesium glycinate activates GABA receptors, relaxing the nervous system for sleep.',
    benefit: 'Deep sleep depth',
  },
  {
    title: 'Cool Your Room',
    category: 'Bedroom',
    time: 'At bedtime',
    icon: '❄️',
    description: 'Set your thermostat between 16–19°C. A cooling mattress pad is worth every penny if you run hot.',
    benefit: 'Sleep onset speed',
  },
  {
    title: 'Blackout Your Room',
    category: 'Bedroom',
    time: 'At bedtime',
    icon: '🌑',
    description: 'If you can see your hand in front of your face, your room is too bright. Blackout curtains or a sleep mask.',
    benefit: 'Melatonin quality',
  },
  {
    title: '4-7-8 Breath',
    category: 'Evening',
    time: 'In bed',
    icon: '🫁',
    description: 'Inhale 4 counts, hold 7, exhale 8. Activates the parasympathetic system and halves sleep onset time.',
    benefit: 'Anxiety release',
  },
  {
    title: 'Morning Sunlight',
    category: 'Morning',
    time: 'Within 30 min of waking',
    icon: '🌤️',
    description: '10 minutes of outdoor light sets your circadian clock and makes falling asleep 14 hours later dramatically easier.',
    benefit: 'Circadian anchoring',
  },
  {
    title: 'Delay Coffee 90 Minutes',
    category: 'Morning',
    time: '90 min after waking',
    icon: '☕',
    description: 'Adenosine (sleep pressure) clears naturally first. Early caffeine masks it and causes an afternoon crash.',
    benefit: 'Energy stability',
  },
]

const SLEEP_THIEVES = [
  { thief: 'Alcohol', impact: 'Destroys REM sleep in the second half of the night. Feels sedating — it is not sleep.', icon: '🍷', severity: 'High' },
  { thief: 'Blue Light', impact: 'Tells your brain it is noon. Delays melatonin release by 2–3 hours.', icon: '📱', severity: 'High' },
  { thief: 'Caffeine after 2pm', impact: 'Half-life of 5–7 hours. A 3pm coffee is still a quarter-dose at midnight.', icon: '☕', severity: 'High' },
  { thief: 'Late Exercise', impact: 'Raises core temperature and cortisol. Finish vigorous workouts 3+ hours before bed.', icon: '🏃', severity: 'Medium' },
  { thief: 'Irregular Schedule', impact: 'Social jetlag — weekend lie-ins shift your clock and make Monday brutal.', icon: '📅', severity: 'High' },
  { thief: 'Heavy Late Meals', impact: 'Digestion is metabolically active and keeps core temperature elevated.', icon: '🍕', severity: 'Medium' },
]

const SEVERITY_STYLE: Record<string, string> = {
  High: 'bg-red-900/40 text-red-400 border border-red-800/40',
  Medium: 'bg-amber-900/40 text-amber-400 border border-amber-800/40',
}

const SLEEP_CYCLES = [
  { hour: '10pm', label: 'Asleep', stage: 'N1/N2', brightness: 20 },
  { hour: '11pm', label: 'Cycle 1 Deep', stage: 'N3', brightness: 8 },
  { hour: '12am', label: 'Cycle 1 REM', stage: 'REM', brightness: 15 },
  { hour: '1am', label: 'Cycle 2 Deep', stage: 'N3', brightness: 6 },
  { hour: '2am', label: 'Cycle 2 REM', stage: 'REM', brightness: 18 },
  { hour: '3am', label: 'Cycle 3 Deep', stage: 'N3', brightness: 5 },
  { hour: '4am', label: 'Cycle 3 REM', stage: 'REM', brightness: 25 },
  { hour: '5am', label: 'Cycle 4 REM', stage: 'REM', brightness: 35 },
  { hour: '6am', label: 'Wake', stage: 'N1', brightness: 70 },
]

const QUOTES = [
  {
    quote: 'Sleep is the single most effective thing we can do to reset our brain and body health each day.',
    author: 'Matthew Walker',
    role: 'Professor of Neuroscience, UC Berkeley',
  },
  {
    quote: 'The shorter your sleep, the shorter your life.',
    author: 'Matthew Walker',
    role: 'Why We Sleep, 2017',
  },
  {
    quote: 'Each night, when I go to sleep, I die. And the next morning, when I wake up, I am reborn.',
    author: 'Mahatma Gandhi',
    role: 'Philosopher & Leader',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-400">
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-black tracking-tight text-white">
      {children}
    </h2>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0e1a] border-b border-white/10">
      {/* Star field effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Moon glow blob */}
      <div className="pointer-events-none absolute -top-32 right-12 h-80 w-80 rounded-full bg-indigo-500 opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute top-8 right-24 hidden lg:block">
        <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 shadow-[0_0_60px_20px_rgba(253,224,71,0.15)]" />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 rounded-full bg-indigo-900/60 border border-indigo-700/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300">
            Sleep Science
          </span>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-black leading-[1.05] tracking-tight text-white">
            Sleep Deeper.
            <br />
            <span className="text-indigo-400">Live Longer.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/60 max-w-lg">
            Sleep is not downtime — it is the most powerful performance-enhancing, disease-preventing, mood-stabilising activity known to science. And it is free.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              Build Your Routine
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 hover:border-indigo-400/50 hover:text-indigo-300 transition-colors"
            >
              Sleep Stage Guide
            </button>
          </div>
        </div>

        {/* Floating sleep chips */}
        <div className="absolute right-8 top-14 hidden lg:flex flex-col gap-3">
          {['Deep Sleep 💤', 'REM Cycles 🌀', 'Recovery 🔋', 'Circadian ⏰'].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-white/5 backdrop-blur px-4 py-1.5 text-xs font-semibold text-white/60 shadow-sm"
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
    <section className="border-b border-white/10 bg-[#0d1120]">
      <div className="max-w-[1100px] mx-auto px-5 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="text-center">
              <p className="font-serif text-3xl font-black text-indigo-400">{s.value}</p>
              <p className="mt-1 text-xs leading-snug text-white/50">{s.label}</p>
              <p className="mt-0.5 text-[10px] font-semibold text-white/30">{s.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StagesSection() {
  const [activeStage, setActiveStage] = useState(0)
  const stage = SLEEP_STAGES[activeStage]

  return (
    <section className="bg-[#0d1120] border-b border-white/10 py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Sleep Architecture</SectionLabel>
        <SectionTitle>What happens when you close your eyes</SectionTitle>
        <p className="mt-2 text-sm text-white/50 max-w-lg">
          You cycle through four stages every 90 minutes. Each one has a job. Cutting sleep short steals from the most critical ones.
        </p>

        {/* Stage selector */}
        <div className="mt-10 flex flex-wrap gap-3">
          {SLEEP_STAGES.map((s, i) => (
            <button
              key={s.stage}
              type="button"
              onClick={() => setActiveStage(i)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeStage === i
                  ? 'bg-indigo-600 text-white scale-105'
                  : 'border border-white/10 bg-white/5 text-white/50 hover:border-indigo-500/50 hover:text-indigo-300'
              }`}
            >
              {s.stage} — {s.name}
            </button>
          ))}
        </div>

        {/* Active stage detail */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${stage.textColor}`}>
              {stage.stage} · {stage.name}
            </p>
            <p className="font-serif text-2xl font-black text-white mb-3">{stage.duration}</p>
            <p className="text-sm leading-relaxed text-white/60">{stage.description}</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${stage.pct} ${100 - stage.pct}`}
                  className={stage.textColor}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-serif text-2xl font-black ${stage.textColor}`}>{stage.pct}%</span>
                <span className="text-[9px] text-white/40">of night</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proportion bars */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
            Typical 8-hour night composition
          </p>
          <div className="flex h-6 w-full overflow-hidden rounded-full gap-1">
            {SLEEP_STAGES.map((s) => (
              <div
                key={s.stage}
                className={`${s.color} rounded-full transition-all`}
                style={{ width: `${s.pct}%` }}
                title={`${s.name}: ${s.pct}%`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {SLEEP_STAGES.map((s) => (
              <div key={s.stage} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="text-[10px] text-white/50">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PillarsSection() {
  return (
    <section className="bg-[#0a0e1a] border-b border-white/10 py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>The Four Conditions</SectionLabel>
        <SectionTitle>Your room is your sleep laboratory</SectionTitle>
        <p className="mt-2 text-sm text-white/50 max-w-lg">
          Get these four environmental factors right and your sleep quality can improve in a single night.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div
              key={p.label}
              className={`rounded-2xl border ${p.border} bg-gradient-to-br ${p.color} p-6 hover:scale-[1.02] transition-transform`}
            >
              <span className="text-3xl">{p.icon}</span>
              <h3 className={`mt-3 font-serif text-lg font-black ${p.accent}`}>{p.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/50">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RitualsSection() {
  const [activeFilter, setActiveFilter] = useState<WindDownCategory>('All')
  const filters: WindDownCategory[] = ['All', 'Evening', 'Bedroom', 'Morning']

  type WindDownCategory = 'All' | 'Evening' | 'Bedroom' | 'Morning'

  const filtered = activeFilter === 'All' ? RITUALS : RITUALS.filter((r) => r.category === activeFilter)

  return (
    <section className="bg-[#0d1120] border-b border-white/10 py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Wind-Down Rituals</SectionLabel>
        <SectionTitle>The habits that make deep sleep inevitable</SectionTitle>
        <p className="mt-2 text-sm text-white/50 max-w-lg">
          Sleep hygiene isn't about being precious. It's about removing every obstacle between you and deep rest.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white'
                  : 'border border-white/10 bg-white/5 text-white/50 hover:border-indigo-500/40 hover:text-indigo-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((r) => (
            <div
              key={r.title}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{r.icon}</span>
                <span className="rounded-full bg-indigo-900/60 border border-indigo-700/40 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                  {r.category}
                </span>
              </div>
              <h3 className="font-serif text-sm font-black text-white">{r.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/50 flex-1">{r.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/30">⏱ {r.time}</span>
                <span className="rounded-full bg-violet-900/50 border border-violet-700/40 px-2 py-0.5 text-[9px] font-bold text-violet-300">
                  ↑ {r.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SleepThievesSection() {
  return (
    <section className="bg-[#0a0e1a] border-b border-white/10 py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Sleep Disruptors</SectionLabel>
        <SectionTitle>The silent thieves robbing your rest</SectionTitle>
        <p className="mt-2 text-sm text-white/50 max-w-lg">
          Most people optimise for sleep quantity and ignore quality. These are what destroy it.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SLEEP_THIEVES.map((t) => (
            <div
              key={t.thief}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-red-800/50 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.icon}</span>
                  <h3 className="font-serif text-sm font-black text-white">{t.thief}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${SEVERITY_STYLE[t.severity]}`}>
                  {t.severity}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/50">{t.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CycleVisualSection() {
  return (
    <section className="bg-[#0d1120] border-b border-white/10 py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Sleep Timeline</SectionLabel>
        <SectionTitle>An ideal 8-hour night, visualised</SectionTitle>
        <p className="mt-2 text-sm text-white/50 max-w-lg mb-10">
          Deep sleep dominates early in the night. REM expands as morning approaches — don't cut it short.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 overflow-x-auto">
          <div className="flex items-end gap-1.5 min-w-[500px] h-36">
            {SLEEP_CYCLES.map((cycle, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max(100 - cycle.brightness * 1.1, 10)}%`,
                    background:
                      cycle.stage === 'REM'
                        ? 'linear-gradient(to top, #c026d3, #818cf8)'
                        : cycle.stage === 'N3'
                        ? 'linear-gradient(to top, #4f46e5, #312e81)'
                        : 'linear-gradient(to top, #6366f1, #818cf8)',
                    opacity: 0.7 + i * 0.03,
                  }}
                />
                <span className="text-[9px] text-white/40 text-center leading-tight">{cycle.hour}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {[
              { label: 'Deep Sleep (N3)', color: 'bg-indigo-600' },
              { label: 'REM', color: 'bg-fuchsia-500' },
              { label: 'Light Sleep', color: 'bg-indigo-400' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                <span className="text-[10px] text-white/40">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function QuotesSection() {
  return (
    <section className="bg-[#0a0e1a] border-b border-white/10 py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>From the Experts</SectionLabel>
        <SectionTitle>Words that changed how the world sleeps</SectionTitle>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {QUOTES.map((q) => (
            <div
              key={q.author + q.quote.slice(0, 10)}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-white/[0.07] transition-colors"
            >
              <p className="font-serif text-3xl text-indigo-400/30 leading-none mb-3">"</p>
              <p className="text-sm leading-relaxed text-white/70 italic">{q.quote}</p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-bold text-indigo-400">{q.author}</p>
                <p className="text-[10px] text-white/30">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export function SleepPage(): React.ReactNode {
  return (
    <main id="main-content">
      <HeroSection />
      <StatsBar />
      <StagesSection />
      <PillarsSection />
      <RitualsSection />
      <SleepThievesSection />
      <CycleVisualSection />
      <QuotesSection />
    </main>
  )
}
