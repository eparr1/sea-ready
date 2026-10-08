"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CaretRight, ChartBar } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  getProgress,
  getProgressBySubject,
  ProgressRecord,
} from "@/lib/progress"

export function ProgressView() {
  const [records, setRecords] = useState<ProgressRecord[] | null>(null)

  useEffect(() => {
    setRecords(getProgress())
  }, [])

  if (records === null) {
    return (
      <div
        className="flex flex-col gap-4"
        aria-busy="true"
        aria-label="Loading progress"
      >
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  const bySubject = getProgressBySubject(records).sort((a, b) =>
    b.lastPlayed.localeCompare(a.lastPlayed)
  )

  if (bySubject.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 pb-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <ChartBar
            className="size-7 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div>
          <p className="text-lg font-semibold">No scores yet</p>
          <p className="mx-auto mt-1 max-w-[30ch] text-sm text-muted-foreground">
            Finish a quiz and your best result for each topic shows up here.
          </p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link href="/topics">Choose a topic</Link>
        </Button>
      </div>
    )
  }

  const avg = Math.round(
    records.reduce((a, r) => a + (r.score / r.total) * 100, 0) / records.length
  )

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 divide-x divide-border pb-6">
        <div className="pr-5">
          <p className="font-display text-4xl font-semibold tracking-tight tabular-nums">
            {records.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {records.length === 1 ? "quiz" : "quizzes"} completed
          </p>
        </div>
        <div className="pl-5">
          <p className="font-display text-4xl font-semibold tracking-tight tabular-nums">
            {avg}
            <span className="text-xl text-muted-foreground">%</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">average score</p>
        </div>
      </div>

      <ul className="border-t border-border">
        {bySubject.map(({ subject, best, attempts, lastPlayed, href }) => (
          <li key={subject}>
            <Link
              href={href ?? "/topics"}
              className="-mx-2 block border-b border-border px-2 py-4 transition-colors active:bg-muted/70"
            >
              <div className="flex items-center gap-3">
                <p className="min-w-0 flex-1 leading-snug font-semibold break-words">
                  {subject}
                </p>
                <span className="font-display text-2xl font-semibold tabular-nums">
                  {best}
                  <span className="text-sm text-muted-foreground">%</span>
                </span>
                <CaretRight
                  className="size-5 shrink-0 text-muted-foreground"
                  weight="bold"
                />
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-out"
                  style={{ transform: `scaleX(${best / 100})`, width: "100%" }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                Best of {attempts} {attempts === 1 ? "attempt" : "attempts"} ·
                Last played{" "}
                {new Date(lastPlayed).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="pt-5 text-center text-xs text-muted-foreground">
        Stored on this device only.
      </p>
    </div>
  )
}
