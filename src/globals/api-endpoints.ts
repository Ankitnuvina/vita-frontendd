export const API_ENDPOINTS = {
  CHAT: '/chat',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    ADMIN_LOGIN: '/api/auth/admin/login',
    ADMIN_REGISTER: '/api/auth/admin/register',
  },
  CONTENT: {
    ARTICLES: '/api/articles',
    PODCASTS: '/api/podcasts',
    EXPERTS: '/api/experts',
    TIPS: '/api/tips',
    PLANS: '/api/plans',
    USER_STATS: '/api/user/stats',
    FEATURE_FLAGS: '/api/config/features',
  },
  ADMIN: {
    ARTICLES: '/api/admin/articles',
    PODCASTS: '/api/admin/podcasts',
    EXPERTS: '/api/admin/experts',
    TIPS: '/api/admin/tips',
    STATS: '/api/admin/stats',
  },
} as const
