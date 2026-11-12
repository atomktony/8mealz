export const site = {
  name: "8Mealz",
  tagline: "Securing remittance with food",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://8mealz.vercel.app",
  whatsapp: "+238 592 1330",
  email: "hello@8mealz.com",
  // Temporary: Resend's sandbox sender can only reach the account owner.
  // Switch back to 8mealz@foundationforfogo.org once 8mealz.com is verified.
  ordersEmail: "atomiktony@gmail.com",
  social: {
    instagram: "https://instagram.com/8mealz",
    whatsapp: "https://wa.me/2385921330",
    linkedin: "https://linkedin.com/company/8mealz",
  },
  credit: {
    label: "8Mealz",
    year: new Date().getFullYear(),
  },
} as const

export type Site = typeof site

export const WHATSAPP_PREFILL = "Olá, quero enviar comida para a minha família em Cabo Verde."

export function whatsappLink(message: string = WHATSAPP_PREFILL): string {
  return `${site.social.whatsapp}?text=${encodeURIComponent(message)}`
}
