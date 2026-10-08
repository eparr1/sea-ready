"use client"

import { useEffect, useState } from "react"

export function Greeting() {
  const [greeting, setGreeting] = useState("Good morning")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return (
    <h1 className="text-[clamp(2.25rem,11.5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
      {greeting}.
    </h1>
  )
}
