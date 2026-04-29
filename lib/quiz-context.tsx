'use client'

import { createContext, useContext, useState } from 'react'
import { Question } from '@/lib/questions'

type Answer = {
  questionId: number
  selectedIndexes: number[]
  correctIndexes: number[]
}

type QuizState = {
  questions: Question[]
  currentIndex: number
  selectedIndexes: number[]
  isRevealed: boolean
  score: number
  answers: Answer[]
  isFinished: boolean
}

type QuizContextType = QuizState & {
  startQuiz: (questions: Question[]) => void
  selectAnswer: (index: number) => void
  confirmAnswers: () => void
  nextQuestion: () => void
}

const QuizContext = createContext<QuizContextType | null>(null)

function arraysEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    selectedIndexes: [],
    isRevealed: false,
    score: 0,
    answers: [],
    isFinished: false,
  })

  function startQuiz(questions: Question[]) {
    setState({
      questions,
      currentIndex: 0,
      selectedIndexes: [],
      isRevealed: false,
      score: 0,
      answers: [],
      isFinished: false,
    })
  }

  function selectAnswer(index: number) {
    if (state.isRevealed) return
    const current = state.questions[state.currentIndex]
    const isMultiple = current.correctIndexes.length > 1

    if (isMultiple) {
      // Toggle selection for multi-answer questions
      setState(prev => ({
        ...prev,
        selectedIndexes: prev.selectedIndexes.includes(index)
          ? prev.selectedIndexes.filter(i => i !== index)
          : [...prev.selectedIndexes, index],
      }))
    } else {
      // Auto-reveal for single-answer questions
      const isCorrect = arraysEqual([index], current.correctIndexes)
      setState(prev => ({
        ...prev,
        selectedIndexes: [index],
        isRevealed: true,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: [...prev.answers, {
          questionId: current.id,
          selectedIndexes: [index],
          correctIndexes: current.correctIndexes,
        }],
      }))
    }
  }

  function confirmAnswers() {
    if (state.isRevealed) return
    const current = state.questions[state.currentIndex]
    const sorted = (arr: number[]) => [...arr].sort((a, b) => a - b)
    const isCorrect = arraysEqual(sorted(state.selectedIndexes), sorted(current.correctIndexes))
    setState(prev => ({
      ...prev,
      isRevealed: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, {
        questionId: current.id,
        selectedIndexes: prev.selectedIndexes,
        correctIndexes: current.correctIndexes,
      }],
    }))
  }

  function nextQuestion() {
    const isLast = state.currentIndex === state.questions.length - 1
    setState(prev => ({
      ...prev,
      currentIndex: isLast ? prev.currentIndex : prev.currentIndex + 1,
      selectedIndexes: [],
      isRevealed: false,
      isFinished: isLast,
    }))
  }

  return (
    <QuizContext.Provider value={{ ...state, startQuiz, selectAnswer, confirmAnswers, nextQuestion }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
