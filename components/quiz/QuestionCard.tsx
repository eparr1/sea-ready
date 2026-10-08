"use client"

import { useEffect } from "react"
import { useQuiz } from "@/lib/quiz-context"
import { Button } from "@/components/ui/button"
import { resultHaptic, tapHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

const LETTERS = ["A", "B", "C", "D", "E", "F"]

function sameSet(a: number[], b: number[]) {
  const sa = [...a].sort((x, y) => x - y)
  const sb = [...b].sort((x, y) => x - y)
  return sa.length === sb.length && sa.every((v, i) => v === sb[i])
}

const optionStyles = {
  idle: "border-border bg-card",
  selected: "border-foreground bg-card",
  correct: "border-success bg-success-soft",
  wrong: "border-danger bg-danger-soft",
  dim: "border-border bg-card opacity-50",
}

const badgeStyles = {
  idle: "bg-muted text-muted-foreground",
  selected: "bg-ink text-ink-foreground",
  correct: "bg-success text-background",
  wrong: "bg-danger text-background",
  dim: "bg-muted text-muted-foreground",
}

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  )
}

function Cross() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}

export function QuestionCard() {
  const {
    questions,
    currentIndex,
    selectedIndexes,
    isRevealed,
    selectAnswer,
    confirmAnswers,
    nextQuestion,
  } = useQuiz()

  const current = questions[currentIndex]
  const wasCorrect = current
    ? sameSet(selectedIndexes, current.correctIndexes)
    : false

  useEffect(() => {
    if (isRevealed) resultHaptic(wasCorrect)
  }, [isRevealed])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [currentIndex])

  if (!current) return null

  const isMultiple = current.correctIndexes.length > 1
  const isLast = currentIndex === questions.length - 1
  const answered = currentIndex + (isRevealed ? 1 : 0)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answered}
        >
          <div
            className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${answered / questions.length})` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <h2
        key={current.id}
        className="mt-8 animate-in text-[1.375rem] leading-snug font-semibold tracking-tight duration-300 fade-in slide-in-from-bottom-1"
      >
        {current.question}
      </h2>
      {current.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.image}
          alt="Diagram for this question"
          className="mt-4 max-h-64 w-full rounded-2xl border border-border bg-card object-contain"
        />
      )}
      {isMultiple && !isRevealed && (
        <p className="mt-2 text-sm text-muted-foreground">
          Choose {current.correctIndexes.length} answers.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {current.options.map((option, index) => {
          const isSelected = selectedIndexes.includes(index)
          const isCorrect = current.correctIndexes.includes(index)

          let state: keyof typeof optionStyles = "idle"
          if (isRevealed) {
            if (isCorrect) state = "correct"
            else if (isSelected) state = "wrong"
            else state = "dim"
          } else if (isSelected) {
            state = "selected"
          }

          return (
            <button
              key={index}
              onClick={() => {
                tapHaptic()
                selectAnswer(index)
              }}
              disabled={isRevealed}
              aria-pressed={isMultiple ? isSelected : undefined}
              className={cn(
                "flex min-h-16 w-full items-center gap-3.5 rounded-2xl border-2 p-3.5 text-left text-[0.9375rem] leading-snug transition-[colors,transform] duration-150 active:scale-[0.985]",
                optionStyles[state]
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-semibold transition-colors",
                  badgeStyles[state]
                )}
              >
                {state === "correct" || (state === "selected" && isMultiple) ? (
                  <Check />
                ) : state === "wrong" ? (
                  <Cross />
                ) : (
                  LETTERS[index]
                )}
              </span>
              <span className="flex-1">{option}</span>
              {isRevealed && isCorrect && (
                <span className="sr-only">Correct answer</span>
              )}
              {isRevealed && isSelected && !isCorrect && (
                <span className="sr-only">Your answer, incorrect</span>
              )}
            </button>
          )
        })}
      </div>

      {isRevealed && (
        <div
          className="mt-5 animate-in rounded-2xl bg-muted p-4 duration-300 fade-in slide-in-from-bottom-2"
          aria-live="polite"
        >
          <p
            className={cn(
              "text-sm font-semibold",
              wasCorrect ? "text-success" : "text-danger"
            )}
          >
            {wasCorrect ? "Correct" : "Not quite"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">
            {current.explanation}
          </p>
        </div>
      )}

      {isMultiple && !isRevealed && (
        <div className="action-bar">
          <Button
            size="lg"
            className="w-full"
            onClick={confirmAnswers}
            disabled={selectedIndexes.length === 0}
          >
            Check answer
          </Button>
        </div>
      )}

      {isRevealed && (
        <div className="action-bar">
          <Button size="lg" className="w-full" onClick={nextQuestion}>
            {isLast ? "See results" : "Next question"}
          </Button>
        </div>
      )}
    </div>
  )
}
