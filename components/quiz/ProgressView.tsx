'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProgress, getProgressBySubject, ProgressRecord } from '@/lib/progress'

export function ProgressView() {
  const router = useRouter()
  const [records, setRecords] = useState<ProgressRecord[]>([])

  useEffect(() => {
    setRecords(getProgress())
  }, [])

  const bySubject = getProgressBySubject(records)

  if (bySubject.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card px-5 py-5">
          <p className="text-sm text-muted-foreground">No quizzes completed yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Complete a quiz to see your scores here.</p>
        </div>
        <button
          onClick={() => router.push('/topics')}
          className="w-full min-h-13 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Choose a Topic
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {bySubject.map(({ subject, best, attempts, lastPlayed }) => (
        <button
          key={subject}
          onClick={() => router.push(`/quiz?subject=${encodeURIComponent(subject)}`)}
          className="w-full rounded-xl border border-border bg-card px-4 py-4 text-left transition-all duration-150 hover:border-primary/40 hover:bg-accent active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-semibold text-foreground text-sm">{subject}</span>
            <span className="text-sm font-bold text-primary">{best}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${best}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {attempts} attempt{attempts !== 1 ? 's' : ''} · Last {new Date(lastPlayed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </button>
      ))}

      <p className="text-xs text-muted-foreground text-center pt-1">
        Stored on this device only.
      </p>

      <button
        onClick={() => router.push('/topics')}
        className="w-full min-h-13 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors active:scale-[0.98]"
      >
        Back to Topics
      </button>
    </div>
  )
}
