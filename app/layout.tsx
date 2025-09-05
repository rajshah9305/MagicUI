import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Magic UI Elite - AI-Powered UI Generation Platform',
  description: 'Transform your ideas into stunning user interfaces through revolutionary AI orchestration. Experience the future of design automation with real-time neural network visualization.',
  keywords: ['AI', 'UI Generation', 'Design Automation', 'CrewAI', 'Next.js', 'React'],
  authors: [{ name: 'Magic UI Elite Team' }],
  creator: 'Magic UI Elite',
  publisher: 'Magic UI Elite',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://magic-ui-elite.vercel.app'),
  openGraph: {
    title: 'Magic UI Elite - AI-Powered UI Generation Platform',
    description: 'Transform your ideas into stunning user interfaces through revolutionary AI orchestration.',
    url: 'https://magic-ui-elite.vercel.app',
    siteName: 'Magic UI Elite',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Magic UI Elite - AI-Powered UI Generation Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magic UI Elite - AI-Powered UI Generation Platform',
    description: 'Transform your ideas into stunning user interfaces through revolutionary AI orchestration.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-token-bg text-token-text antialiased">
        <div className="aurora-bg" />
        <div className="relative z-10">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--glass-bg)',
              color: 'var(--color-text)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(20px)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-success)',
                secondary: 'var(--color-bg)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--color-error)',
                secondary: 'var(--color-bg)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}