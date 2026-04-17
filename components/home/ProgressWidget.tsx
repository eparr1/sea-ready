'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProgress, getProgressBySubject, ProgressRecord } from '@/lib/progress'

export function ProgressWidget() {
  const router = useRouter()
  const [records, setRecords] = useState<ProgressRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setRecords(getProgress())
    setMounted(true)
  }, [])

  if (!mounted) return null

  const bySubject = getProgressBySubject(records)

  if (bySubject.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-4">
        <p className="text-sm text-muted-foreground">No quizzes completed yet.</p>
        <p className="text-xs text-muted-foreground mt-0.5">Your scores will appear here.</p>
      </div>
    )
  }

  const totalAttempts = records.length
  const avgScore = Math.round(
    records.reduce((a, r) => a + (r.score / r.total) * 100, 0) / records.length
  )
  const top = bySubject.slice(0, 3)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 mb-1">
        <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Quizzes</p>
          <p className="text-xl font-bold text-primary mt-0.5">{totalAttempts}</p>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Avg. score</p>
          <p className="text-xl font-bold text-primary mt-0.5">{avgScore}%</p>
        </div>
      </div>

      {top.map(({ subject, best }) => (
        <button
          key={subject}
          onClick={() => router.push(`/quiz?subject=${encodeURIComponent(subject)}`)}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all duration-150 hover:border-primary/40 hover:bg-accent active:scale-[0.98]"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-semibold text-foreground truncate">{subject}</p>
              <span className="text-xs font-bold text-primary ml-2 shrink-0">{best}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${best}%` }}
              />
            </div>
          </div>
        </button>
      ))}

      {bySubject.length > 3 && (
        <button
          onClick={() => router.push('/progress')}
          className="text-left text-xs text-muted-foreground hover:text-primary transition-colors px-1 pt-1"
        >
          +{bySubject.length - 3} more topics →
        </button>
      )}
    </div>
  )
}
