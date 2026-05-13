export const APP_NAME = 'Vitalize Health'
export const APP_TAGLINE = 'Science-backed health wisdom for modern life'

export const NAV_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/articles', label: 'Articles' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/podcasts', label: 'Podcasts' },
  { path: '/videos', label: 'Videos' },
  { path: '/ai', label: 'AI' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/subscription', label: 'Subscription' },
] as const

export interface AdminNavItem {
  path: string
  label: string
  icon: string
  end?: boolean
}

export const ADMIN_NAV: readonly AdminNavItem[] = [
  { path: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { path: '/admin/articles', label: 'Articles', icon: '📝' },
  { path: '/admin/podcasts', label: 'Podcasts', icon: '🎧' },
  { path: '/admin/experts', label: 'Experts', icon: '👩‍⚕️' },
  { path: '/admin/tips', label: 'Tips', icon: '💡' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export const ARTICLE_CATEGORIES = [
  'All',
  'Mental Health',
  'Nutrition',
  'Fitness',
  'Mindfulness',
  'Longevity',
  'Biohacking',
] as const

export const AI_DISCLAIMER =
  '⚠️ For informational purposes only. Not a substitute for medical advice.'

export const AI_SYSTEM_PROMPT =
  'You are Vita, an expert AI wellness guide for Vitalize Health magazine. Give concise, evidence-based health advice on sleep, stress, nutrition, fitness, and mindfulness. Keep replies under 150 words. Always end with: Warning: General wellness info only - not medical advice.'

export const STREAK_FALLBACK = 0
