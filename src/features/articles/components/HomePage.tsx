// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { ArticleCard } from '@/components/feature/ArticleCard'
// import { CategoryPills } from '@/components/feature/CategoryPills'
// import { SectionHeader } from '@/components/common/SectionHeader'
// import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
// import { ErrorMessage } from '@/components/common/ErrorMessage'
// import { EmptyState } from '@/components/common/EmptyState'
// import { AiChatWidget } from '@/features/ai/components/AiChatWidget'
// import { SubscriptionSection } from '@/features/subscription/components/SubscriptionSection'
// import { useArticles } from '@/features/articles/hooks/useArticles'
// import { useExperts } from '@/features/experts/hooks/useExperts'
// import { useWellnessTips } from '@/features/ai/hooks/useWellnessTips'
// import { useUserStats } from '@/features/dashboard/hooks/useUserStats'
// import { getUserFriendlyMessage } from '@/lib/errors'

// const TRUST_ITEMS = [
//   { icon: '🏥', label: 'Physician-reviewed' },
//   { icon: '📚', label: 'Peer-reviewed' },
//   { icon: '🔬', label: 'Evidence-based' },
//   { icon: '🛡️', label: 'HIPAA-aware' },
//   { icon: '⭐', label: '4.92/5 · 52K readers' },
// ]

// const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'Sa', 'Su']

// export function HomePage(): React.ReactNode {
//   const [selectedCat, setSelectedCat] = useState('All')
//   const navigate = useNavigate()
//   const articlesQuery = useArticles()
//   const expertsQuery = useExperts()
//   const tipsQuery = useWellnessTips()
//   const statsQuery = useUserStats()

//   const articles = articlesQuery.data ?? []
//   const experts = expertsQuery.data ?? []
//   const tips = tipsQuery.data ?? []
//   const streak = statsQuery.data?.streakCount ?? 0

//   return (
//     <main id="main-content">
//       {/* ── Hero ── */}
//       <section
//         aria-label="Hero"
//         className="bg-gradient-to-br from-green-50 via-paper to-tan-50 pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden"
//       >
//         <div className="vh-container">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
//             {/* Left: copy */}
//             <div className="text-center lg:text-left">
//               <div className="inline-flex items-center gap-1.5 bg-white border border-green-100 rounded-full px-3 py-1.5 text-[11px] font-bold text-green-600 tracking-[0.06em] uppercase mb-4 animate-fade-in">
//                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-dot shrink-0" />
//                 🌿 Evidence-based · Expert-verified
//               </div>

//               <h1 className="font-serif text-[clamp(28px,6vw,56px)] font-black leading-[1.08] text-ink tracking-[-0.04em] mb-4 animate-fade-up">
//                 Science-backed
//                 <br />
//                 <em className="text-green-500 font-light not-italic">health wisdom</em>
//                 <br />
//                 for modern life
//               </h1>

//               <p className="text-sm sm:text-base text-ink-3 leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0 font-light">
//                 Expert-verified articles, AI-powered insights, and curated podcasts — designed to
//                 help you live healthier, not just longer.
//               </p>

//               <div className="flex items-center bg-white border-2 border-border rounded-full py-1.5 pl-4 pr-1.5 shadow-card max-w-[520px] mx-auto lg:mx-0 mb-3">
//                 <span className="text-sm mr-2 opacity-45" aria-hidden="true">🔍</span>
//                 <label htmlFor="hero-search" className="sr-only">Search health topics</label>
//                 <input
//                   id="hero-search"
//                   placeholder='Ask: "how to improve sleep"'
//                   className="flex-1 border-none bg-transparent text-sm text-ink min-w-0 py-1 outline-none placeholder:text-ink-4"
//                   onKeyDown={(e) => e.key === 'Enter' && navigate('/ai')}
//                 />
//                 <button
//                   onClick={() => navigate('/ai')}
//                   className="vh-btn vh-btn-primary text-xs shrink-0"
//                 >
//                   Ask Vita AI
//                 </button>
//               </div>

//               <div className="flex flex-wrap gap-1.5 mb-5 justify-center lg:justify-start">
//                 {['Sleep', 'Stress', 'Nutrition', 'Gut Health', 'Zone 2'].map((tag) => (
//                   <button
//                     key={tag}
//                     onClick={() => navigate('/ai')}
//                     className="text-[11px] font-medium text-ink-3 bg-white border border-border rounded-full px-2.5 py-0.5 hover:border-green-300 hover:text-green-600 transition-colors"
//                   >
//                     {tag}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
//                 {TRUST_ITEMS.slice(0, 4).map(({ icon, label }) => (
//                   <div key={label} className="flex items-center gap-1.5 text-[11px] text-ink-3">
//                     <div className="w-5 h-5 bg-green-50 border border-green-100 rounded-md flex items-center justify-center text-[11px] shrink-0">
//                       {icon}
//                     </div>
//                     {label}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: visual cluster (hidden on small to avoid clutter, shown sm+) */}
//             <div
//               className="relative h-[340px] sm:h-[400px] hidden sm:block"
//               aria-hidden="true"
//             >
//               <div className="absolute top-0 left-0 right-6 sm:right-10 bg-white rounded-2xl overflow-hidden shadow-pop border border-border">
//                 <img
//                   src={
//                     articles[0]?.imageUrl ??
//                     'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80'
//                   }
//                   alt=""
//                   className="h-[150px] sm:h-[170px] w-full object-cover"
//                 />
//                 <div className="p-4">
//                   <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 inline-block mb-2">
//                     Featured
//                   </span>
//                   <p className="font-serif text-sm font-bold text-ink leading-snug mb-1.5 line-clamp-2">
//                     {articles[0]?.title ?? 'Loading featured article…'}
//                   </p>
//                   <p className="text-[11px] text-ink-4">
//                     {articles[0] ? `${articles[0].author} · ${articles[0].readTime} read` : '—'}
//                   </p>
//                 </div>
//               </div>

//               <div className="absolute top-3 right-0 bg-green-600 text-white rounded-xl p-3 shadow-pop w-[150px] sm:w-[158px] animate-float">
//                 <p className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/55 mb-1">
//                   🤖 Vita AI
//                 </p>
//                 <p className="text-[11px] font-medium leading-snug mb-1.5">
//                   "What helps with chronic stress?"
//                 </p>
//                 <p className="text-[10px] text-white/65 leading-relaxed line-clamp-3">
//                   Box breathing activates your parasympathetic system in under 2 minutes…
//                 </p>
//               </div>

//               {streak > 0 && (
//                 <div className="absolute bottom-5 right-0 bg-white rounded-xl p-3 shadow-lifted border border-border w-[140px] sm:w-[150px] animate-float-delayed">
//                   <p className="text-[9px] font-bold tracking-[0.08em] uppercase text-tan-400 mb-1">
//                     🔥 Streak
//                   </p>
//                   <p className="font-serif text-2xl sm:text-[26px] font-black text-tan-600 leading-none">
//                     {streak}
//                   </p>
//                   <p className="text-[10px] text-ink-3 mt-0.5">Days in a row!</p>
//                   <div className="flex gap-0.5 mt-2">
//                     {STREAK_DAYS.map((d, i) => (
//                       <div
//                         key={i}
//                         className="w-[15px] sm:w-[17px] h-[15px] sm:h-[17px] rounded-full text-[7px] font-bold flex items-center justify-center"
//                         style={{
//                           background: i < 5 ? '#C47845' : i === 5 ? '#FDF3EE' : '#eee',
//                           color: i < 5 ? '#fff' : i === 5 ? '#C47845' : '#bbb',
//                           border: i === 5 ? '2px solid #C47845' : 'none',
//                         }}
//                       >
//                         {i < 5 ? '✓' : i === 5 ? '🔥' : d}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Trust Bar ── */}
//       <div
//         className="bg-white border-t border-b border-border py-3"
//         role="region"
//         aria-label="Trust indicators"
//       >
//         <div className="vh-container flex gap-3 sm:gap-5 items-center justify-start sm:justify-center flex-nowrap sm:flex-wrap overflow-x-auto scroll-x-clean">
//           {TRUST_ITEMS.map(({ icon, label }) => (
//             <div key={label} className="flex items-center gap-1.5 text-[11px] text-ink-3 shrink-0">
//               <div className="w-5 h-5 bg-green-50 border border-green-100 rounded-md flex items-center justify-center text-[11px] shrink-0">
//                 {icon}
//               </div>
//               {label}
//             </div>
//           ))}
//         </div>
//       </div>

//       <CategoryPills selected={selectedCat} onSelect={setSelectedCat} sticky />

//       {/* ── Articles Section ── */}
//       <section className="py-12 sm:py-16 bg-paper" aria-label="Latest articles">
//         <div className="vh-container">
//           <SectionHeader
//             eyebrow="Latest & Trending"
//             title="Expert"
//             titleAccent="Insights"
//             onSeeAll={() => navigate('/articles')}
//           />
//           {articlesQuery.isLoading ? (
//             <ArticleCardSkeleton count={3} />
//           ) : articlesQuery.isError ? (
//             <ErrorMessage
//               message={getUserFriendlyMessage(articlesQuery.error)}
//               onRetry={() => void articlesQuery.refetch()}
//             />
//           ) : articles.length === 0 ? (
//             <EmptyState message="No articles available yet." />
//           ) : (
//             <>
//               <div
//                 className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-px mb-3.5 rounded-2xl overflow-hidden bg-border"
//               >
//                 <ArticleCard article={articles[0]} size="xl" />
//                 {(articles[1] || articles[2]) && (
//                   <div className="grid gap-px bg-border">
//                     {articles[1] && <ArticleCard article={articles[1]} size="lg" />}
//                     {articles[2] && <ArticleCard article={articles[2]} size="lg" />}
//                   </div>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                 {articles.slice(2, 5).map((a) => (
//                   <ArticleCard key={a.id} article={a} size="md" />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* ── AI Section ── */}
//       <section
//         className="bg-ink py-12 sm:py-16 relative overflow-hidden"
//         aria-label="AI Health Assistant"
//       >
//         <div className="vh-container relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
//             <div>
//               <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-green-300 mb-2.5 flex items-center gap-1.5">
//                 <span className="w-3.5 h-0.5 bg-green-400 rounded inline-block" />
//                 AI Health Assistant
//               </p>
//               <h2 className="font-serif text-[clamp(24px,4vw,40px)] font-black text-white tracking-tight leading-tight mb-3.5">
//                 Meet <em className="text-green-400 font-light not-italic">Vita</em> — your personal
//                 wellness intelligence
//               </h2>
//               <p className="text-sm text-white/55 leading-relaxed mb-5 font-light max-w-xl">
//                 Instant, evidence-based answers from 1,200+ expert-reviewed articles and the latest
//                 peer-reviewed research.
//               </p>
//               <div className="mb-6 space-y-3">
//                 {[
//                   ['🧬', 'Evidence-based only', 'Every response references peer-reviewed research.'],
//                   ['🔗', 'Smart content linking', 'Connects your question to relevant articles and podcasts.'],
//                   ['🛡️', 'Safe & responsible', 'Non-diagnostic. Recommends professional help when needed.'],
//                 ].map(([icon, title, desc]) => (
//                   <div key={title} className="flex gap-3 items-start">
//                     <div className="w-9 h-9 shrink-0 bg-green-500/14 border border-green-500/24 rounded-xl flex items-center justify-center text-base">
//                       {icon}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
//                       <p className="text-[11px] text-white/50 leading-relaxed">{desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex gap-2.5 flex-wrap">
//                 <button
//                   onClick={() => navigate('/ai')}
//                   className="vh-btn vh-btn-primary text-xs"
//                 >
//                   Open Full AI Chat →
//                 </button>
//                 <button className="vh-btn text-xs bg-white/[0.07] border border-white/14 text-white hover:bg-white/15">
//                   View Sample Answers
//                 </button>
//               </div>
//             </div>
//             <AiChatWidget compact />
//           </div>
//         </div>
//       </section>

//       {/* ── Daily Tips ── */}
//       <section
//         className="py-12 sm:py-16 bg-gradient-to-br from-green-50 via-paper to-tan-50"
//         aria-label="Daily wellness tips"
//       >
//         <div className="vh-container">
//           <SectionHeader
//             eyebrow="AI-Curated Daily"
//             title="Today's Wellness"
//             titleAccent="Tips"
//             subtitle="Refreshed daily from 1,200+ peer-reviewed articles."
//             center
//           />
//           {tipsQuery.isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="vh-card p-5 animate-pulse">
//                   <div className="w-[42px] h-[42px] rounded-xl bg-border mb-3" />
//                   <div className="h-4 w-3/4 bg-border rounded mb-2" />
//                   <div className="h-3 w-full bg-border/70 rounded mb-1.5" />
//                   <div className="h-3 w-5/6 bg-border/70 rounded" />
//                 </div>
//               ))}
//             </div>
//           ) : tipsQuery.isError ? (
//             <ErrorMessage message={getUserFriendlyMessage(tipsQuery.error)} />
//           ) : tips.length === 0 ? (
//             <EmptyState message="No wellness tips today." icon="🌿" />
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//               {tips.map((tip) => (
//                 <div
//                   key={tip.id}
//                   className="vh-card vh-card-hover p-5 cursor-pointer"
//                 >
//                   <div
//                     className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-[21px] mb-3"
//                     style={{ background: tip.colors.bg, border: `1px solid ${tip.colors.border}` }}
//                   >
//                     {tip.icon}
//                   </div>
//                   <h3 className="font-serif text-sm font-bold text-ink mb-1.5">{tip.title}</h3>
//                   <p className="text-xs text-ink-3 leading-relaxed font-light line-clamp-3">{tip.text}</p>
//                   <div className="mt-2.5 inline-flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
//                     ✨ AI Curated
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ── Experts ── */}
//       <section
//         className="py-12 sm:py-16 bg-green-50 border-t border-b border-green-100"
//         aria-label="Expert authors"
//       >
//         <div className="vh-container">
//           <SectionHeader
//             eyebrow="Built on Trust"
//             title="Meet Our"
//             titleAccent="Experts"
//             subtitle="Every article authored or reviewed by credentialed health professionals."
//           />
//           {expertsQuery.isLoading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="vh-card p-5 animate-pulse">
//                   <div className="w-16 h-16 rounded-full mx-auto mb-2.5 bg-border" />
//                   <div className="h-3 w-2/3 bg-border rounded mx-auto mb-2" />
//                   <div className="h-3 w-1/2 bg-border/70 rounded mx-auto mb-1.5" />
//                   <div className="h-3 w-3/4 bg-border/70 rounded mx-auto" />
//                 </div>
//               ))}
//             </div>
//           ) : expertsQuery.isError ? (
//             <ErrorMessage message={getUserFriendlyMessage(expertsQuery.error)} />
//           ) : experts.length === 0 ? (
//             <EmptyState message="No experts to show." />
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {experts.map((expert) => (
//                 <div
//                   key={expert.id}
//                   onClick={() => navigate(`/experts/${expert.id}`)}
//                   className="vh-card vh-card-hover p-5 text-center cursor-pointer"
//                 >
//                   <div className="w-16 h-16 rounded-full mx-auto mb-2.5 overflow-hidden border-2 border-green-100">
//                     <img
//                       src={expert.imageUrl}
//                       alt={expert.name}
//                       className="h-16 w-full object-cover"
//                       loading="lazy"
//                     />
//                   </div>
//                   <div className="inline-flex items-center gap-1 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 text-[9px] font-bold text-green-600 mb-2">
//                     ✓ Verified
//                   </div>
//                   <br />
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       navigate(`/experts/${expert.id}`)
//                     }}
//                     className="font-serif text-sm font-bold text-ink mb-0.5 hover:text-green-600 transition-colors"
//                   >
//                     {expert.name}
//                   </button>
//                   <p className="text-[11px] font-semibold text-green-500 mb-1">{expert.role}</p>
//                   <p className="text-[10px] text-ink-3 leading-relaxed mb-2 font-light line-clamp-2">
//                     {expert.credentials}
//                   </p>
//                   <p className="text-[11px] font-semibold text-ink-3">
//                     📝 {expert.articleCount} articles
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       <SubscriptionSection preview />
//     </main>
//   )
// }


import React, { useEffect, useRef, useState } from 'react'
import './HomeePage.css'

/* ============================================================
   STATIC DATA
   ============================================================ */

const TICKER_ITEMS = [
  'Drink 500ml water before coffee — boosts metabolism by 30%',
  '10 min morning sun resets your circadian rhythm better than supplements',
  'Walk 10 min after meals — lowers blood glucose by 22%',
  'Magnesium glycinate 200mg before bed deepens sleep architecture measurably',
  'Box breathing 4-4-4-4 activates parasympathetic system in 90 seconds',
  'Nasal breathing during exercise increases oxygen uptake by 18%',
  'Eating curd rice is a probiotic powerhouse — Ayurveda got it right',
  'Zone 2 cardio — you can still hold a conversation — is where longevity happens',
]

type TabKey = 'mind' | 'body' | 'nutrition' | 'sleep' | 'longevity' | 'india'

interface TabDef {
  key: TabKey
  name: string
  sub: string
  icon: string
  iconColor: string
  iconBg: string
}

const TABS: TabDef[] = [
  { key: 'mind', name: 'Mind', sub: 'Mental well-being', icon: 'ti-brain', iconColor: '#1E6E3A', iconBg: '#F0FAF4' },
  { key: 'body', name: 'Body', sub: 'Fitness & strength', icon: 'ti-run', iconColor: '#F43F5E', iconBg: '#FFF1F2' },
  { key: 'nutrition', name: 'Nutrition', sub: 'Eat smart', icon: 'ti-leaf', iconColor: '#F59E0B', iconBg: '#FFFBEB' },
  { key: 'sleep', name: 'Sleep', sub: 'Rest & recharge', icon: 'ti-moon', iconColor: '#3B82F6', iconBg: '#EFF6FF' },
  { key: 'longevity', name: 'Longevity', sub: 'Live longer', icon: 'ti-dna-2', iconColor: '#14B8A6', iconBg: '#F0FDFA' },
  { key: 'india', name: 'India Roots', sub: 'Ayurveda + science', icon: 'ti-plant', iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
]

interface ArticleCardData {
  imgClass: string
  icon: string
  iconColor: string
  tagClass: string
  tagLabel: string
  title: string
  authorInitials: string
  authorName: string
  readTime: string
}

interface TrendItemData {
  imgClass: string
  icon: string
  iconColor: string
  title: string
  readTime: string
}

interface TabContent {
  sectionTitle: string
  articles: ArticleCardData[]
  trending: TrendItemData[]
}

const TAB_CONTENT: Record<TabKey, TabContent> = {
  mind: {
    sectionTitle: 'Latest articles',
    articles: [
      { imgClass: 'ai-blue', icon: 'ti-brain', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Mind', title: '5 Morning Habits That Improve Mental Clarity', authorInitials: 'NV', authorName: 'Dr. Neha Verma', readTime: '7 min' },
      { imgClass: 'ai-amber', icon: 'ti-salad', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Nutrition', title: 'High Protein Breakfast Ideas for Busy Mornings', authorInitials: 'RM', authorName: 'Riya Mehta', readTime: '6 min' },
      { imgClass: 'ai-grn', icon: 'ti-moon', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Sleep', title: 'Why You Feel Tired Even After 8 Hours of Sleep', authorInitials: 'KS', authorName: 'Dr. Kabir Singh', readTime: '8 min' },
      { imgClass: 'ai-coral', icon: 'ti-run', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Body', title: 'Desk Job Problems and Simple Posture Fixes', authorInitials: 'PR', authorName: 'Physio Rohit', readTime: '6 min' },
      { imgClass: 'ai-teal', icon: 'ti-dna-2', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Longevity', title: "What Your Weight Doesn't Tell You About Health", authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '7 min' },
      { imgClass: 'ai-purple', icon: 'ti-device-mobile', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Lifestyle', title: 'Digital Detox: Reclaim Your Focus and Energy', authorInitials: 'AK', authorName: 'Aarav Khanna', readTime: '5 min' },
    ],
    trending: [
      { imgClass: 'ai-grn', icon: 'ti-sun', iconColor: '#1E6E3A', title: "Signs of Vitamin D Deficiency You Shouldn't Ignore", readTime: '6 min read' },
      { imgClass: 'ai-amber', icon: 'ti-clock', iconColor: '#F59E0B', title: 'Is Intermittent Fasting Safe for Everyone?', readTime: '7 min read' },
      { imgClass: 'ai-coral', icon: 'ti-sparkles', iconColor: '#F43F5E', title: 'Best Foods for Healthy Skin', readTime: '5 min read' },
      { imgClass: 'ai-purple', icon: 'ti-brain', iconColor: '#8B5CF6', title: 'How Stress Affects Your Gut Health', readTime: '8 min read' },
      { imgClass: 'ai-teal', icon: 'ti-shield', iconColor: '#14B8A6', title: '10 Simple Ways to Boost Immunity', readTime: '6 min read' },
    ],
  },
  body: {
    sectionTitle: 'Latest in Body',
    articles: [
      { imgClass: 'ai-coral', icon: 'ti-barbell', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Body', title: 'Strength Training Basics Every Beginner Should Know', authorInitials: 'AS', authorName: 'Arjun Shah', readTime: '8 min' },
      { imgClass: 'ai-amber', icon: 'ti-stretching', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Mobility', title: 'The Truth About Daily Stretching for Flexibility', authorInitials: 'PR', authorName: 'Physio Rohit', readTime: '6 min' },
      { imgClass: 'ai-blue', icon: 'ti-run', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Cardio', title: 'How to Build Endurance Without Cardio Burnout', authorInitials: 'RK', authorName: 'Coach Rahul K.', readTime: '7 min' },
      { imgClass: 'ai-grn', icon: 'ti-heart-rate-monitor', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Recovery', title: 'Recovery Routines That Actually Work for Athletes', authorInitials: 'SM', authorName: 'Dr. Suresh M.', readTime: '9 min' },
      { imgClass: 'ai-purple', icon: 'ti-yoga', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Flexibility', title: "Mobility vs Flexibility — What's the Difference?", authorInitials: 'PR', authorName: 'Physio Rohit', readTime: '5 min' },
      { imgClass: 'ai-teal', icon: 'ti-shoe', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Running', title: 'Why Your Knees Hurt After Running (And How to Fix It)', authorInitials: 'KS', authorName: 'Dr. Kavya S.', readTime: '7 min' },
    ],
    trending: [
      { imgClass: 'ai-coral', icon: 'ti-barbell', iconColor: '#F43F5E', title: 'The 7 Best Exercises for Better Posture', readTime: '6 min read' },
      { imgClass: 'ai-grn', icon: 'ti-walk', iconColor: '#1E6E3A', title: 'How Many Steps Should You Really Walk Daily?', readTime: '5 min read' },
      { imgClass: 'ai-amber', icon: 'ti-salad', iconColor: '#F59E0B', title: 'Pre vs Post Workout Nutrition: What Matters More', readTime: '7 min read' },
      { imgClass: 'ai-blue', icon: 'ti-heart-rate-monitor', iconColor: '#3B82F6', title: 'The Science of Muscle Soreness Explained', readTime: '6 min read' },
      { imgClass: 'ai-purple', icon: 'ti-run', iconColor: '#8B5CF6', title: "Functional Training: A Complete Beginner's Guide", readTime: '8 min read' },
    ],
  },
  nutrition: {
    sectionTitle: 'Latest in Nutrition',
    articles: [
      { imgClass: 'ai-amber', icon: 'ti-salad', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Diet', title: "Mediterranean Diet: Why It's Backed by Science", authorInitials: 'AS', authorName: 'Dr. Ananya Sharma', readTime: '9 min' },
      { imgClass: 'ai-coral', icon: 'ti-meat', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Protein', title: 'The Truth About Protein Powders in 2026', authorInitials: 'RM', authorName: 'Riya Mehta', readTime: '7 min' },
      { imgClass: 'ai-grn', icon: 'ti-candy', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Sugar', title: 'Hidden Sugars in "Healthy" Foods You Buy Daily', authorInitials: 'PJ', authorName: 'Dr. Priya Joshi', readTime: '6 min' },
      { imgClass: 'ai-teal', icon: 'ti-bacteria', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Gut', title: 'How Fiber Transforms Your Gut Microbiome', authorInitials: 'VT', authorName: 'Dr. Vikram T.', readTime: '8 min' },
      { imgClass: 'ai-purple', icon: 'ti-plant', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'India', title: 'Indian Superfoods That Beat Imported Trends', authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '7 min' },
      { imgClass: 'ai-blue', icon: 'ti-tools-kitchen-2', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Planning', title: 'Meal Prep Sunday: A 4-Hour Weekly System', authorInitials: 'AK', authorName: 'Aarav Khanna', readTime: '6 min' },
    ],
    trending: [
      { imgClass: 'ai-coral', icon: 'ti-coffee', iconColor: '#F43F5E', title: 'Is Coffee Actually Bad for Your Heart?', readTime: '6 min read' },
      { imgClass: 'ai-amber', icon: 'ti-bread', iconColor: '#F59E0B', title: 'The Best Time to Eat Carbs for Energy', readTime: '5 min read' },
      { imgClass: 'ai-grn', icon: 'ti-pepper', iconColor: '#1E6E3A', title: 'Top 10 Anti-Inflammatory Foods', readTime: '7 min read' },
      { imgClass: 'ai-teal', icon: 'ti-bacteria', iconColor: '#14B8A6', title: 'Probiotics vs Prebiotics: Which Matters More?', readTime: '8 min read' },
      { imgClass: 'ai-purple', icon: 'ti-plant', iconColor: '#8B5CF6', title: 'Why Indian Spices Are the Original Functional Foods', readTime: '6 min read' },
    ],
  },
  sleep: {
    sectionTitle: 'Latest in Sleep',
    articles: [
      { imgClass: 'ai-blue', icon: 'ti-moon', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Sleep', title: 'The Perfect Sleep Schedule for Your Chronotype', authorInitials: 'KS', authorName: 'Dr. Kabir Singh', readTime: '8 min' },
      { imgClass: 'ai-purple', icon: 'ti-capsule', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Supplements', title: 'Why Magnesium is the King of Sleep Supplements', authorInitials: 'RM', authorName: 'Dr. Riya Menon', readTime: '7 min' },
      { imgClass: 'ai-amber', icon: 'ti-sun', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Light', title: 'How Light Exposure Controls Your Sleep Quality', authorInitials: 'NR', authorName: 'Dr. Nandini R.', readTime: '6 min' },
      { imgClass: 'ai-grn', icon: 'ti-device-watch', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Tracking', title: 'Sleep Tracking: What the Data Really Means', authorInitials: 'AS', authorName: 'Arjun Shah', readTime: '9 min' },
      { imgClass: 'ai-coral', icon: 'ti-zzz', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Insomnia', title: 'Insomnia Protocols From a Sleep Doctor', authorInitials: 'KS', authorName: 'Dr. Kabir Singh', readTime: '10 min' },
      { imgClass: 'ai-teal', icon: 'ti-clock', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Science', title: 'The 90-Minute Sleep Cycle Theory Explained', authorInitials: 'VT', authorName: 'Dr. Vikram T.', readTime: '7 min' },
    ],
    trending: [
      { imgClass: 'ai-blue', icon: 'ti-bed', iconColor: '#3B82F6', title: 'Should You Nap During the Day?', readTime: '5 min read' },
      { imgClass: 'ai-grn', icon: 'ti-temperature', iconColor: '#1E6E3A', title: 'Cooling Mattresses: Worth the Hype?', readTime: '6 min read' },
      { imgClass: 'ai-coral', icon: 'ti-glass-full', iconColor: '#F43F5E', title: 'How Alcohol Wrecks Your Deep Sleep', readTime: '7 min read' },
      { imgClass: 'ai-amber', icon: 'ti-body-scan', iconColor: '#F59E0B', title: 'The Best Sleep Position for Back Pain', readTime: '6 min read' },
      { imgClass: 'ai-purple', icon: 'ti-leaf', iconColor: '#8B5CF6', title: 'CBD for Sleep: What Science Says', readTime: '8 min read' },
    ],
  },
  longevity: {
    sectionTitle: 'Latest in Longevity',
    articles: [
      { imgClass: 'ai-teal', icon: 'ti-world', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Lifestyle', title: "Blue Zones: 5 Habits of the World's Oldest People", authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '9 min' },
      { imgClass: 'ai-grn', icon: 'ti-dna-2', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Cellular', title: 'Cellular Aging: Can You Actually Reverse It?', authorInitials: 'VT', authorName: 'Dr. Vikram Tiwari', readTime: '10 min' },
      { imgClass: 'ai-purple', icon: 'ti-capsule', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Supplements', title: 'The NMN Supplement Debate Settled', authorInitials: 'RM', authorName: 'Dr. Riya Menon', readTime: '8 min' },
      { imgClass: 'ai-blue', icon: 'ti-heart-rate-monitor', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Cardio', title: 'Why Zone 2 Cardio is the Longevity King', authorInitials: 'AS', authorName: 'Arjun Shah', readTime: '7 min' },
      { imgClass: 'ai-coral', icon: 'ti-flame', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Heat', title: 'Sauna Use & Cardiovascular Health Evidence', authorInitials: 'SM', authorName: 'Dr. Suresh M.', readTime: '8 min' },
      { imgClass: 'ai-amber', icon: 'ti-chart-line', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Biomarkers', title: 'Telomere Length and Your Real Biological Age', authorInitials: 'PJ', authorName: 'Dr. Priya Joshi', readTime: '9 min' },
    ],
    trending: [
      { imgClass: 'ai-teal', icon: 'ti-test-pipe', iconColor: '#14B8A6', title: 'The Best Longevity Tests You Can Do at Home', readTime: '7 min read' },
      { imgClass: 'ai-amber', icon: 'ti-clock', iconColor: '#F59E0B', title: 'Fasting Mimicking Diet — Worth the Effort?', readTime: '6 min read' },
      { imgClass: 'ai-coral', icon: 'ti-barbell', iconColor: '#F43F5E', title: 'Why Resistance Training Beats Cardio After 40', readTime: '8 min read' },
      { imgClass: 'ai-grn', icon: 'ti-pill', iconColor: '#1E6E3A', title: 'Supplements That Actually Extend Lifespan', readTime: '9 min read' },
      { imgClass: 'ai-purple', icon: 'ti-microscope', iconColor: '#8B5CF6', title: 'The Hayflick Limit and Why It Matters', readTime: '7 min read' },
    ],
  },
  india: {
    sectionTitle: 'Latest in India Roots',
    articles: [
      { imgClass: 'ai-purple', icon: 'ti-apple', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Ayurveda', title: 'Triphala: The 3-Fruit Wonder Backed by Science', authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '8 min' },
      { imgClass: 'ai-grn', icon: 'ti-yoga', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Yoga', title: 'Yoga vs Modern Exercise — Which Works Better?', authorInitials: 'NR', authorName: 'Dr. Nandini Rao', readTime: '7 min' },
      { imgClass: 'ai-amber', icon: 'ti-droplet', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Food', title: 'Ghee Reconsidered: The Ayurvedic Superfat', authorInitials: 'AS', authorName: 'Dr. Ananya Sharma', readTime: '6 min' },
      { imgClass: 'ai-teal', icon: 'ti-massage', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Detox', title: 'How Panchakarma Detoxes Actually Work', authorInitials: 'VT', authorName: 'Dr. Vikram T.', readTime: '9 min' },
      { imgClass: 'ai-coral', icon: 'ti-plant-2', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Herbs', title: 'Tulsi: Adaptogen of the Subcontinent', authorInitials: 'PJ', authorName: 'Dr. Priya Joshi', readTime: '7 min' },
      { imgClass: 'ai-blue', icon: 'ti-glass-cocktail', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Tradition', title: 'Why Indian Mothers Always Insisted on Haldi Doodh', authorInitials: 'RM', authorName: 'Riya Mehta', readTime: '5 min' },
    ],
    trending: [
      { imgClass: 'ai-purple', icon: 'ti-capsule', iconColor: '#8B5CF6', title: 'Ashwagandha Doses That Actually Work', readTime: '7 min read' },
      { imgClass: 'ai-grn', icon: 'ti-user-circle', iconColor: '#1E6E3A', title: 'The Ayurvedic Body Types Explained', readTime: '6 min read' },
      { imgClass: 'ai-amber', icon: 'ti-droplet', iconColor: '#F59E0B', title: 'Why Mustard Oil is Making a Comeback', readTime: '5 min read' },
      { imgClass: 'ai-coral', icon: 'ti-wind', iconColor: '#F43F5E', title: 'Pranayama: The Original Box Breathing', readTime: '8 min read' },
      { imgClass: 'ai-teal', icon: 'ti-brain', iconColor: '#14B8A6', title: 'Brahmi for Memory: Evidence Review', readTime: '7 min read' },
    ],
  },
}

const PODCASTS = [
  { thumbClass: 'pt-g', icon: 'ti-brain', iconColor: '#1E6E3A', ep: 'Ep 48 · Mind Architecture', title: 'The Neuroscience of Breaking Bad Habits', dur: '54 min · Dr. Nandini Rao' },
  { thumbClass: 'pt-b', icon: 'ti-dna-2', iconColor: '#3B82F6', ep: 'Ep 47 · Longevity Lab', title: 'Metformin, NMN & The Longevity Stack', dur: '68 min · Dr. Vikram Tiwari' },
  { thumbClass: 'pt-p', icon: 'ti-heart-rate-monitor', iconColor: '#8B5CF6', ep: 'Ep 46 · Body Intel', title: 'HRV, VO2 Max & The Metrics That Actually Matter', dur: '41 min · Arjun Shah' },
]

const VIDEOS = [
  { thumbClass: 'vt-b', icon: 'ti-moon', iconColor: '#3B82F6', dur: '4:22', cat: 'Sleep', title: 'Why You Wake at 3am — Explained in 4 Min', views: '92k views' },
  { thumbClass: 'vt-g', icon: 'ti-dna-2', iconColor: '#1E6E3A', dur: '6:10', cat: 'Longevity', title: "Autophagy: Your Body's Self-Clean Mode", views: '78k views' },
  { thumbClass: 'vt-a', icon: 'ti-salad', iconColor: '#F59E0B', dur: '3:47', cat: 'Nutrition', title: '30 Plants a Week: What That Actually Means', views: '54k views' },
  { thumbClass: 'vt-c', icon: 'ti-wind', iconColor: '#F43F5E', dur: '2:55', cat: 'Mind', title: 'Box Breathing: The 90-Second Reset', views: '41k views' },
]

const VITAL_DIMS = [
  { label: 'Sleep', pct: 68, color: '#3B82F6' },
  { label: 'Stress', pct: 52, color: '#F43F5E' },
  { label: 'Nutrition', pct: 80, color: '#1E6E3A' },
  { label: 'Movement', pct: 74, color: '#14B8A6' },
  { label: 'Gut', pct: 88, color: '#1E6E3A' },
  { label: 'Mind', pct: 61, color: '#8B5CF6' },
]

const CLAIMS = [
  { type: 'myth', verdict: 'Myth', text: 'You need 8 glasses of water a day — the requirement depends on body weight, climate and activity level entirely.' },
  { type: 'fact', verdict: 'Fact', text: 'Cold showers do raise norepinephrine — even 30 seconds at the end of a hot shower produces the effect.' },
  { type: 'mixed', verdict: 'It depends', text: 'Eating after 8pm causes weight gain — total daily calories matter most, but late eating disrupts insulin sensitivity for some people.' },
]

const EXPERTS = [
  { initials: 'AS', bg: '#F0FAF4', color: '#1E6E3A', name: 'Dr. Ananya Sharma', role: 'Clinical Nutritionist', article: 'The Ultimate Guide to Anti-Inflammatory Diet' },
  { initials: 'KS', bg: '#EFF6FF', color: '#1E40AF', name: 'Dr. Kabir Singh', role: 'Sleep Specialist', article: 'Why Sleep Quality Matters More Than Hours' },
  { initials: 'NV', bg: '#F5F3FF', color: '#4C1D95', name: 'Dr. Neha Verma', role: 'Psychologist', article: 'Managing Anxiety in High-Pressure Life' },
  { initials: 'PR', bg: '#FFF1F2', color: '#9F1239', name: 'Physio Rohit', role: 'Physiotherapist', article: 'Desk Job Problems and Posture Fixes' },
]

const INDIA_CARDS = [
  { tag: 'Ayurveda meets science', h: 'Ashwagandha: What 34 Clinical Trials Actually Show', body: 'KSM-66 extract at 300mg lowers cortisol by 27% and improves sleep onset. Dose and timing matter enormously.', link: 'Read the evidence review' },
  { tag: 'Regional wisdom', h: "Kerala's Healing Kitchen: The Science Behind Sadhya", body: 'The traditional feast hits near-perfect macronutrient balance, fiber targets and probiotic diversity in one meal.', link: 'Explore the tradition' },
  { tag: 'Monsoon wellness', h: "How India's Monsoon Rewires Your Immune System", body: "June–September raises gut permeability and inflammation. Ayurveda's response is surprisingly validated by modern immunology.", link: 'Prepare for monsoon' },
]

interface QuizQuestion {
  id: number
  q: string
  opts: { value: string; label: string }[]
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Which affects your daily life most right now?',
    opts: [
      { value: 'A', label: 'Chronic fatigue and low energy' },
      { value: 'B', label: 'Anxiety or mental overload' },
      { value: 'C', label: 'Weight or metabolic concerns' },
      { value: 'D', label: 'Poor sleep quality' },
    ],
  },
  {
    id: 2,
    q: 'How would you describe your sleep quality?',
    opts: [
      { value: 'A', label: 'Excellent — 7–9 hrs, wake refreshed' },
      { value: 'B', label: 'Good — mostly restful with rare disruptions' },
      { value: 'C', label: 'Average — restless or wake at night' },
      { value: 'D', label: 'Poor — struggle to fall or stay asleep' },
    ],
  },
  {
    id: 3,
    q: 'How often do you exercise each week?',
    opts: [
      { value: 'A', label: '5+ times a week' },
      { value: 'B', label: '3–4 times a week' },
      { value: 'C', label: '1–2 times a week' },
      { value: 'D', label: 'Rarely or never' },
    ],
  },
  {
    id: 4,
    q: 'How would you rate your stress levels?',
    opts: [
      { value: 'A', label: 'Low — feel mostly relaxed' },
      { value: 'B', label: 'Moderate — occasional stress spikes' },
      { value: 'C', label: 'High — frequent stress most days' },
      { value: 'D', label: 'Overwhelming — constant pressure' },
    ],
  },
  {
    id: 5,
    q: 'How balanced is your daily nutrition?',
    opts: [
      { value: 'A', label: 'Very balanced — whole foods, planned meals' },
      { value: 'B', label: 'Mostly balanced — some processed foods' },
      { value: 'C', label: 'Inconsistent — meals skipped or random' },
      { value: 'D', label: 'Mostly processed or fast food' },
    ],
  },
]

interface AiMessage {
  role: 'bot' | 'user'
  text: string
  cite?: string
}

const INITIAL_AI_MESSAGES: AiMessage[] = [
  { role: 'bot', text: "Hi! I'm Vita AI. Ask me about sleep, nutrition, fitness or Ayurveda — I cite every answer from peer-reviewed research." },
  { role: 'user', text: 'Is ashwagandha actually worth taking?' },
  { role: 'bot', text: 'Yes, but only KSM-66 extract at 300–600mg. 34 RCTs show it lowers cortisol by ~27% and improves sleep onset. Take it at night, not morning.', cite: '3 peer-reviewed sources' },
]

const AI_SUGGESTIONS = ['Best time to work out?', 'Fix my sleep', 'Gut health basics']

/* ============================================================
   COMPONENT
   ============================================================ */

export function HomePage(): React.ReactNode {
  /* Tabs */
  const [activeTab, setActiveTab] = useState<TabKey>('mind')

  /* Quiz */
  const [currentQ, setCurrentQ] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const totalQuestions = QUIZ_QUESTIONS.length
  const currentAnswer = answers[currentQ]

  /* AI chat */
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(INITIAL_AI_MESSAGES)
  const aiMsgsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (aiMsgsRef.current) {
      aiMsgsRef.current.scrollTop = aiMsgsRef.current.scrollHeight
    }
  }, [aiMessages])

  /* Newsletter */
  const [nlEmail, setNlEmail] = useState('')
  const [nlSubmitted, setNlSubmitted] = useState(false)

  /* Handlers */
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = aiInput.trim()
    if (!text) return
    setAiMessages((prev) => [...prev, { role: 'user', text }])
    setAiInput('')
    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Great question! Let me pull cited research on that and reply shortly…' },
      ])
    }, 600)
  }

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nlEmail.trim()) return
    setNlSubmitted(true)
    setNlEmail('')
    setTimeout(() => setNlSubmitted(false), 2400)
  }

  const handleNext = () => {
    if (!currentAnswer) return
    if (currentQ < totalQuestions) {
      setCurrentQ((q) => q + 1)
    } else {
      // eslint-disable-next-line no-alert
      alert('Quiz submitted!\n\nYour answers:\n' + JSON.stringify(answers, null, 2))
    }
  }

  const handlePrev = () => {
    if (currentQ > 1) setCurrentQ((q) => q - 1)
  }

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: value }))
  }

  const content = TAB_CONTENT[activeTab]
  const isLastQ = currentQ === totalQuestions
  const question = QUIZ_QUESTIONS[currentQ - 1]

  return (
    <div className="vita-home-page">
      <div className="pg">

        {/* TIPS TICKER */}
        <div className="">
          <div className="ticker">
            <div className="tick-lbl">
              <span className="tick-dot" />
              Daily tips
            </div>
            <div className="tick-track">
              <div className="tick-content">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <div className="tick-item" key={i}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="vh-container">
          <div className="hero">
            <div className="hero-l">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Cover story · Issue 12 · May 2026
              </div>
              <div className="hero-h1">
                Smarter Health<br />
                <span>Starts Here</span>
              </div>
              <div className="hero-sub">
                Science-backed wellness insights for modern Indian lifestyles. Every claim cited,
                every author credentialled.
              </div>
              <div className="hero-author">
                <div className="ava">DR</div>
                <div className="ava-info">
                  <span className="ava-name">Dr. Riya Menon</span>
                  <span className="ava-cred">MD Neurology · AIIMS Delhi</span>
                </div>
                <div className="verified-chip">
                  <i className="ti ti-circle-check" style={{ fontSize: 13 }} aria-hidden="true" />
                  Expert verified
                </div>
              </div>
              <div className="hero-chips">
                <div className="h-chip"><i className="ti ti-clock" style={{ fontSize: 14 }} aria-hidden="true" />12 min read</div>
                <div className="h-chip"><i className="ti ti-eye" style={{ fontSize: 14 }} aria-hidden="true" />48k reads</div>
                <div className="h-chip"><i className="ti ti-flame" style={{ fontSize: 14, color: '#F43F5E' }} aria-hidden="true" />#1 this month</div>
              </div>
              <div className="hero-btns">
                <button className="btn-p" type="button">Explore articles <i className="ti ti-arrow-right" style={{ fontSize: 14 }} aria-hidden="true" /></button>
                <button className="btn-s" type="button">Start your journey</button>
              </div>
            </div>
            <div className="hero-r">
              <div className="hero-img-circle">🧘</div>
              <div className="stat-cards-row">
                <div className="stat-card">
                  <div className="stat-icon si-blue"><i className="ti ti-moon" style={{ fontSize: 18 }} aria-hidden="true" /></div>
                  <div><div className="stat-val">7h 30m</div><div className="stat-label">Good sleep</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon si-grn"><i className="ti ti-run" style={{ fontSize: 18 }} aria-hidden="true" /></div>
                  <div><div className="stat-val">7,890</div><div className="stat-label">Steps today</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon si-coral"><i className="ti ti-heart-rate-monitor" style={{ fontSize: 18 }} aria-hidden="true" /></div>
                  <div><div className="stat-val">85 bpm</div><div className="stat-label">Heart rate</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon si-amber"><i className="ti ti-droplet" style={{ fontSize: 18 }} aria-hidden="true" /></div>
                  <div><div className="stat-val">2.1 L</div><div className="stat-label">Water today</div></div>
                </div>
              </div>
              <div className="hero-tip-float">
                <div className="tip-icon"><i className="ti ti-bulb" style={{ fontSize: 18, color: '#1E6E3A' }} aria-hidden="true" /></div>
                <div>
                  <div className="tip-label">Daily tip</div>
                  <div className="tip-text">Hydrate your body — stay energised</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE STRIP */}
        <div className="vh-container">
          <div className="feat-strip">
            <div className="feat">
              <div className="feat-icon fi-g"><i className="ti ti-robot" style={{ fontSize: 22 }} aria-hidden="true" /></div>
              <div className="feat-label">Vita AI</div>
              <div className="feat-desc">Ask anything about your health — cited answers, no hallucinations.</div>
              <div className="feat-link">Chat now <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
            <div className="feat">
              <div className="feat-icon fi-a"><i className="ti ti-microphone" style={{ fontSize: 22 }} aria-hidden="true" /></div>
              <div className="live-dot">Live</div>
              <div className="feat-label">Podcast</div>
              <div className="feat-desc">Deep conversations with doctors, scientists & founders.</div>
              <div className="feat-link">Listen now <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
            <div className="feat">
              <div className="feat-icon fi-b"><i className="ti ti-player-play" style={{ fontSize: 22 }} aria-hidden="true" /></div>
              <div className="feat-label">Videos</div>
              <div className="feat-desc">Short expert explainers, protocols and breakdowns.</div>
              <div className="feat-link">Watch now <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
            <div className="feat hl">
              <div className="feat-icon"><i className="ti ti-chart-radar" style={{ fontSize: 22 }} aria-hidden="true" /></div>
              <div className="feat-label">Vital Score Quiz</div>
              <div className="feat-desc">Monthly wellness assessment across 6 health dimensions.</div>
              <div className="feat-link">Take the test <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
          </div>
        </div>

        {/* CATEGORY ROW (TABS) */}
        <div className="vh-container">
          <div className="cat-row">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={`cat${activeTab === tab.key ? ' on' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <div className="cat-icon" style={{ background: tab.iconBg }}>
                  <i className={`ti ${tab.icon}`} style={{ fontSize: 22, color: tab.iconColor }} aria-hidden="true" />
                </div>
                <div className="cat-name">{tab.name}</div>
                <div className="cat-sub">{tab.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ARTICLES + TRENDING (TAB CONTENT) */}
        <div className="vh-container">
          <div className="main-cols">
            <div className="articles-col">
              <div className="sec-bar">
                <div className="sec-title">{content.sectionTitle}</div>
                <div className="sec-more">View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
              </div>
              <div className="art-grid">
                {content.articles.map((a, i) => (
                  <div className="acard" key={`${activeTab}-art-${i}`}>
                    <div className={`acard-img ${a.imgClass}`}>
                      <i className={`ti ${a.icon}`} style={{ fontSize: 38, color: a.iconColor }} aria-hidden="true" />
                    </div>
                    <div className={`tag-pill ${a.tagClass}`}>{a.tagLabel}</div>
                    <div className="acard-h">{a.title}</div>
                    <div className="acard-foot">
                      <div className="acard-auth">
                        <div className="auth-av">{a.authorInitials}</div>
                        {a.authorName}
                      </div>
                      <div className="acard-rt">{a.readTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar">
              <div className="sec-bar" style={{ paddingBottom: 8 }}>
                <div className="sec-title">Trending now</div>
              </div>
              {content.trending.map((t, i) => (
                <div className="trend-item" key={`${activeTab}-tr-${i}`}>
                  <div className="trend-num">{i + 1}</div>
                  <div className={`trend-img ${t.imgClass}`}>
                    <i className={`ti ${t.icon}`} style={{ fontSize: 22, color: t.iconColor }} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="trend-h">{t.title}</div>
                    <div className="trend-t">{t.readTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PODCAST */}
        <div className="vh-container">
          <div className="pod-section">
            <div className="sec-bar">
              <div className="sec-title">Podcast</div>
              <div className="sec-more">All episodes <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
            <div className="pod-row">
              {PODCASTS.map((p, i) => (
                <div className="pod-card" key={i}>
                  <div className={`pod-thumb ${p.thumbClass}`}>
                    <i className={`ti ${p.icon}`} style={{ fontSize: 26, color: p.iconColor }} aria-hidden="true" />
                  </div>
                  <div className="pod-meta">
                    <div className="pod-ep">{p.ep}</div>
                    <div className="pod-title">{p.title}</div>
                    <div className="pod-dur">
                      <i className="ti ti-clock" style={{ fontSize: 13 }} aria-hidden="true" />
                      {p.dur}
                    </div>
                  </div>
                  <div className="pod-play"><div className="play-tri" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIDEOS */}
        <div className="vh-container">
          <div className="vid-section">
            <div className="sec-bar">
              <div className="sec-title">Videos</div>
              <div className="sec-more">All videos <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
            <div className="vid-row">
              {VIDEOS.map((v, i) => (
                <div className="vid-card" key={i}>
                  <div className={`vid-thumb ${v.thumbClass}`}>
                    <i className={`ti ${v.icon}`} style={{ fontSize: 34, color: v.iconColor }} aria-hidden="true" />
                    <div className="vid-dur">{v.dur}</div>
                  </div>
                  <div className="vid-info">
                    <div className="vid-cat">{v.cat}</div>
                    <div className="vid-title">{v.title}</div>
                    <div className="vid-views">{v.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI CHAT + QUIZ */}
        <div className="vh-container">
          <div className="tools-cols">
            {/* AI CHAT */}
            <div className="ai-panel">
              <div className="ai-head">
                <div className="ai-title-row">
                  <div className="ai-orb"><i className="ti ti-robot" style={{ fontSize: 19, color: '#fff' }} aria-hidden="true" /></div>
                  <div>
                    <div className="ai-name">Vita AI</div>
                    <div className="ai-sub">Ask anything about your health</div>
                  </div>
                </div>
                <div className="ai-badge">Online</div>
              </div>
              <div className="ai-msgs" ref={aiMsgsRef}>
                {aiMessages.map((m, i) => (
                  <div className={`msg ${m.role}`} key={i}>
                    {m.text}
                    {m.cite && (
                      <div className="msg-cite">
                        <i className="ti ti-link" style={{ fontSize: 12 }} aria-hidden="true" />
                        {m.cite}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="ai-sugs">
                {AI_SUGGESTIONS.map((s) => (
                  <button
                    type="button"
                    className="ai-sug"
                    key={s}
                    onClick={() => setAiInput(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form className="ai-input-row" onSubmit={handleAiSubmit}>
                <input
                  type="text"
                  className="ai-inp"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask Vita AI anything..."
                  autoComplete="off"
                />
                <button type="submit" className="ai-send-btn">Send</button>
              </form>
            </div>

            {/* QUIZ */}
            <div className="quiz-panel">
              <div className="quiz-head">
                <div className="quiz-title-row">
                  <div className="quiz-icon-box">
                    <i className="ti ti-chart-radar" style={{ fontSize: 19, color: '#8B5CF6' }} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="quiz-name">Vital Score Quiz</div>
                    <div className="quiz-sub">Find your wellness gaps in 90 sec</div>
                  </div>
                </div>
              </div>
              <div className="quiz-prog-wrap">
                <div className="quiz-dots">
                  {Array.from({ length: totalQuestions }).map((_, i) => {
                    const step = i + 1
                    const cls = step < currentQ ? 'qd done' : step === currentQ ? 'qd on' : 'qd'
                    return <div className={cls} key={i} />
                  })}
                </div>
                <span className="q-step-lbl">Question {currentQ} of {totalQuestions}</span>
              </div>

              <div className="quiz-question active" key={currentQ}>
                <div className="quiz-q">{question.q}</div>
                <div className="quiz-opts">
                  {question.opts.map((opt) => (
                    <div
                      key={opt.value}
                      className={`qopt${currentAnswer === opt.value ? ' sel' : ''}`}
                      onClick={() => handleSelectOption(opt.value)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelectOption(opt.value)
                        }
                      }}
                    >
                      <div className="qopt-ltr">{opt.value}</div>
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="quiz-footer">
                <div className="quiz-step-txt">No sign-up required</div>
                <div className="quiz-actions">
                  {currentQ > 1 && (
                    <button type="button" className="quiz-btn quiz-prev" onClick={handlePrev}>
                      ← Previous
                    </button>
                  )}
                  <button
                    type="button"
                    className={`quiz-btn quiz-next${isLastQ ? ' quiz-submit' : ''}`}
                    onClick={handleNext}
                    disabled={!currentAnswer}
                  >
                    {isLastQ ? 'Submit ✓' : 'Next question →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VITAL SCORE + TRUTH CHECK */}
        <div className="vh-container">
          <div className="bottom-tools">
            <div className="vital-panel">
              <div className="panel-head">
                <div className="panel-title-row">
                  <div className="panel-icon pi-teal"><i className="ti ti-activity" style={{ fontSize: 19 }} aria-hidden="true" /></div>
                  <div>
                    <div className="panel-name">Your Vital Score</div>
                    <div className="panel-sub">Monthly wellness check-in across 6 dimensions</div>
                  </div>
                </div>
                <div className="panel-badge pb-teal">May 2026</div>
              </div>
              <div className="vital-content">
                <div className="ring-wrap">
                  <svg className="ring-svg" viewBox="0 0 110 110">
                    <circle className="r-bg" cx="55" cy="55" r="42.5" />
                    <circle className="r-val" cx="55" cy="55" r="42.5" />
                  </svg>
                  <div className="ring-txt">
                    <div className="ring-n">74</div>
                    <div className="ring-of">/100</div>
                  </div>
                </div>
                <div className="dims">
                  {VITAL_DIMS.map((d) => (
                    <div className="dim" key={d.label}>
                      <div className="dim-lbl">{d.label}</div>
                      <div className="dim-track">
                        <div className="dim-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                      </div>
                      <div className="dim-v">{d.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="vital-cta">Retake monthly check-in →</div>
            </div>
            <div className="truth-panel">
              <div className="panel-head">
                <div className="panel-title-row">
                  <div className="panel-icon pi-coral"><i className="ti ti-microscope" style={{ fontSize: 19 }} aria-hidden="true" /></div>
                  <div>
                    <div className="panel-name">Truth Check</div>
                    <div className="panel-sub">We fact-check 5 viral health claims each week</div>
                  </div>
                </div>
                <div className="panel-badge pb-coral">This week</div>
              </div>
              <div className="claims">
                {CLAIMS.map((c, i) => (
                  <div className={`claim ${c.type}`} key={i}>
                    <div className={`verdict v-${c.type}`}>{c.verdict}</div>
                    <div className="claim-txt">{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EXPERTS */}
        <div className="vh-container">
          <div className="experts-section">
            <div className="sec-bar">
              <div className="sec-title">Insights from health experts</div>
              <div className="sec-more">View all experts <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
            </div>
            <div className="experts-row">
              {EXPERTS.map((e) => (
                <div className="expert-card" key={e.initials + e.name}>
                  <div className="exp-ava" style={{ background: e.bg, color: e.color }}>{e.initials}</div>
                  <div className="exp-name">{e.name}</div>
                  <div className="exp-role">{e.role}</div>
                  <div className="exp-article">{e.article}</div>
                  <div className="exp-link">View profile <i className="ti ti-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INDIA BAND */}
        <div className="vh-container">
          <div className="india-band">
            {INDIA_CARDS.map((c, i) => (
              <React.Fragment key={i}>
                <div className="india-card">
                  <div className="i-tag">{c.tag}</div>
                  <div className="i-h">{c.h}</div>
                  <div className="i-body">{c.body}</div>
                  <div className="i-link">{c.link}</div>
                </div>
                {i < INDIA_CARDS.length - 1 && <div className="idiv" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="nl-main">         
          <div className="nl-band">
          <div className='vh-container'>
            <div className="nl-l">
              <div className="nl-eyebrow">Every Tuesday morning</div>
              <div className="nl-h">
                Get weekly health insights<br />
                that <span>actually matter</span>
              </div>
              <div className="nl-sub">
                Expert tips, easy habits and the latest health updates — delivered to your inbox.
                No spam, ever.
              </div>
            </div>
            <div className="nl-r">
              <form className="nl-form" onSubmit={handleNlSubmit}>
                <input
                  type="email"
                  className="nl-inp"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  disabled={nlSubmitted}
                  required
                />
                <button
                  type="submit"
                  className={`nl-btn${nlSubmitted ? ' subscribed' : ''}`}
                >
                  {nlSubmitted ? 'Subscribed ✓' : 'Subscribe'}
                </button>
              </form>
              <div className="nl-trust">
                <div className="nl-trust-item">No spam, ever</div>
                <div className="nl-trust-item">Unsubscribe anytime</div>
                <div className="nl-trust-item">Free Starter Guide</div>
              </div>
            </div>
          </div>
          </div>
        </div>

      </div>
    </div>
  )
}
