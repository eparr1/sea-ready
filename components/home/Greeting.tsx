'use client'

import { useEffect, useState } from 'react'

export function Greeting() {
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  return (
    <h1 className="text-xl font-bold text-foreground tracking-tight">{greeting}</h1>
  )
}
