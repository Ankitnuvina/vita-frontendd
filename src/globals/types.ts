export interface Section {
  heading: string
  items: string[]
}

export interface Article {
  id: number
  cat: string
  categoryLabel: string
  categoryColor: string
  title: string
  author: string
  date: string
  readTime: string
  imageUrl: string
  excerpt: string
  articleStatus: 'draft' | 'published' | 'scheduled'
  isPremium: boolean
  slug: string
  sections?: Section[]
  tags?: string[]
  seoTitle?: string
  seoDescription?: string

  expertId?: number
}

export interface Podcast {
  id: number
  episode: string
  category: string
  title: string
  guest: string
  duration: string
  date: string
  // imageUrl: string
  videoUrl: string
}

export interface Expert {
  id: number
  name: string
  role: string
  credentials: string
  articleCount: number
  imageUrl: string
}

export interface WellnessTip {
  id: number
  icon: string
  colors: { bg: string; border: string }
  title: string
  text: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  monthlyPrice: string
  annualPrice: string
  tagline: string
  features: string[]
  ctaLabel: string
  isPopular: boolean
}

export interface ChatMessage {
  role: 'ai' | 'user'
  content: string
  timestamp: number
}

export interface VideoItem {
  title: string
  views: string
  imageUrl: string
}

export interface NavPage {
  path: string
  label: string
}

export interface UserStats {
  streakCount: number
  articlesRead: number
  podcastsListened: number
  aiQueries: number
}

export interface AdminStats {
  articleCount: number
  podcastCount: number
  expertCount: number
  subscriberCount: number
}

export interface FeatureFlags {
  aiEnabled: boolean
  podcastsEnabled: boolean
  videosEnabled: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type { AuthUser, JwtPayload, AuthState } from './auth.types'
