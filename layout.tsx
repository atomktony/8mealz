import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/allura/400.css";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { StoreProvider } from "@/lib/store";
import { getLang } from "@/lib/lang-server";
import { SITE } from "@/lib/site";
import { PilotBar } from "@/components/PilotBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { PilotModal } from "@/components/PilotModal";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "8Mealz | Securing remittance with food", template: "%s | 8Mealz" },
  description: SITE.description,
  openGraph: {
    title: "8Mealz | Securing remittance with food",
    description: SITE.description,
    type: "website",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "8Mealz" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#57aba9" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang === "pt" ? "pt-PT" : "en"}>
      <body className="min-h-screen flex flex-col font-sans">
        <LangProvider initial={lang}>
          <StoreProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] btn-white">
              Skip to content
            </a>
            <PilotBar />
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <PilotModal />
          </StoreProvider>
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
