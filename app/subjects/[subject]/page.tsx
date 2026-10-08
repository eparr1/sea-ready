import { getQuestions, getTopics } from "@/lib/questions"
import { SubjectTopicList } from "@/components/quiz/SubjectTopicList"
import { PageHeader } from "@/components/app/PageHeader"

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: rawSubject } = await params
  const subject = decodeURIComponent(rawSubject)
  const questions = getQuestions()
  const topics = getTopics(questions, subject)

  return (
    <main className="screen">
      <PageHeader
        title={subject}
        subtitle="Choose a topic, or mix them all."
        backHref="/topics"
      />
      <SubjectTopicList subject={subject} topics={topics} />
    </main>
  )
}
