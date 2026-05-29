import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/globals/enums'
import { Leaf, ArrowLeft, User, LockKeyhole, KeyRound, Eye, EyeOff, CheckCircle2, } from 'lucide-react'

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

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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

  const passwordsMatch =
    password.length > 0 && confirm.length > 0 && password === confirm

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-[#67E8F9]">
      {/* =====================================================
          CARTOON LANDSCAPE BACKGROUND
          sun · sky · clouds · mountains · rolling green hills · trees · grass
          ===================================================== */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky gradient (cyan → soft → warm sun horizon) */}
          {/* <linearGradient id="reg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="35%" stopColor="#67E8F9" />
            <stop offset="70%" stopColor="#CFFAFE" />
            <stop offset="100%" stopColor="#FEF9C3" />
          </linearGradient> */}

          {/* Sun glow (radial) */}
          {/* <radialGradient id="reg-sun-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FDE68A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
          </radialGradient> */}

          {/* Soft fluffy cloud */}
          <symbol id="reg-cloud" viewBox="0 0 140 50">
            <ellipse cx="32" cy="32" rx="30" ry="16" fill="white" />
            <ellipse cx="68" cy="26" rx="36" ry="20" fill="white" />
            <ellipse cx="105" cy="32" rx="28" ry="15" fill="white" />
            <ellipse cx="50" cy="38" rx="42" ry="10" fill="white" opacity="0.85" />
          </symbol>

          {/* Cartoon tree (brown trunk + round green canopy) */}
          <symbol id="reg-tree" viewBox="0 0 120 170" overflow="visible">
            {/* Trunk */}
            <path d="M 56 88 Q 52 130 50 165 L 70 165 Q 68 130 64 88 Z" fill="#8B4513" />
            {/* Trunk darker side */}
            <path d="M 60 95 Q 60 130 60 165 L 70 165 Q 68 130 64 95 Z" fill="#5C2E0A" opacity="0.55" />
            {/* Trunk base */}
            <ellipse cx="60" cy="165" rx="22" ry="5" fill="#5C2E0A" opacity="0.7" />

            {/* Canopy (overlapping circles) */}
            <circle cx="60" cy="55" r="36" fill="#16A34A" />
            <circle cx="38" cy="62" r="26" fill="#15803D" />
            <circle cx="84" cy="62" r="28" fill="#15803D" />
            <circle cx="60" cy="40" r="30" fill="#22C55E" />
            <circle cx="44" cy="46" r="22" fill="#22C55E" />
            <circle cx="78" cy="46" r="24" fill="#22C55E" />
            <circle cx="52" cy="32" r="18" fill="#4ADE80" />
            <circle cx="72" cy="34" r="16" fill="#4ADE80" />

            {/* Highlights */}
            <ellipse cx="52" cy="28" rx="10" ry="6" fill="#86EFAC" opacity="0.8" />
            <ellipse cx="48" cy="50" rx="6" ry="4" fill="#BBF7D0" opacity="0.6" />
          </symbol>

          {/* Grass tuft */}
          <symbol id="reg-grass" viewBox="0 0 14 18" overflow="visible">
            <path d="M 7 18 L 2 4 L 5 14 L 7 0 L 9 14 L 12 4 L 7 18 Z" fill="currentColor" />
          </symbol>
        </defs>

        {/* === SKY === */}
        <rect width="1440" height="900" fill="url(#reg-sky)" />

        {/* === SUN GLOW (big, prominent like the reference) === */}
        {/* <circle cx="1100" cy="230" r="380" fill="url(#reg-sun-glow)" /> */}
        <circle cx="1100" cy="230" r="75" fill="#FEF08A" opacity="0.9" />


        {/* === DISTANT MOUNTAINS (blue silhouettes) === */}
        <path
          d="M 0 470 L 100 390 L 220 440 L 360 350 L 500 420 L 640 360 L 780 410
             L 920 350 L 1060 420 L 1200 370 L 1340 430 L 1440 400 L 1440 700 L 0 700 Z"
          fill="#7DD3FC"
          opacity="0.7"
        />
        <path
          d="M 0 520 L 140 440 L 280 490 L 440 410 L 600 480 L 760 420 L 920 480
             L 1080 410 L 1240 480 L 1380 440 L 1440 470 L 1440 700 L 0 700 Z"
          fill="#38BDF8"
          opacity="0.55"
        />

        {/* === CLOUDS === */}
        <g>
          <use href="#reg-cloud" x="120" y="120" width="220" height="78" />
          <use href="#reg-cloud" x="700" y="100" width="180" height="64" />
          <use href="#reg-cloud" x="240" y="260" width="160" height="56" />
          <use href="#reg-cloud" x="600" y="240" width="140" height="50" />
          <use href="#reg-cloud" x="950" y="150" width="170" height="60" />
        </g>

        {/* === MID HILLS (lighter green, with field patches) === */}
        <path
          d="M 0 590 Q 240 530 480 590 T 960 580 T 1440 590 L 1440 900 L 0 900 Z"
          fill="#86EFAC"
        />
        <ellipse cx="500" cy="610" rx="110" ry="14" fill="#A7F3D0" opacity="0.7" />
        <ellipse cx="900" cy="600" rx="130" ry="16" fill="#FDE68A" opacity="0.55" />
        <ellipse cx="200" cy="620" rx="100" ry="12" fill="#BBF7D0" opacity="0.7" />

        {/* === ROLLING HILLS LAYER 2 === */}
        <path
          d="M 0 680 Q 300 610 600 680 T 1200 660 L 1440 680 L 1440 900 L 0 900 Z"
          fill="#4ADE80"
        />

        {/* === ROLLING HILLS LAYER 3 (closer, brighter) === */}
        <path
          d="M 0 770 Q 360 700 720 770 T 1440 760 L 1440 900 L 0 900 Z"
          fill="#22C55E"
        />

        {/* === FOREGROUND HILL === */}
        <path
          d="M 0 850 Q 480 790 960 840 T 1440 850 L 1440 900 L 0 900 Z"
          fill="#16A34A"
        />

        {/* Hill field-line highlights */}
        <path
          d="M 100 800 Q 400 770 700 800"
          stroke="#15803D"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M 760 820 Q 1100 790 1380 820"
          stroke="#15803D"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />

        {/* === TREES === */}
        {/* Left tree (smaller, mid-distance) */}
        <use href="#reg-tree" x="80" y="500" width="180" height="255" />
        {/* Right tree (bigger, foreground) */}
        <use href="#reg-tree" x="1180" y="520" width="220" height="312" />

        {/* === GRASS TUFTS along the very bottom === */}
        <g color="#15803D">
          <use href="#reg-grass" x="20" y="875" width="20" height="25" />
          <use href="#reg-grass" x="90" y="880" width="14" height="20" />
          <use href="#reg-grass" x="160" y="875" width="18" height="25" />
          <use href="#reg-grass" x="240" y="882" width="14" height="18" />
          <use href="#reg-grass" x="320" y="875" width="20" height="25" />
          <use href="#reg-grass" x="420" y="880" width="14" height="20" />
          <use href="#reg-grass" x="520" y="875" width="18" height="25" />
          <use href="#reg-grass" x="640" y="882" width="14" height="18" />
          <use href="#reg-grass" x="760" y="875" width="20" height="25" />
          <use href="#reg-grass" x="880" y="880" width="14" height="20" />
          <use href="#reg-grass" x="980" y="875" width="18" height="25" />
          <use href="#reg-grass" x="1080" y="882" width="14" height="18" />
          <use href="#reg-grass" x="1180" y="875" width="20" height="25" />
          <use href="#reg-grass" x="1280" y="880" width="14" height="20" />
          <use href="#reg-grass" x="1380" y="875" width="18" height="25" />
        </g>
      </svg>

      {/* Soft white fade behind the card so form text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,transparent_55%)]"
      />

      {/* ===========================================================
          REGISTER CARD  (responsive, functionality unchanged)
          =========================================================== */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(20,80,40,0.25)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[520px] sm:min-h-[600px] border border-white/60 ring-1 ring-[#22C55E]/10">
          {/* LEFT — illustration panel */}
          <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-white">
            <span className="absolute top-6 left-8 w-4 h-4 rounded-full bg-[#FACC15]" />
            <span className="absolute top-16 left-2 w-6 h-6 rounded-full border-2 border-[#22C55E]/40" />
            <span className="absolute top-8 right-10 flex h-10 w-10 items-center justify-center">
              <Leaf className="h-10 w-10 text-[#22C55E]" />
            </span>
            <span className="absolute bottom-28 left-12 w-3 h-3 rounded-full border-2 border-[#22C55E]/50" />
            <span className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-[#BBF7D0] to-[#6EE7B7]" />
            <span className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#D1FAE5]/70 -translate-y-1/3 translate-x-1/4" />

            <div className="relative z-10 max-w-[280px] pt-6">
              
              <h2 className="font-bold text-4xl xl:text-5xl text-[#1F2A33] leading-none tracking-tight">
                HELLO <span className="text-[#22C55E]">!</span>
              </h2>
              <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                Please entre your details
                <br />
                to continue...
              </p>
            </div>

            <img
              src="/adminLoginRegisterBanner/register.png"
              alt="Doctor illustration"
              className="absolute right-0 bottom-0 max-h-[88%] w-auto object-contain pointer-events-none z-10"
              onError={(e) => {
                ; (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>

          {/* RIGHT — form panel */}
          <div className="bg-[#D1FAE5]/60 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center relative pt-14 sm:pt-16">
            <button
              className="group absolute left-3 top-3 sm:left-4 sm:top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#22C55E] shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-[#22C55E] hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />

              <span className="pointer-events-none absolute left-11 whitespace-nowrap rounded-md bg-black px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100">
                Back to Vitalize
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-8 h-8 sm:w-9 sm:h-9 bg-green-300 rounded-lg flex items-center justify-center text-white text-base shrink-0 shadow-soft">
                🌿
              </span>
             <span className="font-serif text-[28px] sm:text-[36px] font-bold tracking-tight">
  Vita<span className="text-green-500">lize</span>
</span>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Create Admin Account
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Requires the operator-issued invite code
              </p>
            </div>

            <form
              onSubmit={(e) => void handleSubmit(e)}
              noValidate
              className="w-full max-w-md mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label
                    htmlFor="ar-user"
                    className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-700"
                  >
                    <User size={16} className="text-[#22C55E]" />
                    Username
                  </label>
                  <div className="relative group">
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
                      placeholder="Enter your username..."
                      className="w-full bg-white border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ar-pass"
                    className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-700"
                  >
                    <LockKeyhole size={16} className="text-[#22C55E]" />
                    Password
                  </label>

                  <div className="relative group">
                    <input
                      id="ar-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        clearError()
                        setLocalError(null)
                        setPassword(e.target.value)
                      }}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full bg-white rounded-md px-4 py-3 pr-11 text-sm text-gray-800 shadow-sm outline-none transition border border-transparent focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ar-confirm"
                    className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-700"
                  >
                    <LockKeyhole size={16} className="text-[#22C55E]" />
                    Confirm password
                  </label>

                  <div className="relative group">
                    <input
                      id="ar-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => {
                        setLocalError(null)
                        setConfirm(e.target.value)
                      }}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className={`w-full bg-white rounded-md px-4 py-3 pr-11 text-sm text-gray-800 shadow-sm outline-none transition border ${confirm.length > 0 && !passwordsMatch
                          ? 'border border-red-300 focus:border-red-400 focus:ring-red-200/40'
                          : 'border-transparent focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20'
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={
                        showConfirm ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-[#22C55E]/10 hover:text-[#22C55E]"
                    >
                      {showConfirm ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p
                    className={`flex items-center gap-1.5 pl-1 text-[11px] font-medium transition-colors duration-200 ${confirm.length === 0
                        ? 'text-gray-400'
                        : passwordsMatch
                          ? 'text-[#16A34A]'
                          : 'text-red-500'
                      }`}
                  >
                    {confirm.length > 0 && passwordsMatch && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}

                    {confirm.length === 0
                      ? ''
                      : passwordsMatch
                        ? 'Passwords match'
                        : 'Passwords do not match'}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label
                    htmlFor="ar-invite"
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"
                  >
                    <KeyRound className="h-4 w-4 text-[#22C55E]" />
                    Admin invite code
                  </label>
                  <input
                    id="ar-invite"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => {
                      clearError()
                      setLocalError(null)
                      setInviteCode(e.target.value)
                    }}
                    required
                    autoComplete="off"
                    placeholder="Enter admin invite code..."
                    className="w-full bg-white border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
                  />
                </div>
              </div>

              {visibleError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5"
                >
                  <span className="mt-0.5 inline-block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <span>{visibleError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isLoading || !username || !password || !confirm || !inviteCode
                }
                className="w-full mt-6 py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#86EFAC] via-[#4ADE80] to-[#22C55E] shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                {isLoading ? 'Creating admin…' : 'Create Admin Account'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-5">
                Already have admin credentials?{' '}
                <Link
                  to="/admin/login"
                  className="text-[#22C55E] font-semibold hover:underline no-underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
