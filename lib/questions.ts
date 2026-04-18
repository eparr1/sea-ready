import { readFileSync } from 'fs'
import { join } from 'path'

export type Question = {
  id: number
  subject: string
  topic: string
  question: string
  options: string[]
  correctIndex: number
  difficulty: string
  tierLabel: string
  explanation: string
}

export function getQuestions(): Question[] {
  const filePath = join(process.cwd(), 'public', 'questions.json')
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return data.questions as Question[]
  } catch {
    console.warn('questions.json not found – run: npm run fetch-questions')
    return []
  }
}

export function getSubjects(questions: Question[]) {
  const map = new Map<string, { name: string; count: number }>()
  for (const q of questions) {
    const existing = map.get(q.subject)
    if (existing) existing.count++
    else map.set(q.subject, { name: q.subject, count: 1 })
  }
  return Array.from(map.values())
}

export function getTopics(questions: Question[], subject: string) {
  const map = new Map<string, { name: string; count: number }>()
  for (const q of questions.filter(q => q.subject === subject)) {
    const topic = q.topic || 'General'
    const existing = map.get(topic)
    if (existing) existing.count++
    else map.set(topic, { name: topic, count: 1 })
  }
  return Array.from(map.values())
}

export function getTierLabels(questions: Question[]) {
  const map = new Map<string, number>()
  for (const q of questions) {
    map.set(q.tierLabel, (map.get(q.tierLabel) ?? 0) + 1)
  }
  return Array.from(map.entries()).map(([label, count]) => ({ label, count }))
}
