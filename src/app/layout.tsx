import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  title: 'AI Assistant - Smart Chat Interface',
  description: 'Fast, modern AI chatbot with intelligent responses and user-friendly design. Built with Next.js and Tailwind CSS.',
  keywords: 'AI, chatbot, assistant, OpenAI, Next.js, modern chat interface',
  authors: [{ name: 'AI Chatbot Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  )
}
