import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { getQuestions, getSubjects } from "@/lib/questions"
import { ProgressWidget } from "@/components/home/ProgressWidget"
import { Greeting } from "@/components/home/Greeting"
import { Logo } from "@/components/brand/Logo"
import { TopicGrid } from "@/components/quiz/TopicGrid"

export default function HomePage() {
  const questions = getQuestions()
  const subjects = getSubjects(questions)

  return (
    <main className="screen">
      <header className="flex h-11 items-center">
        <Logo />
      </header>

      <section className="mt-4 [@media(min-height:700px)]:mt-7">
        <Greeting />
        <p className="mt-2 text-base text-muted-foreground [@media(max-height:700px)]:hidden">
          Ready for a quick round?
        </p>
      </section>

      <Link
        href="/quiz?subject=__random__"
        className="group mt-5 flex flex-col gap-4 rounded-3xl bg-ink p-5 text-ink-foreground transition-transform duration-200 active:scale-[0.985] sm:flex-row sm:items-center sm:justify-between sm:gap-6 [@media(min-height:700px)]:mt-6"
      >
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-medium text-ink-foreground/70">
            Quick mix
          </p>
          <h2 className="mt-1 font-display text-[clamp(1.375rem,6vw,1.75rem)] leading-[1.1] font-semibold tracking-tight">
            Ten questions from every topic
          </h2>
          <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-snug text-ink-foreground/70">
            A random warm-up across all subjects. Each answer is explained, so
            you learn as you go. Takes about five minutes.
          </p>
          <p className="mt-2 text-sm text-ink-foreground/60 tabular-nums">
            {questions.length} questions in the bank
          </p>
        </div>
        <span className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary pr-5 pl-6 text-lg font-semibold text-primary-foreground transition-transform duration-200 group-hover:brightness-110 group-active:translate-x-0.5">
          Start
          <ArrowRight className="size-6" weight="bold" />
        </span>
      </Link>

      <ProgressWidget />

      <section className="mt-6 [@media(min-height:700px)]:mt-8">
        <h2 className="mb-1 text-[0.9375rem] font-medium text-muted-foreground">
          Subjects
        </h2>
        <TopicGrid subjects={subjects} showMix={false} />
      </section>
    </main>
  )
}
