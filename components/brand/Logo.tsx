import { cn } from "@/lib/utils"

/** Typographic wordmark. The store icon is a separate asset. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.25rem] leading-none font-semibold tracking-[-0.02em]",
        className
      )}
    >
      MasterMariner<span className="text-brand">Pro</span>
    </span>
  )
}
