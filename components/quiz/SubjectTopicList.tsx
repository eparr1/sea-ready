"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, CaretRight } from "@phosphor-icons/react"
import { getProgress, getProgressBySubject } from "@/lib/progress"

type Topic = { name: string; count: number }

export function SubjectTopicList({
  subject,
  topics,
}: {
  subject: string
  topics: Topic[]
}) {
  const [best, setBest] = useState<Record<string, number>>({})

  useEffect(() => {
    const map: Record<string, number> = {}
    for (const p of getProgressBySubject(getProgress())) map[p.subject] = p.best
    setBest(map)
  }, [])

  const base = `/quiz?subject=${encodeURIComponent(subject)}`

  return (
    <div className="flex flex-col">
      <Link
        href={`${base}&topic=__mix__`}
        className="relative mb-6 flex items-center gap-4 overflow-hidden rounded-2xl bg-ink px-5 py-4 text-ink-foreground transition-transform duration-200 active:scale-[0.985]"
      >
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold tracking-tight">
            Topic mix
          </p>
          <p className="text-sm text-ink-foreground/70">
            Up to 20 questions across every topic
          </p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ArrowRight className="size-5" weight="bold" />
        </span>
      </Link>

      <h2 className="mb-1 text-sm font-medium text-muted-foreground">Topics</h2>
      <ul>
        {topics.map((topic) => {
          const score = best[topic.name]
          return (
            <li key={topic.name}>
              <Link
                href={`${base}&topic=${encodeURIComponent(topic.name)}`}
                className="-mx-2 flex items-center gap-4 border-b border-border px-2 py-4 transition-colors active:bg-muted/70"
              >
                <div className="min-w-0 flex-1">
                  <p className="leading-snug font-semibold break-words">
                    {topic.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
                    {topic.count} questions
                  </p>
                </div>
                {score !== undefined && (
                  <span className="font-display text-lg font-semibold tabular-nums">
                    {score}
                    <span className="text-sm text-muted-foreground">%</span>
                  </span>
                )}
                <CaretRight
                  className="size-5 shrink-0 text-muted-foreground"
                  weight="bold"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
