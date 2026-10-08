"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSubscription } from "@/lib/subscription-context"

/** Styled to sit on the navy ProCard. */
export function UpgradeButton() {
  const { isReady, isPro, presentPaywall, managementURL, error } =
    useSubscription()
  const [busy, setBusy] = useState(false)

  if (!isReady) return null

  if (isPro) {
    return managementURL ? (
      <Button
        asChild
        size="lg"
        className="w-full bg-white/15 text-ink-foreground hover:bg-white/25"
      >
        <a href={managementURL} target="_blank" rel="noopener noreferrer">
          Manage subscription
        </a>
      </Button>
    ) : null
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        className="w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          await presentPaywall()
          setBusy(false)
        }}
      >
        {busy ? "Opening…" : "Upgrade to Pro"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-[oklch(0.86_0.09_25)]">
          {error}
        </p>
      )}
    </div>
  )
}
