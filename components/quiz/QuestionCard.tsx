'use client'

import { useQuiz } from '@/lib/quiz-context'

export function QuestionCard() {
  const { questions, currentIndex, selectedIndex, isRevealed, selectAnswer } = useQuiz()

  const current = questions[currentIndex]

  if (!current) return null

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
          {currentIndex + 1}/{questions.length}
        </span>
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-base font-semibold text-foreground leading-snug">{current.question}</h2>

      <div className="flex flex-col gap-2.5">
        {current.options.map((option, index) => {
          let variant: 'correct' | 'wrong' | 'idle' = 'idle'

          if (isRevealed) {
            if (index === current.correctIndex) variant = 'correct'
            else if (index === selectedIndex) variant = 'wrong'
          }

          const styles = {
            idle: 'border border-border bg-card hover:border-primary/40 hover:bg-accent text-foreground',
            correct: 'border border-green-500 bg-green-50 text-green-900',
            wrong: 'border border-red-400 bg-red-50 text-red-900',
          }

          return (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              disabled={isRevealed}
              className={`w-full min-h-13 rounded-xl px-4 py-3 text-left text-sm transition-all duration-150 active:scale-[0.99] ${styles[variant]}`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {isRevealed && (
        <div className="rounded-xl border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground leading-relaxed">
          {current.explanation}
        </div>
      )}
    </div>
  )
}
