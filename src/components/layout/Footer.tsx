import React from 'react'
import { Link } from 'react-router-dom'

interface FooterLink {
  label: string
  to?: string
}

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Articles', to: '/articles' },
      { label: 'Podcasts', to: '/podcasts' },
      { label: 'Videos', to: '/videos' },
      { label: 'AI Assistant', to: '/ai' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us' },
      { label: 'Editorial Standards' },
      { label: 'Careers' },
      { label: 'Press Kit' },
      { label: 'Advertise' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center' },
      { label: 'Privacy Policy' },
      { label: 'Terms of Use' },
      { label: 'Cookie Settings' },
      { label: 'Contact' },
    ],
  },
]

const SOCIAL_ICONS = ['𝕏', 'in', '📸', '▶', '🎧']
const TRUST_BADGES = ['HIPAA Aware', 'HONcode', 'ADA AA']

export function Footer(): React.ReactNode {
  return (
    <footer
      className="bg-[#0D1710] text-white pt-12 pb-6 mt-auto"
      role="contentinfo"
    >
      <div className="vh-container">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 pb-10 border-b border-white/[0.07] mb-5">
          {/* Brand block — full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="font-serif text-xl font-bold mb-2.5 inline-flex items-center gap-2 text-white"
            >
              <span className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-base">
                🌿
              </span>
              Vita<span className="text-green-400">lize</span>
            </Link>
            <p className="text-xs text-white/40 leading-relaxed max-w-[260px] mb-4 mt-2 font-light">
              Science-backed health wisdom for the modern generation.
            </p>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Social media links">
              {SOCIAL_ICONS.map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  role="listitem"
                  aria-label={`Social media link ${i + 1}`}
                  className="w-9 h-9 bg-white/[0.06] rounded-lg flex items-center justify-center text-xs cursor-pointer text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-400 mb-3.5">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-xs text-white/55 cursor-pointer font-light hover:text-white transition-colors text-left inline-block"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="text-xs text-white/55 cursor-pointer font-light hover:text-white transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-[11px] text-white/30 leading-relaxed">
            © 2026 Vitalize Health Media. Content is for informational purposes only.
          </span>
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="Compliance badges">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                role="listitem"
                className="text-[9px] font-semibold uppercase text-white/30 border border-white/10 px-2 py-0.5 rounded"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
