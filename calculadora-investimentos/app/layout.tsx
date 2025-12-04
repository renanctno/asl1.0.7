import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calculadora de Investimentos',
  description: 'Calculadora completa de investimentos com simulação detalhada, imposto de renda e comparação de rentabilidade.',
  authors: [{ name: 'Investment Calculator' }],
  keywords: 'investimentos,calculadora,Tesouro,CDB,LCI,LCA,simulação,imposto de renda',
  openGraph: {
    title: 'Calculadora de Investimentos',
    description: 'Simule e compare diferentes tipos de investimentos com cálculo de imposto de renda',
    url: 'https://chat.z.ai',
    siteName: 'Investment Calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Investimentos',
    description: 'Simule e compare diferentes tipos de investimentos com cálculo de imposto de renda',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}