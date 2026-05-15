import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useUserStats } from '@/features/dashboard/hooks/useUserStats'
import { UserRole } from '@/globals/enums'
import { LoginDialog } from '@/features/auth/components/LoginDialog'

const NAV_LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/articles', label: 'Articles' },
  { to: '/blogs', label: 'Blogs' },
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: stats } = useUserStats({ enabled: isAuthenticated })
  const streakCount = stats?.streakCount ?? 0

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [mobileOpen])

  const handleLogout = async (): Promise<void> => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <nav
        className="bg-paper/95 backdrop-blur-md border-b border-border shadow-soft sticky top-0 z-[99]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="vh-container flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="Vitalize Health — go to home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-500 rounded-xl flex items-center justify-center text-white text-base shrink-0 shadow-soft">
              🌿
            </div>
            <span className="font-serif text-lg sm:text-xl font-bold text-ink tracking-tight">
              Vita<span className="text-green-500">lize</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            className="hidden lg:flex gap-0.5 flex-nowrap items-center flex-1 justify-center"
            role="menubar"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                role="menuitem"
                className={({ isActive }) =>
                  `text-xs xl:text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-green-700 font-semibold bg-green-100'
                      : 'text-ink-3 hover:text-green-600 hover:bg-green-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right cluster (desktop) */}
          <div className="hidden lg:flex gap-2 items-center shrink-0">
            {isAuthenticated && streakCount > 0 && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 bg-tan-50 border border-tan-100 rounded-full px-3 py-1.5 text-xs font-semibold text-tan-600 hover:bg-tan-100 transition-colors"
                aria-label={`${streakCount}-day streak`}
              >
                🔥 {streakCount}d
              </Link>
            )}

            {user?.role === UserRole.ADMIN && (
              <Link
                to="/admin"
                className="vh-btn vh-btn-ghost text-xs"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="vh-btn vh-btn-ghost text-xs"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="vh-btn vh-btn-ghost text-xs"
              >
                Sign In
              </button>
            )}

            <Link to="/subscription" className="vh-btn vh-btn-primary text-xs">
              Get Started
            </Link>
          </div>

          {/* Mobile right side: streak + hamburger */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {isAuthenticated && streakCount > 0 && (
              <Link
                to="/dashboard"
                className="flex items-center gap-1 bg-tan-50 border border-tan-100 rounded-full px-2.5 py-1 text-[11px] font-semibold text-tan-600"
                aria-label={`${streakCount}-day streak`}
              >
                🔥 {streakCount}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-white text-ink-2 hover:bg-green-50 hover:border-green-200 transition-colors"
            >
              <span className="relative w-5 h-4 inline-block">
                <span
                  className={`absolute left-0 right-0 h-0.5 bg-current rounded transition-all duration-300 ${
                    mobileOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-current rounded transition-opacity duration-200 ${
                    mobileOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-0.5 bg-current rounded transition-all duration-300 ${
                    mobileOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden border-t border-border bg-white transition-[max-height,opacity] duration-300 ease-out ${
            mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="vh-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-green-700 font-semibold bg-green-100'
                      : 'text-ink-2 hover:text-green-600 hover:bg-green-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="h-px bg-border my-3" />

            <div className="flex flex-col gap-2">
              {user?.role === UserRole.ADMIN && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="vh-btn vh-btn-ghost text-sm w-full"
                >
                  Admin Panel
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    void handleLogout()
                  }}
                  className="vh-btn vh-btn-ghost text-sm w-full"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setLoginOpen(true)
                  }}
                  className="vh-btn vh-btn-ghost text-sm w-full"
                >
                  Sign In
                </button>
              )}

              <Link
                to="/subscription"
                onClick={() => setMobileOpen(false)}
                className="vh-btn vh-btn-primary text-sm w-full"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
