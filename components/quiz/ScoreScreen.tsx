"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/lib/quiz-context"
import { Question } from "@/lib/questions"
import { Button } from "@/components/ui/button"

type Props = {
  subject: string
  questions: Question[]
  onRestart: () => void
}

function arraysEqualSorted(a: number[], b: number[]) {
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.length === sb.length && sa.every((v, i) => v === sb[i])
}

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ScoreScreen({ subject, questions, onRestart }: Props) {
  const router = useRouter()
  const { score, answers } = useQuiz()
  const [filled, setFilled] = useState(false)

  const percentage = Math.round((score / questions.length) * 100)
  const wrongAnswers = answers.filter(
    (a) => !arraysEqualSorted(a.selectedIndexes, a.correctIndexes)
  )

  // Start empty, then fill, so the ring draws in.
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center pt-2 text-center">
        <p className="max-w-full text-sm font-medium break-words text-muted-foreground">
          {subject}
        </p>

        <div className="relative mt-5 size-48">
          <svg
            viewBox="0 0 120 120"
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="var(--muted)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={
                filled ? CIRCUMFERENCE * (1 - percentage / 100) : CIRCUMFERENCE
              }
              className="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-semibold tracking-tight tabular-nums">
              {percentage}
              <span className="text-2xl text-muted-foreground">%</span>
            </span>
          </div>
        </div>

        <p className="mt-5 text-lg font-semibold tabular-nums">
          {score} of {questions.length} correct
        </p>
        {wrongAnswers.length === 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            Perfect score. No mistakes to review.
          </p>
        )}
      </div>

      {wrongAnswers.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">
            Review{" "}
            <span className="text-muted-foreground tabular-nums">
              {wrongAnswers.length}
            </span>
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {wrongAnswers.map((answer, i) => {
              const question = questions.find((q) => q.id === answer.questionId)
              if (!question) return null
              const yourAnswerText =
                answer.selectedIndexes.length > 0
                  ? answer.selectedIndexes
                      .map((idx) => question.options[idx])
                      .join(", ")
                  : "No answer selected"
              const correctText = answer.correctIndexes
                .map((idx) => question.options[idx])
                .join(", ")
              return (
                <li
                  key={answer.questionId}
                  className="animate-in rounded-2xl bg-muted/70 p-4 duration-300 [animation-fill-mode:both] fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                >
                  <p className="leading-snug font-semibold">
                    {question.question}
                  </p>
                  <dl className="mt-3 flex flex-col gap-2 text-sm">
                    <div className="flex gap-3">
                      <dt className="w-[4.5rem] shrink-0 font-medium text-danger">
                        You chose
                      </dt>
                      <dd>{yourAnswerText}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-[4.5rem] shrink-0 font-medium text-success">
                        Answer
                      </dt>
                      <dd>{correctText}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                    {question.explanation}
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="action-bar flex flex-col gap-1">
        <Button size="lg" className="w-full" onClick={onRestart}>
          Try again
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={() => router.push("/")}
        >
          Back to home
        </Button>
      </div>
    </div>
  )
}
