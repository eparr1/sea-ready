import { getQuestions, getTopics } from '@/lib/questions'
import { SubjectTopicList } from '@/components/quiz/SubjectTopicList'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: rawSubject } = await params
  const subject = decodeURIComponent(rawSubject)
  const questions = getQuestions()
  const topics = getTopics(questions, subject)

  return (
    <div className="mx-auto max-w-lg min-h-svh flex flex-col px-5 pt-12 pb-12">
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/topics"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2} />
        </Link>
        <h1 className="text-xl font-bold text-foreground tracking-tight">{subject}</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8 ml-11">Select a topic to start a quiz</p>
      <SubjectTopicList subject={subject} topics={topics} />
    </div>
  )
}
