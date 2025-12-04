import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculadora de Investimentos",
  description: "Calculadora completa de investimentos com simulação detalhada, imposto de renda e comparação de rentabilidade.",
  keywords: ["investimentos", "calculadora", "Tesouro", "CDB", "LCI", "LCA", "simulação", "imposto de renda"],
  authors: [{ name: "Investment Calculator" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Calculadora de Investimentos",
    description: "Simule e compare diferentes tipos de investimentos com cálculo de imposto de renda",
    url: "https://chat.z.ai",
    siteName: "Investment Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Investimentos",
    description: "Simule e compare diferentes tipos de investimentos com cálculo de imposto de renda",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
