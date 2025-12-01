'use client';

import type { Metadata } from 'next'
import { Inter, Poppins, Montserrat } from 'next/font/google'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const montserrat = Montserrat({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <html lang="tr" className={`${inter.variable} ${poppins.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <title>Pin25 Foods & Cloud Kitchen</title>
        <meta name="description" content="Sağlıklı yemek aboneliği ve kurumsal çözümler." />
      </head>
      <body className="font-body bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {!isAdminPage && <Header />}
          <main>{children}</main>
          {!isAdminPage && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  )
}
