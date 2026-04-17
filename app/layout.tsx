import type { Metadata } from 'next'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/user-context"

export const metadata: Metadata = {
  title: 'SeaReady',
  description: 'Marine Studies Quiz App',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SeaReady',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: '/icons/favicon-32.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased font-sans">
      <body>
        <ThemeProvider>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
