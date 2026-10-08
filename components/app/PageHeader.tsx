import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"

type Props = {
  title: string
  subtitle?: string
  /** Renders a back button linking here. Tab roots omit it. */
  backHref?: string
}

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Back"
      className="-ml-2 flex size-11 items-center justify-center rounded-full text-foreground transition-colors active:bg-muted"
    >
      <CaretLeft className="size-6" weight="bold" />
    </Link>
  )
}

export function PageHeader({ title, subtitle, backHref }: Props) {
  return (
    <header className="pt-2 pb-6">
      {backHref && <BackButton href={backHref} />}
      <h1
        className={`text-[2rem] leading-[1.05] font-semibold tracking-tight ${backHref ? "mt-2" : "mt-4"}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[0.9375rem] text-muted-foreground">
          {subtitle}
        </p>
      )}
    </header>
  )
}
