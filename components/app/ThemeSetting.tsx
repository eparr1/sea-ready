"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const options = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function ThemeSetting() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // The stored theme is unknown on the server, so nothing is selected until mount.
  const active = mounted ? (theme ?? "system") : null

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
      <div
        role="radiogroup"
        aria-label="Appearance"
        className="mt-3 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1"
      >
        {options.map((option) => (
          <button
            key={option.value}
            role="radio"
            aria-checked={active === option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "h-11 rounded-xl text-sm font-semibold transition-colors active:scale-[0.98]",
              active === option.value
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  )
}
