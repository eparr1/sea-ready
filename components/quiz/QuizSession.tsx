"use client"

import { useEffect } from "react"
import { useQuiz } from "@/lib/quiz-context"
import { QuestionCard } from "./QuestionCard"
import { ScoreScreen } from "./ScoreScreen"
import { Question } from "@/lib/questions"
import { saveProgress } from "@/lib/progress"

type Props = {
  questions: Question[]
  subject: string
  /** URL of this quiz, saved with the result so lists can relaunch it. */
  href?: string
}

export function QuizSession({ questions, subject, href }: Props) {
  const { startQuiz, isFinished, score } = useQuiz()

  useEffect(() => {
    startQuiz(questions)
  }, [])

  useEffect(() => {
    if (isFinished) {
      saveProgress({ subject, score, total: questions.length, href })
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

  return <QuestionCard />
}
