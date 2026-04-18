import Link from 'next/link'
import { getQuestions, getSubjects } from '@/lib/questions'
import { ProgressWidget } from '@/components/home/ProgressWidget'
import { Greeting } from '@/components/home/Greeting'
import { ArrowRight, ChartNoAxesColumn } from 'lucide-react'

export default function HomePage() {
  const questions = getQuestions()
  const subjects = getSubjects(questions)

  return (
    <div className="mx-auto max-w-lg min-h-svh flex flex-col">

      {/* App header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-0.5">MasterMarinerPro</p>
          <Greeting />
        </div>
        <Link
          href="/progress"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
          aria-label="View progress"
        >
          <ChartNoAxesColumn className="h-4 w-4 text-primary" strokeWidth={1.75} />
        </Link>
      </header>

      <div className="flex flex-col gap-6 px-5 pb-12 flex-1">

        {/* Subjects */}
        <div>
          <p className="text-sm font-semibold text-primary mb-3">Subjects</p>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                href={`/subjects/${encodeURIComponent(subject.name)}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-4 transition-all duration-150 hover:border-primary/40 hover:bg-accent active:scale-[0.98]"
              >
                <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{subject.name}</p>
                <p className="text-xs text-muted-foreground">{subject.count} questions</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Random Mix */}
        <Link
          href="/quiz?subject=__random__"
          className="group flex items-center justify-between rounded-2xl bg-primary px-6 py-5 transition-all duration-200 active:scale-[0.98]"
        >
          <div>
            <p className="font-semibold text-primary-foreground text-lg">Random Mix</p>
            <p className="mt-0.5 text-sm text-primary-foreground/70">
              {questions.length} questions · all subjects
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
            <ArrowRight className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
        </Link>

        {/* Progress */}
        <div>
          <p className="text-sm font-semibold text-primary mb-3">Your progress</p>
          <ProgressWidget />
        </div>

      </div>
    </div>
  )
}
