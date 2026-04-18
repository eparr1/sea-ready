'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Shuffle } from 'lucide-react'

type Topic = { name: string; count: number }

export function SubjectTopicList({ subject, topics }: { subject: string; topics: Topic[] }) {
  const router = useRouter()

  function handleTopicSelect(topicName: string) {
    router.push(`/quiz?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topicName)}`)
  }

  function handleTopicMix() {
    router.push(`/quiz?subject=${encodeURIComponent(subject)}&topic=__mix__`)
  }

  return (
    <div className="flex flex-col gap-2.5">
      {topics.map((topic) => (
        <button
          key={topic.name}
          onClick={() => handleTopicSelect(topic.name)}
          className="group w-full rounded-xl border border-border bg-card px-4 py-4 text-left transition-all duration-150 hover:border-primary/40 hover:bg-accent active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">{topic.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{topic.count} questions</span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
          </div>
        </button>
      ))}

      <button
        onClick={handleTopicMix}
        className="w-full rounded-xl bg-primary px-4 py-4 text-left transition-all duration-150 active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-primary-foreground">Topic Mix</span>
            <span className="ml-2 text-xs text-primary-foreground/70">up to 20 questions</span>
          </div>
          <Shuffle className="h-4 w-4 text-primary-foreground/70" strokeWidth={2} />
        </div>
      </button>
    </div>
  )
}
