// import React from 'react'
// import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
// import { useAuthStore } from '@/store/auth.store'
// import { ADMIN_NAV } from '@/globals/constants'
// import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// function currentPageTitle(pathname: string): string {
//   const item = ADMIN_NAV.find((n) =>
//     n.end ? pathname === n.path : pathname.startsWith(n.path)
//   )
//   return item?.label ?? 'Admin'
// }

// export function AdminLayout(): React.ReactNode {
//   const user = useAuthStore((s) => s.user)
//   const logout = useAuthStore((s) => s.logout)
//   const navigate = useNavigate()
//   const location = useLocation()

//   const handleLogout = async (): Promise<void> => {
//     await logout()
//     navigate('/')
//   }

//   return (
//     <div className="fixed inset-0 flex bg-paper">
//       <aside className="bg-ink text-white w-[200px] shrink-0 flex flex-col py-5">
//         <div className="px-5 mb-6">
//           <Link to="/" className="block">
//             <p className="font-serif text-base font-black text-white">
//               Vita<span className="text-green-400">lize</span>
//             </p>
//             <p className="text-[10px] text-white/35 mt-0.5">Admin CMS</p>
//           </Link>
//         </div>

//         <nav aria-label="Admin navigation" className="flex flex-col gap-0.5 px-2 flex-1">
//           {ADMIN_NAV.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.end}
//               className={({ isActive }) =>
//                 `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left border-none cursor-pointer ${
//                   isActive
//                     ? 'bg-green-500 text-white'
//                     : 'text-white/50 hover:bg-white/[0.07] hover:text-white/80'
//                 }`
//               }
//             >
//               <span aria-hidden="true">{item.icon}</span>
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="px-3 pt-4 border-t border-white/[0.07] flex flex-col gap-2 text-white/65">
//           <div className="bg-white/[0.05] rounded-xl px-3 py-2">
//             <p className="text-[10px] uppercase tracking-[0.1em] text-white/40">Signed in</p>
//             <p className="text-xs font-semibold text-white truncate">{user?.userId ?? 'unknown'}</p>
//             <span className="inline-block mt-1 text-[9px] uppercase tracking-[0.08em] font-bold text-green-300 bg-green-400/10 border border-green-400/30 rounded-full px-2 py-0.5">
//               {user?.role ?? 'guest'}
//             </span>
//           </div>
//           <button
//             type="button"
//             onClick={() => void handleLogout()}
//             className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/55 hover:bg-white/[0.07] hover:text-white transition-all border-none cursor-pointer"
//           >
//             🚪 Logout
//           </button>
//         </div>
//       </aside>

//       <div className="flex-1 overflow-y-auto flex flex-col">
//         <div className="bg-white border-b border-border px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
//           <h1 className="text-sm font-bold text-ink">{currentPageTitle(location.pathname)}</h1>
//           <Link
//             to="/"
//             className="text-xs font-semibold text-ink-3 border border-border rounded-full px-3.5 py-1.5 hover:border-ink-3 transition-colors"
//           >
//             ✕ Exit Admin
//           </Link>
//         </div>

//         <div className="p-6 flex-1">
//           <ErrorBoundary>
//             <Outlet />
//           </ErrorBoundary>
//         </div>
//       </div>
//     </div>
//   )
// }





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

function getInitial(id?: string): string {
  if (!id) return 'A'
  const trimmed = id.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'A'
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
    <div className="admin-shell fixed inset-0 flex bg-paper">
      <aside
        className="text-white w-[250px] shrink-0 flex flex-col py-6"
        style={{ backgroundColor: 'rgb(25 75 43)' }}
      >
        {/* Brand */}
        <Link to="/" className="px-5 mb-8 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center text-white text-2xl shrink-0 shadow-soft">
            🌿
          </div>
          <div className="min-w-0">
            <p className="font-serif text-[20px] font-black text-white leading-none tracking-tight">
              Vita<span className="text-green-200">lize</span>
            </p>
            <p className="text-[11px] text-white/55 mt-1 tracking-wide">
              Admin CMS
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav
          aria-label="Admin navigation"
          className="flex flex-col gap-1.5 px-4 flex-1"
        >
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left border-none cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.14] text-white shadow-soft'
                    : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
                }`
              }
            >
              <i
                className={`${item.icon} text-[15px] w-5 text-center shrink-0`}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom: account card */}
        <div className="px-4 pt-4 mt-2 border-t border-white/[0.08]">
          <div
            className="relative overflow-hidden bg-white/[0.07] border border-white/[0.12] rounded-2xl p-3.5 backdrop-blur-sm"
          >
            {/* subtle gradient accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(120% 80% at 100% 0%, rgba(143, 201, 162, 0.18) 0%, transparent 60%)',
              }}
            />

            <div className="relative flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base shadow-soft"
                  style={{
                    background:
                      'linear-gradient(135deg, #AEDABC 0%, #5FA876 100%)',
                    color: '#143820',
                  }}
                >
                  {getInitial(user?.userId)}
                </div>
                {/* Online indicator */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-300"
                  style={{ boxShadow: '0 0 0 2.5px #205c35' }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/55 font-bold leading-none">
                  Signed in
                </p>
                <p className="text-[14px] font-bold text-white truncate mt-1.5 leading-tight">
                  {user?.userId ?? 'unknown'}
                </p>
              </div>
            </div>

            <div className="relative mt-3 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.12em] font-bold text-green-100 bg-green-400/15 border border-green-300/40 rounded-full px-2.5 py-1">
                {user?.role ?? 'guest'}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-white/55 font-semibold">
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-green-300"
                />
                Active
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="group mt-3 w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-[0.12em] text-white/75 border border-white/[0.15] hover:bg-white/[0.10] hover:text-white hover:border-white/30 transition-all cursor-pointer"
            aria-label="Sign out"
          >
            <i
              className="fa-solid fa-right-from-bracket text-sm transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto flex flex-col" style={{ backgroundColor: '#f3f7fb', borderColor:'#d7dfea' }}>
        <div className="border-b border-border px-6 py-3.5 flex items-center justify-between sticky top-0 z-10" style={{ backgroundColor: '#f3f7fb', borderColor:'#d7dfea' }}>
          <h1 className="text-[22px] font-bold text-ink">{currentPageTitle(location.pathname)}</h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink-3 border border-border rounded-full px-3.5 py-1.5 hover:border-ink-3 hover:text-ink transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
            Exit Admin
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
