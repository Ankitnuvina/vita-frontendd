import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

export function AdminSettingsPage(): React.ReactNode {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async (): Promise<void> => {
    await logout()
    navigate('/')
  }

  return (
    <div className="max-w-[600px]">
      <h2 className="font-serif text-xl font-black text-ink mb-1">Settings</h2>
      <p className="text-xs text-ink-3 mb-6">Account and session details for the current admin.</p>

      <div className="bg-white border border-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-ink mb-4">Current Session</h3>
        <dl className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <dt className="text-xs font-semibold text-ink-3 uppercase tracking-[0.06em]">User ID</dt>
          <dd className="font-mono text-ink-2">{user?.userId ?? '—'}</dd>
          <dt className="text-xs font-semibold text-ink-3 uppercase tracking-[0.06em]">Role</dt>
          <dd>
            <span className="text-[10px] uppercase tracking-[0.08em] font-bold text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              {user?.role ?? '—'}
            </span>
          </dd>
        </dl>

        <div className="border-t border-border mt-6 pt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors rounded-full px-4 py-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
