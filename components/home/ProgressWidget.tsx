"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CaretRight, ChartBar } from "@phosphor-icons/react"
import { getProgress, ProgressRecord } from "@/lib/progress"

export function ProgressWidget() {
  const [records, setRecords] = useState<ProgressRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setRecords(getProgress())
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="mt-5 h-[3.75rem] animate-pulse rounded-2xl bg-muted"
        aria-hidden="true"
      />
    )
  }

  if (records.length === 0) {
    return (
      <section className="mt-5 flex items-center gap-3 rounded-2xl bg-muted px-4 py-3.5">
        <ChartBar
          className="size-6 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-[0.9375rem] leading-snug text-muted-foreground">
          <span className="font-semibold text-foreground">No scores yet.</span>{" "}
          Take your first quiz.
        </p>
      </section>
    )
  }

  const total = records.length
  const avg = Math.round(
    records.reduce((a, r) => a + (r.score / r.total) * 100, 0) / records.length
  )
  const last = records[records.length - 1]
  const lastPct = Math.round((last.score / last.total) * 100)

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[0.9375rem] font-medium text-muted-foreground">
          Your progress
        </h2>
        <Link
          href="/progress"
          className="-my-3 py-3 text-[0.9375rem] font-semibold text-brand"
        >
          See all
        </Link>
      </div>

      <div className="mt-2 grid grid-cols-2 divide-x divide-border">
        <div className="pr-4">
          <p className="font-display text-[2.5rem] leading-none font-semibold tracking-tight tabular-nums">
            {total}
          </p>
          <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
            {total === 1 ? "quiz" : "quizzes"} completed
          </p>
        </div>
        <div className="pl-4">
          <p className="font-display text-[2.5rem] leading-none font-semibold tracking-tight tabular-nums">
            {avg}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>
          <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
            average score
          </p>
        </div>
      </div>

      <Link
        href={last.href ?? "/topics"}
        className="mt-4 flex items-center gap-3 rounded-2xl bg-muted px-4 py-3.5 transition-colors active:bg-accent"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[0.8125rem] font-medium text-muted-foreground">
            Last quiz
          </p>
          <p className="mt-0.5 truncate text-base font-semibold">
            {last.subject}
          </p>
        </div>
        <span className="font-display text-xl font-semibold tabular-nums">
          {lastPct}%
        </span>
        <CaretRight
          className="size-5 shrink-0 text-muted-foreground"
          weight="bold"
        />
      </Link>
    </section>
  )
}
