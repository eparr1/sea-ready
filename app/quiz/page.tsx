"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { QuizProvider } from "@/lib/quiz-context"
import { QuizSession } from "@/components/quiz/QuizSession"
import { Question } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { WifiSlash, X } from "@phosphor-icons/react"

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function QuizSkeleton() {
  return (
    <div
      className="mt-2 flex flex-col gap-3"
      aria-busy="true"
      aria-label="Loading questions"
    >
      <div className="h-2 animate-pulse rounded-full bg-muted" />
      <div className="mt-6 h-6 w-4/5 animate-pulse rounded-lg bg-muted" />
      <div className="h-6 w-3/5 animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

function QuizPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const subject = searchParams.get("subject") || "__random__"
  const topic = searchParams.get("topic") || ""

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    setLoading(true)
    setOffline(false)

    const controller = new AbortController()

    // Fetch the static JSON directly — it's precached by the service worker,
    // so filtering works correctly offline for any topic.
    fetch("/questions.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: { questions: (Question & { correctIndex?: number })[] }) => {
        // Normalize legacy correctIndex → correctIndexes
        const allQuestions: Question[] = data.questions.map((q) => ({
          ...q,
          correctIndexes:
            q.correctIndexes ??
            (q.correctIndex !== undefined ? [q.correctIndex] : [0]),
        }))
        const isRandom = subject === "__random__"
        const isMix = topic === "__mix__"

        let filtered: Question[]
        if (isRandom) {
          filtered = shuffleArray(allQuestions).slice(0, 10)
        } else if (isMix) {
          filtered = shuffleArray(
            allQuestions.filter((q) => q.subject === subject)
          ).slice(0, 20)
        } else if (topic) {
          filtered = allQuestions.filter(
            (q) => q.subject === subject && q.topic === topic
          )
        } else {
          filtered = allQuestions.filter((q) => q.subject === subject)
        }

        if (filtered.length === 0) {
          router.replace("/topics")
          return
        }

        setQuestions(filtered)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setOffline(true)
        setLoading(false)
      })

    return () => controller.abort()
  }, [subject, topic])

  const displayName =
    subject === "__random__"
      ? "Random Mix"
      : topic === "__mix__"
        ? `${subject} - Topic Mix`
        : topic || subject

  return (
    <main className="screen screen-focus">
      <div className="mb-4 flex items-center gap-1">
        <button
          onClick={() => router.back()}
          aria-label="Close quiz"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full transition-colors active:bg-muted"
        >
          <X className="size-6" weight="bold" />
        </button>
        <p className="truncate text-sm font-medium text-muted-foreground">
          {displayName}
        </p>
      </div>

      {loading && <QuizSkeleton />}

      {offline && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 pb-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <WifiSlash className="size-7 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold">You&apos;re offline</p>
            <p className="mx-auto mt-1 max-w-[32ch] text-sm text-muted-foreground">
              Open the app once with a connection to save the questions, then it
              works offline.
            </p>
          </div>
          <Button size="lg" className="w-full" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      )}

      {!loading && !offline && (
        <QuizProvider>
          <QuizSession
            questions={questions}
            subject={displayName}
            href={`/quiz?${searchParams.toString()}`}
          />
        </QuizProvider>
      )}
    </main>
  )
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizPageInner />
    </Suspense>
  )
}
