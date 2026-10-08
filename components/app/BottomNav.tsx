"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenText,
  ChartBar,
  SquaresFour,
  UserCircle,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    href: "/",
    label: "Learn",
    Icon: BookOpenText,
    match: (p: string) => p === "/",
  },
  {
    href: "/topics",
    label: "Topics",
    Icon: SquaresFour,
    match: (p: string) => p.startsWith("/topics") || p.startsWith("/subjects"),
  },
  {
    href: "/progress",
    label: "Progress",
    Icon: ChartBar,
    match: (p: string) => p.startsWith("/progress"),
  },
  {
    href: "/account",
    label: "Account",
    Icon: UserCircle,
    match: (p: string) => p.startsWith("/account"),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  // Quiz is a focus screen: no tab bar.
  if (pathname.startsWith("/quiz")) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-lg px-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname)
          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors active:scale-95",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon
                  className="size-7"
                  weight={active ? "fill" : "regular"}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
