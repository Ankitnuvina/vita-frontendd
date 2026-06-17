export const API_ENDPOINTS = {
  CHAT: '/chat',
  CHAT_HISTORY: '/chat/history',
  CHAT_RENAME: (sessionId: string) => `/chat/${sessionId}/rename`,
  CHAT_DELETE: (sessionId: string) => `/chat/${sessionId}`,
  CHAT_PIN: (sessionId: string) => `/chat/${sessionId}/pin`,

  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    ADMIN_LOGIN: '/api/auth/admin/login',
    ADMIN_REGISTER: '/api/auth/admin/register',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
  },

   USER: {                                                   // ADD
    PROFILE: '/api/user/profile',
    AVATAR: '/api/user/avatar',
    DELETE: '/api/user/account', 
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
