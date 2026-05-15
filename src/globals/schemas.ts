import { z } from 'zod'
import { UserRole } from '@/globals/enums'

export const authUserSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(UserRole),
})

export const articleSchema = z.object({
  id: z.number(),
  cat: z.string(),
  categoryLabel: z.string(),
  categoryColor: z.string(),
  title: z.string(),
  author: z.string(),
  date: z.string(),
  readTime: z.string(),
  imageUrl: z.string(),
  excerpt: z.string(),
  articleStatus: z.enum(['draft', 'published', 'scheduled',]), isPremium: z.boolean(), slug: z.string(),
  sections: z.array(z.object({ heading: z.string(), items: z.array(z.string()), })).optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const podcastSchema = z.object({
  id: z.number(),
  episode: z.string(),
  category: z.string(),
  title: z.string(),
  guest: z.string(),
  duration: z.string(),
  date: z.string(),
  videoUrl: z.string(),
})

export const expertSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  credentials: z.string(),
  articleCount: z.number(),
  imageUrl: z.string(),
})

export const wellnessTipSchema = z.object({
  id: z.number(),
  icon: z.string(),
  colors: z.object({ bg: z.string(), border: z.string() }),
  title: z.string(),
  text: z.string(),
})

export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  monthlyPrice: z.string(),
  annualPrice: z.string(),
  tagline: z.string(),
  features: z.array(z.string()),
  ctaLabel: z.string(),
  isPopular: z.boolean(),
})

export const userStatsSchema = z.object({
  streakCount: z.number(),
  articlesRead: z.number(),
  podcastsListened: z.number(),
  aiQueries: z.number(),
})

export const adminStatsSchema = z.object({
  articleCount: z.number(),
  podcastCount: z.number(),
  expertCount: z.number(),
  subscriberCount: z.number(),
})

export const featureFlagsSchema = z.object({
  aiEnabled: z.boolean(),
  podcastsEnabled: z.boolean(),
  videosEnabled: z.boolean(),
})

export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  })
}
