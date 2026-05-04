import React from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ADMIN_NAV } from '@/globals/constants'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

function currentPageTitle(pathname: string): string {
  const item = ADMIN_NAV.find((n) =>
    n.end ? pathname === n.path : pathname.startsWith(n.path)
  )
  return item?.label ?? 'Admin'
}

export function AdminLayout(): React.ReactNode {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async (): Promise<void> => {
    await logout()
    navigate('/')
  }

  return (
    <div className="fixed inset-0 flex bg-paper">
      <aside className="bg-ink text-white w-[200px] shrink-0 flex flex-col py-5">
        <div className="px-5 mb-6">
          <Link to="/" className="block">
            <p className="font-serif text-base font-black text-white">
              Vita<span className="text-green-400">lize</span>
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">Admin CMS</p>
          </Link>
        </div>

        <nav aria-label="Admin navigation" className="flex flex-col gap-0.5 px-2 flex-1">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left border-none cursor-pointer ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : 'text-white/50 hover:bg-white/[0.07] hover:text-white/80'
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pt-4 border-t border-white/[0.07] flex flex-col gap-2 text-white/65">
          <div className="bg-white/[0.05] rounded-xl px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.1em] text-white/40">Signed in</p>
            <p className="text-xs font-semibold text-white truncate">{user?.userId ?? 'unknown'}</p>
            <span className="inline-block mt-1 text-[9px] uppercase tracking-[0.08em] font-bold text-green-300 bg-green-400/10 border border-green-400/30 rounded-full px-2 py-0.5">
              {user?.role ?? 'guest'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/55 hover:bg-white/[0.07] hover:text-white transition-all border-none cursor-pointer"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="bg-white border-b border-border px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-sm font-bold text-ink">{currentPageTitle(location.pathname)}</h1>
          <Link
            to="/"
            className="text-xs font-semibold text-ink-3 border border-border rounded-full px-3.5 py-1.5 hover:border-ink-3 transition-colors"
          >
            ✕ Exit Admin
          </Link>
        </div>

        <div className="p-6 flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
