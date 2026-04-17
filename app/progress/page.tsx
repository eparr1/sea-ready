import { ProgressView } from '@/components/quiz/ProgressView'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-lg min-h-svh flex flex-col px-5 pt-12 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Your Progress</h1>
      </div>
      <ProgressView />
    </div>
  )
}
