import React, { useState } from 'react'
import { SubscriptionSection } from '@/features/subscription/components/SubscriptionSection'

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel anytime from your account settings. No cancellation fees.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Payments are processed via Stripe with 256-bit TLS encryption. We never store card details.',
  },
  {
    q: 'What happens when I upgrade?',
    a: 'You get instant access to all premium content. Billing is pro-rated for your current period.',
  },
  {
    q: 'Do you offer team plans?',
    a: 'Yes — contact us at teams@vitalize.health for group pricing for 5+ seats.',
  },
]

export function SubscriptionPage(): React.ReactNode {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main id="main-content">
      <section
        aria-label="Subscription hero"
        className="bg-gradient-to-br from-green-50 via-paper to-tan-50 py-14 text-center"
      >
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-green-500 mb-3">
          🌿 Membership Plans
        </p>
        <h1 className="font-serif text-[clamp(24px,4vw,46px)] font-black text-ink tracking-tight mb-3">
          Invest in your <em className="text-green-500 not-italic font-light">healthspan</em>
        </h1>
        <p className="text-sm text-ink-3 font-light max-w-md mx-auto">
          Science-backed health content, AI guidance, and expert access — for less than a
          supplement per week.
        </p>
      </section>

      <SubscriptionSection />

      <section className="bg-green-50 border-t border-b border-green-100 py-10" aria-label="Trust signals">
        <div className="max-w-[900px] mx-auto px-5 grid grid-cols-4 gap-6 text-center">
          {[
            ['🔒', '256-bit SSL', 'Bank-grade encryption'],
            ['💳', 'Stripe Payments', 'PCI DSS compliant'],
            ['↩️', '7-Day Guarantee', 'Full refund, no questions'],
            ['❌', 'Cancel Anytime', 'No lock-in, no hidden fees'],
          ].map(([icon, title, desc]) => (
            <div key={title}>
              <div className="text-2xl mb-1.5" aria-hidden="true">
                {icon}
              </div>
              <p className="text-sm font-bold text-ink mb-0.5">{title}</p>
              <p className="text-[11px] text-ink-3 font-light">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[700px] mx-auto px-5 py-14" aria-label="Frequently asked questions">
        <h2 className="font-serif text-xl font-black text-ink text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-semibold text-ink hover:bg-paper transition-colors"
              >
                {faq.q}
                <span
                  className={`text-green-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-xs text-ink-3 leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
