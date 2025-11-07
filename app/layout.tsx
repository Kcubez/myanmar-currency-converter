import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Myanmar Currency Converter',
  description: 'Convert Myanmar Kyat to other currencies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
