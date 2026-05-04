import React from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage(): React.ReactNode {
  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-paper to-tan-50 px-5"
    >
      <div className="text-center max-w-md">
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-500 mb-3">
          🌿 Vitalize Health
        </p>
        <h1 className="font-serif text-[clamp(64px,12vw,128px)] font-black text-ink leading-none mb-2">
          404
        </h1>
        <p className="font-serif text-2xl font-bold text-ink mb-3">
          This page <em className="text-green-500 not-italic font-light">doesn't exist.</em>
        </p>
        <p className="text-sm text-ink-3 leading-relaxed mb-6 font-light">
          The link you followed may be broken, or the page may have been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-green-600 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  )
}
