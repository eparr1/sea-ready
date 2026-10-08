'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const isLogin = mode === 'login'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) return setError(error.message)
    // With email confirmation on, signUp returns no session until the link is clicked.
    if (!data.session) return setNotice('Check your email to confirm your account, then log in.')
    router.push('/topics')
    router.refresh()
  }

  const field =
    'h-11 w-full rounded-lg border border-border bg-card px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50'

  return (
    <main className="screen justify-center gap-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {isLogin ? 'Log in' : 'Create account'}
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
        <Button type="submit" disabled={busy} className="h-11">
          {isLogin ? 'Log in' : 'Sign up'}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        {isLogin ? 'No account? ' : 'Already have one? '}
        <Link href={isLogin ? '/signup' : '/login'} className="text-primary underline">
          {isLogin ? 'Sign up' : 'Log in'}
        </Link>
      </p>
    </main>
  )
}
