'use client';

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

// DİKKAT: buradaki next/font/google importlarını kaldırıyoruz
// import { Inter, Poppins, Montserrat } from 'next/font/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <title>Pin25 Foods & Cloud Kitchen</title>
        <meta
          name="description"
          content="Sağlıklı yemek aboneliği ve kurumsal çözümler."
        />
      </head>
      {/* font-body yerine Tailwind system font kullanıyoruz */}
      <body className="font-sans bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {!isAdminPage && <Header />}
          <main>{children}</main>
          {!isAdminPage && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  )
}
