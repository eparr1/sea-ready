'use client'

import { createContext, useContext, useState } from 'react'
import { Question } from '@/lib/questions'

type Answer = {
  questionId: number
  selectedIndex: number
  correctIndex: number
}

type QuizState = {
  questions: Question[]
  currentIndex: number
  selectedIndex: number | null
  isRevealed: boolean
  score: number
  answers: Answer[]
  isFinished: boolean
}

type QuizContextType = QuizState & {
  startQuiz: (questions: Question[]) => void
  selectAnswer: (index: number) => void
  nextQuestion: () => void
}

const QuizContext = createContext<QuizContextType | null>(null)

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedIndex: null,
    isRevealed: false,
    score: 0,
    answers: [],
    isFinished: false,
  })

  function startQuiz(questions: Question[]) {
    setState({
      questions,
      currentIndex: 0,
      selectedIndex: null,
      isRevealed: false,
      score: 0,
      answers: [],
      isFinished: false,
    })
  }

  function selectAnswer(index: number) {
    if (state.isRevealed) return
    const current = state.questions[state.currentIndex]
    const isCorrect = index === current.correctIndex
    setState(prev => ({
      ...prev,
      selectedIndex: index,
      isRevealed: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, {
        questionId: current.id,
        selectedIndex: index,
        correctIndex: current.correctIndex,
      }],
    }))
  }

  function nextQuestion() {
    const isLast = state.currentIndex === state.questions.length - 1
    setState(prev => ({
      ...prev,
      currentIndex: isLast ? prev.currentIndex : prev.currentIndex + 1,
      selectedIndex: null,
      isRevealed: false,
      isFinished: isLast,
    }))
  }

  return (
    <QuizContext.Provider value={{ ...state, startQuiz, selectAnswer, nextQuestion }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
