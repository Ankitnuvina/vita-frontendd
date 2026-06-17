import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { Eye, EyeOff, Mail, CheckCircle, User, X, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
}

type Mode = 'signin' | 'signup'

function LoginDialogContent({ onClose }: { onClose: () => void }): React.ReactNode {
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<Mode>('signin')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [showResend, setShowResend] = useState(false)

  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const resendVerification = useAuthStore((s) => s.resendVerification)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const successMessage = useAuthStore((s) => s.successMessage)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearError = useAuthStore((s) => s.clearError)
  const clearSuccess = useAuthStore((s) => s.clearSuccess)

  useEffect(() => {
    clearError()
    clearSuccess()
  }, [clearError, clearSuccess])

  useEffect(() => {
    if (isAuthenticated) onClose()
  }, [isAuthenticated, onClose])

  // EMAIL_NOT_VERIFIED error aane par resend option dikhao
  useEffect(() => {
    if (error?.toLowerCase().includes('verify your email')) {
      setShowResend(true)
      setResendEmail(email)
    } else {
      setShowResend(false)
    }
  }, [error, email])

  const switchMode = (next: Mode): void => {
    if (next === mode) return
    clearError()
    clearSuccess()
    setUsername('')
    setEmail('')
    setPassword('')
    setShowResend(false)
    setMode(next)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (mode === 'signin') {
      await login(email, password)
    } else {
      await register(username, email, password)
    }
  }

  const handleResend = async (): Promise<void> => {
    if (!resendEmail) return
    await resendVerification(resendEmail)
    setShowResend(false)
  }

  const isSignup = mode === 'signup'

  // Registration success — show check email screen
  if (successMessage && isSignup) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[380px] text-center">
          <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-500" />
          </div>
          <h2 className="font-serif text-xl font-black text-ink mb-2">Check your inbox</h2>
          <p className="text-sm text-gray-500 mb-2">{successMessage}</p>
          <p className="text-xs text-gray-400 mb-6">
            Didn't receive it?{' '}
            <button
              type="button"
              onClick={() => void resendVerification(email)}
              className="text-green-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
            >
              Resend email
            </button>
          </p>
          <button
            type="button"
            onClick={() => { clearSuccess(); switchMode('signin') }}
            className="w-full bg-green-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-green-600 transition-colors border-none cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  const submitLabel = isLoading
    ? isSignup ? 'Creating account…' : 'Signing in…'
    : isSignup ? 'Create account' : 'Sign In'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-[#ebf7f1] rounded-2xl shadow-2xl p-8 w-[500px] relative">
        <button
          onClick={onClose}
          aria-label="Close sign-in dialog"
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper flex items-center justify-center text-ink-3 hover:bg-green-100 transition-colors border-none cursor-pointer"
        >
          <X className='text-black/60 h-4 w-4  hover:text-black ' />
        </button>

        <div className="text-center mb-5">
          <div>
            <Link
              to="/"
              className="flex items-center justify-center mb-2 gap-2 shrink-0"
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
          </div>
          <h2 id="login-title" className="font-serif text-xl font-normal text-ink">
            {isSignup ? 'Create your account' : 'Sign in to Vitalize'}
          </h2>

        </div>

        <div role="tablist" className="grid grid-cols-2 bg-paper rounded-xl p-1 mb-5 login_tabs_main">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              type="button"
              onClick={() => switchMode(m)}
              className={`text-sm font-semibold py-3 rounded-lg transition-colors border-none cursor-pointer ${mode === m
                ? 'bg-[#1e6e3a] text-white shadow-sm active'
                : 'bg-transparent text-ink-3 hover:text-ink-2 '
                }`}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} noValidate>

          {/* Username — only signup */}
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="login-user" className="flex gap-2 text-xs font-semibold text-ink-2 mb-1.5">
                <User className='w-4 h-4 text-[#22C55E]' />
                Username
              </label>
              <input
                id="login-user"
                type="text"
                value={username}
                onChange={(e) => { clearError(); setUsername(e.target.value) }}
                required
                autoComplete="username"
                placeholder="Enter your username..."
                className="w-full bg-white border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="login-email" className="flex gap-2 text-xs font-semibold text-ink-2 mb-1.5">
              <Mail className="w-4 h-4 text-[#22C55E]" />
              Email
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => { clearError(); setEmail(e.target.value) }}
                required
                autoComplete="email"
                placeholder="Enter your email..."
                className="w-full bg-white border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">

            <label htmlFor="login-pass" className="flex gap-2 text-xs font-semibold text-ink-2 mb-1.5">
              <LockKeyhole className="w-4 h-4 text-[#22C55E]" />
              Password
            </label>
            <div className="relative">
              <input
                id="login-pass"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { clearError(); setPassword(e.target.value) }}
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                placeholder="Enter your password..."
                minLength={isSignup ? 8 : undefined}
                className="w-full bg-white border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              ⚠️ {error}
              {showResend && (
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  className="block mt-1.5 text-green-600 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
                >
                  Resend verification email →
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password || (isSignup && !username)}
            className="w-full mt-6 py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#86EFAC] via-[#4ADE80] to-[#22C55E] shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {submitLabel}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-3">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('signin')} className="text-[#22C55E] font-semibold hover:underline no-underline">
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button type="button" onClick={() => switchMode('signup')} className="text-[#22C55E] font-semibold hover:underline no-underline">
                Create an account
              </button>
              <div className="text-center mt-5">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#22C55E] font-medium hover:underline no-underline"
                >
                  Forget Password ?
                </Link>
              </div>
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