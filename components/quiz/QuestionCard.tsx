'use client'

import { useQuiz } from '@/lib/quiz-context'

export function QuestionCard() {
  const { questions, currentIndex, selectedIndexes, isRevealed, selectAnswer, confirmAnswers } = useQuiz()

  const current = questions[currentIndex]

  if (!current) return null

  const isMultiple = current.correctIndexes.length > 1

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

      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground leading-snug">{current.question}</h2>
        {isMultiple && !isRevealed && (
          <p className="text-xs text-muted-foreground">
            Select all correct answers ({current.correctIndexes.length} correct)
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {current.options.map((option, index) => {
          const isSelected = selectedIndexes.includes(index)
          const isCorrect = current.correctIndexes.includes(index)

          let variant: 'correct' | 'wrong' | 'selected' | 'idle' = 'idle'

          if (isRevealed) {
            if (isCorrect) variant = 'correct'
            else if (isSelected) variant = 'wrong'
          } else if (isSelected) {
            variant = 'selected'
          }

          const styles = {
            idle: 'border border-border bg-card hover:border-primary/40 hover:bg-accent text-foreground',
            selected: 'border border-primary bg-primary/10 text-foreground',
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
              <span className="flex items-center gap-3">
                {isMultiple && (
                  <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected && !isRevealed ? 'border-primary bg-primary' : 'border-current opacity-40'
                  }`}>
                    {isSelected && !isRevealed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    )}
                  </span>
                )}
                {option}
              </span>
            </button>
          )
        })}
      </div>

      {isMultiple && !isRevealed && (
        <button
          onClick={confirmAnswers}
          disabled={selectedIndexes.length === 0}
          className="w-full min-h-13 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
      )}

      {isRevealed && (
        <div className="rounded-xl border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground leading-relaxed">
          {current.explanation}
        </div>
      )}
    </div>
  )
}
