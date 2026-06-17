import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/globals/enums'
import { Eye, EyeOff, ArrowLeft, User, LockKeyhole, Leaf } from 'lucide-react'

export function AdminLoginPage(): React.ReactNode {
  const [showPassword, setShowPassword] = useState(false)

  const adminLogin = useAuthStore((s) => s.adminLogin)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const clearError = useAuthStore((s) => s.clearError)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    clearError()
  }, [clearError])

  if (isAuthenticated && user?.role === UserRole.ADMIN) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const result = await adminLogin(email, password)
    if (result) {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-[#ECFDF5]">
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sky gradient (cream → light green → mint) */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F7FEE7" />
            <stop offset="40%" stopColor="#DCFCE7" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>

          {/* Sun glow */}
          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#FEF3C7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
          </radialGradient>

          {/* Soft cloud */}
          <symbol id="cloud" viewBox="0 0 120 40">
            <ellipse cx="30" cy="22" rx="28" ry="14" fill="white" />
            <ellipse cx="60" cy="18" rx="32" ry="16" fill="white" />
            <ellipse cx="92" cy="24" rx="24" ry="12" fill="white" />
          </symbol>

          {/* Cartoon parrot (faces left, mid-flight) */}
          <symbol id="parrot" viewBox="0 0 100 70" overflow="visible">
            {/* Tail feathers (red / cyan / blue, behind body) */}
            <path d="M 60 36 L 96 28 L 92 38 L 72 42 Z" fill="#EF4444" />
            <path d="M 60 42 L 98 44 L 94 52 L 72 48 Z" fill="#22D3EE" />
            <path d="M 60 47 L 94 56 L 88 62 L 72 54 Z" fill="#3B82F6" />

            {/* Raised wing (behind body) */}
            <path d="M 46 28 Q 60 4 90 8 Q 82 28 60 34 Z" fill="#15803D" />
            <path d="M 48 28 Q 60 12 84 14 Q 76 28 60 31 Z" fill="#22C55E" />
            <path d="M 55 18 L 80 14" stroke="#14532D" strokeWidth="0.8" fill="none" />
            <path d="M 56 22 L 78 20" stroke="#14532D" strokeWidth="0.8" fill="none" />
            <path d="M 58 26 L 76 26" stroke="#14532D" strokeWidth="0.8" fill="none" />

            {/* Body */}
            <ellipse cx="40" cy="42" rx="22" ry="17" fill="#22C55E" />
            {/* Belly (lighter green) */}
            <ellipse cx="36" cy="47" rx="14" ry="11" fill="#BBF7D0" />

            {/* Head */}
            <circle cx="26" cy="26" r="13" fill="#22C55E" />
            {/* Cheek patch */}
            <circle cx="22" cy="29" r="3.5" fill="#FBBF24" opacity="0.55" />

            {/* Crest (spike on top of head) */}
            <path d="M 23 13 Q 27 3 31 10 Q 31 16 27 18 Z" fill="#15803D" />

            {/* Beak (yellow, curved) */}
            <path d="M 15 23 Q 3 27 6 34 Q 14 36 20 30 Z" fill="#F59E0B" />
            <path d="M 14 30 Q 11 32 14 33 Q 18 32 20 30 Z" fill="#FB923C" />

            {/* Eye */}
            <circle cx="24" cy="22" r="3.2" fill="white" />
            <circle cx="24.5" cy="22.4" r="1.9" fill="#1E3A8A" />
            <circle cx="25" cy="21.6" r="0.6" fill="white" />

            {/* Small foot */}
            <path d="M 42 58 L 40 65 L 44 65 Z" fill="#F59E0B" />
          </symbol>

          {/* Flight drift animations (3 different rhythms) */}
          <style>
            {`
              @keyframes birdFlyA {
                0%, 100% { transform: translateX(0)    translateY(0); }
                50%      { transform: translateX(60px) translateY(-12px); }
              }
              @keyframes birdFlyB {
                0%, 100% { transform: translateX(0)     translateY(0); }
                50%      { transform: translateX(-50px) translateY(10px); }
              }
              @keyframes birdFlyC {
                0%, 100% { transform: translateX(0)    translateY(0); }
                50%      { transform: translateX(45px) translateY(14px); }
              }
              .bird-flock-a { animation: birdFlyA 14s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
              .bird-flock-b { animation: birdFlyB 18s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
              .bird-flock-c { animation: birdFlyC 22s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
            `}
          </style>
        </defs>

        {/* Sky */}
        <rect width="1440" height="900" fill="url(#sky)" />

        {/* Sun + glow (top-left) */}
        <circle cx="100" cy="180" r="280" fill="url(#sunGlow)" />
        <circle cx="120" cy="180" r="55" fill="#FDE68A" opacity="0.85" />

        {/* Soft clouds */}
        <g opacity="0.75">
          <use href="#cloud" x="120" y="120" width="180" height="60" />
          <use href="#cloud" x="520" y="80" width="160" height="50" />
          <use href="#cloud" x="900" y="150" width="200" height="64" />
          <use href="#cloud" x="280" y="220" width="140" height="44" />
        </g>



        {/* Flock B — center sky, medium parrots */}
        <g className="bird-flock-b">
          <use href="#parrot" x="600" y="100" width="75" height="52" />
          <use href="#parrot" x="700" y="180" width="55" height="38" />
        </g>



        {/* ---- Distant mountains (lightest green) ---- */}
        <path
          d="M0,520 L120,410 L240,470 L360,380 L480,460 L600,360 L720,440 L840,370 L960,450 L1080,360 L1200,440 L1320,400 L1440,460 L1440,900 L0,900 Z"
          fill="#86EFAC"
          opacity="0.55"
        />

        {/* ---- Mid mountains ---- */}
        <path
          d="M0,620 L140,500 L280,580 L440,450 L600,560 L760,440 L920,540 L1080,460 L1240,540 L1380,480 L1440,520 L1440,900 L0,900 Z"
          fill="#4ADE80"
          opacity="0.7"
        />

        {/* ---- Rolling hills ---- */}
        <path
          d="M0,740 L160,660 L340,720 L520,650 L720,710 L920,640 L1120,700 L1320,650 L1440,700 L1440,900 L0,900 Z"
          fill="#22C55E"
          opacity="0.85"
        />

        {/* ---- Foreground left hill ---- */}
        <ellipse cx="160" cy="940" rx="540" ry="180" fill="#16A34A" />

        {/* ---- Foreground right hill ---- */}
        <ellipse cx="1280" cy="950" rx="620" ry="200" fill="#15803D" />
      </svg>

      {/* Soft white fade behind the card so form text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55)_0%,transparent_55%)]"
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
        <div className="relative w-full max-w-5xl">
          <SittingOnTopAvatar />


          <div className="relative w-full bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(20,80,40,0.25)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[480px] sm:min-h-[560px] border border-white/60 ring-1 ring-[#22C55E]/10">
            {/* LEFT — illustration panel */}
            <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-white">
              <span className="absolute top-6 left-8 w-4 h-4 rounded-full bg-[#F4C45A]" />
              <span className="absolute top-16 left-2 h-5 w-5 rounded-full border-2 border-[#3DB389]/40 bg-[#3DB389]" />
              <span className="absolute top-8 right-10 flex h-10 w-10 items-center justify-center">
                <Leaf className="h-10 w-10 text-[#22C55E]" />
              </span>
              <span className="absolute bottom-24 left-10 w-3 h-3 rounded-full border-2 border-[#3DB389]/50" />
              <span className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-[#BFE7DA] to-[#7FCDB4]" />
              <span className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#DFF1EA]/60 -translate-y-1/3 translate-x-1/4" />

              <div className="relative z-10 max-w-[280px] pt-6">
                <h2 className="font-bold text-4xl xl:text-5xl text-[#0F2E1B] leading-none tracking-tight">
                  WELCOME <span className="text-[#22C55E]">!</span>
                </h2>
                <p className="text-md text-gray-600 mt-5 leading-relaxed">
                  Join the admin team and start
                  <br />
                  managing your Vita<span className='text-green-500'>lize</span> today
                </p>
              </div>

              <img
                src="/adminLoginRegisterBanner/health.png"
                alt="Doctor illustration"
                className="absolute right-0 bottom-0 max-h-[88%] w-auto object-contain pointer-events-none z-10"
                onError={(e) => {
                  ; (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>

            {/* RIGHT — form panel */}
            <div className="bg-[#DFF1EA]/60 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center relative pt-14 sm:pt-16">
              <button
                className="group absolute left-3 top-3 sm:left-4 sm:top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#22C55E] shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-[#22C55E] hover:text-white"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4" />

                <span className="pointer-events-none absolute left-11 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-black opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100">
                  Back to Vitalize
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
                <Link
                  to="/"
                  className="flex items-center gap-2 shrink-0"
                  aria-label="Vitalize Health — go to home"
                >
                  <div className="flex items-center rounded-xl px-2 py-1 transition-all duration-300 hover:bg-white/50">
                    <img
                      src="/vitalizeLogo/logo.svg"
                      alt="Vitalize Logo"
                      className="h-9 cursor-pointer w-auto object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>
              </div>

              <form
                onSubmit={(e) => void handleSubmit(e)}
                noValidate
                className="w-full max-w-sm mx-auto"
              >
                <div className="sm:col-span-2 space-y-2">
                  <label
                    htmlFor="ar-user"
                    className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-700"
                  >
                    <User size={16} className="text-[#22C55E]" />
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      id="admin-user"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        clearError()
                        setEmail(e.target.value)
                      }}
                      required
                      autoComplete="email"
                      placeholder="Enter your email..."
                      className="w-full bg-white border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="ar-pass"
                    className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-700 mt-4"
                  >
                    <LockKeyhole size={16} className="text-[#22C55E]" />
                    Password
                  </label>

                  <div className="relative group">
                    <input
                      id="admin-pass"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        clearError()
                        setPassword(e.target.value)
                      }}
                      required
                      autoComplete="current-password"
                      className={`w-full bg-white rounded-md px-4 py-3 pr-11 text-sm text-gray-800 shadow-sm outline-none transition border ${error
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-transparent focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20'
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#22C55E] transition-colors bg-transparent border-none cursor-pointer p-0"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <p role="alert" className="text-xs text-red-500 mt-1.5">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full mt-6 py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-[#86EFAC] via-[#4ADE80] to-[#22C55E] shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                >
                  {isLoading ? 'Verifying…' : 'Log in to Admin'}
                </button>

                <div className="text-center mt-5">
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-[#22C55E] font-medium hover:underline no-underline"
                  >
                    Forget Password ?
                  </Link>
                </div>

                <p className="text-center text-sm text-gray-600 mt-3">
                  Need to create an admin account ?{' '}
                  <Link
                    to="/admin/register"
                    className="text-[#22C55E] font-semibold hover:underline no-underline"
                  >
                    Register with invite code
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}



function AvatarImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}): React.ReactNode {
  const [errored, setErrored] = useState(false)
  if (errored) return null
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={className}
      aria-hidden="true"
    />
  )
}

function SittingOnTopAvatar(): React.ReactNode {
  const wrapperCls =
    'hidden sm:block absolute -top-20 sm:-top-24 lg:-top-28 -right-4 sm:-right-6 lg:-right-10 w-32 sm:w-40 lg:w-48 z-30 pointer-events-none drop-shadow-md'

  return (
    <div className={wrapperCls}>
      {/* Tries real illustration first */}
      <AvatarImage
        src="/avatars/sitting-laptop.png"
        alt="Sitting person with laptop"
        className="w-full h-auto"
      />

      {/* SVG fallback — chibi guy with laptop on a green stool/box */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 240"
        className="w-full h-auto"
      >
        {/* =========================================================
            GREEN STOOL  (small, refined — like the reference)
            ========================================================= */}
        {/* <rect x="40" y="200" width="140" height="30" rx="5" fill="#15803D" />
        <ellipse cx="110" cy="200" rx="72" ry="6" fill="#22C55E" />
        <path
          d="M 42 200 Q 110 194 178 200 L 178 205 Q 110 200 42 205 Z"
          fill="#4ADE80"
        />
        <rect x="40" y="225" width="140" height="5" rx="2" fill="#14532D" /> */}

        {/* =========================================================
            LEGS (dark pants, dangling)
            ========================================================= */}
        {/* Back leg */}
        <rect x="118" y="178" width="20" height="42" rx="3" fill="#1F2937" />
        <ellipse cx="128" cy="222" rx="14" ry="4" fill="#0F172A" />
        {/* Front leg (crossed slightly) */}
        <rect x="82" y="178" width="20" height="46" rx="3" fill="#1F2937" />
        <ellipse cx="92" cy="226" rx="14" ry="4" fill="#0F172A" />

        {/* =========================================================
            BODY — LIME-GREEN SWEATER  (clean silhouette)
            ========================================================= */}
        <path
          d="M 70 105
             Q 60 145 72 188
             L 148 188
             Q 160 145 150 105
             Q 140 92 110 88
             Q 80 92 70 105 Z"
          fill="#86EFAC"
        />
        {/* Soft inner shadow on right side */}
        <path
          d="M 138 100 Q 160 145 148 188 L 124 188 Q 136 145 130 100 Z"
          fill="#4ADE80"
          opacity="0.5"
        />
        {/* Sweater hem */}
        <path
          d="M 72 184 Q 110 192 148 184 L 148 188 L 72 188 Z"
          fill="#4ADE80"
        />
        {/* Sweater neckline */}
        <ellipse cx="110" cy="98" rx="14" ry="5" fill="#22C55E" />

        {/* =========================================================
            ARMS  (wrap around laptop)
            ========================================================= */}
        {/* Back arm (right side of figure) */}
        <path
          d="M 148 112
             Q 168 142 156 178
             L 138 178
             Q 144 142 138 116 Z"
          fill="#4ADE80"
        />
        {/* Front arm (left side of figure) */}
        <path
          d="M 70 112
             Q 50 142 64 178
             L 82 178
             Q 78 142 80 116 Z"
          fill="#86EFAC"
        />

        {/* =========================================================
            LAPTOP  (clean rectangle look)
            ========================================================= */}
        {/* Screen back */}
        <rect
          x="55"
          y="138"
          width="110"
          height="42"
          rx="4"
          fill="#1F2937"
        />
        {/* Screen */}
        <rect x="60" y="143" width="100" height="32" rx="2" fill="#A7F3D0" />
        {/* Screen content — chart-like bars */}
        <rect x="66" y="148" width="40" height="3" rx="1" fill="#22C55E" />
        <rect x="66" y="156" width="64" height="2" rx="1" fill="#16A34A" opacity="0.6" />
        <rect x="66" y="161" width="50" height="2" rx="1" fill="#16A34A" opacity="0.6" />
        <rect x="66" y="166" width="58" height="2" rx="1" fill="#16A34A" opacity="0.6" />
        {/* mini chart */}
        <rect x="135" y="160" width="3" height="8" fill="#22C55E" />
        <rect x="140" y="156" width="3" height="12" fill="#22C55E" />
        <rect x="145" y="152" width="3" height="16" fill="#22C55E" />
        <rect x="150" y="158" width="3" height="10" fill="#22C55E" />

        {/* Laptop base (keyboard wedge) */}
        <path
          d="M 50 180 L 170 180 L 162 188 L 58 188 Z"
          fill="#374151"
        />
        <rect x="58" y="181" width="104" height="1.5" fill="#4B5563" />

        {/* Hands on laptop */}
        <ellipse cx="62" cy="182" rx="7" ry="5" fill="#FCD9B6" />
        <ellipse cx="158" cy="182" rx="7" ry="5" fill="#FCD9B6" />

        {/* =========================================================
            NECK + HEAD  (chibi-friendly proportions)
            ========================================================= */}
        {/* Neck */}
        <rect x="102" y="86" width="16" height="12" fill="#FCD9B6" />
        <path d="M 102 88 L 118 88 L 118 92 L 102 92 Z" fill="#E8B68A" opacity="0.55" />

        {/* Head — bigger for that cute chibi feel */}
        <ellipse cx="110" cy="56" rx="30" ry="34" fill="#FCD9B6" />
        {/* Face soft shadow under hair */}
        <path
          d="M 80 56 Q 84 38 110 36 Q 136 38 140 56 L 138 52 Q 110 48 82 52 Z"
          fill="#E8B68A"
          opacity="0.35"
        />

        {/* =========================================================
            HAIR — short brown with a clean quiff (like the ref)
            ========================================================= */}
        {/* Main hair shape */}
        <path
          d="M 80 56
             Q 74 22 110 18
             Q 146 22 140 56
             L 136 40
             Q 122 32 110 32
             Q 96 32 84 40
             L 80 56 Z"
          fill="#000"
        />
        {/* Quiff / front wave */}
        <path
          d="M 96 22
             Q 110 8 126 22
             Q 120 30 110 30
             Q 100 30 96 22 Z"
          fill="#000"
        />
        {/* Side burn / temple shadow */}
        <path
          d="M 80 56 Q 82 46 88 40 L 86 56 Z"
          fill="#7C2D12"
          opacity="0.45"
        />

        {/* =========================================================
            EARS  (small, on both sides)
            ========================================================= */}
        <ellipse cx="80" cy="60" rx="3.5" ry="6" fill="#FCD9B6" />
        <path
          d="M 80 58 Q 81 60 80 62"
          stroke="#D97706"
          strokeWidth="0.8"
          fill="none"
        />
        <ellipse cx="140" cy="60" rx="3.5" ry="6" fill="#FCD9B6" />
        <path
          d="M 140 58 Q 139 60 140 62"
          stroke="#D97706"
          strokeWidth="0.8"
          fill="none"
        />

        {/* =========================================================
            FACE FEATURES  (clear, expressive)
            ========================================================= */}
        {/* Eyebrows */}
        <path
          d="M 92 52 Q 98 48 104 52"
          stroke="#000"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 116 52 Q 122 48 128 52"
          stroke="#000"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Eyes */}
        <ellipse cx="98" cy="60" rx="2.6" ry="3.2" fill="#1F2937" />
        <ellipse cx="122" cy="60" rx="2.6" ry="3.2" fill="#1F2937" />
        {/* Eye highlights */}
        <circle cx="99" cy="59" r="0.8" fill="white" />
        <circle cx="123" cy="59" r="0.8" fill="white" />

        {/* Cheek blush */}
        <ellipse cx="88" cy="70" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.55" />
        <ellipse cx="132" cy="70" rx="4.5" ry="3" fill="#FCA5A5" opacity="0.55" />

        {/* Nose */}
        <path
          d="M 108 66 Q 110 70 112 66"
          stroke="#D97706"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Smile */}
        <path
          d="M 100 76 Q 110 82 120 76"
          stroke="#000"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
