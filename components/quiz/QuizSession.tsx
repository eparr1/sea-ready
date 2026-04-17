'use client'

import { useEffect } from 'react'
import { useQuiz } from '@/lib/quiz-context'
import { QuestionCard } from './QuestionCard'
import { ScoreScreen } from './ScoreScreen'
import { Question } from '@/lib/questions'
import { saveProgress } from '@/lib/progress'

type Props = {
  questions: Question[]
  subject: string
}

export function QuizSession({ questions, subject }: Props) {
  const { startQuiz, isFinished, isRevealed, nextQuestion, score } = useQuiz()

  useEffect(() => {
    startQuiz(questions)
  }, [])

  useEffect(() => {
    if (isFinished) {
      saveProgress({ subject, score, total: questions.length })
    }
  }, [isFinished])

  if (isFinished) {
    return (
      <ScoreScreen
        subject={subject}
        questions={questions}
        onRestart={() => startQuiz(questions)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <QuestionCard />
      {isRevealed && (
        <button
          onClick={nextQuestion}
          className="w-full min-h-[48px] rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors"
        >
          Next Question
        </button>
      )}
    </div>
  )
}
