"use client"

import Link from "next/link"
import { ArrowRight, CaretRight, Lock } from "@phosphor-icons/react"
import { useUser } from "@/lib/user-context"

type Subject = { name: string; count: number }

export function TopicGrid({
  subjects,
  showMix = true,
}: {
  subjects: Subject[]
  showMix?: boolean
}) {
  const user = useUser()
  const accessible = user.tier === "paid"

  return (
    <div className="flex flex-col">
      {showMix && (
        <Link
          href="/quiz?subject=__random__"
          className="relative mb-5 flex items-center gap-4 overflow-hidden rounded-2xl bg-ink px-5 py-4 text-ink-foreground transition-transform duration-200 active:scale-[0.985]"
        >
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold tracking-tight">
              Random mix
            </p>
            <p className="text-sm text-ink-foreground/70">
              Ten questions, all topics
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ArrowRight className="size-5" weight="bold" />
          </span>
        </Link>
      )}

      <ul>
        {subjects.map((subject, i) => (
          <li key={subject.name}>
            <Link
              href={
                accessible
                  ? `/subjects/${encodeURIComponent(subject.name)}`
                  : "/account"
              }
              className="-mx-2 flex items-center gap-3 border-b border-border px-2 py-[1.125rem] transition-colors active:bg-muted min-[375px]:gap-4"
            >
              <span className="w-7 shrink-0 font-display text-[0.9375rem] text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[1.0625rem] leading-snug font-semibold">
                  {subject.name}
                </p>
                <p className="mt-0.5 text-[0.9375rem] text-muted-foreground tabular-nums">
                  {subject.count} questions
                </p>
              </div>
              {accessible ? (
                <CaretRight
                  className="size-5 shrink-0 text-muted-foreground"
                  weight="bold"
                />
              ) : (
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Lock className="size-4" weight="bold" />
                  Pro
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
