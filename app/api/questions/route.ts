import { getQuestions, getSubjects, getTierLabels } from '@/lib/questions'

export const dynamic = 'force-static'

export function GET() {
  const questions = getQuestions()

  return Response.json({
    questionCount: questions.length,
    questions,
    subjects: getSubjects(questions),
    tiers: getTierLabels(questions),
  })
}
