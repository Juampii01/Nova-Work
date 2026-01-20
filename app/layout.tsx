import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Poppins } from "next/font/google"
import { GeistMono } from "geist/font"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NavDropdownProvider } from "@/components/nav-dropdown-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Nova Work — Trabajo real, cerca tuyo",
    template: "%s | Nova Work",
  },
  description:
    "Buscá y ofrecé empleo en tu localidad. Perfiles verificados, mapa de cercanía y suscripción con prueba gratis. Conecta con profesionales y oportunidades laborales locales.",
  applicationName: "Nova Work",
  generator: "Nova Work",
  keywords: [
    "trabajo",
    "empleo",
    "local",
    "red social",
    "profesional",
    "verificado",
    "networking",
    "freelance",
    "oportunidades laborales",
    "búsqueda de empleo",
  ],
  authors: [{ name: "Nova Work", url: "https://novawork.com" }],
  creator: "Nova Work",
  publisher: "Nova Work",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://novawork.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nova Work — Trabajo real, cerca tuyo",
    description:
      "Buscá y ofrecé empleo en tu localidad. Perfiles verificados, mapa de cercanía y suscripción con prueba gratis.",
    type: "website",
    locale: "es_ES",
    url: "https://novawork.com",
    siteName: "Nova Work",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nova Work - Red Profesional Local",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova Work — Trabajo real, cerca tuyo",
    description:
      "Buscá y ofrecé empleo en tu localidad. Perfiles verificados, mapa de cercanía y suscripción con prueba gratis.",
    images: ["/og-image.png"],
    creator: "@novawork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.jpg", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nova Work",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0FA36B" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1F17" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="nova-work-theme">
          <NavDropdownProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </NavDropdownProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
