"use client"

import { useSubscription } from "@/lib/subscription-context"
import { UpgradeButton } from "./UpgradeButton"

export function ProCard() {
  const { isReady, isPro, error } = useSubscription()
  // No API key or SDK failed to start: nothing to sell, so say so instead of showing a dead button.
  const unavailable = !isReady && !!error

  return (
    <section className="rounded-3xl bg-ink p-5 text-ink-foreground min-[375px]:p-6">
      <p className="text-sm font-medium text-ink-foreground/70">
        {isPro ? "Your plan" : "Pro plan"}
      </p>
      <h2 className="mt-1.5 text-[1.75rem] leading-[1.1] font-semibold tracking-tight">
        Master Mariner Pro
      </h2>
      <p className="mt-2 max-w-[28ch] text-[0.9375rem] text-ink-foreground/75">
        {isPro
          ? "Your subscription is active."
          : "Upgrade to unlock the full question bank."}
      </p>

      <div className="relative mt-7">
        {!isReady && !error ? (
          <div
            className="h-12 animate-pulse rounded-xl bg-white/10"
            aria-hidden="true"
          />
        ) : unavailable ? (
          <p className="text-sm text-ink-foreground/70">
            Subscriptions aren&apos;t available right now. Please try again
            later.
          </p>
        ) : (
          <UpgradeButton />
        )}
      </div>
    </section>
  )
}
