import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/globals/enums'

export function AdminRegisterPage(): React.ReactNode {
  const adminRegister = useAuthStore((s) => s.adminRegister)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearError = useAuthStore((s) => s.clearError)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    clearError()
  }, [clearError])

  if (isAuthenticated && user?.role === UserRole.ADMIN) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLocalError(null)
    if (password !== confirm) {
      setLocalError('Passwords do not match')
      return
    }
    const result = await adminRegister(username, password, inviteCode)
    if (result?.role === UserRole.ADMIN) {
      navigate('/admin', { replace: true })
    }
  }

  const visibleError = localError ?? error

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-ink-3 hover:text-ink-2 mb-6 no-underline"
        >
          <span aria-hidden="true">←</span> Back to Vitalize
        </Link>

        <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-ink/5 border border-border rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
              🛡️
            </div>
            <h1 className="font-serif text-2xl font-black text-ink">Create Admin Account</h1>
            <p className="text-xs text-ink-4 mt-1">
              Requires the operator-issued invite code
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} noValidate>
            <div className="mb-3">
              <label
                htmlFor="ar-user"
                className="block text-xs font-semibold text-ink-2 mb-1.5"
              >
                Username
              </label>
              <input
                id="ar-user"
                type="text"
                value={username}
                onChange={(e) => {
                  clearError()
                  setLocalError(null)
                  setUsername(e.target.value)
                }}
                required
                minLength={3}
                maxLength={32}
                autoComplete="username"
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink transition-colors"
              />
              <p className="text-[11px] text-ink-4 mt-1">
                3–32 chars · letters, numbers, _.-
              </p>
            </div>

            <div className="mb-3">
              <label
                htmlFor="ar-pass"
                className="block text-xs font-semibold text-ink-2 mb-1.5"
              >
                Password
              </label>
              <input
                id="ar-pass"
                type="password"
                value={password}
                onChange={(e) => {
                  clearError()
                  setLocalError(null)
                  setPassword(e.target.value)
                }}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink transition-colors"
              />
              <p className="text-[11px] text-ink-4 mt-1">Minimum 8 characters</p>
            </div>

            <div className="mb-3">
              <label
                htmlFor="ar-confirm"
                className="block text-xs font-semibold text-ink-2 mb-1.5"
              >
                Confirm password
              </label>
              <input
                id="ar-confirm"
                type="password"
                value={confirm}
                onChange={(e) => {
                  setLocalError(null)
                  setConfirm(e.target.value)
                }}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink transition-colors"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="ar-invite"
                className="block text-xs font-semibold text-ink-2 mb-1.5"
              >
                Admin invite code
              </label>
              <input
                id="ar-invite"
                type="password"
                value={inviteCode}
                onChange={(e) => {
                  clearError()
                  setLocalError(null)
                  setInviteCode(e.target.value)
                }}
                required
                autoComplete="off"
                placeholder="Provided by your operator"
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink transition-colors font-mono"
              />
            </div>

            {visibleError && (
              <div
                role="alert"
                className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
              >
                ⚠️ {visibleError}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading || !username || !password || !confirm || !inviteCode
              }
              className="w-full bg-ink text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-ink-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {isLoading ? 'Creating admin…' : 'Create Admin Account'}
            </button>
          </form>

          <p className="text-[11px] text-ink-4 text-center mt-5">
            Already have admin credentials?{' '}
            <Link
              to="/admin/login"
              className="text-ink-2 font-semibold hover:text-ink underline-offset-2 hover:underline no-underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-[10px] text-ink-4 text-center mt-4 uppercase tracking-[0.08em]">
          All access is logged
        </p>
      </div>
    </div>
  )
}
