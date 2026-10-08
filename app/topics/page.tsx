import { getQuestions, getSubjects } from "@/lib/questions"
import { TopicGrid } from "@/components/quiz/TopicGrid"
import { PageHeader } from "@/components/app/PageHeader"

export default function TopicsPage() {
  const questions = getQuestions()
  const subjects = getSubjects(questions)

  return (
    <main className="screen">
      <PageHeader
        title="Topics"
        subtitle="Pick a subject to start practising."
      />
      <TopicGrid subjects={subjects} />
    </main>
  )
}
