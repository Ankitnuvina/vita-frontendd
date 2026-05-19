import React, { useState } from 'react'

// ─── Static Data ──────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: '🥦',
    label: 'Whole Foods',
    description: 'Prioritise foods with one ingredient. The closer to the source, the richer the nutrient profile.',
    color: 'from-lime-50 to-green-100',
    accent: 'text-green-700',
    border: 'border-green-200',
  },
  {
    icon: '🩸',
    label: 'Blood Sugar',
    description: 'Stable glucose is the foundation of energy, mood, and metabolic health. Spike and crash is a cycle to break.',
    color: 'from-rose-50 to-red-100',
    accent: 'text-red-700',
    border: 'border-red-200',
  },
  {
    icon: '🦠',
    label: 'Gut Health',
    description: 'Your second brain. Fibre, fermented foods, and diversity feed the microbiome that regulates everything.',
    color: 'from-amber-50 to-yellow-100',
    accent: 'text-amber-700',
    border: 'border-amber-200',
  },
  {
    icon: '💧',
    label: 'Hydration',
    description: 'Most fatigue, headaches, and brain fog are dehydration in disguise. Drink before.',
    color: 'from-sky-50 to-blue-100',
    accent: 'text-blue-700',
    border: 'border-blue-200',
  },
]

type MealCategory = 'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'

const MEALS: {
  title: string
  category: MealCategory
  prepTime: string
  calories: number
  tags: string[]
  icon: string
  description: string
  macros: { p: number; c: number; f: number }
}[] = [
  {
    title: 'Golden Turmeric Oats',
    category: 'Breakfast',
    prepTime: '5 min',
    calories: 340,
    tags: ['Anti-inflammatory', 'High Fibre'],
    icon: '🌾',
    description: 'Rolled oats with turmeric, black pepper, banana, and a drizzle of raw honey. Gut-loving and deeply warming.',
    macros: { p: 12, c: 58, f: 8 },
  },
  {
    title: 'Smoked Salmon Avocado Bowl',
    category: 'Lunch',
    prepTime: '10 min',
    calories: 480,
    tags: ['Omega-3 Rich', 'Low Glycaemic'],
    icon: '🥑',
    description: 'Wild smoked salmon over brown rice with avocado, cucumber ribbons, sesame, and a miso-lime drizzle.',
    macros: { p: 32, c: 35, f: 22 },
  },
  {
    title: 'Lentil & Sweet Potato Curry',
    category: 'Dinner',
    prepTime: '30 min',
    calories: 520,
    tags: ['Plant Protein', 'High Fibre'],
    icon: '🍛',
    description: 'Red lentils simmered in coconut milk with sweet potato, spinach, and warming spices. Prebiotic powerhouse.',
    macros: { p: 22, c: 72, f: 14 },
  },
  {
    title: 'Greek Yogurt Bark',
    category: 'Snack',
    prepTime: '5 min + freeze',
    calories: 180,
    tags: ['Probiotic', 'High Protein'],
    icon: '🫐',
    description: 'Full-fat Greek yogurt spread thin, topped with mixed berries, granola, and dark chocolate chips. Freeze, snap, eat.',
    macros: { p: 14, c: 22, f: 6 },
  },
  {
    title: 'Overnight Chia Pudding',
    category: 'Breakfast',
    prepTime: '5 min + overnight',
    calories: 310,
    tags: ['Omega-3', 'Gut Health'],
    icon: '🌱',
    description: 'Chia seeds soaked in oat milk overnight, layered with mango, kiwi, and toasted coconut. Zero morning effort.',
    macros: { p: 10, c: 40, f: 14 },
  },
  {
    title: 'Grilled Chicken Grain Bowl',
    category: 'Lunch',
    prepTime: '20 min',
    calories: 560,
    tags: ['High Protein', 'Balanced'],
    icon: '🫙',
    description: 'Herb-grilled chicken thigh over farro, roasted peppers, chickpeas, and tahini-lemon sauce.',
    macros: { p: 44, c: 52, f: 16 },
  },
  {
    title: 'Baked Salmon & Greens',
    category: 'Dinner',
    prepTime: '25 min',
    calories: 490,
    tags: ['Omega-3', 'Low Carb'],
    icon: '🐟',
    description: 'Miso-glazed salmon fillet with steamed broccoli, edamame, and a sesame-ginger drizzle.',
    macros: { p: 38, c: 20, f: 26 },
  },
  {
    title: 'Almond Butter Apple Slices',
    category: 'Snack',
    prepTime: '2 min',
    calories: 210,
    tags: ['Fibre', 'Healthy Fats'],
    icon: '🍎',
    description: 'Crisp apple slices with natural almond butter and a pinch of cinnamon and sea salt. Simplicity wins.',
    macros: { p: 6, c: 28, f: 12 },
  },
]

const STATS = [
  { value: '95%', label: 'of diets fail within a year', source: 'NEJM, 2022' },
  { value: '39T', label: 'microbes in your gut shaping health', source: 'Cell Research' },
  { value: '30+', label: 'plant foods per week for optimal gut diversity', source: 'American Gut Project' },
  { value: '60%', label: 'of chronic disease is preventable through diet', source: 'WHO, 2023' },
]

const NUTRIENTS = [
  { name: 'Vitamin D', role: 'Immune defence, bone strength, mood regulation', source: 'Fatty fish, egg yolks, sunlight', alert: 'Over 40% of adults are deficient', icon: '☀️' },
  { name: 'Magnesium', role: 'Sleep quality, muscle recovery, stress response', source: 'Dark chocolate, nuts, leafy greens', alert: 'Depleted by stress and processed food', icon: '🍫' },
  { name: 'Omega-3', role: 'Brain health, inflammation control, heart function', source: 'Salmon, sardines, walnuts, flaxseed', alert: 'Most people consume 10× too much Omega-6', icon: '🐟' },
  { name: 'Zinc', role: 'Wound healing, testosterone, immune function', source: 'Oysters, beef, pumpkin seeds, lentils', alert: 'Vegetarians are at highest risk of deficiency', icon: '🦪' },
  { name: 'Fibre', role: 'Gut microbiome, blood sugar, satiety', source: 'Legumes, oats, vegetables, fruit', alert: 'Average adult gets half the recommended amount', icon: '🥕' },
  { name: 'B12', role: 'Nerve function, red blood cells, energy', source: 'Meat, dairy, eggs, fortified foods', alert: 'Essential supplement for plant-based diets', icon: '🥚' },
]

const EATING_PRINCIPLES = [
  {
    number: '01',
    title: 'Eat Protein First',
    description: 'Starting every meal with protein slows glucose absorption, keeps you full longer, and preserves lean muscle mass.',
    color: 'border-l-amber-500',
  },
  {
    number: '02',
    title: 'Colour Your Plate',
    description: 'Each colour in vegetables represents a different phytonutrient class. Five colours = five layers of protection.',
    color: 'border-l-green-500',
  },
  {
    number: '03',
    title: 'Stop at 80%',
    description: 'Hara hachi bu — the Okinawan principle of eating until 80% full. It takes 20 minutes for satiety signals to arrive.',
    color: 'border-l-sky-500',
  },
  {
    number: '04',
    title: 'Ferment Something Daily',
    description: 'Kefir, kimchi, kombucha, or yogurt — one fermented food per day seeds your gut with beneficial bacteria.',
    color: 'border-l-rose-500',
  },
  {
    number: '05',
    title: 'Time Your Eating Window',
    description: 'A 12-hour eating window (e.g. 8am–8pm) gives your gut time to rest, repair, and recalibrate overnight.',
    color: 'border-l-violet-500',
  },
  {
    number: '06',
    title: 'Drink Before Every Meal',
    description: 'One glass of water 15 minutes before eating reduces caloric intake by up to 13% and improves digestion.',
    color: 'border-l-cyan-500',
  },
]

const MEAL_PLAN_DAYS = [
  {
    day: 'Monday',
    breakfast: 'Golden Turmeric Oats',
    lunch: 'Smoked Salmon Avocado Bowl',
    dinner: 'Lentil & Sweet Potato Curry',
    snack: 'Greek Yogurt Bark',
  },
  {
    day: 'Tuesday',
    breakfast: 'Overnight Chia Pudding',
    lunch: 'Grilled Chicken Grain Bowl',
    dinner: 'Baked Salmon & Greens',
    snack: 'Almond Butter Apple Slices',
  },
  {
    day: 'Wednesday',
    breakfast: 'Eggs & Avocado Toast',
    lunch: 'Lentil Soup + Sourdough',
    dinner: 'Turkey Stir-Fry with Brown Rice',
    snack: 'Handful of Mixed Nuts',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.14em] ${light ? 'text-amber-300' : 'text-amber-600'}`}>
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

function MacroBar({ p, c, f }: { p: number; c: number; f: number }) {
  const total = p + c + f
  return (
    <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full gap-0.5">
      <div className="bg-red-400 rounded-full" style={{ width: `${(p / total) * 100}%` }} title={`Protein ${p}g`} />
      <div className="bg-amber-400 rounded-full" style={{ width: `${(c / total) * 100}%` }} title={`Carbs ${c}g`} />
      <div className="bg-sky-400 rounded-full" style={{ width: `${(f / total) * 100}%` }} title={`Fat ${f}g`} />
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-lime-50 border-b border-border">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-96 w-96 rounded-full bg-amber-100 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-64 w-64 rounded-full bg-lime-100 opacity-40 blur-2xl" />

      {/* Background food emoji watermark */}
      <div className="pointer-events-none absolute right-8 top-0 bottom-0 hidden lg:flex items-center opacity-[0.05]">
        <span className="text-[220px] leading-none select-none">🥗</span>
      </div>

      <div className="relative max-w-[1100px] mx-auto px-5 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
            Nutrition Science
          </span>
          <h1 className="font-serif text-[clamp(36px,6vw,72px)] font-black leading-[1.05] tracking-tight text-ink">
            Eat with{' '}
            <span className="text-amber-600">Purpose.</span>
            <br />
            Live with{' '}
            <span className="text-lime-700">Vitality.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-3 max-w-lg">
            Food is information, not just fuel. Every bite sends signals to your genes, gut, and brain. Learn to eat for the life you want.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-amber-700 transition-colors"
            >
              Explore Meal Plans
            </button>
            <button
              type="button"
              className="rounded-full border border-border bg-white px-6 py-2.5 text-sm font-semibold text-ink-3 hover:border-amber-300 hover:text-amber-600 transition-colors"
            >
              Key Nutrients Guide
            </button>
          </div>
        </div>

        {/* Floating food chips */}
        <div className="absolute right-8 top-14 hidden lg:flex flex-col gap-3">
          {['Whole Foods 🥦', 'Gut Health 🦠', 'Blood Sugar 🩸', 'Anti-Inflame 🌿'].map((chip) => (
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
              <p className="font-serif text-3xl font-black text-amber-600">{s.value}</p>
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
      <SectionTitle>The cornerstones of nutritional health</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        Master these four and every other dietary detail falls into place naturally.
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

function MealsSection() {
  const [activeFilter, setActiveFilter] = useState<MealCategory>('All')
  const filters: MealCategory[] = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']

  const filtered = activeFilter === 'All' ? MEALS : MEALS.filter((m) => m.category === activeFilter)

  return (
    <section className="bg-gradient-to-b from-amber-50/50 to-white border-y border-border py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Recipe Library</SectionLabel>
        <SectionTitle>Meals that taste good and do good</SectionTitle>
        <p className="mt-2 text-sm text-ink-3 max-w-lg">
          Every recipe is balanced, quick, and built around real whole ingredients.
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
                  ? 'bg-amber-600 text-white'
                  : 'border border-border bg-white text-ink-3 hover:border-amber-300 hover:text-amber-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((meal) => (
            <div
              key={meal.title}
              className="group flex flex-col rounded-2xl border border-border bg-white p-5 hover:shadow-lg hover:border-amber-200 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{meal.icon}</span>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  {meal.category}
                </span>
              </div>

              <h3 className="font-serif text-sm font-black text-ink">{meal.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-3 flex-1">{meal.description}</p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {meal.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-lime-50 px-2 py-0.5 text-[9px] font-semibold text-lime-700">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Macro bar */}
              <MacroBar p={meal.macros.p} c={meal.macros.c} f={meal.macros.f} />
              <div className="mt-1.5 flex gap-3 text-[9px] font-bold text-ink-3/60">
                <span className="text-red-500">P {meal.macros.p}g</span>
                <span className="text-amber-500">C {meal.macros.c}g</span>
                <span className="text-sky-500">F {meal.macros.f}g</span>
                <span className="ml-auto">{meal.calories} kcal</span>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-ink-3/60">⏱ {meal.prepTime}</span>
                <button
                  type="button"
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700 hover:bg-amber-600 hover:text-white transition-colors"
                >
                  View Recipe →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section className="max-w-[1100px] mx-auto px-5 py-14">
      <SectionLabel>Eating Principles</SectionLabel>
      <SectionTitle>Six rules that outlast every diet</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        No macros, no calorie counting. Just six shifts that rewire your relationship with food.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EATING_PRINCIPLES.map((p) => (
          <div
            key={p.number}
            className={`rounded-2xl border-l-4 ${p.color} border border-border bg-white p-6 hover:shadow-md transition-shadow`}
          >
            <p className="font-serif text-3xl font-black text-ink-3/20 leading-none mb-3">{p.number}</p>
            <h3 className="font-serif text-base font-black text-ink">{p.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-3">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function NutrientsSection() {
  return (
    <section className="bg-gradient-to-b from-lime-50/40 to-white border-y border-border py-14">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel>Key Nutrients</SectionLabel>
        <SectionTitle>The six most commonly missed</SectionTitle>
        <p className="mt-2 text-sm text-ink-3 max-w-lg">
          You might be eating plenty — but are you eating these?
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NUTRIENTS.map((n) => (
            <div
              key={n.name}
              className="rounded-2xl border border-border bg-white p-6 hover:shadow-md hover:border-amber-200 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{n.icon}</span>
                <h3 className="font-serif text-base font-black text-ink">{n.name}</h3>
              </div>
              <p className="text-xs leading-relaxed text-ink-3 mb-3">{n.role}</p>
              <div className="rounded-lg bg-lime-50 border border-lime-100 px-3 py-2 mb-3">
                <p className="text-[10px] font-bold text-lime-700 uppercase tracking-wide mb-0.5">Best Sources</p>
                <p className="text-xs text-ink-3">{n.source}</p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-0.5">⚠ Watch Out</p>
                <p className="text-xs text-ink-3">{n.alert}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MealPlanSection() {
  const [activeDay, setActiveDay] = useState(0)
  const day = MEAL_PLAN_DAYS[activeDay]

  return (
    <section className="max-w-[1100px] mx-auto px-5 py-14">
      <SectionLabel>Sample Meal Plan</SectionLabel>
      <SectionTitle>Three days to get you started</SectionTitle>
      <p className="mt-2 text-sm text-ink-3 max-w-lg">
        Mix and match meals across days. The goal is variety — hit 30 different plants by Sunday.
      </p>

      {/* Day tabs */}
      <div className="mt-8 flex gap-2">
        {MEAL_PLAN_DAYS.map((d, i) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setActiveDay(i)}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-colors ${
              activeDay === i
                ? 'bg-amber-600 text-white'
                : 'border border-border bg-white text-ink-3 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Meal grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(
          [
            { label: 'Breakfast', emoji: '🌅', value: day.breakfast },
            { label: 'Lunch', emoji: '☀️', value: day.lunch },
            { label: 'Dinner', emoji: '🌙', value: day.dinner },
            { label: 'Snack', emoji: '🍎', value: day.snack },
          ] as const
        ).map((slot) => (
          <div
            key={slot.label}
            className="rounded-2xl border border-border bg-white p-5 hover:border-amber-200 hover:shadow-sm transition-all"
          >
            <p className="text-lg mb-2">{slot.emoji}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">{slot.label}</p>
            <p className="text-sm font-semibold text-ink leading-snug">{slot.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MacroGuideSection() {
  return (
    <section className="bg-ink py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <SectionLabel light>Macro Guide</SectionLabel>
        <h2 className="font-serif text-[clamp(24px,3vw,38px)] font-black tracking-tight text-white mb-3">
          What your macros actually do
        </h2>
        <p className="text-sm text-white/60 max-w-lg mb-10">
          Understanding macronutrients helps you eat strategically — not obsessively.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              macro: 'Protein',
              emoji: '🥩',
              kcal: '4 kcal/g',
              goal: '0.8–1g per lb of bodyweight',
              role: 'Builds and repairs every tissue in your body. Keeps you full. Protects muscle during fat loss.',
              sources: ['Chicken', 'Fish', 'Eggs', 'Lentils', 'Greek Yogurt'],
              bar: 'bg-red-400',
            },
            {
              macro: 'Carbohydrates',
              emoji: '🌾',
              kcal: '4 kcal/g',
              goal: '45–65% of total calories',
              role: "Your brain's preferred fuel. Choose complex, fibre-rich sources for sustained energy without the crash.",
              sources: ['Oats', 'Sweet Potato', 'Brown Rice', 'Fruit', 'Legumes'],
              bar: 'bg-amber-400',
            },
            {
              macro: 'Fats',
              emoji: '🥑',
              kcal: '9 kcal/g',
              goal: '20–35% of total calories',
              role: 'Critical for hormone production, brain function, and fat-soluble vitamin absorption. Do not fear fat.',
              sources: ['Avocado', 'Olive Oil', 'Salmon', 'Nuts', 'Seeds'],
              bar: 'bg-sky-400',
            },
          ].map((m) => (
            <div
              key={m.macro}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{m.emoji}</span>
                <div>
                  <h3 className="font-serif text-base font-black text-white">{m.macro}</h3>
                  <p className="text-[10px] text-white/40">{m.kcal}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/70 mb-4">{m.role}</p>
              <div className={`h-1 w-full rounded-full ${m.bar} mb-4`} />
              <p className="text-[10px] font-bold text-amber-300 mb-2">Daily Goal: {m.goal}</p>
              <div className="flex flex-wrap gap-1">
                {m.sources.map((s) => (
                  <span key={s} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function NutritionPage(): React.ReactNode {
  return (
    <main id="main-content">
      <HeroSection />
      <StatsBar />
      <PillarsSection />
      <MealsSection />
      <PrinciplesSection />
      <NutrientsSection />
      <MealPlanSection />
      <MacroGuideSection />
    </main>
  )
}
