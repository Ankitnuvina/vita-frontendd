import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useUserStats } from '@/features/dashboard/hooks/useUserStats'
import { UserRole } from '@/globals/enums'
import { LoginDialog } from '@/features/auth/components/LoginDialog'
import { User, UserStar } from 'lucide-react'
import { useUserProfile } from '@/features/users/hook/useUserProfile'
import { UserAvatarDropdown } from '@/features/users/components/UserAvatarDropdown'
import { AccountSettingsModal } from '@/features/users/components/AccountSettingsModal'

const NAV_LINKS: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/articles', label: 'Articles' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/podcasts', label: 'Podcasts' },
  { to: '/videos', label: 'Videos' },
  { to: '/ai', label: 'AI' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/subscription', label: 'Subscription' },
  { to: '/mind', label: 'Mind' },
  { to: '/body', label: 'Body' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/sleep', label: 'Sleep' },
  { to: '/experts', label: 'Experts' },
]

export function Navbar(): React.ReactNode {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { data: stats } = useUserStats({ enabled: isAuthenticated })
  const streakCount = stats?.streakCount ?? 0

  const { profile, updateProfile, uploadAvatar, deleteAccount } =
    useUserProfile(isAuthenticated)

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


  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`bg-white transition-all duration-300 ${isScrolled
          ? "sticky top-0 z-[99] navbar-scroll-animation shadow-md"
          : ""
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="px-4 flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="Vitalize Health — go to home"
          >
            <div className="flex items-center rounded-xl px-2 py-1 transition-all duration-300">
              <img
                src="/vitalizeLogo/logo.svg"
                alt="Vitalize Logo"
                className="h-8 cursor-pointer w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>

          <div
            className="hidden lg:flex gap-0.5 flex-nowrap items-center flex-1 justify-center"
            role="menubar"
          >
            {NAV_LINKS.map((link) =>
              link.label === 'AI' ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs xl:text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap transition-colors duration-200 text-ink-3 hover:text-green-600 hover:bg-green-50"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  role="menuitem"
                  className={({ isActive }) =>
                    `text-xs xl:text-sm px-3 py-1 whitespace-nowrap transition-all duration-200 ${isActive
                      ? 'text-green-600 font-bold underline decoration-2 underline-offset-4'
                      : 'text-ink-3 font-medium hover:rounded-full hover:text-[#1E6E3A]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex gap-2 items-center shrink-0">
            {user?.role === UserRole.ADMIN && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:shadow-sm"
              >
                <UserStar size={14} strokeWidth={2.2} />
                Admin
              </Link>
            )}

            {isAuthenticated && profile ? (
              <UserAvatarDropdown
                profile={profile}
                onSettingsClick={() => setSettingsOpen(true)}
                onLogout={() => void handleLogout()}
              />
            ) : isAuthenticated && !profile ? (
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
                className="group flex items-center rounded-full bg-[#1e6e3a] text-white p-0 pr-[15px] gap-2 border border-black transition-all duration-300"
              >
                <div className="flex items-center justify-center rounded-full border-[3px] border-white scale-[1.2] bg-white">
                  <User className="w-[30px] h-[30px] border-2 border-[#1e6e3a] rounded-[50px] p-[5px] text-black" />
                </div>
                <span className="text-sm font-medium tracking-wider">Login</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
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
                  className={`absolute left-0 right-0 h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                    }`}
                />
                <span
                  className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-current rounded transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                <span
                  className={`absolute left-0 right-0 h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-0'
                    }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden border-t border-border bg-white transition-[max-height,opacity] duration-300 ease-out ${mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="vh-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.label === 'AI' ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium px-3 py-2.5 rounded-lg transition-colors text-ink-2 hover:text-green-600 hover:bg-green-50"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${isActive
                      ? 'text-green-700 font-semibold bg-green-100'
                      : 'text-ink-2 hover:text-green-600 hover:bg-green-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            )}


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

              {isAuthenticated && profile && (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); setSettingsOpen(true) }}
                  className="vh-btn vh-btn-ghost text-sm w-full"
                >
                  Account Settings
                </button>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); void handleLogout() }}
                  className="vh-btn vh-btn-ghost text-sm w-full"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); setLoginOpen(true) }}
                  className="vh-btn vh-btn-ghost text-sm w-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />

      {settingsOpen && profile && (
        <AccountSettingsModal
          profile={profile}
          onClose={() => setSettingsOpen(false)}
          onUpdate={updateProfile}
          onAvatarUpload={uploadAvatar}
          onDelete={deleteAccount}
          onLogout={() => void handleLogout()}
        />
      )}
    </>
  )
}