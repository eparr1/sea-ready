export type ProgressRecord = {
  id: string
  userId: string
  subject: string
  score: number
  total: number
  completedAt: string
}

const STORAGE_KEY = 'mastermarinerpro-progress'

export function getProgress(): ProgressRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveProgress(data: {
  subject: string
  score: number
  total: number
}) {
  const records = getProgress()
  const newRecord: ProgressRecord = {
    id: crypto.randomUUID(),
    userId: 'local',
    subject: data.subject,
    score: data.score,
    total: data.total,
    completedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...records, newRecord]))
}

export function getProgressBySubject(records: ProgressRecord[]) {
  const map = new Map<string, {
    best: number
    attempts: number
    lastPlayed: string
  }>()

  for (const record of records) {
    const percentage = Math.round((record.score / record.total) * 100)
    const existing = map.get(record.subject)

    if (!existing) {
      map.set(record.subject, {
        best: percentage,
        attempts: 1,
        lastPlayed: record.completedAt,
      })
    } else {
      map.set(record.subject, {
        best: Math.max(existing.best, percentage),
        attempts: existing.attempts + 1,
        lastPlayed: record.completedAt > existing.lastPlayed
          ? record.completedAt
          : existing.lastPlayed,
      })
    }
  }

  return Array.from(map.entries()).map(([subject, data]) => ({ subject, ...data }))
}
