import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { EmptyState } from '@/components/common/EmptyState'
import { usePlans } from '@/features/subscription/hooks/usePlans'
import { getUserFriendlyMessage } from '@/lib/errors'

interface Props {
  preview?: boolean
}

function PlanSkeleton(): React.ReactNode {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border-2 border-border rounded-2xl p-6 animate-pulse">
          <div className="h-3 w-20 bg-border rounded mb-2" />
          <div className="h-6 w-32 bg-border rounded mb-4" />
          <div className="h-10 w-24 bg-border rounded mb-6" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-3 w-full bg-border/70 rounded" />
            ))}
          </div>
          <div className="h-9 w-full bg-border rounded-full mt-6" />
        </div>
      ))}
    </div>
  )
}

export function SubscriptionSection({ preview = false }: Props): React.ReactNode {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const { data: plans, isLoading, isError, error, refetch } = usePlans()

  return (
    <section className="py-12 sm:py-16 bg-paper" aria-label="Subscription plans">
      <div className="vh-container">
        <SectionHeader
          eyebrow="Membership"
          title="Choose Your"
          titleAccent="Plan"
          subtitle="Cancel anytime. No hidden fees."
          center
        />

        <div className="flex items-center justify-center gap-3 mb-8">
          {(['monthly', 'annual'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border-[1.5px] transition-all capitalize ${
                billing === b
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-border text-ink-3 hover:border-green-300'
              }`}
            >
              {b}
            </button>
          ))}
          {billing === 'annual' && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
              Save up to 20%
            </span>
          )}
        </div>

        {isLoading ? (
          <PlanSkeleton />
        ) : isError ? (
          <ErrorMessage
            message={getUserFriendlyMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : !plans || plans.length === 0 ? (
          <EmptyState message="No plans available." icon="💳" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border-2 transition-all ${
                  plan.isPopular
                    ? 'border-green-500 bg-green-600 text-white shadow-glow lg:scale-[1.02]'
                    : 'border-border bg-white text-ink hover:border-green-200 hover:shadow-card'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-tan-400 text-white text-[9px] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full whitespace-nowrap">
                    ✦ Most Popular
                  </div>
                )}

                <p
                  className={`text-[10px] font-bold tracking-[0.12em] uppercase mb-1 ${
                    plan.isPopular ? 'text-green-200' : 'text-ink-4'
                  }`}
                >
                  {plan.tagline}
                </p>
                <h3
                  className={`font-serif text-xl font-black mb-2 ${
                    plan.isPopular ? 'text-white' : 'text-ink'
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="flex items-end gap-1 mb-1">
                  <span
                    className={`font-serif text-[36px] font-black leading-none ${
                      plan.isPopular ? 'text-white' : 'text-ink'
                    }`}
                  >
                    {billing === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.id !== 'free' && (
                    <span className={`text-xs mb-2 ${plan.isPopular ? 'text-green-200' : 'text-ink-3'}`}>
                      /{billing === 'annual' ? 'yr' : 'mo'}
                    </span>
                  )}
                </div>

                <ul className="mb-6 mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <span className={`mt-0.5 shrink-0 ${plan.isPopular ? 'text-green-300' : 'text-green-500'}`}>
                        ✓
                      </span>
                      <span className={plan.isPopular ? 'text-green-100' : 'text-ink-2'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/subscription"
                  className={`block text-center w-full py-2.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    plan.isPopular
                      ? 'bg-white text-green-600 border-white hover:bg-green-50'
                      : plan.id === 'free'
                      ? 'bg-transparent border-border text-ink-3 hover:border-ink-3'
                      : 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        )}

        {preview && plans && plans.length > 0 && (
          <p className="text-center text-xs text-ink-4 mt-5">
            All plans include a 7-day money-back guarantee.{' '}
            <Link to="/subscription" className="text-green-600 font-semibold underline">
              Compare all features →
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}
