import { ProgressView } from "@/components/quiz/ProgressView"
import { PageHeader } from "@/components/app/PageHeader"

export default function ProgressPage() {
  return (
    <main className="screen">
      <PageHeader title="Progress" subtitle="Your best score for each quiz." />
      <ProgressView />
    </main>
  )
}
