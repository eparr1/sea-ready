'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type User = {
  id: string
  tier: 'free' | 'paid'
  isLoggedIn: boolean
  email: string | null
  signOut: () => Promise<void>
}

const defaultUser: User = {
  id: 'local',
  tier: 'paid',
  isLoggedIn: false,
  email: null,
  signOut: async () => {},
}

const UserContext = createContext<User>(defaultUser)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [session, setSession] = useState<{ id: string; email: string | null } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setSession(u ? { id: u.id, email: u.email ?? null } : null)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s?.user ? { id: s.user.id, email: s.user.email ?? null } : null)
    })
    return () => data.subscription.unsubscribe()
  }, [supabase])

  const value = useMemo<User>(
    () => ({
      ...defaultUser,
      id: session?.id ?? defaultUser.id,
      email: session?.email ?? null,
      isLoggedIn: !!session,
      signOut: async () => {
        await supabase.auth.signOut()
      },
    }),
    [session, supabase],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser(): User {
  return useContext(UserContext)
}
