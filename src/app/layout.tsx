import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import NextTopLoader from 'nextjs-toploader'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'B2B Industrial CRM',
  description: 'Farclean Internal CRM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full font-sans overflow-hidden">
        <NextTopLoader color="#2563eb" showSpinner={false} shadow="0 0 10px #2563eb,0 0 5px #2563eb" />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
