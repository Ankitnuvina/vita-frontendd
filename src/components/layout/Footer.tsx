import React from 'react'
import { Link } from 'react-router-dom'

interface FooterLink {
  label: string
  to?: string
}

const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Categories',
    links: [
      { label: 'Mind', to: "/mind" },
      { label: 'Body', to: "/body"  },
      { label: 'Nutrition', to: "/nutrition"  },
      { label: 'Sleep', to: "/sleep"  },
      { label: 'Longevity' },
      { label: 'India Roots' },
    ],
  },

  {
    title: 'Tools',
    links: [
      { label: 'Vita AI' },
      { label: 'Vital Score' },
      { label: 'Protocol Builder' },
      { label: '28-Day Resets' },
      { label: 'Habit Tracker' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us' },
      { label: 'Our Experts' },
      { label: 'Editorial Policy' },
      { label: 'Advertise' },
      { label: 'Contact' },
    ],
  },
]

const SOCIAL_ICONS = ['𝕏', 'in', '📸', '▶', '🎧']

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
              className="font-serif text-xl font-bold mb-2.5 inline-flex items-center text-white"
            >
              VIT<span className="text-green-400">A</span>
            </Link>
            <p className="text-xs text-white/40 leading-relaxed max-w-[260px] mb-4 mt-2 font-light">
              Your trusted destination for science-backed health, wellness and lifestyle insights.
            </p>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Social media links">
              {SOCIAL_ICONS.map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  role="listitem"
                  aria-label={`Social media link ${i + 1}`}
                  className="w-9 h-9 bg-white/[0.08] rounded-lg flex items-center justify-center text-xs cursor-pointer text-white hover:bg-white/15 hover:text-white transition-colors"
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
            © 2026 VITA Health Media. All rights reserved.
          </span>

        </div>
      </div>
    </footer>
  )
}
