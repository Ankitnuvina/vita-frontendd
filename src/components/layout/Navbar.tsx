import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useUserStats } from '@/features/dashboard/hooks/useUserStats'
import { UserRole } from '@/globals/enums'
import { LoginDialog } from '@/features/auth/components/LoginDialog'

const NAV_LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/articles', label: 'Articles' },
  { to: '/podcasts', label: 'Podcasts' },
  { to: '/videos', label: 'Videos' },
  { to: '/ai', label: 'AI' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/subscription', label: 'Subscription' },
]

export function Navbar(): React.ReactNode {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)

  const { data: stats } = useUserStats({ enabled: isAuthenticated })
  const streakCount = stats?.streakCount ?? 0

  const handleLogout = async (): Promise<void> => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <nav
        className="bg-[rgba(250,250,248,0.97)] border-b border-border shadow-[0_1px_4px_rgba(19,25,23,0.06)] sticky top-0 z-[99]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-[58px] max-w-[1100px] mx-auto px-5 gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer bg-none border-none"
            aria-label="Vitalize Health — go to home"
          >
            <div className="w-[30px] h-[30px] bg-green-500 rounded-lg flex items-center justify-center text-white text-[15px] shrink-0">
              🌿
            </div>
            <span className="font-serif text-[19px] font-bold text-ink tracking-tight">
              Vita<span className="text-green-500">lize</span>
            </span>
          </Link>

          <div className="flex gap-0.5 flex-nowrap overflow-x-auto" role="menubar">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                role="menuitem"
                className={({ isActive }) =>
                  `text-xs font-medium px-2.5 py-1.5 rounded-lg border-none transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-green-600 font-bold bg-green-50'
                      : 'text-ink-3 bg-none hover:text-green-600 hover:bg-green-50/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex gap-2 items-center shrink-0">
            {isAuthenticated && streakCount > 0 && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 bg-tan-50 border border-tan-100 rounded-full px-3 py-1.5 text-xs font-semibold text-tan-600 hover:bg-tan-100 transition-colors"
                aria-label={`${streakCount}-day streak`}
              >
                🔥 {streakCount} days
              </Link>
            )}

            {user?.role === UserRole.ADMIN && (
              <Link
                to="/admin"
                className="text-xs font-semibold text-ink-2 border-[1.5px] border-border-2 rounded-full px-3.5 py-1.5 bg-none hover:border-ink-3 transition-colors"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="text-xs font-semibold text-ink-2 border-[1.5px] border-border-2 rounded-full px-3.5 py-1.5 bg-none hover:border-ink-3 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="text-xs font-semibold text-ink-2 border-[1.5px] border-border-2 rounded-full px-3.5 py-1.5 bg-none hover:border-ink-3 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Link
              to="/subscription"
              className="text-xs font-semibold text-white bg-green-500 rounded-full px-4 py-1.5 border-none hover:bg-green-600 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
