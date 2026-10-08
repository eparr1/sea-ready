import type { Metadata, Viewport } from "next"
import { Barlow, Barlow_Semi_Condensed, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/user-context"
import { SubscriptionProvider } from "@/lib/subscription-context"
import { BottomNav } from "@/components/app/BottomNav"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
})
const barlowCondensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MasterMarinerPro",
  description: "Marine Studies Quiz App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MasterMarinerPro",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "/icons/favicon-32.png",
  },
}

export const viewport: Viewport = {
  // Draw under the notch / home indicator; screens pad with env(safe-area-inset-*).
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#06101c" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} font-sans antialiased`}
    >
      <body>
        <ThemeProvider>
          <UserProvider>
            <SubscriptionProvider>
              {children}
              <BottomNav />
            </SubscriptionProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
