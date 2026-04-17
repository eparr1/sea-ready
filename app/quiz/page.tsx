'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { QuizProvider } from '@/lib/quiz-context'
import { QuizSession } from '@/components/quiz/QuizSession'
import { Question } from '@/lib/questions'
import { ChevronLeft } from 'lucide-react'

function QuizPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subject = searchParams.get('subject') || '__random__'

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/questions')
      .then(r => r.json())
      .then(data => {
        const allQuestions: Question[] = data.questions
        const isRandom = subject === '__random__'

        const filtered = isRandom
          ? [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
          : allQuestions.filter(q => q.subject === subject)

        if (filtered.length === 0) {
          router.replace('/topics')
          return
        }

        setQuestions(filtered)
        setLoading(false)
      })
  }, [subject])

  const displayName = subject === '__random__' ? 'Random Mix' : subject

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

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading questions…</p>
        </div>
      ) : (
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
