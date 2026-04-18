'use client'

import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { ArrowRight } from 'lucide-react'

type Subject = { name: string; count: number }

export function TopicGrid({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()
  const user = useUser()

  function isAccessible() {
    return user.tier === 'paid'
  }

  function handleSelect(subjectName: string) {
    if (subjectName === '__random__') {
      router.push('/quiz?subject=__random__')
    } else {
      router.push(`/subjects/${encodeURIComponent(subjectName)}`)
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {subjects.map((subject) => {
        const accessible = isAccessible()
        return (
          <button
            key={subject.name}
            onClick={() => accessible && handleSelect(subject.name)}
            className={`group w-full rounded-xl border px-4 py-4 text-left transition-all duration-150 active:scale-[0.99]
              ${accessible
                ? 'border-border bg-card hover:border-primary/40 hover:bg-accent'
                : 'border-border bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground">{subject.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">{subject.count} questions</span>
              </div>
              {accessible
                ? <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                : <span className="text-sm opacity-50">🔒</span>
              }
            </div>
          </button>
        )
      })}

      <button
        onClick={() => handleSelect('__random__')}
        className="w-full rounded-xl bg-primary px-4 py-4 text-left transition-all duration-150 active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-primary-foreground">Random Mix</span>
            <span className="ml-2 text-xs text-primary-foreground/70">all topics</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary-foreground/70" strokeWidth={2} />
        </div>
      </button>
    </div>
  )
}
