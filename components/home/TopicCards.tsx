'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Compass, Shield, Cloud, BookOpen, Anchor, Waves, MapPin, Zap } from 'lucide-react'

type Subject = { name: string; count: number }

const topicIcons: Record<string, React.ElementType> = {
  colregs: Compass,
  navigation: MapPin,
  safety: Shield,
  meteorology: Cloud,
  weather: Cloud,
  seamanship: Anchor,
  tides: Waves,
  rules: BookOpen,
  electrical: Zap,
}

function getIcon(name: string): React.ElementType {
  const key = name.toLowerCase()
  for (const [k, Icon] of Object.entries(topicIcons)) {
    if (key.includes(k)) return Icon
  }
  return BookOpen
}

const topicColors = [
  'from-blue-50 to-sky-50 border-blue-100 hover:border-blue-300',
  'from-slate-50 to-zinc-50 border-slate-200 hover:border-slate-400',
  'from-cyan-50 to-teal-50 border-cyan-100 hover:border-cyan-300',
  'from-indigo-50 to-blue-50 border-indigo-100 hover:border-indigo-300',
  'from-sky-50 to-blue-50 border-sky-100 hover:border-sky-300',
  'from-teal-50 to-cyan-50 border-teal-100 hover:border-teal-300',
]

const iconColors = [
  'text-blue-600',
  'text-slate-600',
  'text-cyan-600',
  'text-indigo-600',
  'text-sky-600',
  'text-teal-600',
]

export function TopicCards({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject, i) => {
        const Icon = getIcon(subject.name)
        const colorClass = topicColors[i % topicColors.length]
        const iconColor = iconColors[i % iconColors.length]

        return (
          <button
            key={subject.name}
            onClick={() => router.push(`/quiz?subject=${encodeURIComponent(subject.name)}`)}
            className={`group relative flex flex-col gap-4 rounded-2xl border bg-linear-to-br ${colorClass} p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl bg-white/80 p-2.5 shadow-sm ${iconColor}`}>
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <ArrowRight
                className="h-4 w-4 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">{subject.name}</p>
              <p className="mt-1 text-sm text-slate-500">{subject.count} questions</p>
            </div>
          </button>
        )
      })}

      <button
        onClick={() => router.push('/quiz?subject=__random__')}
        className="group relative flex flex-col gap-4 rounded-2xl border border-blue-200 bg-linear-to-br from-blue-600 to-blue-700 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-200"
      >
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-white/20 p-2.5">
            <Zap className="h-5 w-5 text-white" strokeWidth={1.75} />
          </div>
          <ArrowRight
            className="h-4 w-4 text-blue-200 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
            strokeWidth={2}
          />
        </div>
        <div>
          <p className="font-semibold text-white leading-tight">Random Mix</p>
          <p className="mt-1 text-sm text-blue-200">10 questions, all topics</p>
        </div>
      </button>
    </div>
  )
}
