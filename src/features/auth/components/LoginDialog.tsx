import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Eye, EyeOff } from "lucide-react";


interface LoginDialogProps {
  open: boolean
  onClose: () => void
}

type Mode = 'signin' | 'signup'

function LoginDialogContent({ onClose }: { onClose: () => void }): React.ReactNode {

  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearError = useAuthStore((s) => s.clearError)

  const [mode, setMode] = useState<Mode>('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    if (isAuthenticated) onClose()
  }, [isAuthenticated, onClose])

  const switchMode = (next: Mode): void => {
    if (next === mode) return
    clearError()
    setUsername('')
    setPassword('')
    setMode(next)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (mode === 'signin') {
      await login(username, password)
    } else {
      await register(username, password)
    }
  }

  const isSignup = mode === 'signup'
  const submitLabel = isLoading
    ? isSignup
      ? 'Creating account…'
      : 'Signing in…'
    : isSignup
      ? 'Create account'
      : 'Sign In'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[380px] relative">
        <button
          onClick={onClose}
          aria-label="Close sign-in dialog"
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper flex items-center justify-center text-ink-3 hover:bg-border transition-colors border-none cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
            🌿
          </div>
          <h2 id="login-title" className="font-serif text-xl font-black text-ink">
            {isSignup ? 'Create your account' : 'Sign in to Vitalize'}
          </h2>
          <p className="text-xs text-ink-4 mt-1">
            {isSignup
              ? 'Free forever — read articles, listen to podcasts, get streaks.'
              : 'Access your dashboard and personalized content'}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Authentication mode"
          className="grid grid-cols-2 bg-paper rounded-xl p-1 mb-5"
        >
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              type="button"
              onClick={() => switchMode(m)}
              className={`text-xs font-semibold py-2 rounded-lg transition-colors border-none cursor-pointer ${mode === m
                  ? 'bg-[#1e6e3a] text-white shadow-sm'
                  : 'bg-transparent text-ink-3 hover:text-ink-2'
                }`}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} noValidate>
          <div className="mb-3">
            <label htmlFor="login-user" className="block text-xs font-semibold text-ink-2 mb-1.5">
              Username
            </label>
            <input
              id="login-user"
              type="text"
              value={username}
              onChange={(e) => {
                clearError()
                setUsername(e.target.value)
              }}
              required
              autoComplete={isSignup ? 'username' : 'username'}
              placeholder={isSignup ? 'pick a username' : 'username'}
              className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink outline-none focus:border-green-400 transition-colors"
            />
            {isSignup && (
              <p className="text-[11px] text-ink-4 mt-1">
                3–32 chars · letters, numbers, _.-
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="login-pass" className="block text-xs font-semibold text-ink-2 mb-1.5">
              Password
            </label>
            <div className="relative">

              <input
                id="login-pass"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  clearError()
                  setPassword(e.target.value)
                }}
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                minLength={isSignup ? 8 : undefined}
                className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink outline-none focus:border-green-400 transition-colors"
              />
              {isSignup && (
                <p className="text-[11px] text-ink-4 mt-1">Minimum 8 characters</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-6 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>


          {error && (
            <div
              role="alert"
              className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-green-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {submitLabel}
          </button>
        </form>

        <p className="text-[11px] text-ink-4 text-center mt-4">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-green-600 hover:text-green-700 font-semibold border-none bg-transparent cursor-pointer p-0"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-green-600 hover:text-green-700 font-semibold border-none bg-transparent cursor-pointer p-0"
              >
                Create an account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export function LoginDialog({ open, onClose }: LoginDialogProps): React.ReactNode {
  if (!open) return null
  return <LoginDialogContent onClose={onClose} />
}
