'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { QuizProvider } from '@/lib/quiz-context'
import { QuizSession } from '@/components/quiz/QuizSession'
import { Question } from '@/lib/questions'
import { ChevronLeft, WifiOff } from 'lucide-react'

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function QuizPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subject = searchParams.get('subject') || '__random__'
  const topic = searchParams.get('topic') || ''

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    setLoading(true)
    setOffline(false)

    const controller = new AbortController()

    // Fetch the static JSON directly — it's precached by the service worker,
    // so filtering works correctly offline for any topic.
    fetch('/questions.json', { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: { questions: (Question & { correctIndex?: number })[] }) => {
        // Normalize legacy correctIndex → correctIndexes
        const allQuestions: Question[] = data.questions.map(q => ({
          ...q,
          correctIndexes: q.correctIndexes ?? (q.correctIndex !== undefined ? [q.correctIndex] : [0]),
        }))
        const isRandom = subject === '__random__'
        const isMix = topic === '__mix__'

        let filtered: Question[]
        if (isRandom) {
          filtered = shuffleArray(allQuestions).slice(0, 10)
        } else if (isMix) {
          filtered = shuffleArray(allQuestions.filter(q => q.subject === subject)).slice(0, 20)
        } else if (topic) {
          filtered = allQuestions.filter(q => q.subject === subject && q.topic === topic)
        } else {
          filtered = allQuestions.filter(q => q.subject === subject)
        }

        if (filtered.length === 0) {
          router.replace('/topics')
          return
        }

        setQuestions(filtered)
        setLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setOffline(true)
        setLoading(false)
      })

    return () => controller.abort()
  }, [subject, topic])

  const displayName =
    subject === '__random__'
      ? 'Random Mix'
      : topic === '__mix__'
        ? `${subject} — Topic Mix`
        : topic || subject

  return (
    <div className="mx-auto max-w-lg min-h-svh flex flex-col px-5 pt-12 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2} />
        </button>
        <h1 className="text-xl font-bold tracking-tight truncate">{displayName}</h1>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading questions…</p>
        </div>
      )}

      {offline && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-semibold text-foreground">You're offline</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Visit the app once with wifi to cache the questions, then it works offline.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Back to home
          </button>
        </div>
      )}

      {!loading && !offline && (
        <QuizProvider>
          <QuizSession questions={questions} subject={displayName} />
        </QuizProvider>
      )}
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizPageInner />
    </Suspense>
  )
}
