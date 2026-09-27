import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "@fontsource-variable/inter"
import "@fontsource/montserrat/500.css"
import "@fontsource/montserrat/600.css"
import "@fontsource/montserrat/700.css"
import "@fontsource/allura/400.css"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "8Mealz turns your remittance into real meals for your family. Pay here, they pick up fresh food at a trusted local market.",
  keywords: ["remittance", "food", "diaspora", "Cabo Verde", "Cape Verde", "Praia", "send money home", "8Mealz"],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: "Send food home, not just money. Remittance you can taste.",
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#1b5e3a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
