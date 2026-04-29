'use client'

import { useRouter } from 'next/navigation'
import { useQuiz } from '@/lib/quiz-context'
import { Question } from '@/lib/questions'

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

export function ScoreScreen({ subject, questions, onRestart }: Props) {
  const router = useRouter()
  const { score, answers } = useQuiz()

  const percentage = Math.round((score / questions.length) * 100)
  const wrongAnswers = answers.filter(a => !arraysEqualSorted(a.selectedIndexes, a.correctIndexes))

  return (
    <div className="flex flex-col gap-5">

      <div className="rounded-2xl border border-border bg-card px-6 py-8 text-center">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">{subject}</p>
        <p className="text-7xl font-bold text-primary tracking-tight">{percentage}%</p>
        <p className="mt-2 text-sm text-muted-foreground">{score} of {questions.length} correct</p>
      </div>

      {wrongAnswers.length === 0 && (
        <div className="rounded-xl border border-primary/20 bg-accent px-4 py-3 text-center">
          <p className="text-sm font-medium text-accent-foreground">Perfect score — no mistakes!</p>
        </div>
      )}

      {wrongAnswers.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-primary">Review mistakes</p>
          {wrongAnswers.map((answer) => {
            const question = questions.find(q => q.id === answer.questionId)
            if (!question) return null
            const yourAnswerText = answer.selectedIndexes.length > 0
              ? answer.selectedIndexes.map(i => question.options[i]).join(', ')
              : 'No answer selected'
            const correctText = answer.correctIndexes.map(i => question.options[i]).join(', ')
            return (
              <div
                key={answer.questionId}
                className="rounded-xl border border-border bg-card px-4 py-4 flex flex-col gap-2 text-sm"
              >
                <p className="font-medium text-foreground leading-snug">{question.question}</p>
                <p className="text-red-500 text-xs">Your answer: {yourAnswerText}</p>
                <p className="text-green-600 text-xs">Correct: {correctText}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{question.explanation}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <button
          onClick={onRestart}
          className="w-full min-h-13 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full min-h-13 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors active:scale-[0.98]"
        >
          Home
        </button>
      </div>

    </div>
  )
}
