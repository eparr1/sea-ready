'use client'

import { createContext, useContext } from 'react'

type User = {
  id: string
  tier: 'free' | 'paid'
  isLoggedIn: boolean
}

const defaultUser: User = {
  id: 'local',
  tier: 'paid',
  isLoggedIn: false,
}

const UserContext = createContext<User>(defaultUser)

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={defaultUser}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): User {
  return useContext(UserContext)
}
