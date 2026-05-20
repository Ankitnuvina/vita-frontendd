import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { UserLayout } from '@/components/layout/UserLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { AdminRoute } from '@/router/AdminRoute'

const HomePage = lazy(() =>
  import('@/features/articles/components/HomePage').then((m) => ({ default: m.HomePage }))
)
const ArticlesPage = lazy(() =>
  import('@/features/articles/components/ArticlesPage').then((m) => ({ default: m.ArticlesPage }))
)
const BlogsPage = lazy(() =>
  import('@/features/blogs/components/BlogsPage').then((m) => ({ default: m.BlogsPage }))
)
const BlogDetailPage = lazy(() =>
  import('@/features/blogs/components/BlogDetailPage').then((m) => ({ default: m.BlogDetailPage }))
)
const PodcastsPage = lazy(() =>
  import('@/features/podcasts/components/PodcastsPage').then((m) => ({ default: m.PodcastsPage }))
)
const VideosPage = lazy(() =>
  import('@/features/videos/components/VideosPage').then((m) => ({ default: m.VideosPage }))
)
const ExpertDetailPageWithArticles = lazy(() =>
  import('@/features/experts/components/ExpertDetailPageWithArticles').then((m) => ({
    default: m.ExpertDetailPageWithArticles,
  }))
)
const AiPage = lazy(() =>
  import('@/features/ai/components/AiPage').then((m) => ({ default: m.AiPage }))
)
const DashboardPage = lazy(() =>
  import('@/features/dashboard/components/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const SubscriptionPage = lazy(() =>
  import('@/features/subscription/components/SubscriptionPage').then((m) => ({
    default: m.SubscriptionPage,
  }))
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const MindPage = lazy(() =>
  import('@/features/mind/components/MindPage').then((m) => ({
    default: m.MindPage,
  }))
)

const ExpertDetailPage = lazy(() =>
  import('@/features/experts/components/ExpertDetailPage').then((m) => ({
    default: m.ExpertDetailPage,
  }))
)

const BodyPage = lazy(() =>
  import('@/features/body/components/BodyPage').then((m) => ({
    default: m.BodyPage,
  }))
)

const NutritionPage = lazy(() =>
  import('@/features/nutrition/components/NutritionPage').then((m) => ({
    default: m.NutritionPage,
  }))
)

const SleepPage = lazy(() =>
  import('@/features/sleep/components/SleepPage').then((m) => ({
    default: m.SleepPage,
  }))
)
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const NotFoundPage = lazy(() =>
  import('@/features/notfound/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const AdminLoginPage = lazy(() =>
  import('@/features/auth/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
)
const AdminRegisterPage = lazy(() =>
  import('@/features/auth/pages/AdminRegisterPage').then((m) => ({
    default: m.AdminRegisterPage,
  }))
)

const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  }))
)
const AdminArticlesPage = lazy(() =>
  import('@/features/admin/pages/AdminArticlesPage').then((m) => ({
    default: m.AdminArticlesPage,
  }))
)
const AdminPodcastsPage = lazy(() =>
  import('@/features/admin/pages/AdminPodcastsPage').then((m) => ({
    default: m.AdminPodcastsPage,
  }))
)
const AdminExpertsPage = lazy(() =>
  import('@/features/admin/pages/AdminExpertsPage').then((m) => ({ default: m.AdminExpertsPage }))
)
const AdminTipsPage = lazy(() =>
  import('@/features/admin/pages/AdminTipsPage').then((m) => ({ default: m.AdminTipsPage }))
)
const AdminSettingsPage = lazy(() =>
  import('@/features/admin/pages/AdminSettingsPage').then((m) => ({
    default: m.AdminSettingsPage,
  }))
)

function withSuspense(node: React.ReactNode): React.ReactNode {
  return <Suspense fallback={<PageSkeleton />}>{node}</Suspense>
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'articles', element: withSuspense(<ArticlesPage />) },
      { path: 'blogs', element: withSuspense(<BlogsPage />) },
      { path: 'blogs/:id', element: withSuspense(<BlogDetailPage />) },
      { path: 'podcasts', element: withSuspense(<PodcastsPage />) },
      { path: 'videos', element: withSuspense(<VideosPage />) },
      { path: 'experts/:expertId', element: withSuspense(<ExpertDetailPageWithArticles />) },
      { path: 'ai', element: withSuspense(<AiPage />) },
      { path: 'subscription', element: withSuspense(<SubscriptionPage />) },

      { path: 'mind', element: withSuspense(<MindPage />) },
      { path: 'experts', element: withSuspense(<ExpertDetailPage />) },
      { path: 'body', element: withSuspense(<BodyPage />) },
      { path: 'nutrition', element: withSuspense(<NutritionPage />) },
      { path: 'sleep', element: withSuspense(<SleepPage />) },
      {
        element: <ProtectedRoute />,
        children: [{ path: 'dashboard', element: withSuspense(<DashboardPage />) }],
      },
    ],
  },
  {
    path: '/admin/login',
    element: withSuspense(<AdminLoginPage />),
  },
  {
    path: '/admin/register',
    element: withSuspense(<AdminRegisterPage />),
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: withSuspense(<AdminDashboardPage />) },
          { path: 'articles', element: withSuspense(<AdminArticlesPage />) },
          { path: 'podcasts', element: withSuspense(<AdminPodcastsPage />) },
          { path: 'experts', element: withSuspense(<AdminExpertsPage />) },
          { path: 'tips', element: withSuspense(<AdminTipsPage />) },
          { path: 'settings', element: withSuspense(<AdminSettingsPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]

export const router = createBrowserRouter(routes)
